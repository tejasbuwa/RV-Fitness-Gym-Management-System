import React, { useState, useEffect } from 'react';
import { CreditCard, Receipt, Printer, FileText, CheckCircle2, Clock } from 'lucide-react';
import api from '../../services/api';
import { formatCurrency, formatDate, getStatusBadgeClass } from '../../utils/formatters';
import PrintInvoiceModal from '../../components/printable/PrintInvoiceModal';
import PrintReceiptModal from '../../components/printable/PrintReceiptModal';
import { useNotification } from '../../context/NotificationContext';

export default function MemberBilling() {
  const [invoices, setInvoices] = useState([]);
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [printInvoiceOpen, setPrintInvoiceOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [printReceiptOpen, setPrintReceiptOpen] = useState(false);

  const { error } = useNotification();

  useEffect(() => {
    Promise.all([
      api.get('/invoices'),
      api.get('/receipts')
    ])
      .then(([invRes, recRes]) => {
        if (invRes.data.success) setInvoices(invRes.data.invoices);
        if (recRes.data.success) setReceipts(recRes.data.receipts);
      })
      .catch(() => error('Failed to fetch billing records.'))
      .finally(() => setLoading(false));
  }, []);

  const openInvoicePrint = async (invId) => {
    try {
      const res = await api.get(`/invoices/${invId}`);
      if (res.data.success) {
        setSelectedInvoice(res.data.invoice);
        setPrintInvoiceOpen(true);
      }
    } catch {
      error('Failed to load printable invoice.');
    }
  };

  const openReceiptPrint = async (recId) => {
    try {
      const res = await api.get(`/receipts/${recId}`);
      if (res.data.success) {
        setSelectedReceipt(res.data.receipt);
        setPrintReceiptOpen(true);
      }
    } catch {
      error('Failed to load printable receipt.');
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-black text-white">My Invoices & Payment Receipts</h2>
        <p className="text-xs text-slate-400">View official documentation, billing status, and print receipts.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Invoices */}
        <div className="p-6 rounded-3xl bg-dark-850 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <FileText className="w-5 h-5 text-brand-500" />
            <h3 className="text-base font-bold text-white">Membership Invoices</h3>
          </div>

          <div className="divide-y divide-slate-800 text-xs">
            {loading ? (
              <p className="py-8 text-center text-slate-500">Loading invoices...</p>
            ) : invoices.length === 0 ? (
              <p className="py-8 text-center text-slate-500">No invoices on file.</p>
            ) : (
              invoices.map((inv) => (
                <div key={inv.id} className="py-3.5 flex items-center justify-between">
                  <div>
                    <button
                      onClick={() => openInvoicePrint(inv.id)}
                      className="font-mono font-bold text-brand-400 hover:underline flex items-center gap-1.5"
                    >
                      <span>{inv.invoice_number}</span>
                      <Printer className="w-3.5 h-3.5 text-slate-400" />
                    </button>
                    <p className="text-[11px] text-slate-400 mt-0.5">Date: {formatDate(inv.invoice_date)}</p>
                  </div>
                  <div className="text-right flex items-center gap-4">
                    <div>
                      <p className="font-mono font-bold text-white text-sm">{formatCurrency(inv.final_amount)}</p>
                      <span className={`inline-block px-1.5 py-0.2 rounded text-[10px] font-bold uppercase ${getStatusBadgeClass(inv.payment_status)}`}>
                        {inv.payment_status}
                      </span>
                    </div>
                    <button
                      onClick={() => openInvoicePrint(inv.id)}
                      className="p-2 rounded-xl bg-dark-800 hover:bg-slate-700 text-slate-300 transition"
                      title="Print Invoice"
                    >
                      <Printer className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Payment Receipts */}
        <div className="p-6 rounded-3xl bg-dark-850 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <Receipt className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-white">Official Payment Receipts</h3>
          </div>

          <div className="divide-y divide-slate-800 text-xs">
            {loading ? (
              <p className="py-8 text-center text-slate-500">Loading receipts...</p>
            ) : receipts.length === 0 ? (
              <p className="py-8 text-center text-slate-500">No payment receipts issued yet.</p>
            ) : (
              receipts.map((rec) => (
                <div key={rec.id} className="py-3.5 flex items-center justify-between">
                  <div>
                    <button
                      onClick={() => openReceiptPrint(rec.id)}
                      className="font-mono font-bold text-emerald-400 hover:underline flex items-center gap-1.5"
                    >
                      <span>{rec.receipt_number}</span>
                      <Printer className="w-3.5 h-3.5 text-slate-400" />
                    </button>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {formatDate(rec.receipt_date)} ({rec.payment_method})
                    </p>
                  </div>
                  <div className="text-right flex items-center gap-4">
                    <div>
                      <p className="font-mono font-bold text-white text-sm">{formatCurrency(rec.amount)}</p>
                      <span className="text-[10px] text-slate-400">Balance: {formatCurrency(rec.remaining_balance)}</span>
                    </div>
                    <button
                      onClick={() => openReceiptPrint(rec.id)}
                      className="p-2 rounded-xl bg-dark-800 hover:bg-slate-700 text-slate-300 transition"
                      title="Print Receipt"
                    >
                      <Printer className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <PrintInvoiceModal
        invoice={selectedInvoice}
        isOpen={printInvoiceOpen}
        onClose={() => setPrintInvoiceOpen(false)}
      />

      <PrintReceiptModal
        receipt={selectedReceipt}
        isOpen={printReceiptOpen}
        onClose={() => setPrintReceiptOpen(false)}
      />
    </div>
  );
}
