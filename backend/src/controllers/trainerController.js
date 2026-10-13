const bcrypt = require('bcryptjs');
const { pool } = require('../config/db');
const { logAudit } = require('../utils/auditLogger');

// 1. Get All Trainers (Public & Admin)
async function getTrainers(req, res, next) {
  try {
    const { status = '' } = req.query;

    let sql = `
      SELECT t.*, u.is_active,
        (SELECT COUNT(*) FROM members m WHERE m.assigned_trainer_id = t.id AND m.status = 'active') as active_members_count
      FROM trainers t
      JOIN users u ON t.user_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (status) {
      sql += ` AND t.status = ?`;
      params.push(status);
    } else if (!req.user || req.user.role !== 'admin') {
      // Non-admin or public only see active
      sql += ` AND t.status = 'active'`;
    }

    sql += ` ORDER BY t.id ASC`;
    const [trainers] = await pool.execute(sql, params);

    res.json({
      success: true,
      trainers
    });
  } catch (err) {
    next(err);
  }
}

// 2. Get Single Trainer by ID
async function getTrainerById(req, res, next) {
  try {
    const trainerId = parseInt(req.params.id, 10);

    const [rows] = await pool.execute(
      `SELECT t.*, u.is_active FROM trainers t JOIN users u ON t.user_id = u.id WHERE t.id = ?`,
      [trainerId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Trainer not found.' });
    }

    const trainer = rows[0];

    // Get assigned members
    const [assignedMembers] = await pool.execute(
      `SELECT id, member_code, full_name, phone, status, joining_date, fitness_goal 
       FROM members 
       WHERE assigned_trainer_id = ? 
       ORDER BY status ASC, full_name ASC`,
      [trainerId]
    );

    res.json({
      success: true,
      trainer: {
        ...trainer,
        assignedMembers
      }
    });
  } catch (err) {
    next(err);
  }
}

// 3. Create Trainer (Admin Only)
async function createTrainer(req, res, next) {
  const connection = await pool.getConnection();
  try {
    const {
      fullName,
      email,
      phone,
      password = 'Trainer@123',
      experienceYears = 1,
      specialization,
      bio,
      photoUrl
    } = req.body;

    if (!fullName || !email || !phone || !specialization) {
      return res.status(400).json({
        success: false,
        message: 'Full name, email, phone, and specialization are required.'
      });
    }

    const [existing] = await connection.execute(
      `SELECT id FROM users WHERE email = ?`,
      [email.toLowerCase().trim()]
    );
    if (existing.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'A user with this email address already exists.'
      });
    }

    await connection.beginTransaction();

    const passwordHash = await bcrypt.hash(password, 10);

    const [userRes] = await connection.execute(
      `INSERT INTO users (email, password_hash, role, is_active) VALUES (?, ?, 'trainer', 1)`,
      [email.toLowerCase().trim(), passwordHash]
    );
    const userId = userRes.insertId;

    const [trainerRes] = await connection.execute(
      `INSERT INTO trainers (user_id, full_name, phone, email, experience_years, specialization, bio, photo_url, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'active')`,
      [
        userId,
        fullName.trim(),
        phone.trim(),
        email.toLowerCase().trim(),
        parseInt(experienceYears, 10),
        specialization.trim(),
        bio || null,
        photoUrl || null
      ]
    );

    await connection.commit();

    await logAudit({
      userId: req.user.id,
      action: 'TRAINER_CREATED',
      entityType: 'trainers',
      entityId: trainerRes.insertId,
      details: { fullName, email },
      ipAddress: req.ip
    });

    res.status(201).json({
      success: true,
      message: 'Trainer created successfully.',
      trainerId: trainerRes.insertId
    });
  } catch (err) {
    await connection.rollback();
    next(err);
  } finally {
    connection.release();
  }
}

// 4. Update Trainer (Admin Only)
async function updateTrainer(req, res, next) {
  try {
    const trainerId = parseInt(req.params.id, 10);
    const {
      fullName,
      phone,
      experienceYears,
      specialization,
      bio,
      photoUrl,
      status
    } = req.body;

    const [existing] = await pool.execute(`SELECT * FROM trainers WHERE id = ?`, [trainerId]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Trainer not found.' });
    }

    await pool.execute(
      `UPDATE trainers SET
        full_name = COALESCE(?, full_name),
        phone = COALESCE(?, phone),
        experience_years = COALESCE(?, experience_years),
        specialization = COALESCE(?, specialization),
        bio = COALESCE(?, bio),
        photo_url = COALESCE(?, photo_url),
        status = COALESCE(?, status)
       WHERE id = ?`,
      [fullName, phone, experienceYears, specialization, bio, photoUrl, status, trainerId]
    );

    if (status) {
      const isActive = status === 'active' ? 1 : 0;
      await pool.execute(`UPDATE users SET is_active = ? WHERE id = ?`, [isActive, existing[0].user_id]);
    }

    await logAudit({
      userId: req.user.id,
      action: 'TRAINER_UPDATED',
      entityType: 'trainers',
      entityId: trainerId,
      details: { fullName, status },
      ipAddress: req.ip
    });

    res.json({
      success: true,
      message: 'Trainer profile updated successfully.'
    });
  } catch (err) {
    next(err);
  }
}

// 5. Toggle Status
async function toggleTrainerStatus(req, res, next) {
  try {
    const trainerId = parseInt(req.params.id, 10);
    const { status } = req.body;

    if (!['active', 'inactive'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status.' });
    }

    const [rows] = await pool.execute(`SELECT user_id FROM trainers WHERE id = ?`, [trainerId]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Trainer not found.' });
    }

    const isActive = status === 'active' ? 1 : 0;
    await pool.execute(`UPDATE trainers SET status = ? WHERE id = ?`, [status, trainerId]);
    await pool.execute(`UPDATE users SET is_active = ? WHERE id = ?`, [isActive, rows[0].user_id]);

    await logAudit({
      userId: req.user.id,
      action: `TRAINER_STATUS_${status.toUpperCase()}`,
      entityType: 'trainers',
      entityId: trainerId,
      details: { status },
      ipAddress: req.ip
    });

    res.json({
      success: true,
      message: `Trainer status updated to ${status}.`
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getTrainers,
  getTrainerById,
  createTrainer,
  updateTrainer,
  toggleTrainerStatus
};
