const { pool } = require('../config/db');

// 1. Admin Dashboard KPI Summary
async function getAdminDashboard(req, res, next) {
  try {
    const today = new Date().toISOString().split('T')[0];
    const firstDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];

    // Member counts
    const [memberCounts] = await pool.execute(`
      SELECT 
        COUNT(*) as total_members,
        SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active_members,
        SUM(CASE WHEN status = 'inactive' THEN 1 ELSE 0 END) as inactive_members
      FROM members
    `);

    // Membership status counts
    const [subCounts] = await pool.execute(`
      SELECT 
        SUM(CASE WHEN status = 'expiring_soon' OR (end_date >= CURDATE() AND end_date <= DATE_ADD(CURDATE(), INTERVAL 7 DAY)) THEN 1 ELSE 0 END) as expiring_memberships,
        SUM(CASE WHEN status = 'expired' OR end_date < CURDATE() THEN 1 ELSE 0 END) as expired_memberships
      FROM memberships
    `);

    // Trainers count
    const [trainerCounts] = await pool.execute(`SELECT COUNT(*) as total_trainers FROM trainers WHERE status = 'active'`);

    // Collections & Revenues
    const [todayCollection] = await pool.execute(
      `SELECT COALESCE(SUM(amount), 0) as today_collection FROM payments WHERE payment_date = ?`,
      [today]
    );

    const [monthRevenue] = await pool.execute(
      `SELECT COALESCE(SUM(amount), 0) as monthly_revenue FROM payments WHERE payment_date >= ?`,
      [firstDayOfMonth]
    );

    const [totalRevenue] = await pool.execute(
      `SELECT COALESCE(SUM(amount), 0) as total_revenue FROM payments`
    );

    // Outstanding / Pending balances
    const [pendingBalances] = await pool.execute(`
      SELECT 
        COALESCE(SUM(balance_amount), 0) as pending_amount,
        COUNT(*) as total_invoices,
        SUM(CASE WHEN payment_status = 'paid' THEN 1 ELSE 0 END) as paid_invoices,
        SUM(CASE WHEN payment_status = 'partially_paid' THEN 1 ELSE 0 END) as partially_paid_invoices,
        SUM(CASE WHEN payment_status = 'pending' THEN 1 ELSE 0 END) as pending_invoices,
        SUM(CASE WHEN payment_status = 'overdue' OR (due_date < CURDATE() AND balance_amount > 0) THEN 1 ELSE 0 END) as overdue_invoices,
        SUM(CASE WHEN due_date < CURDATE() AND balance_amount > 0 THEN balance_amount ELSE 0 END) as overdue_amount
      FROM invoices
      WHERE payment_status != 'cancelled'
    `);

    // Recent Payments (last 5)
    const [recentPayments] = await pool.execute(`
      SELECT p.*, m.member_code, m.full_name as member_name, r.receipt_number
      FROM payments p
      JOIN members m ON p.member_id = m.id
      LEFT JOIN receipts r ON p.id = r.payment_id
      ORDER BY p.id DESC LIMIT 5
    `);

    // Recent Members (last 5)
    const [recentMembers] = await pool.execute(`
      SELECT id, member_code, full_name, phone, status, joining_date, profile_photo
      FROM members
      ORDER BY id DESC LIMIT 5
    `);

    // Recent Invoices (last 5)
    const [recentInvoices] = await pool.execute(`
      SELECT inv.*, m.member_code, m.full_name as member_name
      FROM invoices inv
      JOIN members m ON inv.member_id = m.id
      ORDER BY inv.id DESC LIMIT 5
    `);

    // Monthly revenue chart data (last 6 months)
    const [revenueTrend] = await pool.execute(`
      SELECT 
        DATE_FORMAT(payment_date, '%Y-%m') as month,
        DATE_FORMAT(payment_date, '%b %Y') as month_name,
        SUM(amount) as revenue
      FROM payments
      WHERE payment_date >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
      GROUP BY month, month_name
      ORDER BY month ASC
    `);

    // Gym status
    const [gymStatus] = await pool.execute(`SELECT status, notice_message, today_opening_time, today_closing_time FROM gym_status WHERE id = 1`);

    res.json({
      success: true,
      stats: {
        totalMembers: memberCounts[0].total_members || 0,
        activeMembers: memberCounts[0].active_members || 0,
        inactiveMembers: memberCounts[0].inactive_members || 0,
        expiringMemberships: subCounts[0].expiring_memberships || 0,
        expiredMemberships: subCounts[0].expired_memberships || 0,
        totalTrainers: trainerCounts[0].total_trainers || 0,
        todayCollection: parseFloat(todayCollection[0].today_collection || 0),
        monthlyRevenue: parseFloat(monthRevenue[0].monthly_revenue || 0),
        totalRevenue: parseFloat(totalRevenue[0].total_revenue || 0),
        pendingAmount: parseFloat(pendingBalances[0].pending_amount || 0),
        overdueAmount: parseFloat(pendingBalances[0].overdue_amount || 0),
        totalInvoices: pendingBalances[0].total_invoices || 0,
        paidInvoices: pendingBalances[0].paid_invoices || 0,
        partiallyPaidInvoices: pendingBalances[0].partially_paid_invoices || 0,
        pendingInvoices: pendingBalances[0].pending_invoices || 0,
        overdueInvoices: pendingBalances[0].overdue_invoices || 0
      },
      recentPayments,
      recentMembers,
      recentInvoices,
      revenueTrend,
      gymStatus: gymStatus[0] || null
    });
  } catch (err) {
    next(err);
  }
}

// 2. Trainer Dashboard KPI Summary
async function getTrainerDashboard(req, res, next) {
  try {
    const trainerId = req.user.trainerId;

    const [members] = await pool.execute(
      `SELECT 
        COUNT(*) as assigned_count,
        SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active_count
       FROM members WHERE assigned_trainer_id = ?`,
      [trainerId]
    );

    const [recentProgress] = await pool.execute(
      `SELECT pr.*, m.member_code, m.full_name as member_name
       FROM progress_records pr
       JOIN members m ON pr.member_id = m.id
       WHERE m.assigned_trainer_id = ?
       ORDER BY pr.id DESC LIMIT 5`,
      [trainerId]
    );

    const [activeWorkouts] = await pool.execute(
      `SELECT COUNT(*) as count FROM workout_plans WHERE trainer_id = ? AND status = 'active'`,
      [trainerId]
    );

    const [activeDiets] = await pool.execute(
      `SELECT COUNT(*) as count FROM diet_plans WHERE trainer_id = ? AND status = 'active'`,
      [trainerId]
    );

    res.json({
      success: true,
      stats: {
        assignedMembers: members[0].assigned_count || 0,
        activeMembers: members[0].active_count || 0,
        activeWorkouts: activeWorkouts[0].count || 0,
        activeDiets: activeDiets[0].count || 0
      },
      recentProgress
    });
  } catch (err) {
    next(err);
  }
}

// 3. Member Dashboard Summary
async function getMemberDashboard(req, res, next) {
  try {
    const memberId = req.user.memberId;

    // Member basic info
    const [memberRows] = await pool.execute(
      `SELECT m.*, t.full_name as trainer_name, t.phone as trainer_phone, t.specialization as trainer_specialization, t.photo_url as trainer_photo
       FROM members m
       LEFT JOIN trainers t ON m.assigned_trainer_id = t.id
       WHERE m.id = ?`,
      [memberId]
    );

    if (memberRows.length === 0) {
      return res.status(404).json({ success: false, message: 'Member profile not found.' });
    }

    const member = memberRows[0];

    // Current active membership
    const [activeSubs] = await pool.execute(
      `SELECT ms.*, p.name as plan_name, p.plan_type, DATEDIFF(ms.end_date, CURDATE()) as days_remaining
       FROM memberships ms
       JOIN membership_plans p ON ms.plan_id = p.id
       WHERE ms.member_id = ?
       ORDER BY ms.end_date DESC LIMIT 1`,
      [memberId]
    );

    // Pending invoice balances
    const [balances] = await pool.execute(
      `SELECT COALESCE(SUM(balance_amount), 0) as pending_balance
       FROM invoices
       WHERE member_id = ? AND payment_status != 'cancelled'`,
      [memberId]
    );

    // Latest progress
    const [latestProgress] = await pool.execute(
      `SELECT * FROM progress_records WHERE member_id = ? ORDER BY recorded_date DESC LIMIT 1`,
      [memberId]
    );

    // Active workout summary
    const [activeWorkout] = await pool.execute(
      `SELECT * FROM workout_plans WHERE member_id = ? AND status = 'active' ORDER BY id DESC LIMIT 1`,
      [memberId]
    );

    // Active diet summary
    const [activeDiet] = await pool.execute(
      `SELECT * FROM diet_plans WHERE member_id = ? AND status = 'active' ORDER BY id DESC LIMIT 1`,
      [memberId]
    );

    // Latest gym status
    const [gymStatus] = await pool.execute(`SELECT * FROM gym_status WHERE id = 1`);

    res.json({
      success: true,
      member,
      membership: activeSubs[0] || null,
      pendingBalance: parseFloat(balances[0].pending_balance || 0),
      latestProgress: latestProgress[0] || null,
      activeWorkout: activeWorkout[0] || null,
      activeDiet: activeDiet[0] || null,
      gymStatus: gymStatus[0] || null
    });
  } catch (err) {
    next(err);
  }
}

// 4. Reports Engine (Admin Only)
async function getReports(req, res, next) {
  try {
    const { type = 'revenue', startDate, endDate, trainerId } = req.query;

    if (type === 'revenue') {
      let sql = `
        SELECT 
          p.payment_date,
          p.payment_number,
          p.amount,
          p.payment_method,
          p.reference_number,
          m.member_code,
          m.full_name as member_name,
          inv.invoice_number
        FROM payments p
        JOIN members m ON p.member_id = m.id
        JOIN invoices inv ON p.invoice_id = inv.id
        WHERE 1=1
      `;
      const params = [];
      if (startDate) { sql += ` AND p.payment_date >= ?`; params.push(startDate); }
      if (endDate) { sql += ` AND p.payment_date <= ?`; params.push(endDate); }
      sql += ` ORDER BY p.payment_date DESC`;
      const [rows] = await pool.execute(sql, params);

      const total = rows.reduce((sum, r) => sum + parseFloat(r.amount), 0);
      return res.json({ success: true, reportType: 'revenue', data: rows, summary: { totalRevenue: total, count: rows.length } });
    }

    if (type === 'members') {
      let sql = `
        SELECT 
          m.id, m.member_code, m.full_name, m.phone, m.email, m.joining_date, m.status,
          t.full_name as trainer_name,
          (SELECT sub.name FROM memberships ms JOIN membership_plans sub ON ms.plan_id = sub.id WHERE ms.member_id = m.id ORDER BY ms.end_date DESC LIMIT 1) as plan_name,
          (SELECT ms.end_date FROM memberships ms WHERE ms.member_id = m.id ORDER BY ms.end_date DESC LIMIT 1) as expiry_date
        FROM members m
        LEFT JOIN trainers t ON m.assigned_trainer_id = t.id
        WHERE 1=1
      `;
      const params = [];
      if (startDate) { sql += ` AND m.joining_date >= ?`; params.push(startDate); }
      if (endDate) { sql += ` AND m.joining_date <= ?`; params.push(endDate); }
      sql += ` ORDER BY m.joining_date DESC`;
      const [rows] = await pool.execute(sql, params);
      return res.json({ success: true, reportType: 'members', data: rows, summary: { total: rows.length } });
    }

    if (type === 'pending-payments') {
      const [rows] = await pool.execute(`
        SELECT 
          inv.invoice_number, inv.invoice_date, inv.due_date, inv.final_amount,
          inv.amount_paid, inv.balance_amount, inv.payment_status,
          m.member_code, m.full_name as member_name, m.phone as member_phone
        FROM invoices inv
        JOIN members m ON inv.member_id = m.id
        WHERE inv.balance_amount > 0 AND inv.payment_status != 'cancelled'
        ORDER BY inv.due_date ASC
      `);
      const totalPending = rows.reduce((sum, r) => sum + parseFloat(r.balance_amount), 0);
      return res.json({ success: true, reportType: 'pending-payments', data: rows, summary: { totalPending, count: rows.length } });
    }

    if (type === 'trainer-members') {
      const [rows] = await pool.execute(`
        SELECT 
          t.id as trainer_id, t.full_name as trainer_name, t.specialization, t.phone,
          COUNT(m.id) as total_assigned,
          SUM(CASE WHEN m.status = 'active' THEN 1 ELSE 0 END) as active_assigned
        FROM trainers t
        LEFT JOIN members m ON t.id = m.assigned_trainer_id
        GROUP BY t.id, t.full_name, t.specialization, t.phone
        ORDER BY active_assigned DESC
      `);
      return res.json({ success: true, reportType: 'trainer-members', data: rows });
    }

    res.status(400).json({ success: false, message: 'Invalid report type requested.' });
  } catch (err) {
    next(err);
  }
}

// 5. Audit Logs
async function getAuditLogs(req, res, next) {
  try {
    const { limit = 50 } = req.query;
    const [logs] = await pool.execute(
      `SELECT al.*, u.email as user_email, u.role as user_role
       FROM audit_logs al
       LEFT JOIN users u ON al.user_id = u.id
       ORDER BY al.id DESC LIMIT ?`,
      [parseInt(limit, 10)]
    );

    res.json({ success: true, auditLogs: logs });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getAdminDashboard,
  getTrainerDashboard,
  getMemberDashboard,
  getReports,
  getAuditLogs
};
