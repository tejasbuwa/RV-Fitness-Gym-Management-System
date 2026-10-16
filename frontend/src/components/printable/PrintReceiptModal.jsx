import React from 'react';
import { X, Printer, CheckCircle } from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/formatters';

export default function PrintReceiptModal({ receipt, isOpen, onClose }) {
  if (!isOpen || !receipt) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-dark-850 border border-slate-700 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Modal Controls (no-print) */}
        <div className="no-print p-4 bg-dark-900 border-b border-gold-500/20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-white text-base">Payment Receipt: {receipt.receipt_number}</h3>
            <span className="px-2 py-0.5 rounded text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase">
              Confirmed
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-black text-xs font-bold shadow-gold-glow transition"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Download PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Slip */}
        <div className="p-8 bg-white text-slate-900 printable-area font-sans border-8 border-slate-100">
          <div className="border border-slate-300 p-6 rounded-lg relative">
            {/* Watermark / Stamp text */}
            <div className="absolute right-6 top-6 border-2 border-emerald-600 text-emerald-700 font-black text-xs uppercase px-3 py-1 rounded tracking-widest rotate-6 select-none opacity-85">
              PAYMENT RECEIVED
            </div>

            {/* Gym Header */}
            <div className="mb-6 flex items-start gap-4">
              <img
                src="/images/logo.png"
                alt="RV Fitness"
                className="w-14 h-14 object-contain rounded-full bg-black p-1 shadow-sm"
              />
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-xl font-black text-slate-950">RV FITNESS</span>
                  <span className="bg-amber-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded uppercase">NARSOBAWADI</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Main Bazaar Road, Near Narsimha Mandir, Narsobawadi, Dist. Kolhapur - 416104
                </p>
                <p className="text-[11px] text-slate-500">Ph: +91 98220 12345 | contact@rvfitness.com</p>
              </div>
            </div>

            <div className="h-0.5 bg-slate-200 mb-6"></div>

            {/* Receipt Identification */}
            <div className="grid grid-cols-2 gap-4 text-xs mb-6 bg-slate-50 p-3 rounded">
              <div>
                <p className="text-slate-500">Receipt Number:</p>
                <p className="font-mono font-bold text-slate-900 text-sm">{receipt.receipt_number}</p>
              </div>
              <div className="text-right">
                <p className="text-slate-500">Receipt Date:</p>
                <p className="font-semibold text-slate-900">{formatDate(receipt.receipt_date)}</p>
              </div>
              <div>
                <p className="text-slate-500">Invoice Number:</p>
                <p className="font-mono font-bold text-slate-800">{receipt.invoice_number}</p>
              </div>
              <div className="text-right">
                <p className="text-slate-500">Payment Method:</p>
                <p className="font-bold text-slate-900 uppercase">{receipt.payment_method}</p>
              </div>
            </div>

            {/* Member Details */}
            <div className="mb-6 space-y-1 text-xs">
              <p className="text-slate-500 font-semibold uppercase text-[10px]">Received With Thanks From:</p>
              <p className="text-base font-bold text-slate-950">{receipt.member_name}</p>
              <p className="font-mono font-bold text-rose-600">Member ID: {receipt.member_code}</p>
              {receipt.member_phone && <p className="text-slate-600">Contact: {receipt.member_phone}</p>}
            </div>

            {/* Payment Breakdown Box */}
            <div className="border border-slate-200 rounded p-4 mb-6 space-y-3 text-xs bg-slate-50/50">
              <div className="flex justify-between items-center text-sm border-b border-slate-200 pb-2">
                <span className="font-bold text-slate-800">Amount Paid:</span>
                <span className="font-mono font-black text-emerald-600 text-base">
                  {formatCurrency(receipt.amount)}
                </span>
              </div>
              {receipt.reference_number && (
                <div className="flex justify-between text-slate-600">
                  <span>Transaction Reference:</span>
                  <span className="font-mono font-medium">{receipt.reference_number}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600">
                <span>Remaining Invoice Balance:</span>
                <span className="font-mono font-bold text-rose-600">{formatCurrency(receipt.remaining_balance)}</span>
              </div>
              {receipt.notes && (
                <div className="pt-2 text-[11px] text-slate-500 italic">
                  Note: {receipt.notes}
                </div>
              )}
            </div>

            {/* Signatory footer */}
            <div className="pt-4 flex justify-between items-end text-[11px] text-slate-500">
              <div>
                <p>Generated electronically by RV Fitness System.</p>
                <p>Computer-verified official receipt.</p>
              </div>
              <div className="text-center">
                <div className="h-8 border-b border-slate-400 w-32 mb-1"></div>
                <p className="font-bold text-slate-800">Authorized Signature</p>
                <p className="text-[10px]">RV Fitness Desk</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
