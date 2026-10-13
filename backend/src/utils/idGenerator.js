const { pool } = require('../config/db');

async function generateMemberCode() {
  const [rows] = await pool.execute(
    `SELECT member_code FROM members ORDER BY id DESC LIMIT 1`
  );
  if (rows.length === 0) {
    return 'RVF-0001';
  }
  const lastCode = rows[0].member_code; // e.g. "RVF-0003"
  const match = lastCode.match(/RVF-(\d+)/);
  if (match) {
    const nextNum = parseInt(match[1], 10) + 1;
    return `RVF-${String(nextNum).padStart(4, '0')}`;
  }
  return `RVF-${Date.now().toString().slice(-4)}`;
}

async function generateInvoiceNumber() {
  const year = new Date().getFullYear();
  const [rows] = await pool.execute(
    `SELECT invoice_number FROM invoices WHERE invoice_number LIKE ? ORDER BY id DESC LIMIT 1`,
    [`INV-${year}-%`]
  );
  if (rows.length === 0) {
    return `INV-${year}-0001`;
  }
  const lastNumber = rows[0].invoice_number;
  const match = lastNumber.match(/INV-\d+-(\d+)/);
  if (match) {
    const nextNum = parseInt(match[1], 10) + 1;
    return `INV-${year}-${String(nextNum).padStart(4, '0')}`;
  }
  return `INV-${year}-${Date.now().toString().slice(-4)}`;
}

async function generatePaymentNumber() {
  const year = new Date().getFullYear();
  const [rows] = await pool.execute(
    `SELECT payment_number FROM payments WHERE payment_number LIKE ? ORDER BY id DESC LIMIT 1`,
    [`PAY-${year}-%`]
  );
  if (rows.length === 0) {
    return `PAY-${year}-0001`;
  }
  const lastNumber = rows[0].payment_number;
  const match = lastNumber.match(/PAY-\d+-(\d+)/);
  if (match) {
    const nextNum = parseInt(match[1], 10) + 1;
    return `PAY-${year}-${String(nextNum).padStart(4, '0')}`;
  }
  return `PAY-${year}-${Date.now().toString().slice(-4)}`;
}

async function generateReceiptNumber() {
  const year = new Date().getFullYear();
  const [rows] = await pool.execute(
    `SELECT receipt_number FROM receipts WHERE receipt_number LIKE ? ORDER BY id DESC LIMIT 1`,
    [`RCP-${year}-%`]
  );
  if (rows.length === 0) {
    return `RCP-${year}-0001`;
  }
  const lastNumber = rows[0].receipt_number;
  const match = lastNumber.match(/RCP-\d+-(\d+)/);
  if (match) {
    const nextNum = parseInt(match[1], 10) + 1;
    return `RCP-${year}-${String(nextNum).padStart(4, '0')}`;
  }
  return `RCP-${year}-${Date.now().toString().slice(-4)}`;
}

module.exports = {
  generateMemberCode,
  generateInvoiceNumber,
  generatePaymentNumber,
  generateReceiptNumber
};
