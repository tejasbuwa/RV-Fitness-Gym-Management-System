import React, { useState, useEffect } from 'react';
import {
  FileText,
  Search,
  Filter,
  Plus,
  Printer,
  DollarSign,
  Ban,
  CheckCircle,
  AlertCircle,
  Clock,
  X
} from 'lucide-react';
import api from '../../services/api';
import { formatCurrency, formatDate, getStatusBadgeClass } from '../../utils/formatters';
import { useNotification } from '../../context/NotificationContext';
import PrintInvoiceModal from '../../components/printable/PrintInvoiceModal';

export default function InvoiceList() {
  const [invoices, setInvoices] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');

  // Modals
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [printModalOpen, setPrintModalOpen] = useState(false);
  const [payModalOpen, setPayModalOpen] = useState(false);
  const [invoiceToPay, setInvoiceToPay] = useState(null);

  // Forms
  const [payForm, setPayForm] = useState({ amount: '', paymentMethod: 'Cash', referenceNumber: '', notes: '' });
  const [newInvoice, setNewInvoice] = useState({
    memberId: '',
    discount: 0,
    taxAmount: 0,
    items: [{ description: 'Gym Membership & Admission Fee', quantity: 1, unitPrice: 1500 }]
  });

  const { success, error } = useNotification();

  useEffect(() => {
    fetchInvoices();
    fetchMembers();
  }, [statusFilter, search]);

  const fetchInvoices = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (statusFilter) params.append('status', statusFilter);
    if (search) params.append('search', search);

    api.get(`/invoices?${params.toString()}`)
      .then((res) => {
        if (res.data.success) {
          setInvoices(res.data.invoices);
        }
      })
      .catch(() => error('Failed to load invoices.'))
      .finally(() => setLoading(false));
  };

  const fetchMembers = () => {
    api.get('/members')
      .then((res) => {
        if (res.data.success) setMembers(res.data.members);
      })
      .catch(() => {});
  };

  const openPrintModal = async (invId) => {
    try {
      const res = await api.get(`/invoices/${invId}`);
      if (res.data.success) {
        setSelectedInvoice(res.data.invoice);
        setPrintModalOpen(true);
      }
    } catch {
      error('Failed to load printable invoice.');
    }
  };

  const handleCancelInvoice = async (invId) => {
    if (!window.confirm('Are you sure you want to cancel this invoice?')) return;
    try {
      const res = await api.patch(`/invoices/${invId}/cancel`);
      if (res.data.success) {
        success('Invoice cancelled successfully.');
        fetchInvoices();
      }
    } catch (err) {
      error(err.response?.data?.message || 'Failed to cancel invoice.');
    }
  };

  const handleCollectPayment = async (e) => {
    e.preventDefault();
    if (!invoiceToPay) return;
    try {
      const res = await api.post('/payments', {
        invoiceId: invoiceToPay.id,
        amount: parseFloat(payForm.amount),
        paymentMethod: payForm.paymentMethod,
        referenceNumber: payForm.referenceNumber,
        notes: payForm.notes
      });
      if (res.data.success) {
        success(res.data.message);
        setPayModalOpen(false);
        setPayForm({ amount: '', paymentMethod: 'Cash', referenceNumber: '', notes: '' });
        fetchInvoices();
      }
    } catch (err) {
      error(err.response?.data?.message || 'Payment recording failed.');
    }
  };

  const handleCreateInvoice = async (e) => {
    e.preventDefault();
    if (!newInvoice.memberId) {
      error('Please select a member.');
      return;
    }
    try {
      const res = await api.post('/invoices', newInvoice);
      if (res.data.success) {
        success(res.data.message);
        setCreateModalOpen(false);
        fetchInvoices();
      }
    } catch (err) {
      error(err.response?.data?.message || 'Failed to generate invoice.');
    }
  };

  const addItemRow = () => {
    setNewInvoice({
      ...newInvoice,
      items: [...newInvoice.items, { description: '', quantity: 1, unitPrice: 0 }]
    });
  };

  const updateItemRow = (index, field, val) => {
    const updated = [...newInvoice.items];
    updated[index][field] = val;
    setNewInvoice({ ...newInvoice, items: updated });
  };

  const removeItemRow = (index) => {
    if (newInvoice.items.length === 1) return;
    const updated = newInvoice.items.filter((_, idx) => idx !== index);
    setNewInvoice({ ...newInvoice, items: updated });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white">Invoices & Billing Ledger</h2>
          <p className="text-xs text-slate-400">Generate tax invoices, track payment status, and print receipts.</p>
        </div>
        <button
          onClick={() => setCreateModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs bg-brand-500 hover:bg-brand-600 text-white shadow-lg transition"
        >
          <Plus className="w-4 h-4" />
          <span>Generate New Invoice</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-dark-850 border border-slate-800 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
        <div className="sm:col-span-8 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search invoice number, member name or RVF ID..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-dark-800 border border-slate-700 text-white text-xs focus:border-brand-500 focus:outline-none"
          />
        </div>
        <div className="sm:col-span-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-dark-800 border border-slate-700 text-white text-xs focus:border-brand-500 focus:outline-none"
          >
            <option value="">All Payment Statuses</option>
            <option value="paid">Paid</option>
            <option value="partially_paid">Partially Paid</option>
            <option value="pending">Pending</option>
            <option value="overdue">Overdue</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="rounded-2xl bg-dark-850 border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-dark-800/80 text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-800">
                <th className="py-3 px-4">Invoice #</th>
                <th className="py-3 px-4">Billed Member</th>
                <th className="py-3 px-4">Date / Due</th>
                <th className="py-3 px-4 text-right">Total Amount</th>
                <th className="py-3 px-4 text-right">Amount Paid</th>
                <th className="py-3 px-4 text-right">Balance Due</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {loading ? (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-slate-500 text-xs">
                    Loading invoices...
                  </td>
                </tr>
              ) : invoices.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-slate-500 text-xs">
                    No billing records found.
                  </td>
                </tr>
              ) : (
                invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-dark-800/40 transition">
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => openPrintModal(inv.id)}
                        className="font-mono font-bold text-brand-400 hover:underline flex items-center gap-1.5"
                      >
                        <span>{inv.invoice_number}</span>
                        <Printer className="w-3.5 h-3.5 text-slate-400" />
                      </button>
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-white">{inv.member_name}</p>
                      <p className="font-mono text-[11px] text-slate-400">{inv.member_code}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="text-slate-300">{formatDate(inv.invoice_date)}</p>
                      <p className="text-[10px] text-slate-500">Due: {formatDate(inv.due_date)}</p>
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-white">
                      {formatCurrency(inv.final_amount)}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-emerald-400">
                      {formatCurrency(inv.amount_paid)}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold">
                      {parseFloat(inv.balance_amount) > 0 ? (
                        <span className="text-rose-400">{formatCurrency(inv.balance_amount)}</span>
                      ) : (
                        <span className="text-slate-500">₹0.00</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${getStatusBadgeClass(inv.payment_status)}`}>
                        {inv.payment_status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {parseFloat(inv.balance_amount) > 0 && inv.payment_status !== 'cancelled' && (
                          <button
                            onClick={() => {
                              setInvoiceToPay(inv);
                              setPayForm({ ...payForm, amount: inv.balance_amount });
                              setPayModalOpen(true);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-[11px] transition"
                          >
                            Collect
                          </button>
                        )}
                        <button
                          onClick={() => openPrintModal(inv.id)}
                          title="Print / View Invoice"
                          className="p-1.5 rounded-lg bg-dark-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>
                        {parseFloat(inv.amount_paid) === 0 && inv.payment_status !== 'cancelled' && (
                          <button
                            onClick={() => handleCancelInvoice(inv.id)}
                            title="Cancel Invoice"
                            className="p-1.5 rounded-lg bg-dark-800 hover:bg-rose-500/20 text-rose-400 transition"
                          >
                            <Ban className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE INVOICE MODAL */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-dark-850 border border-slate-700 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden my-8">
            <div className="p-6 bg-dark-800 border-b border-slate-700 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-white text-base">Generate Customer Invoice</h3>
                <p className="text-xs text-slate-400">Add itemized membership fees or merchandise lines.</p>
              </div>
              <button onClick={() => setCreateModalOpen(false)} className="p-1.5 text-slate-400 hover:text-white rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateInvoice} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Select Member *</label>
                <select
                  required
                  value={newInvoice.memberId}
                  onChange={(e) => setNewInvoice({ ...newInvoice, memberId: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-dark-800 border border-slate-700 text-white text-xs focus:border-brand-500 focus:outline-none"
                >
                  <option value="">-- Choose Member --</option>
                  {members.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.full_name} ({m.member_code}) - {m.phone}
                    </option>
                  ))}
                </select>
              </div>

              {/* Line items builder */}
              <div className="space-y-3 pt-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold text-slate-300">Invoice Line Items</label>
                  <button
                    type="button"
                    onClick={addItemRow}
                    className="text-xs font-bold text-brand-400 hover:text-brand-300 flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Item</span>
                  </button>
                </div>

                {newInvoice.items.map((item, idx) => (
                  <div key={idx} className="grid grid-cols-12 gap-2 items-center bg-dark-800 p-2.5 rounded-xl border border-slate-750">
                    <div className="col-span-6">
                      <input
                        type="text"
                        required
                        placeholder="Item Description"
                        value={item.description}
                        onChange={(e) => updateItemRow(idx, 'description', e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-dark-850 border border-slate-700 text-white text-xs"
                      />
                    </div>
                    <div className="col-span-2">
                      <input
                        type="number"
                        min="1"
                        required
                        placeholder="Qty"
                        value={item.quantity}
                        onChange={(e) => updateItemRow(idx, 'quantity', e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-dark-850 border border-slate-700 text-white text-xs"
                      />
                    </div>
                    <div className="col-span-3">
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        required
                        placeholder="Rate ₹"
                        value={item.unitPrice}
                        onChange={(e) => updateItemRow(idx, 'unitPrice', e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-dark-850 border border-slate-700 text-white text-xs font-mono"
                      />
                    </div>
                    <div className="col-span-1 text-center">
                      <button
                        type="button"
                        onClick={() => removeItemRow(idx)}
                        className="text-slate-400 hover:text-rose-400 p-1"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Discount (₹)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={newInvoice.discount}
                    onChange={(e) => setNewInvoice({ ...newInvoice, discount: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-dark-800 border border-slate-700 text-white text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Tax / GST (₹)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={newInvoice.taxAmount}
                    onChange={(e) => setNewInvoice({ ...newInvoice, taxAmount: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-dark-800 border border-slate-700 text-white text-xs font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-dark-800 border border-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl text-xs font-bold text-white bg-brand-500 hover:bg-brand-600 shadow-lg"
                >
                  Generate Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* COLLECT PAYMENT MODAL */}
      {payModalOpen && invoiceToPay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-dark-850 border border-slate-700 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden my-8">
            <div className="p-6 bg-dark-800 border-b border-slate-700 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-white text-base">Collect Payment: {invoiceToPay.invoice_number}</h3>
                <p className="text-xs text-slate-400">Remaining Balance: {formatCurrency(invoiceToPay.balance_amount)}</p>
              </div>
              <button onClick={() => setPayModalOpen(false)} className="p-1.5 text-slate-400 hover:text-white rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCollectPayment} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Amount to Collect (₹) *</label>
                <input
                  type="number"
                  step="0.01"
                  max={invoiceToPay.balance_amount}
                  required
                  value={payForm.amount}
                  onChange={(e) => setPayForm({ ...payForm, amount: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-dark-800 border border-slate-700 text-white text-xs focus:border-brand-500 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Payment Method</label>
                <select
                  value={payForm.paymentMethod}
                  onChange={(e) => setPayForm({ ...payForm, paymentMethod: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-dark-800 border border-slate-700 text-white text-xs focus:border-brand-500 focus:outline-none"
                >
                  <option value="Cash">Cash</option>
                  <option value="UPI">UPI (Google Pay / PhonePe)</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Card">Debit / Credit Card</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Reference / UTR Number</label>
                <input
                  type="text"
                  value={payForm.referenceNumber}
                  onChange={(e) => setPayForm({ ...payForm, referenceNumber: e.target.value })}
                  placeholder="e.g. UPI-REC-1122"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-dark-800 border border-slate-700 text-white text-xs focus:border-brand-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setPayModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-dark-800 border border-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl text-xs font-bold text-white bg-emerald-500 hover:bg-emerald-600 shadow-lg"
                >
                  Record Payment & Issue Receipt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PRINT INVOICE MODAL */}
      <PrintInvoiceModal
        invoice={selectedInvoice}
        isOpen={printModalOpen}
        onClose={() => setPrintModalOpen(false)}
      />
    </div>
  );
}
