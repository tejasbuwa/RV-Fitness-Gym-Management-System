import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Dumbbell,
  CreditCard,
  Utensils,
  Activity,
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  UserCheck,
  Sparkles,
  Trophy
} from 'lucide-react';
import api from '../../services/api';
import { formatCurrency, formatDate, getStatusBadgeClass } from '../../utils/formatters';

export default function MemberDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/dashboard/member')
      .then((res) => {
        if (res.data.success) {
          setData(res.data);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="py-24 text-center text-zinc-400 text-sm">Loading your member dashboard...</div>;
  }

  const { member, membership, pendingBalance, latestProgress, activeWorkout, activeDiet, gymStatus } = data || {};

  return (
    <div className="space-y-8 bg-[#0a0a0a] text-zinc-100">
      {/* Top Banner with Member ID Card */}
      <div className="p-7 sm:p-8 rounded-3xl glass-gold border border-amber-500/30 bg-zinc-950/90 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-600 flex items-center justify-center font-black text-2xl text-black shadow-lg shadow-amber-500/20">
            {member?.full_name ? member.full_name[0] : 'M'}
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-2xl font-black text-white">{member?.full_name}</h2>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${getStatusBadgeClass(member?.status)}`}>
                {member?.status}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-3 mt-1.5">
              <span className="font-mono text-xs font-bold text-amber-300 bg-amber-500/15 px-3 py-0.5 rounded-md border border-amber-500/30">
                {member?.member_code}
              </span>
              <span className="text-xs text-zinc-400">Admitted on {formatDate(member?.joining_date)}</span>
            </div>
          </div>
        </div>

        <div className="text-left sm:text-right p-3.5 rounded-2xl bg-black border border-zinc-800">
          <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Assigned Coach</p>
          <p className="text-base font-bold text-amber-400 mt-0.5">{member?.trainer_name || 'General Guidance'}</p>
          {member?.trainer_phone && <p className="text-xs text-zinc-400 mt-0.5">Ph: {member.trainer_phone}</p>}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {/* Membership Status Card */}
        <div className="glass-gold p-6 rounded-2xl border border-amber-500/20 bg-zinc-950/80 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Current Plan</span>
          {membership ? (
            <div>
              <h3 className="text-xl font-black text-white">{membership.plan_name}</h3>
              <p className="text-xs text-amber-400 font-semibold mt-1">
                Valid until: {formatDate(membership.end_date)}
              </p>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                {membership.days_remaining > 0 ? `${membership.days_remaining} days remaining` : 'Expired'}
              </p>
            </div>
          ) : (
            <div>
              <p className="text-sm font-bold text-rose-400">No active package</p>
              <p className="text-xs text-zinc-400 mt-1">Please visit desk to renew.</p>
            </div>
          )}
        </div>

        {/* Financial Status Card */}
        <div className="glass-gold p-6 rounded-2xl border border-amber-500/20 bg-zinc-950/80 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Billing Dues</span>
          <div>
            <h3 className="text-2xl font-black text-white font-mono">
              {formatCurrency(pendingBalance)}
            </h3>
            <p className="text-xs text-zinc-400 mt-1">
              {pendingBalance > 0 ? (
                <span className="text-rose-400 font-semibold">Payment pending at desk</span>
              ) : (
                <span className="text-emerald-400 font-semibold">All dues cleared</span>
              )}
            </p>
          </div>
        </div>

        {/* Latest Weight Check-In Card */}
        <div className="glass-gold p-6 rounded-2xl border border-amber-500/20 bg-zinc-950/80 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Current Biometrics</span>
          {latestProgress ? (
            <div>
              <h3 className="text-2xl font-black text-amber-300 font-mono">{latestProgress.weight_kg} kg</h3>
              <p className="text-xs text-zinc-400 mt-1">
                BMI: <strong className="text-white font-bold">{latestProgress.bmi || '—'}</strong> ({formatDate(latestProgress.recorded_date)})
              </p>
            </div>
          ) : (
            <div>
              <p className="text-sm font-bold text-zinc-300">{member?.weight_kg || '—'} kg</p>
              <p className="text-xs text-zinc-400 mt-1">Baseline check-in recorded</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Action Navigation Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          to="/member/workout"
          className="glass-gold p-7 rounded-3xl border border-amber-500/20 hover:border-amber-500/50 transition group flex flex-col justify-between bg-zinc-950/80"
        >
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-black transition">
              <Dumbbell className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition">My Workout Routine</h3>
            <p className="text-xs text-zinc-400">
              {activeWorkout ? activeWorkout.title : 'View weekly split, sets, reps & instructions assigned by your coach.'}
            </p>
          </div>
          <div className="pt-4 flex items-center text-xs font-bold text-amber-400 group-hover:text-amber-300">
            <span>View Routine</span>
            <ChevronRight className="w-4 h-4 ml-1" />
          </div>
        </Link>

        <Link
          to="/member/diet"
          className="glass-gold p-7 rounded-3xl border border-amber-500/20 hover:border-amber-500/50 transition group flex flex-col justify-between bg-zinc-950/80"
        >
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-black transition">
              <Utensils className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition">My Nutrition Plan</h3>
            <p className="text-xs text-zinc-400">
              {activeDiet ? `${activeDiet.title} (${activeDiet.target_calories} kcal)` : 'Personalized macronutrient chart and meal timings.'}
            </p>
          </div>
          <div className="pt-4 flex items-center text-xs font-bold text-amber-400 group-hover:text-amber-300">
            <span>View Meal Schedule</span>
            <ChevronRight className="w-4 h-4 ml-1" />
          </div>
        </Link>

        <Link
          to="/member/billing"
          className="glass-gold p-7 rounded-3xl border border-amber-500/20 hover:border-amber-500/50 transition group flex flex-col justify-between bg-zinc-950/80"
        >
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-black transition">
              <CreditCard className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition">Invoices & Receipts</h3>
            <p className="text-xs text-zinc-400">
              Download and print tax invoices and payment receipts for your membership subscriptions.
            </p>
          </div>
          <div className="pt-4 flex items-center text-xs font-bold text-amber-400 group-hover:text-amber-300">
            <span>View Financial History</span>
            <ChevronRight className="w-4 h-4 ml-1" />
          </div>
        </Link>
      </div>
    </div>
  );
}
