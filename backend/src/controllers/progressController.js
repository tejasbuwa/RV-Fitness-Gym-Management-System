const { pool } = require('../config/db');
const { logAudit } = require('../utils/auditLogger');

// 1. Get Progress History for Member
async function getProgressByMemberId(req, res, next) {
  try {
    const memberId = parseInt(req.params.memberId, 10);

    // Access control
    if (req.user.role === 'member' && req.user.memberId !== memberId) {
      return res.status(403).json({ success: false, message: 'Forbidden. Access restricted to own progress records.' });
    }

    const [records] = await pool.execute(
      `SELECT pr.*, u.email AS recorded_by_email
       FROM progress_records pr
       LEFT JOIN users u ON pr.recorded_by_user_id = u.id
       WHERE pr.member_id = ?
       ORDER BY pr.recorded_date ASC`,
      [memberId]
    );

    // Provide chart-ready format
    const chartData = records.map((r) => ({
      date: r.recorded_date,
      weight: parseFloat(r.weight_kg),
      bmi: r.bmi ? parseFloat(r.bmi) : null,
      chest: r.chest_inches ? parseFloat(r.chest_inches) : null,
      waist: r.waist_inches ? parseFloat(r.waist_inches) : null,
      arms: r.arms_inches ? parseFloat(r.arms_inches) : null
    }));

    res.json({
      success: true,
      records,
      chartData
    });
  } catch (err) {
    next(err);
  }
}

// 2. Record New Progress Entry (Admin or Trainer)
async function recordProgress(req, res, next) {
  try {
    const {
      memberId,
      recordedDate,
      weightKg,
      heightCm,
      chestInches,
      waistInches,
      hipsInches,
      armsInches,
      thighsInches,
      fitnessObservations,
      progressPhotoUrl
    } = req.body;

    const weight = parseFloat(weightKg);
    if (!memberId || isNaN(weight) || weight <= 0) {
      return res.status(400).json({ success: false, message: 'Member ID and valid weight in kg are required.' });
    }

    // Auto calculate BMI if height is available
    let height = heightCm ? parseFloat(heightCm) : null;
    if (!height) {
      const [members] = await pool.execute(`SELECT height_cm FROM members WHERE id = ?`, [memberId]);
      if (members.length > 0 && members[0].height_cm) {
        height = parseFloat(members[0].height_cm);
      }
    }

    let bmi = null;
    if (height && height > 0) {
      const heightM = height / 100;
      bmi = parseFloat((weight / (heightM * heightM)).toFixed(1));
    }

    const dateStr = recordedDate || new Date().toISOString().split('T')[0];

    const [result] = await pool.execute(
      `INSERT INTO progress_records (
        member_id, recorded_by_user_id, recorded_date, weight_kg, height_cm, bmi,
        chest_inches, waist_inches, hips_inches, arms_inches, thighs_inches,
        fitness_observations, progress_photo_url
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        memberId,
        req.user.id,
        dateStr,
        weight,
        height,
        bmi,
        chestInches || null,
        waistInches || null,
        hipsInches || null,
        armsInches || null,
        thighsInches || null,
        fitnessObservations || null,
        progressPhotoUrl || null
      ]
    );

    // Also update current weight on member's main record
    await pool.execute(
      `UPDATE members SET weight_kg = ?, height_cm = COALESCE(?, height_cm) WHERE id = ?`,
      [weight, height, memberId]
    );

    await logAudit({
      userId: req.user.id,
      action: 'PROGRESS_RECORDED',
      entityType: 'progress_records',
      entityId: result.insertId,
      details: { memberId, weight, bmi },
      ipAddress: req.ip
    });

    res.status(201).json({
      success: true,
      message: 'Fitness progress check-in recorded successfully!',
      progressId: result.insertId,
      bmi
    });
  } catch (err) {
    next(err);
  }
}

// 3. Delete Progress Entry
async function deleteProgress(req, res, next) {
  try {
    const progressId = parseInt(req.params.id, 10);
    await pool.execute(`DELETE FROM progress_records WHERE id = ?`, [progressId]);

    res.json({
      success: true,
      message: 'Progress entry removed.'
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getProgressByMemberId,
  recordProgress,
  deleteProgress
};
