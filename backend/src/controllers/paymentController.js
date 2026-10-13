const { pool } = require('../config/db');
const { generatePaymentNumber, generateReceiptNumber } = require('../utils/idGenerator');
const { logAudit } = require('../utils/auditLogger');

// 1. Get Payments List
async function getPayments(req, res, next) {
  try {
    const { memberId = '', invoiceId = '', paymentMethod = '', startDate = '', endDate = '' } = req.query;

    let sql = `
      SELECT 
        p.*,
        inv.invoice_number, inv.final_amount, inv.balance_amount AS current_invoice_balance,
        m.member_code, m.full_name AS member_name, m.phone AS member_phone,
        r.receipt_number, r.id AS receipt_id
      FROM payments p
      JOIN invoices inv ON p.invoice_id = inv.id
      JOIN members m ON p.member_id = m.id
      LEFT JOIN receipts r ON p.id = r.payment_id
      WHERE 1=1
    `;
    const params = [];

    if (req.user.role === 'member') {
      sql += ` AND p.member_id = ?`;
      params.push(req.user.memberId);
    } else if (memberId) {
      sql += ` AND p.member_id = ?`;
      params.push(memberId);
    }

    if (invoiceId) {
      sql += ` AND p.invoice_id = ?`;
      params.push(invoiceId);
    }
    if (paymentMethod) {
      sql += ` AND p.payment_method = ?`;
      params.push(paymentMethod);
    }
    if (startDate) {
      sql += ` AND p.payment_date >= ?`;
      params.push(startDate);
    }
    if (endDate) {
      sql += ` AND p.payment_date <= ?`;
      params.push(endDate);
    }

    sql += ` ORDER BY p.id DESC`;
    const [payments] = await pool.execute(sql, params);

    res.json({
      success: true,
      payments
    });
  } catch (err) {
    next(err);
  }
}

// 2. Record Payment (Admin Only)
async function recordPayment(req, res, next) {
  const connection = await pool.getConnection();
  try {
    const {
      invoiceId,
      amount,
      paymentMethod = 'Cash',
      paymentDate,
      referenceNumber,
      notes
    } = req.body;

    const paymentAmount = parseFloat(amount);
    if (!invoiceId || isNaN(paymentAmount) || paymentAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid Invoice ID and positive payment amount are required.'
      });
    }

    await connection.beginTransaction();

    // Lock invoice row for atomic calculation
    const [invoices] = await connection.execute(
      `SELECT * FROM invoices WHERE id = ? FOR UPDATE`,
      [invoiceId]
    );

    if (invoices.length === 0) {
      await connection.rollback();
      return res.status(404).json({ success: false, message: 'Invoice not found.' });
    }

    const invoice = invoices[0];

    if (invoice.payment_status === 'cancelled') {
      await connection.rollback();
      return res.status(400).json({ success: false, message: 'Cannot record payment for a cancelled invoice.' });
    }

    const currentBalance = parseFloat(invoice.balance_amount);

    if (paymentAmount > currentBalance + 0.001) {
      await connection.rollback();
      return res.status(400).json({
        success: false,
        message: `Payment amount (₹${paymentAmount.toFixed(2)}) cannot exceed the outstanding balance (₹${currentBalance.toFixed(2)}).`
      });
    }

    const newAmountPaid = parseFloat(invoice.amount_paid) + paymentAmount;
    const newBalance = Math.max(0, parseFloat(invoice.final_amount) - newAmountPaid);
    const newStatus = newBalance <= 0 ? 'paid' : 'partially_paid';

    // Update invoice
    await connection.execute(
      `UPDATE invoices SET
        amount_paid = ?,
        balance_amount = ?,
        payment_status = ?,
        payment_method = ?
       WHERE id = ?`,
      [newAmountPaid, newBalance, newStatus, paymentMethod, invoiceId]
    );

    // Generate unique Payment and Receipt numbers
    const paymentNumber = await generatePaymentNumber();
    const payDateStr = paymentDate || new Date().toISOString().split('T')[0];

    // Insert payment
    const [payRes] = await connection.execute(
      `INSERT INTO payments (
        payment_number, invoice_id, member_id, payment_date, amount,
        payment_method, reference_number, notes, received_by_user_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        paymentNumber,
        invoiceId,
        invoice.member_id,
        payDateStr,
        paymentAmount,
        paymentMethod,
        referenceNumber || null,
        notes || null,
        req.user.id
      ]
    );
    const paymentId = payRes.insertId;

    // Generate Receipt
    const receiptNumber = await generateReceiptNumber();
    const [recRes] = await connection.execute(
      `INSERT INTO receipts (
        receipt_number, payment_id, invoice_id, member_id, receipt_date,
        amount, remaining_balance, payment_method, reference_number,
        received_by_user_id, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        receiptNumber,
        paymentId,
        invoiceId,
        invoice.member_id,
        payDateStr,
        paymentAmount,
        newBalance,
        paymentMethod,
        referenceNumber || null,
        req.user.id,
        notes || 'Payment recorded successfully'
      ]
    );
    const receiptId = recRes.insertId;

    await connection.commit();

    await logAudit({
      userId: req.user.id,
      action: 'PAYMENT_RECORDED',
      entityType: 'payments',
      entityId: paymentId,
      details: {
        paymentNumber,
        receiptNumber,
        invoiceNumber: invoice.invoice_number,
        amount: paymentAmount,
        remainingBalance: newBalance
      },
      ipAddress: req.ip
    });

    res.status(201).json({
      success: true,
      message: `Payment of ₹${paymentAmount.toFixed(2)} recorded successfully. Receipt #${receiptNumber} generated.`,
      paymentId,
      paymentNumber,
      receiptId,
      receiptNumber,
      newBalance,
      invoiceStatus: newStatus
    });
  } catch (err) {
    await connection.rollback();
    next(err);
  } finally {
    connection.release();
  }
}

// 3. Get Receipts List
async function getReceipts(req, res, next) {
  try {
    const { memberId = '', search = '' } = req.query;

    let sql = `
      SELECT 
        r.*,
        inv.invoice_number,
        m.member_code, m.full_name AS member_name, m.phone AS member_phone,
        u.email AS received_by_email
      FROM receipts r
      JOIN invoices inv ON r.invoice_id = inv.id
      JOIN members m ON r.member_id = m.id
      LEFT JOIN users u ON r.received_by_user_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (req.user.role === 'member') {
      sql += ` AND r.member_id = ?`;
      params.push(req.user.memberId);
    } else if (memberId) {
      sql += ` AND r.member_id = ?`;
      params.push(memberId);
    }

    if (search.trim()) {
      const term = `%${search.trim()}%`;
      sql += ` AND (r.receipt_number LIKE ? OR inv.invoice_number LIKE ? OR m.full_name LIKE ? OR m.member_code LIKE ?)`;
      params.push(term, term, term, term);
    }

    sql += ` ORDER BY r.id DESC`;
    const [receipts] = await pool.execute(sql, params);

    res.json({
      success: true,
      receipts
    });
  } catch (err) {
    next(err);
  }
}

// 4. Get Single Receipt Details (Printable / PDF format)
async function getReceiptById(req, res, next) {
  try {
    const receiptId = parseInt(req.params.id, 10);

    const [rows] = await pool.execute(
      `SELECT 
        r.*,
        p.payment_number, p.payment_date,
        inv.invoice_number, inv.final_amount, inv.amount_paid,
        m.member_code, m.full_name AS member_name, m.phone AS member_phone,
        m.email AS member_email, m.address AS member_address,
        u.email AS received_by_email
       FROM receipts r
       JOIN payments p ON r.payment_id = p.id
       JOIN invoices inv ON r.invoice_id = inv.id
       JOIN members m ON r.member_id = m.id
       LEFT JOIN users u ON r.received_by_user_id = u.id
       WHERE r.id = ?`,
      [receiptId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Receipt not found.' });
    }

    const receipt = rows[0];

    // Access control
    if (req.user.role === 'member' && req.user.memberId !== receipt.member_id) {
      return res.status(403).json({ success: false, message: 'Forbidden. Access restricted to own receipt.' });
    }

    res.json({
      success: true,
      receipt: {
        ...receipt,
        gymDetails: {
          name: 'RV FITNESS',
          tagline: 'Unleash Your Ultimate Strength',
          address: 'Main Bazaar Road, Near Narsimha Mandir, Narsobawadi, Maharashtra - 416104',
          phone: '+91 98220 12345 / +91 98220 54321',
          email: 'contact@rvfitness.com',
          gstin: '27AABCR8921F1ZX'
        }
      }
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getPayments,
  recordPayment,
  getReceipts,
  getReceiptById
};
