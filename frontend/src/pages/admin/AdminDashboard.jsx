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
  DollarSign,
  Sparkles,
  ShieldCheck,
  Activity
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
      <div className="flex items-center justify-center py-24 text-zinc-400 text-sm">
        <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mr-3"></div>
        Loading RV Fitness Narsobawadi Executive Analytics...
      </div>
    );
  }

  const { stats, recentPayments = [], recentMembers = [], recentInvoices = [], revenueTrend = [], gymStatus } = data || {};

  return (
    <div className="space-y-8 bg-[#0a0a0a] text-zinc-100">
      {/* Top Banner / Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-7 rounded-3xl glass-gold border border-amber-500/20 bg-zinc-950/80">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
              Operations Control Center
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
            RV FITNESS <span className="text-gold-gradient">NARSOBAWADI</span>
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Real-time management ledger: Member admissions, collections, trainer rosters & facility status.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/admin/members"
            className="btn-gold inline-flex items-center gap-1.5 px-4.5 py-2.5 rounded-xl text-xs font-bold shadow-lg"
          >
            <Plus className="w-4 h-4 text-black" />
            <span>New Member</span>
          </Link>
          <Link
            to="/admin/invoices"
            className="btn-gold-outline inline-flex items-center gap-1.5 px-4.5 py-2.5 rounded-xl text-xs font-bold"
          >
            <FileText className="w-4 h-4 text-amber-400" />
            <span>Generate Invoice</span>
          </Link>
        </div>
      </div>

      {/* Main KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Total Members */}
        <div className="glass-gold p-6 rounded-2xl border border-amber-500/20 bg-zinc-950/80 hover:border-amber-500/40 transition">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Total Members</span>
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{stats?.totalMembers || 0}</span>
            <span className="text-xs font-semibold text-emerald-400">({stats?.activeMembers || 0} active)</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-zinc-400 border-t border-zinc-800 pt-2">
            <span>Expiring (7d): <strong className="text-amber-400 font-bold">{stats?.expiringMemberships || 0}</strong></span>
            <span>Expired: <strong className="text-rose-400 font-bold">{stats?.expiredMemberships || 0}</strong></span>
          </div>
        </div>

        {/* Card 2: Today's Collection */}
        <div className="glass-gold p-6 rounded-2xl border border-amber-500/20 bg-zinc-950/80 hover:border-amber-500/40 transition">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Today's Collection</span>
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-emerald-400">{formatCurrency(stats?.todayCollection)}</span>
          </div>
          <div className="mt-3 text-xs text-zinc-400 border-t border-zinc-800 pt-2">
            <span>Month Revenue: <strong className="text-amber-300 font-bold">{formatCurrency(stats?.monthlyRevenue)}</strong></span>
          </div>
        </div>

        {/* Card 3: Pending Balances */}
        <div className="glass-gold p-6 rounded-2xl border border-amber-500/20 bg-zinc-950/80 hover:border-amber-500/40 transition">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Outstanding Balances</span>
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <AlertCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-amber-400">{formatCurrency(stats?.pendingAmount)}</span>
          </div>
          <div className="mt-3 text-xs text-zinc-400 border-t border-zinc-800 pt-2">
            <span>Overdue Dues: <strong className="text-rose-400 font-bold">{formatCurrency(stats?.overdueAmount)}</strong></span>
          </div>
        </div>

        {/* Card 4: Total Lifetime Revenue */}
        <div className="glass-gold p-6 rounded-2xl border border-amber-500/20 bg-zinc-950/80 hover:border-amber-500/40 transition">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Total Lifetime Revenue</span>
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{formatCurrency(stats?.totalRevenue)}</span>
          </div>
          <div className="mt-3 text-xs text-zinc-400 border-t border-zinc-800 pt-2">
            <span>Active Trainers: <strong className="text-amber-300 font-bold">{stats?.totalTrainers || 0} coaches</strong></span>
          </div>
        </div>
      </div>

      {/* Revenue Trend Chart & Facility Status */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Chart Column */}
        <div className="lg:col-span-8 p-6 sm:p-8 rounded-3xl glass-gold border border-amber-500/20 bg-zinc-950/90 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold text-white">Monthly Revenue Analytics</h3>
              <p className="text-xs text-zinc-400">Historical collections across billing cycles</p>
            </div>
            <Link to="/admin/reports" className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1">
              <span>Full Reports</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="h-72 w-full pt-4">
            {revenueTrend.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueTrend}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#eab308" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#eab308" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                  <XAxis dataKey="month_name" stroke="#71717a" tick={{ fontSize: 11 }} />
                  <YAxis stroke="#71717a" tick={{ fontSize: 11 }} tickFormatter={(v) => `₹${v}`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#000000', borderColor: 'rgba(234, 179, 8, 0.4)', borderRadius: '12px', fontSize: '12px', color: '#fff' }}
                    formatter={(v) => [`₹${v}`, 'Revenue']}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#eab308" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-zinc-500 text-xs">
                No revenue records available for charting.
              </div>
            )}
          </div>
        </div>

        {/* Live Status & Quick Action Card */}
        <div className="lg:col-span-4 p-6 sm:p-8 rounded-3xl glass-gold border border-amber-500/20 bg-zinc-950/90 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Gym Live Feed</span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                gymStatus?.status === 'OPEN'
                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                  : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
              }`}>
                {gymStatus?.status || 'OPEN'}
              </span>
            </div>
            <p className="text-sm font-semibold text-white leading-relaxed">
              "{gymStatus?.noticeMessage || 'RV Fitness Narsobawadi is operating normally.'}"
            </p>
            <div className="p-4 rounded-2xl bg-black border border-zinc-800 text-xs text-zinc-300 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">Morning Shift:</span>
                <span className="font-semibold text-amber-300">{gymStatus?.todayOpeningTime || '05:30 AM'} – 10:00 AM</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">Evening Shift:</span>
                <span className="font-semibold text-amber-300">04:30 PM – {gymStatus?.todayClosingTime || '10:00 PM'}</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-zinc-800">
            <Link
              to="/admin/cms"
              className="btn-gold-outline w-full py-2.5 px-4 rounded-xl text-center block font-bold text-xs"
            >
              Update Gym Status & Shifts
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Activity: Members & Invoices */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Members */}
        <div className="p-6 sm:p-8 rounded-3xl glass-gold border border-amber-500/20 bg-zinc-950/90 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-bold text-white">Recent Member Admissions</h3>
            <Link to="/admin/members" className="text-xs text-amber-400 hover:text-amber-300 font-semibold">
              View All Members
            </Link>
          </div>
          <div className="divide-y divide-zinc-800/80">
            {recentMembers.map((m) => (
              <div key={m.id} className="py-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-yellow-600 flex items-center justify-center font-bold text-black text-[11px]">
                    {m.full_name[0]}
                  </div>
                  <div>
                    <Link to={`/admin/members/${m.id}`} className="font-bold text-white hover:text-amber-400 transition">
                      {m.full_name}
                    </Link>
                    <p className="text-[11px] font-mono text-amber-400/80">{m.member_code}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${getStatusBadgeClass(m.status)}`}>
                    {m.status}
                  </span>
                  <p className="text-[10px] text-zinc-500 mt-1">{formatDate(m.joining_date)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Invoices */}
        <div className="p-6 sm:p-8 rounded-3xl glass-gold border border-amber-500/20 bg-zinc-950/90 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-bold text-white">Latest Invoices Generated</h3>
            <Link to="/admin/invoices" className="text-xs text-amber-400 hover:text-amber-300 font-semibold">
              View Invoices
            </Link>
          </div>
          <div className="divide-y divide-zinc-800/80">
            {recentInvoices.map((inv) => (
              <div key={inv.id} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <p className="font-mono font-bold text-white">{inv.invoice_number}</p>
                  <p className="text-zinc-400">{inv.member_name} ({inv.member_code})</p>
                </div>
                <div className="text-right">
                  <p className="font-mono font-bold text-amber-300">{formatCurrency(inv.final_amount)}</p>
                  <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${getStatusBadgeClass(inv.payment_status)}`}>
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
