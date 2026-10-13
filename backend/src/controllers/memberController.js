const bcrypt = require('bcryptjs');
const { pool } = require('../config/db');
const { generateMemberCode } = require('../utils/idGenerator');
const { logAudit } = require('../utils/auditLogger');

// 1. Get All Members (with search, filter, pagination)
async function getMembers(req, res, next) {
  try {
    const {
      search = '',
      status = '',
      trainerId = '',
      page = 1,
      limit = 50
    } = req.query;

    let query = `
      SELECT 
        m.id, m.member_code, m.full_name, m.phone, m.email, m.gender,
        m.dob, m.joining_date, m.status, m.assigned_trainer_id,
        m.height_cm, m.weight_kg, m.fitness_goal, m.profile_photo,
        m.created_at,
        t.full_name AS trainer_name,
        (
          SELECT sub.status 
          FROM memberships sub 
          WHERE sub.member_id = m.id 
          ORDER BY sub.end_date DESC LIMIT 1
        ) AS current_membership_status,
        (
          SELECT sub.end_date 
          FROM memberships sub 
          WHERE sub.member_id = m.id 
          ORDER BY sub.end_date DESC LIMIT 1
        ) AS membership_expiry_date,
        (
          SELECT COALESCE(SUM(inv.balance_amount), 0)
          FROM invoices inv 
          WHERE inv.member_id = m.id AND inv.payment_status != 'cancelled'
        ) AS total_pending_balance
      FROM members m
      LEFT JOIN trainers t ON m.assigned_trainer_id = t.id
      WHERE 1=1
    `;

    const params = [];

    // If Trainer, limit to assigned members
    if (req.user.role === 'trainer') {
      query += ` AND m.assigned_trainer_id = ?`;
      params.push(req.user.trainerId);
    } else if (trainerId) {
      query += ` AND m.assigned_trainer_id = ?`;
      params.push(trainerId);
    }

    if (status) {
      query += ` AND m.status = ?`;
      params.push(status);
    }

    if (search.trim()) {
      const term = `%${search.trim()}%`;
      query += ` AND (m.full_name LIKE ? OR m.member_code LIKE ? OR m.phone LIKE ? OR m.email LIKE ?)`;
      params.push(term, term, term, term);
    }

    query += ` ORDER BY m.id DESC LIMIT ? OFFSET ?`;
    const offset = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    params.push(parseInt(limit, 10), parseInt(offset, 10));

    const [rows] = await pool.execute(query, params);

    // Get total count for pagination
    let countQuery = `
      SELECT COUNT(*) as total 
      FROM members m 
      WHERE 1=1
    `;
    const countParams = [];
    if (req.user.role === 'trainer') {
      countQuery += ` AND m.assigned_trainer_id = ?`;
      countParams.push(req.user.trainerId);
    } else if (trainerId) {
      countQuery += ` AND m.assigned_trainer_id = ?`;
      countParams.push(trainerId);
    }
    if (status) {
      countQuery += ` AND m.status = ?`;
      countParams.push(status);
    }
    if (search.trim()) {
      const term = `%${search.trim()}%`;
      countQuery += ` AND (m.full_name LIKE ? OR m.member_code LIKE ? OR m.phone LIKE ? OR m.email LIKE ?)`;
      countParams.push(term, term, term, term);
    }
    const [countRows] = await pool.execute(countQuery, countParams);

    res.json({
      success: true,
      members: rows,
      pagination: {
        total: countRows[0].total,
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        totalPages: Math.ceil(countRows[0].total / parseInt(limit, 10))
      }
    });
  } catch (err) {
    next(err);
  }
}

// 2. Get Single Member (360 Details)
async function getMemberById(req, res, next) {
  try {
    const memberId = parseInt(req.params.id, 10);

    // Access control: Member can only view own profile
    if (req.user.role === 'member' && req.user.memberId !== memberId) {
      return res.status(403).json({ success: false, message: 'Forbidden. Access restricted to own profile.' });
    }

    // Access control: Trainer can only view assigned member
    if (req.user.role === 'trainer') {
      const [check] = await pool.execute(
        `SELECT id FROM members WHERE id = ? AND assigned_trainer_id = ?`,
        [memberId, req.user.trainerId]
      );
      if (check.length === 0) {
        return res.status(403).json({ success: false, message: 'Forbidden. You are not assigned to this member.' });
      }
    }

    const [memberRows] = await pool.execute(
      `SELECT m.*, t.full_name AS trainer_name, t.phone AS trainer_phone, u.is_active AS user_active
       FROM members m
       LEFT JOIN trainers t ON m.assigned_trainer_id = t.id
       JOIN users u ON m.user_id = u.id
       WHERE m.id = ?`,
      [memberId]
    );

    if (memberRows.length === 0) {
      return res.status(404).json({ success: false, message: 'Member not found.' });
    }

    const member = memberRows[0];

    // Fetch memberships history
    const [memberships] = await pool.execute(
      `SELECT ms.*, p.name AS plan_name, p.plan_type, p.price, p.duration_days
       FROM memberships ms
       JOIN membership_plans p ON ms.plan_id = p.id
       WHERE ms.member_id = ?
       ORDER BY ms.end_date DESC`,
      [memberId]
    );

    // Fetch invoices
    const [invoices] = await pool.execute(
      `SELECT * FROM invoices WHERE member_id = ? ORDER BY invoice_date DESC`,
      [memberId]
    );

    // Fetch payments
    const [payments] = await pool.execute(
      `SELECT p.*, r.receipt_number, inv.invoice_number
       FROM payments p
       JOIN invoices inv ON p.invoice_id = inv.id
       LEFT JOIN receipts r ON p.id = r.payment_id
       WHERE p.member_id = ?
       ORDER BY p.payment_date DESC`,
      [memberId]
    );

    // Fetch recent progress
    const [progress] = await pool.execute(
      `SELECT * FROM progress_records WHERE member_id = ? ORDER BY recorded_date DESC`,
      [memberId]
    );

    res.json({
      success: true,
      member: {
        ...member,
        memberships,
        invoices,
        payments,
        progress
      }
    });
  } catch (err) {
    next(err);
  }
}

// 3. Create Member (Admin Only)
async function createMember(req, res, next) {
  const connection = await pool.getConnection();
  try {
    const {
      fullName,
      email,
      phone,
      password = 'Member@123',
      gender = 'Male',
      dob,
      address,
      emergencyContact,
      joiningDate,
      assignedTrainerId,
      heightCm,
      weightKg,
      fitnessGoal,
      medicalNotes,
      profilePhoto
    } = req.body;

    if (!fullName || !email || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Full name, email address, and phone number are required.'
      });
    }

    // Check email uniqueness
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
      `INSERT INTO users (email, password_hash, role, is_active) VALUES (?, ?, 'member', 1)`,
      [email.toLowerCase().trim(), passwordHash]
    );
    const userId = userRes.insertId;

    const memberCode = await generateMemberCode();
    const joinDate = joiningDate || new Date().toISOString().split('T')[0];

    const [memberRes] = await connection.execute(
      `INSERT INTO members (
        user_id, member_code, full_name, phone, email, gender, dob, address,
        emergency_contact, joining_date, status, assigned_trainer_id, height_cm,
        weight_kg, fitness_goal, medical_notes, profile_photo
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active', ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        memberCode,
        fullName.trim(),
        phone.trim(),
        email.toLowerCase().trim(),
        gender,
        dob || null,
        address || null,
        emergencyContact || null,
        joinDate,
        assignedTrainerId || null,
        heightCm || null,
        weightKg || null,
        fitnessGoal || null,
        medicalNotes || null,
        profilePhoto || null
      ]
    );

    await connection.commit();

    await logAudit({
      userId: req.user.id,
      action: 'MEMBER_CREATED',
      entityType: 'members',
      entityId: memberRes.insertId,
      details: { memberCode, fullName, email },
      ipAddress: req.ip
    });

    res.status(201).json({
      success: true,
      message: `Member created successfully with Member ID: ${memberCode}`,
      memberId: memberRes.insertId,
      memberCode
    });
  } catch (err) {
    await connection.rollback();
    next(err);
  } finally {
    connection.release();
  }
}

// 4. Update Member (Admin Only)
async function updateMember(req, res, next) {
  try {
    const memberId = parseInt(req.params.id, 10);
    const {
      fullName,
      phone,
      gender,
      dob,
      address,
      emergencyContact,
      status,
      assignedTrainerId,
      heightCm,
      weightKg,
      fitnessGoal,
      medicalNotes,
      profilePhoto
    } = req.body;

    const [existing] = await pool.execute(`SELECT * FROM members WHERE id = ?`, [memberId]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Member not found.' });
    }

    await pool.execute(
      `UPDATE members SET
        full_name = COALESCE(?, full_name),
        phone = COALESCE(?, phone),
        gender = COALESCE(?, gender),
        dob = COALESCE(?, dob),
        address = COALESCE(?, address),
        emergency_contact = COALESCE(?, emergency_contact),
        status = COALESCE(?, status),
        assigned_trainer_id = ?,
        height_cm = COALESCE(?, height_cm),
        weight_kg = COALESCE(?, weight_kg),
        fitness_goal = COALESCE(?, fitness_goal),
        medical_notes = COALESCE(?, medical_notes),
        profile_photo = COALESCE(?, profile_photo)
       WHERE id = ?`,
      [
        fullName, phone, gender, dob, address, emergencyContact, status,
        assignedTrainerId !== undefined ? assignedTrainerId : existing[0].assigned_trainer_id,
        heightCm, weightKg, fitnessGoal, medicalNotes, profilePhoto, memberId
      ]
    );

    // If status changed to inactive, update users table
    if (status) {
      const isActive = status === 'active' ? 1 : 0;
      await pool.execute(
        `UPDATE users SET is_active = ? WHERE id = ?`,
        [isActive, existing[0].user_id]
      );
    }

    await logAudit({
      userId: req.user.id,
      action: 'MEMBER_UPDATED',
      entityType: 'members',
      entityId: memberId,
      details: { fullName, status },
      ipAddress: req.ip
    });

    res.json({
      success: true,
      message: 'Member updated successfully.'
    });
  } catch (err) {
    next(err);
  }
}

// 5. Toggle Member Status (Activate / Deactivate)
async function toggleMemberStatus(req, res, next) {
  try {
    const memberId = parseInt(req.params.id, 10);
    const { status } = req.body;

    if (!['active', 'inactive', 'pending'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status provided.' });
    }

    const [members] = await pool.execute(`SELECT user_id, member_code FROM members WHERE id = ?`, [memberId]);
    if (members.length === 0) {
      return res.status(404).json({ success: false, message: 'Member not found.' });
    }

    const isActive = status === 'active' ? 1 : 0;
    await pool.execute(`UPDATE members SET status = ? WHERE id = ?`, [status, memberId]);
    await pool.execute(`UPDATE users SET is_active = ? WHERE id = ?`, [isActive, members[0].user_id]);

    await logAudit({
      userId: req.user.id,
      action: `MEMBER_STATUS_${status.toUpperCase()}`,
      entityType: 'members',
      entityId: memberId,
      details: { memberCode: members[0].member_code, newStatus: status },
      ipAddress: req.ip
    });

    res.json({
      success: true,
      message: `Member status updated to ${status}.`
    });
  } catch (err) {
    next(err);
  }
}

// 6. Delete Member (Admin Only)
async function deleteMember(req, res, next) {
  try {
    const memberId = parseInt(req.params.id, 10);

    const [members] = await pool.execute(`SELECT user_id, member_code FROM members WHERE id = ?`, [memberId]);
    if (members.length === 0) {
      return res.status(404).json({ success: false, message: 'Member not found.' });
    }

    // Deleting user will cascade delete member
    await pool.execute(`DELETE FROM users WHERE id = ?`, [members[0].user_id]);

    await logAudit({
      userId: req.user.id,
      action: 'MEMBER_DELETED',
      entityType: 'members',
      entityId: memberId,
      details: { memberCode: members[0].member_code },
      ipAddress: req.ip
    });

    res.json({
      success: true,
      message: 'Member and linked records deleted successfully.'
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getMembers,
  getMemberById,
  createMember,
  updateMember,
  toggleMemberStatus,
  deleteMember
};
