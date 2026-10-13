const { pool } = require('../config/db');
const { generateInvoiceNumber } = require('../utils/idGenerator');
const { logAudit } = require('../utils/auditLogger');

// Helper to refresh statuses of memberships dynamically
async function updateMembershipStatuses() {
  const today = new Date().toISOString().split('T')[0];
  // 1. Mark expired
  await pool.execute(
    `UPDATE memberships SET status = 'expired' WHERE end_date < ? AND status != 'cancelled'`,
    [today]
  );
  // 2. Mark expiring soon (within 7 days)
  await pool.execute(
    `UPDATE memberships 
     SET status = 'expiring_soon' 
     WHERE end_date >= ? AND end_date <= DATE_ADD(?, INTERVAL 7 DAY) AND status = 'active'`,
    [today, today]
  );
}

// 1. Get Memberships (Admin, Trainer, Member)
async function getMemberships(req, res, next) {
  try {
    await updateMembershipStatuses();

    const { status = '', memberId = '' } = req.query;

    let sql = `
      SELECT 
        ms.*, 
        p.name AS plan_name, p.plan_type, p.price, p.duration_days,
        m.member_code, m.full_name AS member_name, m.phone AS member_phone,
        DATEDIFF(ms.end_date, CURDATE()) AS days_remaining
      FROM memberships ms
      JOIN membership_plans p ON ms.plan_id = p.id
      JOIN members m ON ms.member_id = m.id
      WHERE 1=1
    `;
    const params = [];

    // Role check
    if (req.user.role === 'member') {
      sql += ` AND ms.member_id = ?`;
      params.push(req.user.memberId);
    } else if (req.user.role === 'trainer') {
      sql += ` AND m.assigned_trainer_id = ?`;
      params.push(req.user.trainerId);
    } else if (memberId) {
      sql += ` AND ms.member_id = ?`;
      params.push(memberId);
    }

    if (status) {
      sql += ` AND ms.status = ?`;
      params.push(status);
    }

    sql += ` ORDER BY ms.end_date DESC`;
    const [rows] = await pool.execute(sql, params);

    res.json({
      success: true,
      memberships: rows
    });
  } catch (err) {
    next(err);
  }
}

// 2. Assign Membership Plan to Member (Admin Only)
async function assignMembership(req, res, next) {
  const connection = await pool.getConnection();
  try {
    const { memberId, planId, startDate, generateInvoice = true, notes } = req.body;

    if (!memberId || !planId) {
      return res.status(400).json({
        success: false,
        message: 'Member ID and Plan ID are required.'
      });
    }

    // Get Plan
    const [plans] = await connection.execute(
      `SELECT * FROM membership_plans WHERE id = ? AND status = 'active'`,
      [planId]
    );
    if (plans.length === 0) {
      return res.status(404).json({ success: false, message: 'Membership plan not found or inactive.' });
    }
    const plan = plans[0];

    // Get Member
    const [members] = await connection.execute(
      `SELECT id, member_code, full_name, email FROM members WHERE id = ?`,
      [memberId]
    );
    if (members.length === 0) {
      return res.status(404).json({ success: false, message: 'Member not found.' });
    }
    const member = members[0];

    await connection.beginTransaction();

    const start = startDate ? new Date(startDate) : new Date();
    const end = new Date(start);
    end.setDate(end.getDate() + parseInt(plan.duration_days, 10));

    const startDateStr = start.toISOString().split('T')[0];
    const endDateStr = end.toISOString().split('T')[0];

    // Status logic
    const todayStr = new Date().toISOString().split('T')[0];
    let status = 'active';
    if (endDateStr < todayStr) {
      status = 'expired';
    } else {
      const daysDiff = Math.ceil((end - new Date()) / (1000 * 60 * 60 * 24));
      if (daysDiff <= 7) status = 'expiring_soon';
    }

    const [subRes] = await connection.execute(
      `INSERT INTO memberships (member_id, plan_id, start_date, end_date, status, notes)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [memberId, planId, startDateStr, endDateStr, status, notes || null]
    );
    const membershipId = subRes.insertId;

    let invoiceId = null;
    let invoiceNumber = null;

    if (generateInvoice) {
      invoiceNumber = await generateInvoiceNumber();
      const dueDate = new Date(start);
      dueDate.setDate(dueDate.getDate() + 5);
      const dueDateStr = dueDate.toISOString().split('T')[0];

      const price = parseFloat(plan.price);

      const [invRes] = await connection.execute(
        `INSERT INTO invoices (
          invoice_number, member_id, membership_id, invoice_date, due_date,
          subtotal, discount, tax_amount, final_amount, amount_paid,
          balance_amount, payment_status, notes
        ) VALUES (?, ?, ?, ?, ?, ?, 0.00, 0.00, ?, 0.00, ?, 'pending', ?)`,
        [
          invoiceNumber,
          memberId,
          membershipId,
          startDateStr,
          dueDateStr,
          price,
          price,
          price,
          `Invoice for ${plan.name} (${plan.duration_days} days)`
        ]
      );
      invoiceId = invRes.insertId;

      await connection.execute(
        `INSERT INTO invoice_items (invoice_id, description, quantity, unit_price, total_price)
         VALUES (?, ?, 1, ?, ?)`,
        [invoiceId, `${plan.name} - ${plan.duration_days} Days Plan`, price, price]
      );
    }

    await connection.commit();

    await logAudit({
      userId: req.user.id,
      action: 'MEMBERSHIP_ASSIGNED',
      entityType: 'memberships',
      entityId: membershipId,
      details: { memberCode: member.member_code, planName: plan.name, invoiceNumber },
      ipAddress: req.ip
    });

    res.status(201).json({
      success: true,
      message: `Plan "${plan.name}" successfully assigned to ${member.full_name} (${member.member_code}).`,
      membershipId,
      invoiceId,
      invoiceNumber
    });
  } catch (err) {
    await connection.rollback();
    next(err);
  } finally {
    connection.release();
  }
}

// 3. Renew Membership (Admin Only)
async function renewMembership(req, res, next) {
  const connection = await pool.getConnection();
  try {
    const { memberId, planId, generateInvoice = true, notes } = req.body;

    if (!memberId || !planId) {
      return res.status(400).json({ success: false, message: 'Member ID and Plan ID are required.' });
    }

    const [plans] = await connection.execute(`SELECT * FROM membership_plans WHERE id = ?`, [planId]);
    if (plans.length === 0) {
      return res.status(404).json({ success: false, message: 'Membership plan not found.' });
    }
    const plan = plans[0];

    const [members] = await connection.execute(`SELECT * FROM members WHERE id = ?`, [memberId]);
    if (members.length === 0) {
      return res.status(404).json({ success: false, message: 'Member not found.' });
    }
    const member = members[0];

    // Find member's latest membership to chain end date if active
    const [lastSubs] = await connection.execute(
      `SELECT end_date, status FROM memberships WHERE member_id = ? ORDER BY end_date DESC LIMIT 1`,
      [memberId]
    );

    const today = new Date();
    let startDate = today;

    if (lastSubs.length > 0) {
      const lastEnd = new Date(lastSubs[0].end_date);
      if (lastEnd > today) {
        // Still active, renew from day after previous expiration
        startDate = new Date(lastEnd);
        startDate.setDate(startDate.getDate() + 1);
      }
    }

    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + parseInt(plan.duration_days, 10));

    const startDateStr = startDate.toISOString().split('T')[0];
    const endDateStr = endDate.toISOString().split('T')[0];

    await connection.beginTransaction();

    const [subRes] = await connection.execute(
      `INSERT INTO memberships (member_id, plan_id, start_date, end_date, status, notes)
       VALUES (?, ?, ?, ?, 'active', ?)`,
      [memberId, planId, startDateStr, endDateStr, notes || 'Renewed membership']
    );
    const membershipId = subRes.insertId;

    let invoiceNumber = null;
    let invoiceId = null;

    if (generateInvoice) {
      invoiceNumber = await generateInvoiceNumber();
      const price = parseFloat(plan.price);
      const invoiceDateStr = today.toISOString().split('T')[0];
      const dueDate = new Date(today);
      dueDate.setDate(dueDate.getDate() + 5);
      const dueDateStr = dueDate.toISOString().split('T')[0];

      const [invRes] = await connection.execute(
        `INSERT INTO invoices (
          invoice_number, member_id, membership_id, invoice_date, due_date,
          subtotal, discount, tax_amount, final_amount, amount_paid,
          balance_amount, payment_status, notes
        ) VALUES (?, ?, ?, ?, ?, ?, 0.00, 0.00, ?, 0.00, ?, 'pending', ?)`,
        [
          invoiceNumber,
          memberId,
          membershipId,
          invoiceDateStr,
          dueDateStr,
          price,
          price,
          price,
          `Membership Renewal - ${plan.name}`
        ]
      );
      invoiceId = invRes.insertId;

      await connection.execute(
        `INSERT INTO invoice_items (invoice_id, description, quantity, unit_price, total_price)
         VALUES (?, ?, 1, ?, ?)`,
        [invoiceId, `Renewal: ${plan.name} (${plan.duration_days} Days)`, price, price]
      );
    }

    await connection.commit();

    await logAudit({
      userId: req.user.id,
      action: 'MEMBERSHIP_RENEWED',
      entityType: 'memberships',
      entityId: membershipId,
      details: { memberCode: member.member_code, planName: plan.name, invoiceNumber },
      ipAddress: req.ip
    });

    res.status(201).json({
      success: true,
      message: `Membership renewed successfully until ${endDateStr}!`,
      membershipId,
      invoiceNumber,
      invoiceId
    });
  } catch (err) {
    await connection.rollback();
    next(err);
  } finally {
    connection.release();
  }
}

// 4. Cancel Membership (Admin Only)
async function cancelMembership(req, res, next) {
  try {
    const membershipId = parseInt(req.params.id, 10);
    await pool.execute(
      `UPDATE memberships SET status = 'cancelled' WHERE id = ?`,
      [membershipId]
    );

    await logAudit({
      userId: req.user.id,
      action: 'MEMBERSHIP_CANCELLED',
      entityType: 'memberships',
      entityId: membershipId,
      ipAddress: req.ip
    });

    res.json({
      success: true,
      message: 'Membership status set to cancelled.'
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getMemberships,
  assignMembership,
  renewMembership,
  cancelMembership
};
