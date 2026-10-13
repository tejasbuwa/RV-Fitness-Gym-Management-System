const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { pool } = require('../config/db');
const { generateMemberCode } = require('../utils/idGenerator');
const { logAudit } = require('../utils/auditLogger');

function generateToken(user) {
  return jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET || 'rv_fitness_narsobawadi_jwt_secret_key_2026_super_secure',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}

// 1. User Registration (Public Member Registration)
async function register(req, res, next) {
  const connection = await pool.getConnection();
  try {
    const {
      email,
      password,
      fullName,
      phone,
      gender = 'Male',
      dob,
      address,
      emergencyContact,
      heightCm,
      weightKg,
      fitnessGoal
    } = req.body;

    if (!email || !password || !fullName || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Email, password, full name, and phone number are required.'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.'
      });
    }

    // Check if email already exists
    const [existing] = await connection.execute(
      `SELECT id FROM users WHERE email = ?`,
      [email.toLowerCase().trim()]
    );
    if (existing.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email address already exists.'
      });
    }

    await connection.beginTransaction();

    const passwordHash = await bcrypt.hash(password, 10);

    // Insert user
    const [userRes] = await connection.execute(
      `INSERT INTO users (email, password_hash, role, is_active) VALUES (?, ?, 'member', 1)`,
      [email.toLowerCase().trim(), passwordHash]
    );
    const userId = userRes.insertId;

    // Generate RVF Member Code
    const memberCode = await generateMemberCode();
    const today = new Date().toISOString().split('T')[0];

    // Insert member record
    const [memberRes] = await connection.execute(
      `INSERT INTO members (
        user_id, member_code, full_name, phone, email, gender, dob, address,
        emergency_contact, joining_date, status, height_cm, weight_kg, fitness_goal
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active', ?, ?, ?)`,
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
        today,
        heightCm || null,
        weightKg || null,
        fitnessGoal || null
      ]
    );

    await connection.commit();

    await logAudit({
      userId,
      action: 'MEMBER_REGISTERED',
      entityType: 'members',
      entityId: memberRes.insertId,
      details: { memberCode, email },
      ipAddress: req.ip
    });

    const token = generateToken({ id: userId, email, role: 'member' });

    res.status(201).json({
      success: true,
      message: `Registration successful! Welcome to RV Fitness. Your Member ID is ${memberCode}.`,
      token,
      user: {
        id: userId,
        email,
        role: 'member',
        fullName,
        memberCode,
        memberId: memberRes.insertId
      }
    });
  } catch (err) {
    await connection.rollback();
    next(err);
  } finally {
    connection.release();
  }
}

// 2. User Login
async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email address and password.'
      });
    }

    const [users] = await pool.execute(
      `SELECT id, email, password_hash, role, is_active FROM users WHERE email = ?`,
      [email.toLowerCase().trim()]
    );

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    const user = users[0];

    if (!user.is_active) {
      return res.status(403).json({
        success: false,
        message: 'This account has been deactivated. Please contact RV Fitness management.'
      });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    let profileData = {};

    if (user.role === 'member') {
      const [members] = await pool.execute(
        `SELECT id, member_code, full_name, phone, status, assigned_trainer_id, profile_photo FROM members WHERE user_id = ?`,
        [user.id]
      );
      if (members.length > 0) {
        profileData = {
          memberId: members[0].id,
          memberCode: members[0].member_code,
          fullName: members[0].full_name,
          phone: members[0].phone,
          status: members[0].status,
          assignedTrainerId: members[0].assigned_trainer_id,
          photoUrl: members[0].profile_photo
        };
      }
    } else if (user.role === 'trainer') {
      const [trainers] = await pool.execute(
        `SELECT id, full_name, phone, specialization, status, photo_url FROM trainers WHERE user_id = ?`,
        [user.id]
      );
      if (trainers.length > 0) {
        profileData = {
          trainerId: trainers[0].id,
          fullName: trainers[0].full_name,
          phone: trainers[0].phone,
          specialization: trainers[0].specialization,
          status: trainers[0].status,
          photoUrl: trainers[0].photo_url
        };
      }
    } else if (user.role === 'admin') {
      profileData = {
        fullName: 'RV Fitness Administrator',
        photoUrl: null
      };
    }

    const token = generateToken(user);

    await logAudit({
      userId: user.id,
      action: 'USER_LOGIN',
      entityType: 'users',
      entityId: user.id,
      details: { role: user.role, email: user.email },
      ipAddress: req.ip
    });

    res.json({
      success: true,
      message: 'Login successful.',
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        ...profileData
      }
    });
  } catch (err) {
    next(err);
  }
}

// 3. Get Current User Info
async function getMe(req, res, next) {
  try {
    const [users] = await pool.execute(
      `SELECT id, email, role, is_active, created_at FROM users WHERE id = ?`,
      [req.user.id]
    );

    if (users.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const user = users[0];
    let extraDetails = {};

    if (user.role === 'member') {
      const [members] = await pool.execute(
        `SELECT m.*, t.full_name AS trainer_name 
         FROM members m 
         LEFT JOIN trainers t ON m.assigned_trainer_id = t.id 
         WHERE m.user_id = ?`,
        [user.id]
      );
      if (members.length > 0) {
        extraDetails = { member: members[0] };
      }
    } else if (user.role === 'trainer') {
      const [trainers] = await pool.execute(
        `SELECT * FROM trainers WHERE user_id = ?`,
        [user.id]
      );
      if (trainers.length > 0) {
        extraDetails = { trainer: trainers[0] };
      }
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        ...extraDetails
      }
    });
  } catch (err) {
    next(err);
  }
}

// 4. Forgot Password (generate reset code)
async function forgotPassword(req, res, next) {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Please provide an email address.' });
    }

    const [users] = await pool.execute(
      `SELECT id, email FROM users WHERE email = ?`,
      [email.toLowerCase().trim()]
    );

    if (users.length === 0) {
      // Return 200 to prevent user enumeration
      return res.json({
        success: true,
        message: 'If the email is registered, password reset instructions have been generated.'
      });
    }

    const resetToken = crypto.randomBytes(20).toString('hex');
    const expiry = new Date(Date.now() + 3600000); // 1 hour

    await pool.execute(
      `UPDATE users SET reset_token = ?, reset_token_expiry = ? WHERE id = ?`,
      [resetToken, expiry, users[0].id]
    );

    await logAudit({
      userId: users[0].id,
      action: 'PASSWORD_RESET_REQUESTED',
      entityType: 'users',
      entityId: users[0].id,
      details: { email },
      ipAddress: req.ip
    });

    res.json({
      success: true,
      message: 'Password reset code generated successfully.',
      resetToken // Returned for easy testing and mock email delivery
    });
  } catch (err) {
    next(err);
  }
}

// 5. Reset Password
async function resetPassword(req, res, next) {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Token and new password are required.'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters.'
      });
    }

    const [users] = await pool.execute(
      `SELECT id FROM users WHERE reset_token = ? AND reset_token_expiry > NOW()`,
      [token]
    );

    if (users.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Reset token is invalid or has expired.'
      });
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);

    await pool.execute(
      `UPDATE users SET password_hash = ?, reset_token = NULL, reset_token_expiry = NULL WHERE id = ?`,
      [passwordHash, users[0].id]
    );

    await logAudit({
      userId: users[0].id,
      action: 'PASSWORD_RESET_COMPLETED',
      entityType: 'users',
      entityId: users[0].id,
      details: 'Password was updated successfully',
      ipAddress: req.ip
    });

    res.json({
      success: true,
      message: 'Password has been reset successfully. You may now login.'
    });
  } catch (err) {
    next(err);
  }
}

// 6. Update Profile
async function updateProfile(req, res, next) {
  try {
    const { fullName, phone, address, emergencyContact, heightCm, weightKg, fitnessGoal, photoUrl } = req.body;

    if (req.user.role === 'member') {
      await pool.execute(
        `UPDATE members SET
          full_name = COALESCE(?, full_name),
          phone = COALESCE(?, phone),
          address = COALESCE(?, address),
          emergency_contact = COALESCE(?, emergency_contact),
          height_cm = COALESCE(?, height_cm),
          weight_kg = COALESCE(?, weight_kg),
          fitness_goal = COALESCE(?, fitness_goal),
          profile_photo = COALESCE(?, profile_photo)
         WHERE user_id = ?`,
        [fullName, phone, address, emergencyContact, heightCm, weightKg, fitnessGoal, photoUrl, req.user.id]
      );
    } else if (req.user.role === 'trainer') {
      await pool.execute(
        `UPDATE trainers SET
          full_name = COALESCE(?, full_name),
          phone = COALESCE(?, phone),
          photo_url = COALESCE(?, photo_url)
         WHERE user_id = ?`,
        [fullName, phone, photoUrl, req.user.id]
      );
    }

    res.json({
      success: true,
      message: 'Profile updated successfully.'
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  register,
  login,
  getMe,
  forgotPassword,
  resetPassword,
  updateProfile
};
