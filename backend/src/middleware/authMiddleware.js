const jwt = require('jsonwebtoken');
const { pool } = require('../config/db');

async function verifyToken(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Authentication token missing or invalid format.'
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'rv_fitness_narsobawadi_jwt_secret_key_2026_super_secure');

    // Fetch user and check active status
    const [users] = await pool.execute(
      `SELECT id, email, role, is_active FROM users WHERE id = ?`,
      [decoded.userId]
    );

    if (users.length === 0 || !users[0].is_active) {
      return res.status(401).json({
        success: false,
        message: 'Account not found or has been deactivated.'
      });
    }

    const user = users[0];
    req.user = {
      id: user.id,
      email: user.email,
      role: user.role
    };

    // If member, attach member ID and code
    if (user.role === 'member') {
      const [members] = await pool.execute(
        `SELECT id, member_code, full_name, assigned_trainer_id FROM members WHERE user_id = ?`,
        [user.id]
      );
      if (members.length > 0) {
        req.user.memberId = members[0].id;
        req.user.memberCode = members[0].member_code;
        req.user.fullName = members[0].full_name;
        req.user.assignedTrainerId = members[0].assigned_trainer_id;
      }
    }

    // If trainer, attach trainer ID
    if (user.role === 'trainer') {
      const [trainers] = await pool.execute(
        `SELECT id, full_name FROM trainers WHERE user_id = ?`,
        [user.id]
      );
      if (trainers.length > 0) {
        req.user.trainerId = trainers[0].id;
        req.user.fullName = trainers[0].full_name;
      }
    }

    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Session expired. Please log in again.'
      });
    }
    return res.status(401).json({
      success: false,
      message: 'Invalid or forged authentication token.'
    });
  }
}

module.exports = { verifyToken };
