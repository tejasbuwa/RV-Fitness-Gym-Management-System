const { pool } = require('../config/db');
const { logAudit } = require('../utils/auditLogger');

// 1. Get Notices
async function getNotices(req, res, next) {
  try {
    let sql = `SELECT n.*, u.email as created_by_email FROM notices n LEFT JOIN users u ON n.created_by_user_id = u.id WHERE n.is_active = 1`;
    const params = [];

    if (req.user) {
      if (req.user.role === 'member') {
        sql += ` AND n.target_audience IN ('all', 'members')`;
      } else if (req.user.role === 'trainer') {
        sql += ` AND n.target_audience IN ('all', 'trainers')`;
      }
      // admin sees all
    } else {
      sql += ` AND n.target_audience = 'all'`;
    }

    sql += ` ORDER BY n.publish_date DESC, n.id DESC`;
    const [notices] = await pool.execute(sql, params);

    res.json({
      success: true,
      notices
    });
  } catch (err) {
    next(err);
  }
}

// 2. Create Notice (Admin Only)
async function createNotice(req, res, next) {
  try {
    const { title, content, targetAudience = 'all', publishDate } = req.body;

    if (!title || !content) {
      return res.status(400).json({ success: false, message: 'Title and content are required.' });
    }

    const dateStr = publishDate || new Date().toISOString().split('T')[0];

    const [result] = await pool.execute(
      `INSERT INTO notices (title, content, target_audience, is_active, publish_date, created_by_user_id)
       VALUES (?, ?, ?, 1, ?, ?)`,
      [title.trim(), content.trim(), targetAudience, dateStr, req.user.id]
    );

    await logAudit({
      userId: req.user.id,
      action: 'NOTICE_CREATED',
      entityType: 'notices',
      entityId: result.insertId,
      details: { title, targetAudience },
      ipAddress: req.ip
    });

    res.status(201).json({
      success: true,
      message: 'Notice broadcasted successfully.',
      noticeId: result.insertId
    });
  } catch (err) {
    next(err);
  }
}

// 3. Delete Notice (Admin Only)
async function deleteNotice(req, res, next) {
  try {
    const noticeId = parseInt(req.params.id, 10);
    await pool.execute(`DELETE FROM notices WHERE id = ?`, [noticeId]);

    res.json({
      success: true,
      message: 'Notice removed.'
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getNotices,
  createNotice,
  deleteNotice
};
