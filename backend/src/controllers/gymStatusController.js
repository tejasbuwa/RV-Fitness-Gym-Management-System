const { pool } = require('../config/db');
const { logAudit } = require('../utils/auditLogger');

async function getGymStatus(req, res, next) {
  try {
    const [rows] = await pool.execute(`SELECT * FROM gym_status WHERE id = 1`);
    if (rows.length === 0) {
      return res.json({
        success: true,
        status: {
          status: 'OPEN',
          noticeMessage: 'RV Fitness Narsobawadi is OPEN for workout sessions.',
          todayOpeningTime: '05:30 AM',
          todayClosingTime: '10:00 PM'
        }
      });
    }

    const row = rows[0];
    res.json({
      success: true,
      status: {
        id: row.id,
        status: row.status,
        noticeMessage: row.notice_message,
        todayOpeningTime: row.today_opening_time,
        todayClosingTime: row.today_closing_time,
        updatedAt: row.updated_at
      }
    });
  } catch (err) {
    next(err);
  }
}

async function updateGymStatus(req, res, next) {
  try {
    const { status, noticeMessage, todayOpeningTime, todayClosingTime } = req.body;

    if (!['OPEN', 'CLOSED', 'HOLIDAY', 'TEMPORARILY_CLOSED'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid gym status.' });
    }

    await pool.execute(
      `UPDATE gym_status SET
        status = ?,
        notice_message = COALESCE(?, notice_message),
        today_opening_time = COALESCE(?, today_opening_time),
        today_closing_time = COALESCE(?, today_closing_time),
        updated_by_user_id = ?
       WHERE id = 1`,
      [status, noticeMessage, todayOpeningTime, todayClosingTime, req.user.id]
    );

    await logAudit({
      userId: req.user.id,
      action: 'GYM_STATUS_UPDATED',
      entityType: 'gym_status',
      entityId: 1,
      details: { status, noticeMessage },
      ipAddress: req.ip
    });

    res.json({
      success: true,
      message: `RV Fitness status updated to: ${status}`
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { getGymStatus, updateGymStatus };
