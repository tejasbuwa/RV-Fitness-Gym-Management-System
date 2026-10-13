import React, { useState, useEffect } from 'react';
import { BarChart3, Calendar, Download, Printer, Filter, DollarSign, Users, AlertCircle } from 'lucide-react';
import api from '../../services/api';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { useNotification } from '../../context/NotificationContext';

export default function ReportsPage() {
  const [reportType, setReportType] = useState('revenue');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reportData, setReportData] = useState([]);
  const [summary, setSummary] = useState({});
  const [loading, setLoading] = useState(true);

  const { error } = useNotification();

  useEffect(() => {
    fetchReport();
  }, [reportType, startDate, endDate]);

  const fetchReport = () => {
    setLoading(true);
    const params = new URLSearchParams();
    params.append('type', reportType);
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);

    api.get(`/reports?${params.toString()}`)
      .then((res) => {
        if (res.data.success) {
          setReportData(res.data.data);
          setSummary(res.data.summary || {});
        }
      })
      .catch(() => error('Failed to fetch report data.'))
      .finally(() => setLoading(false));
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div>
          <h2 className="text-2xl font-black text-white">Business Intelligence Reports</h2>
          <p className="text-xs text-slate-400">Exportable financial and operational summaries for RV Fitness Narsobawadi.</p>
        </div>
        <button
          onClick={handlePrint}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-dark-800 hover:bg-slate-700 text-white border border-slate-700 shadow transition"
        >
          <Printer className="w-4 h-4" />
          <span>Print / Export PDF</span>
        </button>
      </div>

      {/* Report Controls (no-print) */}
      <div className="p-4 rounded-2xl bg-dark-850 border border-slate-800 space-y-4 no-print">
        {/* Report Type Pills */}
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'revenue', label: 'Revenue Collection' },
            { id: 'members', label: 'Membership Admissions' },
            { id: 'pending-payments', label: 'Pending Dues Ledger' },
            { id: 'trainer-members', label: 'Trainer Allocations' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setReportType(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                reportType === tab.id
                  ? 'bg-brand-500 text-white shadow-md'
                  : 'bg-dark-800 text-slate-300 hover:bg-slate-750'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Date Filter Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-800">
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">From Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-1.5 rounded-xl bg-dark-800 border border-slate-700 text-white text-xs"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">To Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-1.5 rounded-xl bg-dark-800 border border-slate-700 text-white text-xs"
            />
          </div>
        </div>
      </div>

      {/* Summary Stat Card */}
      {summary && Object.keys(summary).length > 0 && (
        <div className="p-5 rounded-2xl bg-dark-850 border border-slate-800 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Report Aggregates:</span>
          <div className="flex items-center gap-6">
            {summary.totalRevenue !== undefined && (
              <div>
                <span className="text-xs text-slate-400 block">Total Collected:</span>
                <span className="text-lg font-black text-emerald-400 font-mono">{formatCurrency(summary.totalRevenue)}</span>
              </div>
            )}
            {summary.totalPending !== undefined && (
              <div>
                <span className="text-xs text-slate-400 block">Total Pending:</span>
                <span className="text-lg font-black text-rose-400 font-mono">{formatCurrency(summary.totalPending)}</span>
              </div>
            )}
            {summary.count !== undefined && (
              <div>
                <span className="text-xs text-slate-400 block">Count:</span>
                <span className="text-lg font-black text-white font-mono">{summary.count} entries</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Printable Report Output Area */}
      <div className="p-6 rounded-2xl bg-dark-850 border border-slate-800 printable-area text-slate-100 overflow-x-auto">
        <div className="mb-4 pb-4 border-b border-slate-800 flex justify-between items-center">
          <div>
            <h3 className="font-extrabold text-base text-white uppercase">
              RV FITNESS – {reportType.replace('-', ' ').toUpperCase()} REPORT
            </h3>
            <p className="text-xs text-slate-400">Gym Location: Narsobawadi | Generated: {new Date().toLocaleDateString()}</p>
          </div>
        </div>

        {loading ? (
          <div className="py-12 text-center text-slate-500 text-xs">Compiling report data...</div>
        ) : reportData.length === 0 ? (
          <div className="py-12 text-center text-slate-500 text-xs">No records found for the selected parameters.</div>
        ) : (
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-dark-800 text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-700">
                {reportType === 'revenue' && (
                  <>
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Payment #</th>
                    <th className="py-2.5 px-3">Member Name & ID</th>
                    <th className="py-2.5 px-3">Method</th>
                    <th className="py-2.5 px-3">Ref</th>
                    <th className="py-2.5 px-3 text-right">Amount</th>
                  </>
                )}
                {reportType === 'members' && (
                  <>
                    <th className="py-2.5 px-3">Member ID</th>
                    <th className="py-2.5 px-3">Name</th>
                    <th className="py-2.5 px-3">Phone</th>
                    <th className="py-2.5 px-3">Joining Date</th>
                    <th className="py-2.5 px-3">Assigned Trainer</th>
                    <th className="py-2.5 px-3">Plan / Expiry</th>
                  </>
                )}
                {reportType === 'pending-payments' && (
                  <>
                    <th className="py-2.5 px-3">Invoice #</th>
                    <th className="py-2.5 px-3">Member</th>
                    <th className="py-2.5 px-3">Due Date</th>
                    <th className="py-2.5 px-3 text-right">Final Amount</th>
                    <th className="py-2.5 px-3 text-right">Paid</th>
                    <th className="py-2.5 px-3 text-right">Balance Due</th>
                  </>
                )}
                {reportType === 'trainer-members' && (
                  <>
                    <th className="py-2.5 px-3">Trainer Name</th>
                    <th className="py-2.5 px-3">Specialization</th>
                    <th className="py-2.5 px-3">Contact</th>
                    <th className="py-2.5 px-3 text-center">Total Assigned</th>
                    <th className="py-2.5 px-3 text-center">Active Assigned</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {reportData.map((row, idx) => (
                <tr key={idx} className="hover:bg-dark-800/40">
                  {reportType === 'revenue' && (
                    <>
                      <td className="py-3 px-3">{formatDate(row.payment_date)}</td>
                      <td className="py-3 px-3 font-mono font-bold text-white">{row.payment_number}</td>
                      <td className="py-3 px-3">{row.member_name} ({row.member_code})</td>
                      <td className="py-3 px-3 uppercase text-[11px]">{row.payment_method}</td>
                      <td className="py-3 px-3 font-mono text-slate-400">{row.reference_number || '—'}</td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-emerald-400">{formatCurrency(row.amount)}</td>
                    </>
                  )}
                  {reportType === 'members' && (
                    <>
                      <td className="py-3 px-3 font-mono font-bold text-brand-400">{row.member_code}</td>
                      <td className="py-3 px-3 font-bold text-white">{row.full_name}</td>
                      <td className="py-3 px-3">{row.phone}</td>
                      <td className="py-3 px-3">{formatDate(row.joining_date)}</td>
                      <td className="py-3 px-3">{row.trainer_name || 'Unassigned'}</td>
                      <td className="py-3 px-3">{row.plan_name ? `${row.plan_name} (${formatDate(row.expiry_date)})` : 'None'}</td>
                    </>
                  )}
                  {reportType === 'pending-payments' && (
                    <>
                      <td className="py-3 px-3 font-mono font-bold text-white">{row.invoice_number}</td>
                      <td className="py-3 px-3">{row.member_name} ({row.member_code})</td>
                      <td className="py-3 px-3 text-rose-400">{formatDate(row.due_date)}</td>
                      <td className="py-3 px-3 text-right font-mono">{formatCurrency(row.final_amount)}</td>
                      <td className="py-3 px-3 text-right font-mono text-emerald-400">{formatCurrency(row.amount_paid)}</td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-rose-400">{formatCurrency(row.balance_amount)}</td>
                    </>
                  )}
                  {reportType === 'trainer-members' && (
                    <>
                      <td className="py-3 px-3 font-bold text-white">{row.trainer_name}</td>
                      <td className="py-3 px-3 text-brand-400">{row.specialization}</td>
                      <td className="py-3 px-3">{row.phone}</td>
                      <td className="py-3 px-3 text-center font-bold">{row.total_assigned}</td>
                      <td className="py-3 px-3 text-center font-bold text-emerald-400">{row.active_assigned}</td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
