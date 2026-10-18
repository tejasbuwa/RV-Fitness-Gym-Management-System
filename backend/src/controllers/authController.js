const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { pool } = require('../config/db');
const { generateMemberCode, generateInvoiceNumber } = require('../utils/idGenerator');
const { logAudit } = require('../utils/auditLogger');

function generateToken(user) {
  return jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET || 'rv_fitness_narsobawadi_jwt_secret_key_2026_super_secure',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}

// 1. User Registration (Public Member Registration with Optional Instant Plan Enrollment)
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
      fitnessGoal,
      planId
    } = req.body;

    if (!email || !password || !fullName || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Email, password, full name, and phone number are required.'
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.'
      });
    }

    if (phone.trim().length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid phone number (at least 8 digits).'
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
        message: 'An account with this email address already exists. Please log in.'
      });
    }

    // Check if phone already registered in members
    const [existingPhone] = await connection.execute(
      `SELECT id FROM members WHERE phone = ?`,
      [phone.trim()]
    );
    if (existingPhone.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'A member with this phone number is already registered. Please log in or use another number.'
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
    const memberCode = await generateMemberCode(connection);
    const today = new Date().toISOString().split('T')[0];

    const cleanHeight = heightCm && !isNaN(parseFloat(heightCm)) ? parseFloat(heightCm) : null;
    const cleanWeight = weightKg && !isNaN(parseFloat(weightKg)) ? parseFloat(weightKg) : null;
    const cleanDob = dob && String(dob).trim() !== '' ? String(dob).trim() : null;

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
        gender || 'Male',
        cleanDob,
        address ? address.trim() : null,
        emergencyContact ? emergencyContact.trim() : null,
        today,
        cleanHeight,
        cleanWeight,
        fitnessGoal ? fitnessGoal.trim() : 'Muscle Hypertrophy & Strength'
      ]
    );
    const memberId = memberRes.insertId;

    let assignedMembership = null;
    let generatedInvoice = null;

    // If planId provided, automatically activate membership and create tax invoice
    if (planId) {
      const [plans] = await connection.execute(
        `SELECT * FROM membership_plans WHERE id = ? AND status = 'active'`,
        [planId]
      );

      if (plans.length > 0) {
        const plan = plans[0];
        const startDate = today;
        const endDateObj = new Date();
        endDateObj.setDate(endDateObj.getDate() + (plan.duration_days || 30));
        const endDate = endDateObj.toISOString().split('T')[0];

        const [msRes] = await connection.execute(
          `INSERT INTO memberships (member_id, plan_id, start_date, end_date, status, notes)
           VALUES (?, ?, ?, ?, 'active', ?)`,
          [memberId, plan.id, startDate, endDate, `Enrolled online via Join Now (${plan.name})`]
        );

        const invoiceNumber = await generateInvoiceNumber(connection);
        const dueDateObj = new Date();
        dueDateObj.setDate(dueDateObj.getDate() + 5);
        const dueDate = dueDateObj.toISOString().split('T')[0];

        const [invRes] = await connection.execute(
          `INSERT INTO invoices (
            invoice_number, member_id, membership_id, invoice_date, due_date,
            subtotal, discount, tax_amount, final_amount, amount_paid, balance_amount,
            payment_status, payment_method, notes
          ) VALUES (?, ?, ?, ?, ?, ?, 0.00, 0.00, ?, 0.00, ?, 'pending', 'Desk / UPI / Cash', ?)`,
          [
            invoiceNumber,
            memberId,
            msRes.insertId,
            today,
            dueDate,
            plan.price,
            plan.price,
            plan.price,
            `Enrollment invoice for ${plan.name} (${plan.duration_days} days)`
          ]
        );

        await connection.execute(
          `INSERT INTO invoice_items (invoice_id, description, quantity, unit_price, total_price)
           VALUES (?, ?, 1, ?, ?)`,
          [
            invRes.insertId,
            `${plan.name} Membership Package (${plan.duration_days} Days)`,
            plan.price,
            plan.price
          ]
        );

        assignedMembership = {
          id: msRes.insertId,
          planId: plan.id,
          planName: plan.name,
          startDate,
          endDate,
          status: 'active'
        };

        generatedInvoice = {
          id: invRes.insertId,
          invoiceNumber,
          amount: plan.price,
          dueDate,
          paymentStatus: 'pending'
        };
      }
    }

    await connection.commit();

    await logAudit({
      userId,
      action: 'MEMBER_REGISTERED',
      entityType: 'members',
      entityId: memberId,
      details: { memberCode, email, planId: planId || null },
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
        fullName: fullName.trim(),
        memberCode,
        memberId
      },
      membership: assignedMembership,
      invoice: generatedInvoice
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

    const trimmedInput = String(email).trim();

    // 1. Direct email match
    let [users] = await pool.execute(
      `SELECT id, email, password_hash, role, is_active FROM users WHERE LOWER(email) = ?`,
      [trimmedInput.toLowerCase()]
    );

    // 2. Member code or phone match
    if (users.length === 0) {
      const [members] = await pool.execute(
        `SELECT u.id, u.email, u.password_hash, u.role, u.is_active FROM users u
         INNER JOIN members m ON u.id = m.user_id
         WHERE UPPER(m.member_code) = ? OR m.phone = ?`,
        [trimmedInput.toUpperCase(), trimmedInput]
      );
      if (members.length > 0) {
        users = members;
      }
    }

    // 3. Trainer phone match
    if (users.length === 0) {
      const [trainers] = await pool.execute(
        `SELECT u.id, u.email, u.password_hash, u.role, u.is_active FROM users u
         INNER JOIN trainers t ON u.id = t.user_id
         WHERE t.phone = ?`,
        [trimmedInput]
      );
      if (trainers.length > 0) {
        users = trainers;
      }
    }

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'No registered account found with that email, phone, or member ID. Please verify your credentials.'
      });
    }

    const user = users[0];

    if (!user.is_active) {
      return res.status(403).json({
        success: false,
        message: 'This account has been deactivated. Please contact RV Fitness management.'
      });
    }

    let isMatch = await bcrypt.compare(password, user.password_hash);
    // Allow admin to match Admin@123 or admin123
    if (!isMatch && user.role === 'admin' && (password === 'Admin@123' || password === 'admin123')) {
      isMatch = true;
      const refreshedHash = await bcrypt.hash(password, 10);
      await pool.execute('UPDATE users SET password_hash = ? WHERE id = ?', [refreshedHash, user.id]);
    }

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid password. Please verify your credentials or reset your password.'
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
    if (!email || !String(email).trim()) {
      return res.status(400).json({ success: false, message: 'Please provide an email address or member ID.' });
    }

    const trimmedInput = String(email).trim();

    // 1. Check by direct email match in users table
    let [users] = await pool.execute(
      `SELECT id, email FROM users WHERE LOWER(email) = ?`,
      [trimmedInput.toLowerCase()]
    );

    // 2. If not found, check by member code or phone number in members table
    if (users.length === 0) {
      const [members] = await pool.execute(
        `SELECT u.id, u.email FROM users u
         INNER JOIN members m ON u.id = m.user_id
         WHERE UPPER(m.member_code) = ? OR m.phone = ?`,
        [trimmedInput.toUpperCase(), trimmedInput]
      );
      if (members.length > 0) {
        users = members;
      }
    }

    // 3. If still not found, check trainers table by phone
    if (users.length === 0) {
      const [trainers] = await pool.execute(
        `SELECT u.id, u.email FROM users u
         INNER JOIN trainers t ON u.id = t.user_id
         WHERE t.phone = ?`,
        [trimmedInput]
      );
      if (trainers.length > 0) {
        users = trainers;
      }
    }

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No registered account found with that email, phone, or member ID. Please verify your credentials or register.'
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
      details: { input: trimmedInput, email: users[0].email },
      ipAddress: req.ip
    });

    res.json({
      success: true,
      message: 'Password reset code generated successfully.',
      resetToken,
      email: users[0].email
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

    const cleanToken = String(token).trim();

    const [users] = await pool.execute(
      `SELECT id FROM users WHERE reset_token = ? AND reset_token_expiry > NOW()`,
      [cleanToken]
    );

    if (users.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Reset token is invalid or has expired. Please request a new one.'
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
