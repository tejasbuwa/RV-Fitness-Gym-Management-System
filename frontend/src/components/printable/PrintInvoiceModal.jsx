import React from 'react';
import { X, Printer, Download, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/formatters';

export default function PrintInvoiceModal({ invoice, isOpen, onClose }) {
  if (!isOpen || !invoice) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-dark-850 border border-slate-700 w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Modal Controls Header (no-print) */}
        <div className="no-print p-4 bg-dark-800 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-white text-base">Invoice Details: {invoice.invoice_number}</h3>
            <span className={`px-2 py-0.5 rounded text-xs font-semibold uppercase ${
              invoice.payment_status === 'paid' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
            }`}>
              {invoice.payment_status}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-500 hover:bg-brand-600 text-white text-xs font-semibold shadow transition"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Download PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Sheet */}
        <div className="p-8 bg-white text-slate-900 printable-area font-sans">
          {/* Gym Header */}
          <div className="flex justify-between items-start border-b-2 border-slate-900 pb-6 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl font-black tracking-tight text-slate-950">RV FITNESS</span>
                <span className="bg-rose-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded uppercase">GYM</span>
              </div>
              <p className="text-xs font-bold text-slate-600 uppercase tracking-widest">Narsobawadi Center</p>
              <p className="text-xs text-slate-500 mt-1 max-w-xs">
                Main Bazaar Road, Near Narsimha Mandir, Narsobawadi, Dist. Kolhapur, Maharashtra 416104
              </p>
              <p className="text-xs text-slate-500">Ph: +91 98220 12345 | contact@rvfitness.com</p>
            </div>
            <div className="text-right">
              <h2 className="text-2xl font-black uppercase text-slate-900 tracking-wider">TAX INVOICE</h2>
              <p className="text-sm font-mono font-bold text-rose-600 mt-1">{invoice.invoice_number}</p>
              <div className="text-xs text-slate-500 mt-2 space-y-0.5">
                <p><span className="font-semibold text-slate-700">Date:</span> {formatDate(invoice.invoice_date)}</p>
                <p><span className="font-semibold text-slate-700">Due Date:</span> {formatDate(invoice.due_date)}</p>
              </div>
            </div>
          </div>

          {/* Member & Bill-to info */}
          <div className="grid grid-cols-2 gap-6 mb-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Billed To (Member)</p>
              <p className="text-base font-bold text-slate-900">{invoice.member_name}</p>
              <p className="text-xs font-mono font-bold text-rose-600">ID: {invoice.member_code}</p>
              <p className="text-xs text-slate-600 mt-1">Phone: {invoice.member_phone || '—'}</p>
              <p className="text-xs text-slate-500">{invoice.member_address || 'Narsobawadi'}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Payment Status</p>
              <span className={`inline-block px-3 py-1 rounded text-xs font-extrabold uppercase tracking-wider ${
                invoice.payment_status === 'paid'
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : invoice.payment_status === 'partially_paid'
                  ? 'bg-amber-100 text-amber-800 border border-amber-300'
                  : 'bg-rose-100 text-rose-800 border border-rose-300'
              }`}>
                {invoice.payment_status.replace('_', ' ')}
              </span>
              <p className="text-xs text-slate-500 mt-2">
                Payment Method: <span className="font-semibold text-slate-700">{invoice.payment_method || 'Cash / UPI'}</span>
              </p>
            </div>
          </div>

          {/* Line items table */}
          <table className="w-full text-left text-xs mb-6">
            <thead>
              <tr className="bg-slate-900 text-white uppercase tracking-wider text-[11px]">
                <th className="py-2.5 px-3">#</th>
                <th className="py-2.5 px-3">Description / Membership Plan</th>
                <th className="py-2.5 px-3 text-center">Qty</th>
                <th className="py-2.5 px-3 text-right">Rate</th>
                <th className="py-2.5 px-3 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 border-b border-slate-200">
              {invoice.items && invoice.items.length > 0 ? (
                invoice.items.map((item, idx) => (
                  <tr key={item.id || idx}>
                    <td className="py-3 px-3 text-slate-400">{idx + 1}</td>
                    <td className="py-3 px-3 font-semibold text-slate-800">{item.description}</td>
                    <td className="py-3 px-3 text-center">{item.quantity}</td>
                    <td className="py-3 px-3 text-right font-mono">{formatCurrency(item.unit_price)}</td>
                    <td className="py-3 px-3 text-right font-mono font-bold">{formatCurrency(item.total_price)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="py-3 px-3 text-slate-400">1</td>
                  <td className="py-3 px-3 font-semibold text-slate-800">Gym Membership Subscription</td>
                  <td className="py-3 px-3 text-center">1</td>
                  <td className="py-3 px-3 text-right font-mono">{formatCurrency(invoice.subtotal)}</td>
                  <td className="py-3 px-3 text-right font-mono font-bold">{formatCurrency(invoice.subtotal)}</td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Totals Section */}
          <div className="flex justify-end mb-8">
            <div className="w-64 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal:</span>
                <span className="font-mono font-semibold">{formatCurrency(invoice.subtotal)}</span>
              </div>
              {parseFloat(invoice.discount) > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Discount:</span>
                  <span className="font-mono font-semibold">- {formatCurrency(invoice.discount)}</span>
                </div>
              )}
              {parseFloat(invoice.tax_amount) > 0 && (
                <div className="flex justify-between text-slate-600">
                  <span>Tax:</span>
                  <span className="font-mono font-semibold">{formatCurrency(invoice.tax_amount)}</span>
                </div>
              )}
              <div className="flex justify-between border-t-2 border-slate-900 pt-2 text-sm font-extrabold text-slate-900">
                <span>Total Amount:</span>
                <span className="font-mono">{formatCurrency(invoice.final_amount)}</span>
              </div>
              <div className="flex justify-between text-emerald-700 font-semibold pt-1">
                <span>Amount Paid:</span>
                <span className="font-mono">{formatCurrency(invoice.amount_paid)}</span>
              </div>
              <div className="flex justify-between border-t border-slate-300 pt-1 text-sm font-extrabold text-rose-600">
                <span>Balance Due:</span>
                <span className="font-mono">{formatCurrency(invoice.balance_amount)}</span>
              </div>
            </div>
          </div>

          {/* Footer note */}
          <div className="border-t border-slate-200 pt-4 flex justify-between items-end text-[11px] text-slate-500">
            <div>
              <p className="font-semibold text-slate-700">Terms & Conditions:</p>
              <p>1. Membership fees are non-transferable and non-refundable.</p>
              <p>2. Gym rules and indoor shoe etiquette must be followed strictly.</p>
            </div>
            <div className="text-center">
              <div className="h-10 border-b border-slate-400 w-36 mb-1"></div>
              <p className="font-bold text-slate-800">Authorized Signatory</p>
              <p className="text-[10px]">RV Fitness Narsobawadi</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
