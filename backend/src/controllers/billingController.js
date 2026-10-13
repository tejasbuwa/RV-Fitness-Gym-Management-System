const { pool } = require('../config/db');
const { generateInvoiceNumber } = require('../utils/idGenerator');
const { logAudit } = require('../utils/auditLogger');

// 1. Get Invoices (Admin & Member)
async function getInvoices(req, res, next) {
  try {
    const {
      status = '',
      memberId = '',
      startDate = '',
      endDate = '',
      search = ''
    } = req.query;

    let sql = `
      SELECT 
        inv.*,
        m.member_code, m.full_name AS member_name, m.phone AS member_phone,
        m.email AS member_email
      FROM invoices inv
      JOIN members m ON inv.member_id = m.id
      WHERE 1=1
    `;
    const params = [];

    // Access control
    if (req.user.role === 'member') {
      sql += ` AND inv.member_id = ?`;
      params.push(req.user.memberId);
    } else if (memberId) {
      sql += ` AND inv.member_id = ?`;
      params.push(memberId);
    }

    if (status) {
      sql += ` AND inv.payment_status = ?`;
      params.push(status);
    }

    if (startDate) {
      sql += ` AND inv.invoice_date >= ?`;
      params.push(startDate);
    }
    if (endDate) {
      sql += ` AND inv.invoice_date <= ?`;
      params.push(endDate);
    }

    if (search.trim()) {
      const term = `%${search.trim()}%`;
      sql += ` AND (inv.invoice_number LIKE ? OR m.full_name LIKE ? OR m.member_code LIKE ?)`;
      params.push(term, term, term);
    }

    sql += ` ORDER BY inv.id DESC`;
    const [invoices] = await pool.execute(sql, params);

    res.json({
      success: true,
      invoices
    });
  } catch (err) {
    next(err);
  }
}

// 2. Get Single Invoice Details
async function getInvoiceById(req, res, next) {
  try {
    const invoiceId = parseInt(req.params.id, 10);

    const [invoices] = await pool.execute(
      `SELECT 
        inv.*,
        m.member_code, m.full_name AS member_name, m.phone AS member_phone,
        m.email AS member_email, m.address AS member_address,
        ms.start_date AS membership_start, ms.end_date AS membership_end
       FROM invoices inv
       JOIN members m ON inv.member_id = m.id
       LEFT JOIN memberships ms ON inv.membership_id = ms.id
       WHERE inv.id = ?`,
      [invoiceId]
    );

    if (invoices.length === 0) {
      return res.status(404).json({ success: false, message: 'Invoice not found.' });
    }

    const invoice = invoices[0];

    // Access control
    if (req.user.role === 'member' && req.user.memberId !== invoice.member_id) {
      return res.status(403).json({ success: false, message: 'Forbidden. Access restricted to own invoice.' });
    }

    // Fetch line items
    const [items] = await pool.execute(
      `SELECT * FROM invoice_items WHERE invoice_id = ?`,
      [invoiceId]
    );

    // Fetch payments made for this invoice
    const [payments] = await pool.execute(
      `SELECT p.*, r.receipt_number, u.email as received_by_email
       FROM payments p
       LEFT JOIN receipts r ON p.id = r.payment_id
       LEFT JOIN users u ON p.received_by_user_id = u.id
       WHERE p.invoice_id = ?
       ORDER BY p.payment_date ASC`,
      [invoiceId]
    );

    res.json({
      success: true,
      invoice: {
        ...invoice,
        gymDetails: {
          name: 'RV FITNESS',
          tagline: 'Unleash Your Ultimate Strength',
          address: 'Main Bazaar Road, Near Narsimha Mandir, Narsobawadi, Maharashtra - 416104',
          phone: '+91 98220 12345 / +91 98220 54321',
          email: 'contact@rvfitness.com',
          gstin: '27AABCR8921F1ZX'
        },
        items,
        payments
      }
    });
  } catch (err) {
    next(err);
  }
}

// 3. Create Invoice (Admin Only)
async function createInvoice(req, res, next) {
  const connection = await pool.getConnection();
  try {
    const {
      memberId,
      membershipId = null,
      invoiceDate,
      dueDate,
      discount = 0.00,
      taxAmount = 0.00,
      items = [],
      notes
    } = req.body;

    if (!memberId || !items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Member ID and at least one line item are required.'
      });
    }

    // Calculate subtotal
    let subtotal = 0;
    for (const item of items) {
      const lineTotal = parseFloat(item.unitPrice || 0) * parseInt(item.quantity || 1, 10);
      subtotal += lineTotal;
    }

    const finalAmount = Math.max(0, subtotal - parseFloat(discount) + parseFloat(taxAmount));
    const invoiceNumber = await generateInvoiceNumber();

    const invDateStr = invoiceDate || new Date().toISOString().split('T')[0];
    const dueDateStr = dueDate || new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0];

    await connection.beginTransaction();

    const [invRes] = await connection.execute(
      `INSERT INTO invoices (
        invoice_number, member_id, membership_id, invoice_date, due_date,
        subtotal, discount, tax_amount, final_amount, amount_paid,
        balance_amount, payment_status, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0.00, ?, 'pending', ?)`,
      [
        invoiceNumber,
        memberId,
        membershipId,
        invDateStr,
        dueDateStr,
        subtotal,
        parseFloat(discount),
        parseFloat(taxAmount),
        finalAmount,
        finalAmount,
        notes || null
      ]
    );
    const invoiceId = invRes.insertId;

    // Insert items
    for (const item of items) {
      const qty = parseInt(item.quantity || 1, 10);
      const unitPrice = parseFloat(item.unitPrice || 0);
      const total = qty * unitPrice;
      await connection.execute(
        `INSERT INTO invoice_items (invoice_id, description, quantity, unit_price, total_price)
         VALUES (?, ?, ?, ?, ?)`,
        [invoiceId, item.description, qty, unitPrice, total]
      );
    }

    await connection.commit();

    await logAudit({
      userId: req.user.id,
      action: 'INVOICE_CREATED',
      entityType: 'invoices',
      entityId: invoiceId,
      details: { invoiceNumber, finalAmount, memberId },
      ipAddress: req.ip
    });

    res.status(201).json({
      success: true,
      message: `Invoice ${invoiceNumber} created successfully.`,
      invoiceId,
      invoiceNumber,
      finalAmount
    });
  } catch (err) {
    await connection.rollback();
    next(err);
  } finally {
    connection.release();
  }
}

// 4. Cancel Invoice (Admin Only)
async function cancelInvoice(req, res, next) {
  try {
    const invoiceId = parseInt(req.params.id, 10);

    const [inv] = await pool.execute(`SELECT * FROM invoices WHERE id = ?`, [invoiceId]);
    if (inv.length === 0) {
      return res.status(404).json({ success: false, message: 'Invoice not found.' });
    }

    if (parseFloat(inv[0].amount_paid) > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel an invoice with recorded payments. Please refund or reverse payments first.'
      });
    }

    await pool.execute(
      `UPDATE invoices SET payment_status = 'cancelled', balance_amount = 0.00 WHERE id = ?`,
      [invoiceId]
    );

    await logAudit({
      userId: req.user.id,
      action: 'INVOICE_CANCELLED',
      entityType: 'invoices',
      entityId: invoiceId,
      details: { invoiceNumber: inv[0].invoice_number },
      ipAddress: req.ip
    });

    res.json({
      success: true,
      message: 'Invoice cancelled successfully.'
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getInvoices,
  getInvoiceById,
  createInvoice,
  cancelInvoice
};
