const { pool } = require('../config/db');
const { logAudit } = require('../utils/auditLogger');

// 1. Get Workout Plan for Member
async function getWorkoutByMemberId(req, res, next) {
  try {
    const memberId = parseInt(req.params.memberId, 10);

    // Access control
    if (req.user.role === 'member' && req.user.memberId !== memberId) {
      return res.status(403).json({ success: false, message: 'Forbidden. Access restricted to own workout plan.' });
    }

    const [plans] = await pool.execute(
      `SELECT wp.*, t.full_name AS trainer_name 
       FROM workout_plans wp
       JOIN trainers t ON wp.trainer_id = t.id
       WHERE wp.member_id = ? AND wp.status = 'active'
       ORDER BY wp.id DESC LIMIT 1`,
      [memberId]
    );

    if (plans.length === 0) {
      return res.json({
        success: true,
        workoutPlan: null,
        exercises: [],
        message: 'No active workout routine currently assigned.'
      });
    }

    const plan = plans[0];
    const [exercises] = await pool.execute(
      `SELECT * FROM workout_exercises WHERE workout_plan_id = ? ORDER BY FIELD(day_of_week, 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'), id ASC`,
      [plan.id]
    );

    res.json({
      success: true,
      workoutPlan: plan,
      exercises
    });
  } catch (err) {
    next(err);
  }
}

// 2. Create or Assign Workout Plan
async function createWorkoutPlan(req, res, next) {
  const connection = await pool.getConnection();
  try {
    const {
      memberId,
      trainerId,
      title,
      goal,
      startDate,
      endDate,
      notes,
      exercises = []
    } = req.body;

    const tId = req.user.role === 'trainer' ? req.user.trainerId : (trainerId || 1);

    if (!memberId || !title) {
      return res.status(400).json({ success: false, message: 'Member ID and title are required.' });
    }

    await connection.beginTransaction();

    // Mark previous active plans as inactive
    await connection.execute(
      `UPDATE workout_plans SET status = 'inactive' WHERE member_id = ?`,
      [memberId]
    );

    const start = startDate || new Date().toISOString().split('T')[0];

    const [planRes] = await connection.execute(
      `INSERT INTO workout_plans (member_id, trainer_id, title, goal, start_date, end_date, status, notes)
       VALUES (?, ?, ?, ?, ?, ?, 'active', ?)`,
      [memberId, tId, title.trim(), goal || null, start, endDate || null, notes || null]
    );
    const planId = planRes.insertId;

    for (const ex of exercises) {
      await connection.execute(
        `INSERT INTO workout_exercises (
          workout_plan_id, day_of_week, exercise_name, muscle_group, sets,
          repetitions, duration_mins, rest_seconds, instructions
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          planId,
          ex.dayOfWeek || 'Monday',
          ex.exerciseName || 'Exercise',
          ex.muscleGroup || 'Full Body',
          parseInt(ex.sets || 3, 10),
          ex.repetitions || '10-12',
          parseInt(ex.durationMins || 10, 10),
          parseInt(ex.restSeconds || 60, 10),
          ex.instructions || null
        ]
      );
    }

    await connection.commit();

    await logAudit({
      userId: req.user.id,
      action: 'WORKOUT_PLAN_CREATED',
      entityType: 'workout_plans',
      entityId: planId,
      details: { memberId, title },
      ipAddress: req.ip
    });

    res.status(201).json({
      success: true,
      message: 'Workout routine assigned successfully.',
      workoutPlanId: planId
    });
  } catch (err) {
    await connection.rollback();
    next(err);
  } finally {
    connection.release();
  }
}

// 3. Delete Workout Plan
async function deleteWorkoutPlan(req, res, next) {
  try {
    const planId = parseInt(req.params.id, 10);
    await pool.execute(`DELETE FROM workout_plans WHERE id = ?`, [planId]);

    res.json({
      success: true,
      message: 'Workout plan removed.'
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getWorkoutByMemberId,
  createWorkoutPlan,
  deleteWorkoutPlan
};
