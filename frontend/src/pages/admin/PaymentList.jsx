import React, { useState, useEffect } from 'react';
import { Receipt, Search, Filter, Printer, CheckCircle } from 'lucide-react';
import api from '../../services/api';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { useNotification } from '../../context/NotificationContext';
import PrintReceiptModal from '../../components/printable/PrintReceiptModal';

export default function PaymentList() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [methodFilter, setMethodFilter] = useState('');

  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [printModalOpen, setPrintModalOpen] = useState(false);

  const { error } = useNotification();

  useEffect(() => {
    fetchPayments();
  }, [search, methodFilter]);

  const fetchPayments = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (methodFilter) params.append('paymentMethod', methodFilter);

    api.get(`/payments?${params.toString()}`)
      .then((res) => {
        if (res.data.success) {
          setPayments(res.data.payments);
        }
      })
      .catch(() => error('Failed to load payment transactions.'))
      .finally(() => setLoading(false));
  };

  const handlePrintReceipt = async (receiptId) => {
    try {
      const res = await api.get(`/receipts/${receiptId}`);
      if (res.data.success) {
        setSelectedReceipt(res.data.receipt);
        setPrintModalOpen(true);
      }
    } catch {
      error('Failed to load printable receipt.');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-white">Payments & Receipts Ledger</h2>
        <p className="text-xs text-slate-400">Complete audit record of every rupee collected at RV Fitness Narsobawadi.</p>
      </div>

      <div className="p-4 rounded-2xl bg-dark-850 border border-slate-800 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
        <div className="sm:col-span-8 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search payments by member, invoice, or receipt number..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-dark-800 border border-slate-700 text-white text-xs focus:border-brand-500 focus:outline-none"
          />
        </div>
        <div className="sm:col-span-4">
          <select
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-dark-800 border border-slate-700 text-white text-xs focus:border-brand-500 focus:outline-none"
          >
            <option value="">All Payment Modes</option>
            <option value="Cash">Cash</option>
            <option value="UPI">UPI</option>
            <option value="Bank Transfer">Bank Transfer</option>
            <option value="Card">Card</option>
          </select>
        </div>
      </div>

      <div className="rounded-2xl bg-dark-850 border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-dark-800/80 text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-800">
                <th className="py-3 px-4">Receipt # / Trans ID</th>
                <th className="py-3 px-4">Member Name & ID</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Payment Method</th>
                <th className="py-3 px-4">Ref / UTR</th>
                <th className="py-3 px-4 text-right">Amount Paid</th>
                <th className="py-3 px-4 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {loading ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-500 text-xs">
                    Loading payments...
                  </td>
                </tr>
              ) : payments.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-500 text-xs">
                    No transactions recorded.
                  </td>
                </tr>
              ) : (
                payments.map((p) => (
                  <tr key={p.id} className="hover:bg-dark-800/40 transition">
                    <td className="py-3.5 px-4">
                      <p className="font-mono font-bold text-white">{p.receipt_number || p.payment_number}</p>
                      <p className="font-mono text-[10px] text-slate-500">Inv: {p.invoice_number}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-white">{p.member_name}</p>
                      <p className="font-mono text-[11px] text-brand-400">{p.member_code}</p>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">
                      {formatDate(p.payment_date)}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-800 border border-slate-700 text-slate-300">
                        {p.payment_method}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-400 text-[11px]">
                      {p.reference_number || '—'}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-400 text-sm">
                      {formatCurrency(p.amount)}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {p.receipt_id ? (
                        <button
                          onClick={() => handlePrintReceipt(p.receipt_id)}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-dark-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold border border-slate-700 transition"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>Receipt</span>
                        </button>
                      ) : (
                        <span className="text-slate-500 text-[11px]">—</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <PrintReceiptModal
        receipt={selectedReceipt}
        isOpen={printModalOpen}
        onClose={() => setPrintModalOpen(false)}
      />
    </div>
  );
}
