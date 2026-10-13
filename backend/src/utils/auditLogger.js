const { pool } = require('../config/db');

async function logAudit({ userId = null, action, entityType, entityId = null, details = null, ipAddress = null }) {
  try {
    const detailsStr = typeof details === 'object' ? JSON.stringify(details) : details;
    await pool.execute(
      `INSERT INTO audit_logs (user_id, action, entity_type, entity_id, details, ip_address)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [userId, action, entityType, entityId, detailsStr, ipAddress || '127.0.0.1']
    );
  } catch (err) {
    console.error('Audit logger error:', err.message);
  }
}

module.exports = { logAudit };
