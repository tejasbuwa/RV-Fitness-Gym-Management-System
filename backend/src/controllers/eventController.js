const { pool } = require('../config/db');
const { logAudit } = require('../utils/auditLogger');

async function getEvents(req, res, next) {
  try {
    const [events] = await pool.execute(
      `SELECT * FROM events ORDER BY event_date ASC`
    );
    res.json({ success: true, events });
  } catch (err) {
    next(err);
  }
}

async function createEvent(req, res, next) {
  try {
    const { eventName, description, eventDate, eventTime, location, imageUrl } = req.body;

    if (!eventName || !eventDate || !eventTime) {
      return res.status(400).json({ success: false, message: 'Event name, date, and time are required.' });
    }

    const [result] = await pool.execute(
      `INSERT INTO events (event_name, description, event_date, event_time, location, image_url, status, created_by_user_id)
       VALUES (?, ?, ?, ?, ?, ?, 'upcoming', ?)`,
      [
        eventName.trim(),
        description || '',
        eventDate,
        eventTime,
        location || 'RV Fitness, Narsobawadi',
        imageUrl || null,
        req.user.id
      ]
    );

    await logAudit({
      userId: req.user.id,
      action: 'EVENT_CREATED',
      entityType: 'events',
      entityId: result.insertId,
      details: { eventName, eventDate },
      ipAddress: req.ip
    });

    res.status(201).json({
      success: true,
      message: 'Event published successfully.',
      eventId: result.insertId
    });
  } catch (err) {
    next(err);
  }
}

async function deleteEvent(req, res, next) {
  try {
    const eventId = parseInt(req.params.id, 10);
    await pool.execute(`DELETE FROM events WHERE id = ?`, [eventId]);
    res.json({ success: true, message: 'Event removed.' });
  } catch (err) {
    next(err);
  }
}

module.exports = { getEvents, createEvent, deleteEvent };
