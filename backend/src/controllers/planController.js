const { pool } = require('../config/db');
const { logAudit } = require('../utils/auditLogger');

// 1. Get Membership Plans (Public & Admin)
async function getPlans(req, res, next) {
  try {
    const { status = '' } = req.query;

    let sql = `SELECT * FROM membership_plans WHERE 1=1`;
    const params = [];

    if (status) {
      sql += ` AND status = ?`;
      params.push(status);
    } else if (!req.user || req.user.role !== 'admin') {
      sql += ` AND status = 'active'`;
    }

    sql += ` ORDER BY duration_days ASC`;
    const [plans] = await pool.execute(sql, params);

    // Parse JSON benefits if needed
    const parsedPlans = plans.map((p) => ({
      ...p,
      benefits: typeof p.benefits === 'string' ? JSON.parse(p.benefits || '[]') : (p.benefits || [])
    }));

    res.json({
      success: true,
      plans: parsedPlans
    });
  } catch (err) {
    next(err);
  }
}

// 2. Create Plan (Admin Only)
async function createPlan(req, res, next) {
  try {
    const { name, planType = 'Monthly', durationDays, price, description, benefits } = req.body;

    if (!name || !durationDays || price === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Plan name, duration (in days), and price are required.'
      });
    }

    const benefitsJson = JSON.stringify(Array.isArray(benefits) ? benefits : [benefits].filter(Boolean));

    const [result] = await pool.execute(
      `INSERT INTO membership_plans (name, plan_type, duration_days, price, description, benefits, status)
       VALUES (?, ?, ?, ?, ?, ?, 'active')`,
      [name.trim(), planType, parseInt(durationDays, 10), parseFloat(price), description || null, benefitsJson]
    );

    await logAudit({
      userId: req.user.id,
      action: 'PLAN_CREATED',
      entityType: 'membership_plans',
      entityId: result.insertId,
      details: { name, price, durationDays },
      ipAddress: req.ip
    });

    res.status(201).json({
      success: true,
      message: 'Membership plan created successfully.',
      planId: result.insertId
    });
  } catch (err) {
    next(err);
  }
}

// 3. Update Plan (Admin Only)
async function updatePlan(req, res, next) {
  try {
    const planId = parseInt(req.params.id, 10);
    const { name, planType, durationDays, price, description, benefits, status } = req.body;

    const benefitsJson = benefits !== undefined
      ? JSON.stringify(Array.isArray(benefits) ? benefits : [benefits].filter(Boolean))
      : undefined;

    await pool.execute(
      `UPDATE membership_plans SET
        name = COALESCE(?, name),
        plan_type = COALESCE(?, plan_type),
        duration_days = COALESCE(?, duration_days),
        price = COALESCE(?, price),
        description = COALESCE(?, description),
        benefits = COALESCE(?, benefits),
        status = COALESCE(?, status)
       WHERE id = ?`,
      [name, planType, durationDays, price, description, benefitsJson, status, planId]
    );

    await logAudit({
      userId: req.user.id,
      action: 'PLAN_UPDATED',
      entityType: 'membership_plans',
      entityId: planId,
      details: { name, price },
      ipAddress: req.ip
    });

    res.json({
      success: true,
      message: 'Membership plan updated successfully.'
    });
  } catch (err) {
    next(err);
  }
}

// 4. Toggle Plan Status
async function togglePlanStatus(req, res, next) {
  try {
    const planId = parseInt(req.params.id, 10);
    const { status } = req.body;

    if (!['active', 'inactive'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status.' });
    }

    await pool.execute(`UPDATE membership_plans SET status = ? WHERE id = ?`, [status, planId]);

    res.json({
      success: true,
      message: `Plan status updated to ${status}.`
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getPlans,
  createPlan,
  updatePlan,
  togglePlanStatus
};
