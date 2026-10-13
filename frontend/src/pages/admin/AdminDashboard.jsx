import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  CreditCard,
  TrendingUp,
  AlertCircle,
  Calendar,
  Clock,
  UserCheck,
  Receipt,
  FileText,
  ArrowUpRight,
  Plus,
  DollarSign
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import api from '../../services/api';
import { formatCurrency, formatDate, getStatusBadgeClass } from '../../utils/formatters';

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = () => {
    api.get('/dashboard/admin')
      .then((res) => {
        if (res.data.success) {
          setData(res.data);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-slate-400 text-sm">
        <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mr-3"></div>
        Loading RV Fitness Admin Analytics...
      </div>
    );
  }

  const { stats, recentPayments = [], recentMembers = [], recentInvoices = [], revenueTrend = [], gymStatus } = data || {};

  return (
    <div className="space-y-8">
      {/* Top Banner / Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-dark-850 p-6 rounded-3xl border border-slate-800">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-brand-400">Operations Control</span>
          <h2 className="text-2xl font-black text-white mt-0.5">RV Fitness Narsobawadi Management</h2>
          <p className="text-xs text-slate-400 mt-1">Live metrics, financial collection, member admissions & facility status.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/admin/members"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-brand-500 hover:bg-brand-600 text-white shadow-lg transition"
          >
            <Plus className="w-4 h-4" />
            <span>New Member</span>
          </Link>
          <Link
            to="/admin/invoices"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold bg-dark-800 hover:bg-slate-700 border border-slate-700 text-slate-200 transition"
          >
            <FileText className="w-4 h-4" />
            <span>Generate Invoice</span>
          </Link>
        </div>
      </div>

      {/* Main KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Total Members */}
        <div className="p-6 rounded-2xl bg-dark-850 border border-slate-800 hover:border-slate-700 transition">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Members</span>
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{stats?.totalMembers || 0}</span>
            <span className="text-xs font-semibold text-emerald-400">({stats?.activeMembers || 0} active)</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/80 pt-2">
            <span>Expiring (7d): <strong className="text-amber-400">{stats?.expiringMemberships || 0}</strong></span>
            <span>Expired: <strong className="text-rose-400">{stats?.expiredMemberships || 0}</strong></span>
          </div>
        </div>

        {/* Card 2: Today's Collection */}
        <div className="p-6 rounded-2xl bg-dark-850 border border-slate-800 hover:border-slate-700 transition">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Today's Collection</span>
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-emerald-400">{formatCurrency(stats?.todayCollection)}</span>
          </div>
          <div className="mt-3 text-xs text-slate-400 border-t border-slate-800/80 pt-2">
            <span>Month Revenue: <strong className="text-white">{formatCurrency(stats?.monthlyRevenue)}</strong></span>
          </div>
        </div>

        {/* Card 3: Pending Balances */}
        <div className="p-6 rounded-2xl bg-dark-850 border border-slate-800 hover:border-slate-700 transition">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Outstanding Balances</span>
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <AlertCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-amber-400">{formatCurrency(stats?.pendingAmount)}</span>
          </div>
          <div className="mt-3 text-xs text-slate-400 border-t border-slate-800/80 pt-2">
            <span>Overdue Balances: <strong className="text-rose-400">{formatCurrency(stats?.overdueAmount)}</strong></span>
          </div>
        </div>

        {/* Card 4: Total Revenue */}
        <div className="p-6 rounded-2xl bg-dark-850 border border-slate-800 hover:border-slate-700 transition">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Lifetime Revenue</span>
            <div className="p-2.5 rounded-xl bg-brand-500/10 text-brand-400 border border-brand-500/20">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{formatCurrency(stats?.totalRevenue)}</span>
          </div>
          <div className="mt-3 text-xs text-slate-400 border-t border-slate-800/80 pt-2">
            <span>Certified Trainers: <strong className="text-white">{stats?.totalTrainers || 0} active</strong></span>
          </div>
        </div>
      </div>

      {/* Revenue Trend Chart & Facility Status */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Chart Column */}
        <div className="lg:col-span-8 p-6 rounded-3xl bg-dark-850 border border-slate-800 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-base font-bold text-white">Monthly Revenue Trends</h3>
              <p className="text-xs text-slate-400">Historical collections across past billing cycles</p>
            </div>
            <Link to="/admin/reports" className="text-xs text-brand-400 hover:underline font-semibold flex items-center gap-1">
              <span>Detailed Report</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="h-72 w-full pt-4">
            {revenueTrend.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueTrend}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#e11d48" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#e11d48" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e2638" />
                  <XAxis dataKey="month_name" stroke="#64748b" tick={{ fontSize: 11 }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 11 }} tickFormatter={(v) => `₹${v}`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f1420', borderColor: '#334155', borderRadius: '12px', fontSize: '12px', color: '#fff' }}
                    formatter={(v) => [`₹${v}`, 'Revenue']}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#e11d48" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-500 text-xs">
                No revenue records available for charting.
              </div>
            )}
          </div>
        </div>

        {/* Live Status & Quick Action Card */}
        <div className="lg:col-span-4 p-6 rounded-3xl bg-dark-850 border border-slate-800 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Gym Status</span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                gymStatus?.status === 'OPEN' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
              }`}>
                {gymStatus?.status || 'OPEN'}
              </span>
            </div>
            <p className="text-sm font-semibold text-white">
              {gymStatus?.noticeMessage || 'RV Fitness Narsobawadi is operating normally.'}
            </p>
            <div className="p-4 rounded-2xl bg-dark-800 border border-slate-750 text-xs text-slate-300 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Morning Shift:</span>
                <span className="font-semibold text-white">{gymStatus?.todayOpeningTime || '05:30 AM'} – 10:00 AM</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Evening Shift:</span>
                <span className="font-semibold text-white">05:00 PM – {gymStatus?.todayClosingTime || '10:00 PM'}</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800">
            <Link
              to="/admin/cms"
              className="w-full py-2.5 px-4 rounded-xl text-center block font-bold text-xs bg-dark-750 hover:bg-slate-700 text-slate-200 transition border border-slate-700"
            >
              Update Gym Status & Shifts
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Activity: Members & Invoices */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Members */}
        <div className="p-6 rounded-3xl bg-dark-850 border border-slate-800 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-bold text-white">Recent Member Enrollments</h3>
            <Link to="/admin/members" className="text-xs text-brand-400 hover:underline font-semibold">
              View All
            </Link>
          </div>
          <div className="divide-y divide-slate-800">
            {recentMembers.map((m) => (
              <div key={m.id} className="py-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-white text-[11px]">
                    {m.full_name[0]}
                  </div>
                  <div>
                    <Link to={`/admin/members/${m.id}`} className="font-bold text-white hover:text-brand-400">
                      {m.full_name}
                    </Link>
                    <p className="text-[11px] font-mono text-slate-400">{m.member_code}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${getStatusBadgeClass(m.status)}`}>
                    {m.status}
                  </span>
                  <p className="text-[10px] text-slate-500 mt-1">{formatDate(m.joining_date)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Invoices */}
        <div className="p-6 rounded-3xl bg-dark-850 border border-slate-800 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-bold text-white">Latest Invoices Generated</h3>
            <Link to="/admin/invoices" className="text-xs text-brand-400 hover:underline font-semibold">
              View Invoices
            </Link>
          </div>
          <div className="divide-y divide-slate-800">
            {recentInvoices.map((inv) => (
              <div key={inv.id} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <p className="font-mono font-bold text-white">{inv.invoice_number}</p>
                  <p className="text-slate-400">{inv.member_name} ({inv.member_code})</p>
                </div>
                <div className="text-right">
                  <p className="font-mono font-bold text-white">{formatCurrency(inv.final_amount)}</p>
                  <span className={`inline-block px-1.5 py-0.2 rounded text-[10px] font-bold uppercase ${getStatusBadgeClass(inv.payment_status)}`}>
                    {inv.payment_status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
