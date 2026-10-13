import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Users,
  Dumbbell,
  CreditCard,
  Receipt,
  FileText,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Clock,
  ArrowLeft,
  Plus,
  Printer,
  TrendingDown,
  Activity,
  AlertTriangle,
  CheckCircle,
  X
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import api from '../../services/api';
import { formatCurrency, formatDate, getStatusBadgeClass } from '../../utils/formatters';
import { useNotification } from '../../context/NotificationContext';
import PrintInvoiceModal from '../../components/printable/PrintInvoiceModal';
import PrintReceiptModal from '../../components/printable/PrintReceiptModal';

export default function MemberDetail() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [printInvoiceOpen, setPrintInvoiceOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [printReceiptOpen, setPrintReceiptOpen] = useState(false);
  const [payModalOpen, setPayModalOpen] = useState(false);
  const [invoiceToPay, setInvoiceToPay] = useState(null);

  // Form states
  const [assignForm, setAssignForm] = useState({ planId: '', startDate: '', generateInvoice: true, notes: '' });
  const [payForm, setPayForm] = useState({ amount: '', paymentMethod: 'Cash', referenceNumber: '', notes: '' });

  const { success, error } = useNotification();

  useEffect(() => {
    fetchMemberDetail();
    fetchPlans();
  }, [id]);

  const fetchMemberDetail = () => {
    setLoading(true);
    api.get(`/members/${id}`)
      .then((res) => {
        if (res.data.success) {
          setData(res.data.member);
        }
      })
      .catch(() => error('Failed to load member profile.'))
      .finally(() => setLoading(false));
  };

  const fetchPlans = () => {
    api.get('/membership-plans?status=active')
      .then((res) => {
        if (res.data.success) setPlans(res.data.plans);
      })
      .catch(() => {});
  };

  const handleAssignPlan = async (e) => {
    e.preventDefault();
    if (!assignForm.planId) {
      error('Please select a membership plan.');
      return;
    }

    try {
      const res = await api.post('/memberships/assign', {
        memberId: parseInt(id, 10),
        ...assignForm
      });
      if (res.data.success) {
        success(res.data.message);
        setAssignModalOpen(false);
        fetchMemberDetail();
      }
    } catch (err) {
      error(err.response?.data?.message || 'Failed to assign plan.');
    }
  };

  const handleCollectPayment = async (e) => {
    e.preventDefault();
    if (!invoiceToPay || !payForm.amount) return;

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
        fetchMemberDetail();
      }
    } catch (err) {
      error(err.response?.data?.message || 'Payment recording failed.');
    }
  };

  const viewInvoice = async (invId) => {
    try {
      const res = await api.get(`/invoices/${invId}`);
      if (res.data.success) {
        setSelectedInvoice(res.data.invoice);
        setPrintInvoiceOpen(true);
      }
    } catch (err) {
      error('Failed to load invoice sheet.');
    }
  };

  const viewReceipt = async (receiptId) => {
    try {
      const res = await api.get(`/receipts/${receiptId}`);
      if (res.data.success) {
        setSelectedReceipt(res.data.receipt);
        setPrintReceiptOpen(true);
      }
    } catch (err) {
      error('Failed to load receipt.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-slate-400 text-sm">
        <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mr-3"></div>
        Loading 360° Profile...
      </div>
    );
  }

  if (!data) {
    return <div className="text-center py-12 text-slate-400">Member not found.</div>;
  }

  const { memberships = [], invoices = [], payments = [], progress = [] } = data;
  const currentMembership = memberships.find((m) => m.status === 'active' || m.status === 'expiring_soon');

  // Progress chart data
  const chartData = progress.map((p) => ({
    date: p.recorded_date,
    weight: parseFloat(p.weight_kg),
    bmi: p.bmi ? parseFloat(p.bmi) : null
  }));

  return (
    <div className="space-y-8">
      {/* Back button & Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link
          to="/admin/members"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Members</span>
        </Link>
        <button
          onClick={() => setAssignModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-brand-500 hover:bg-brand-600 text-white shadow-lg transition"
        >
          <Plus className="w-4 h-4" />
          <span>Assign / Renew Membership Plan</span>
        </button>
      </div>

      {/* Profile Overview Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Member Profile */}
        <div className="lg:col-span-8 p-6 sm:p-8 rounded-3xl bg-dark-850 border border-slate-800 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-brand-500/20 border border-brand-500/40 flex items-center justify-center font-black text-2xl text-brand-400 shadow-lg">
                {data.full_name[0]}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-black text-white">{data.full_name}</h2>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${getStatusBadgeClass(data.status)}`}>
                    {data.status}
                  </span>
                </div>
                <p className="font-mono text-sm font-bold text-brand-400 mt-0.5">{data.member_code}</p>
                <p className="text-xs text-slate-400 mt-1">Joined: {formatDate(data.joining_date)}</p>
              </div>
            </div>

            <div className="text-right">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Assigned Coach</p>
              <p className="text-sm font-bold text-white mt-0.5">{data.trainer_name || 'None Assigned'}</p>
              {data.trainer_phone && <p className="text-xs text-slate-400">{data.trainer_phone}</p>}
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div className="p-3 rounded-xl bg-dark-800 border border-slate-750">
              <span className="text-slate-400 block mb-0.5">Mobile</span>
              <span className="font-bold text-white">{data.phone}</span>
            </div>
            <div className="p-3 rounded-xl bg-dark-800 border border-slate-750">
              <span className="text-slate-400 block mb-0.5">Email</span>
              <span className="font-medium text-white truncate block">{data.email}</span>
            </div>
            <div className="p-3 rounded-xl bg-dark-800 border border-slate-750">
              <span className="text-slate-400 block mb-0.5">Gender / DOB</span>
              <span className="font-medium text-white">{data.gender} {data.dob ? `(${formatDate(data.dob)})` : ''}</span>
            </div>
            <div className="p-3 rounded-xl bg-dark-800 border border-slate-750">
              <span className="text-slate-400 block mb-0.5">Height / Weight</span>
              <span className="font-bold text-white">{data.height_cm || '—'} cm / {data.weight_kg || '—'} kg</span>
            </div>
          </div>

          <div className="text-xs space-y-1">
            <span className="text-slate-400 font-semibold">Primary Goal:</span>
            <p className="text-slate-200">{data.fitness_goal || 'General Health & Fitness'}</p>
          </div>

          <div className="text-xs space-y-1">
            <span className="text-slate-400 font-semibold">Narsobawadi Address:</span>
            <p className="text-slate-300">{data.address || 'Narsobawadi'}</p>
          </div>
        </div>

        {/* Active Subscription Countdown Card */}
        <div className="lg:col-span-4 p-6 sm:p-8 rounded-3xl bg-dark-850 border border-slate-800 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Current Plan Status</span>
            {currentMembership ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-black text-white">{currentMembership.plan_name}</h3>
                  <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${getStatusBadgeClass(currentMembership.status)}`}>
                    {currentMembership.status}
                  </span>
                </div>
                <div className="p-4 rounded-2xl bg-dark-800 border border-slate-750 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-300">
                    <span>Valid From:</span>
                    <span className="font-semibold text-white">{formatDate(currentMembership.start_date)}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Expiry Date:</span>
                    <span className="font-semibold text-rose-400">{formatDate(currentMembership.end_date)}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-500/30 text-rose-300 text-xs text-center space-y-2">
                <AlertTriangle className="w-6 h-6 mx-auto text-rose-400" />
                <p className="font-bold">No Active Membership</p>
                <p className="text-[11px] text-slate-400">Assign a plan to reactivate gym floor access.</p>
              </div>
            )}
          </div>

          <button
            onClick={() => setAssignModalOpen(true)}
            className="w-full py-2.5 rounded-xl font-bold text-xs bg-dark-750 hover:bg-slate-700 text-white border border-slate-700 transition text-center"
          >
            Assign or Renew Package
          </button>
        </div>
      </div>

      {/* Progress Chart */}
      {chartData.length > 0 && (
        <div className="p-6 rounded-3xl bg-dark-850 border border-slate-800 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-base font-bold text-white">Weight Progression (kg)</h3>
              <p className="text-xs text-slate-400">Biometric check-in trend recorded by coaches</p>
            </div>
            <Activity className="w-5 h-5 text-brand-500" />
          </div>
          <div className="h-60 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e2638" />
                <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} domain={['dataMin - 2', 'dataMax + 2']} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f1420', borderColor: '#334155', borderRadius: '12px', fontSize: '12px', color: '#fff' }}
                  formatter={(v) => [`${v} kg`, 'Weight']}
                />
                <Line type="monotone" dataKey="weight" stroke="#e11d48" strokeWidth={3} dot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Invoices and Payments Tabs / Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Invoices Table */}
        <div className="p-6 rounded-3xl bg-dark-850 border border-slate-800 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-bold text-white">Member Invoices</h3>
            <span className="text-xs text-slate-400 font-semibold">{invoices.length} records</span>
          </div>
          <div className="divide-y divide-slate-800 text-xs">
            {invoices.length === 0 ? (
              <p className="text-slate-500 py-6 text-center">No invoices issued for this member.</p>
            ) : (
              invoices.map((inv) => (
                <div key={inv.id} className="py-3 flex items-center justify-between">
                  <div>
                    <button
                      onClick={() => viewInvoice(inv.id)}
                      className="font-mono font-bold text-brand-400 hover:underline flex items-center gap-1"
                    >
                      <span>{inv.invoice_number}</span>
                      <Printer className="w-3 h-3 text-slate-400" />
                    </button>
                    <p className="text-slate-400 text-[11px] mt-0.5">{formatDate(inv.invoice_date)}</p>
                  </div>
                  <div className="text-right flex items-center gap-3">
                    <div>
                      <p className="font-mono font-bold text-white">{formatCurrency(inv.final_amount)}</p>
                      <span className={`inline-block px-1.5 py-0.2 rounded text-[10px] font-bold uppercase ${getStatusBadgeClass(inv.payment_status)}`}>
                        {inv.payment_status}
                      </span>
                    </div>
                    {parseFloat(inv.balance_amount) > 0 && inv.payment_status !== 'cancelled' && (
                      <button
                        onClick={() => { setInvoiceToPay(inv); setPayForm({ ...payForm, amount: inv.balance_amount }); setPayModalOpen(true); }}
                        className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-white transition font-bold text-[11px]"
                      >
                        Collect
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Payments & Receipts Table */}
        <div className="p-6 rounded-3xl bg-dark-850 border border-slate-800 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-bold text-white">Payment Receipts</h3>
            <span className="text-xs text-slate-400 font-semibold">{payments.length} receipts</span>
          </div>
          <div className="divide-y divide-slate-800 text-xs">
            {payments.length === 0 ? (
              <p className="text-slate-500 py-6 text-center">No payments recorded yet.</p>
            ) : (
              payments.map((p) => (
                <div key={p.id} className="py-3 flex items-center justify-between">
                  <div>
                    <button
                      onClick={() => viewReceipt(p.id)}
                      className="font-mono font-bold text-emerald-400 hover:underline flex items-center gap-1"
                    >
                      <span>{p.receipt_number || p.payment_number}</span>
                      <Printer className="w-3 h-3 text-slate-400" />
                    </button>
                    <p className="text-slate-400 text-[11px] mt-0.5">{formatDate(p.payment_date)} ({p.payment_method})</p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono font-bold text-white">{formatCurrency(p.amount)}</p>
                    <span className="text-[10px] text-slate-400">Inv: {p.invoice_number}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* ASSIGN / RENEW PLAN MODAL */}
      {assignModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-dark-850 border border-slate-700 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden my-8">
            <div className="p-6 bg-dark-800 border-b border-slate-700 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-white text-base">Assign Membership Plan</h3>
                <p className="text-xs text-slate-400">Automatically computes expiry date and generates invoice.</p>
              </div>
              <button onClick={() => setAssignModalOpen(false)} className="p-1.5 text-slate-400 hover:text-white rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAssignPlan} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Select Membership Plan *</label>
                <select
                  required
                  value={assignForm.planId}
                  onChange={(e) => setAssignForm({ ...assignForm, planId: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-dark-800 border border-slate-700 text-white text-xs focus:border-brand-500 focus:outline-none"
                >
                  <option value="">-- Choose Plan --</option>
                  {plans.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.duration_days} Days) – {formatCurrency(p.price)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Start Date (Leave empty for today)</label>
                <input
                  type="date"
                  value={assignForm.startDate}
                  onChange={(e) => setAssignForm({ ...assignForm, startDate: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-dark-800 border border-slate-700 text-white text-xs focus:border-brand-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="genInv"
                  checked={assignForm.generateInvoice}
                  onChange={(e) => setAssignForm({ ...assignForm, generateInvoice: e.target.checked })}
                  className="rounded bg-dark-800 border-slate-700 text-brand-500 focus:ring-0"
                />
                <label htmlFor="genInv" className="text-xs text-slate-300 font-medium cursor-pointer">
                  Generate Billing Invoice Automatically
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setAssignModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-dark-800 border border-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl text-xs font-bold text-white bg-brand-500 hover:bg-brand-600 shadow-lg"
                >
                  Confirm & Assign
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
                <p className="text-xs text-slate-400">Outstanding: {formatCurrency(invoiceToPay.balance_amount)}</p>
              </div>
              <button onClick={() => setPayModalOpen(false)} className="p-1.5 text-slate-400 hover:text-white rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCollectPayment} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Payment Amount (₹) *</label>
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
                <label className="block text-xs font-semibold text-slate-300 mb-1">Payment Mode</label>
                <select
                  value={payForm.paymentMethod}
                  onChange={(e) => setPayForm({ ...payForm, paymentMethod: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-dark-800 border border-slate-700 text-white text-xs focus:border-brand-500 focus:outline-none"
                >
                  <option value="Cash">Cash (Desk Collection)</option>
                  <option value="UPI">UPI (Google Pay / PhonePe / Paytm)</option>
                  <option value="Bank Transfer">Bank Transfer (NEFT/IMPS)</option>
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
                  placeholder="e.g. UPI-9988-1234"
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
        isOpen={printInvoiceOpen}
        onClose={() => setPrintInvoiceOpen(false)}
      />

      {/* PRINT RECEIPT MODAL */}
      <PrintReceiptModal
        receipt={selectedReceipt}
        isOpen={printReceiptOpen}
        onClose={() => setPrintReceiptOpen(false)}
      />
    </div>
  );
}
