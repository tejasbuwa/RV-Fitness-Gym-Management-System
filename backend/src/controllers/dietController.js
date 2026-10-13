const { pool } = require('../config/db');
const { logAudit } = require('../utils/auditLogger');

// 1. Get Diet Plan for Member
async function getDietByMemberId(req, res, next) {
  try {
    const memberId = parseInt(req.params.memberId, 10);

    // Access control
    if (req.user.role === 'member' && req.user.memberId !== memberId) {
      return res.status(403).json({ success: false, message: 'Forbidden. Access restricted to own diet plan.' });
    }

    const [plans] = await pool.execute(
      `SELECT dp.*, t.full_name AS trainer_name
       FROM diet_plans dp
       JOIN trainers t ON dp.trainer_id = t.id
       WHERE dp.member_id = ? AND dp.status = 'active'
       ORDER BY dp.id DESC LIMIT 1`,
      [memberId]
    );

    if (plans.length === 0) {
      return res.json({
        success: true,
        dietPlan: null,
        meals: [],
        message: 'No active diet plan currently assigned.'
      });
    }

    const plan = plans[0];
    const [meals] = await pool.execute(
      `SELECT * FROM diet_meals WHERE diet_plan_id = ? ORDER BY id ASC`,
      [plan.id]
    );

    res.json({
      success: true,
      dietPlan: plan,
      meals
    });
  } catch (err) {
    next(err);
  }
}

// 2. Create / Assign Diet Plan
async function createDietPlan(req, res, next) {
  const connection = await pool.getConnection();
  try {
    const {
      memberId,
      trainerId,
      title,
      targetCalories = 2000,
      dailyProteinG = 120,
      dailyCarbsG = 200,
      dailyFatG = 50,
      notes,
      meals = []
    } = req.body;

    const tId = req.user.role === 'trainer' ? req.user.trainerId : (trainerId || 1);

    if (!memberId || !title) {
      return res.status(400).json({ success: false, message: 'Member ID and title are required.' });
    }

    await connection.beginTransaction();

    // Mark previous plans as inactive
    await connection.execute(
      `UPDATE diet_plans SET status = 'inactive' WHERE member_id = ?`,
      [memberId]
    );

    const [planRes] = await connection.execute(
      `INSERT INTO diet_plans (
        member_id, trainer_id, title, target_calories,
        daily_protein_g, daily_carbs_g, daily_fat_g, notes, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'active')`,
      [
        memberId,
        tId,
        title.trim(),
        parseInt(targetCalories, 10),
        parseInt(dailyProteinG || 0, 10),
        parseInt(dailyCarbsG || 0, 10),
        parseInt(dailyFatG || 0, 10),
        notes || null
      ]
    );
    const planId = planRes.insertId;

    for (const m of meals) {
      await connection.execute(
        `INSERT INTO diet_meals (
          diet_plan_id, meal_name, timing, food_items, quantity, calories, protein_g, notes
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          planId,
          m.mealName || 'Meal',
          m.timing || '08:00 AM',
          m.foodItems || 'Nutrition food',
          m.quantity || '1 portion',
          parseInt(m.calories || 0, 10),
          parseInt(m.proteinG || 0, 10),
          m.notes || null
        ]
      );
    }

    await connection.commit();

    await logAudit({
      userId: req.user.id,
      action: 'DIET_PLAN_CREATED',
      entityType: 'diet_plans',
      entityId: planId,
      details: { memberId, title },
      ipAddress: req.ip
    });

    res.status(201).json({
      success: true,
      message: 'Nutrition plan assigned successfully.',
      dietPlanId: planId
    });
  } catch (err) {
    await connection.rollback();
    next(err);
  } finally {
    connection.release();
  }
}

// 3. Delete Diet Plan
async function deleteDietPlan(req, res, next) {
  try {
    const planId = parseInt(req.params.id, 10);
    await pool.execute(`DELETE FROM diet_plans WHERE id = ?`, [planId]);

    res.json({
      success: true,
      message: 'Diet plan removed.'
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getDietByMemberId,
  createDietPlan,
  deleteDietPlan
};
