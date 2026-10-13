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
  UserCheck
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
    return <div className="py-20 text-center text-slate-400 text-sm">Loading your member dashboard...</div>;
  }

  const { member, membership, pendingBalance, latestProgress, activeWorkout, activeDiet, gymStatus } = data || {};

  return (
    <div className="space-y-8">
      {/* Top Banner with Member ID Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-dark-850 via-dark-800 to-dark-850 border border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-brand-500/20 border border-brand-500/40 flex items-center justify-center font-black text-2xl text-brand-400 shadow-xl">
            {member?.full_name ? member.full_name[0] : 'M'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-black text-white">{member?.full_name}</h2>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${getStatusBadgeClass(member?.status)}`}>
                {member?.status}
              </span>
            </div>
            <div className="flex items-center gap-3 mt-1">
              <span className="font-mono text-sm font-bold text-brand-400 bg-brand-500/10 px-2.5 py-0.5 rounded border border-brand-500/20">
                {member?.member_code}
              </span>
              <span className="text-xs text-slate-400">Member since {formatDate(member?.joining_date)}</span>
            </div>
          </div>
        </div>

        <div className="text-left sm:text-right">
          <p className="text-xs text-slate-400">Personal Trainer</p>
          <p className="text-base font-bold text-white mt-0.5">{member?.trainer_name || 'General Guidance'}</p>
          {member?.trainer_phone && <p className="text-xs text-brand-400 mt-0.5">Ph: {member.trainer_phone}</p>}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {/* Membership Status Card */}
        <div className="p-6 rounded-2xl bg-dark-850 border border-slate-800 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Current Plan</span>
          {membership ? (
            <div>
              <h3 className="text-xl font-black text-white">{membership.plan_name}</h3>
              <p className="text-xs text-brand-400 font-semibold mt-1">
                Expires on: {formatDate(membership.end_date)}
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {membership.days_remaining > 0 ? `${membership.days_remaining} days remaining` : 'Expired'}
              </p>
            </div>
          ) : (
            <div>
              <p className="text-sm font-bold text-rose-400">No active package</p>
              <p className="text-xs text-slate-400 mt-1">Please visit desk to renew.</p>
            </div>
          )}
        </div>

        {/* Financial Status Card */}
        <div className="p-6 rounded-2xl bg-dark-850 border border-slate-800 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Billing Dues</span>
          <div>
            <h3 className="text-2xl font-black text-white font-mono">
              {formatCurrency(pendingBalance)}
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              {pendingBalance > 0 ? (
                <span className="text-rose-400 font-semibold">Payment outstanding</span>
              ) : (
                <span className="text-emerald-400 font-semibold">All fees cleared</span>
              )}
            </p>
          </div>
        </div>

        {/* Latest Weight Check-In Card */}
        <div className="p-6 rounded-2xl bg-dark-850 border border-slate-800 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Current Biometrics</span>
          {latestProgress ? (
            <div>
              <h3 className="text-2xl font-black text-white font-mono">{latestProgress.weight_kg} kg</h3>
              <p className="text-xs text-slate-400 mt-1">
                BMI: <strong className="text-brand-400">{latestProgress.bmi || '—'}</strong> ({formatDate(latestProgress.recorded_date)})
              </p>
            </div>
          ) : (
            <div>
              <p className="text-sm font-bold text-slate-300">{member?.weight_kg || '—'} kg</p>
              <p className="text-xs text-slate-400 mt-1">Baseline check-in recorded</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Action Navigation Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          to="/member/workout"
          className="p-6 rounded-3xl bg-dark-850 border border-slate-800 hover:border-brand-500/50 transition group flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-brand-500/10 border border-brand-500/20 text-brand-500 flex items-center justify-center group-hover:bg-brand-500 group-hover:text-white transition">
              <Dumbbell className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">My Workout Routine</h3>
            <p className="text-xs text-slate-400">
              {activeWorkout ? activeWorkout.title : 'View exercises, sets, reps & instructions assigned by your coach.'}
            </p>
          </div>
          <div className="pt-4 flex items-center text-xs font-semibold text-brand-400 group-hover:text-brand-300">
            <span>View Routine</span>
            <ChevronRight className="w-4 h-4 ml-1" />
          </div>
        </Link>

        <Link
          to="/member/diet"
          className="p-6 rounded-3xl bg-dark-850 border border-slate-800 hover:border-emerald-500/50 transition group flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition">
              <Utensils className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">My Diet & Meals</h3>
            <p className="text-xs text-slate-400">
              {activeDiet ? `${activeDiet.title} (${activeDiet.target_calories} kcal)` : 'Personalized nutrition chart and meal timings.'}
            </p>
          </div>
          <div className="pt-4 flex items-center text-xs font-semibold text-emerald-400 group-hover:text-emerald-300">
            <span>View Meal Schedule</span>
            <ChevronRight className="w-4 h-4 ml-1" />
          </div>
        </Link>

        <Link
          to="/member/billing"
          className="p-6 rounded-3xl bg-dark-850 border border-slate-800 hover:border-blue-500/50 transition group flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition">
              <CreditCard className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Invoices & Receipts</h3>
            <p className="text-xs text-slate-400">
              Download and print tax invoices and payment receipts for your membership subscriptions.
            </p>
          </div>
          <div className="pt-4 flex items-center text-xs font-semibold text-blue-400 group-hover:text-blue-300">
            <span>View Invoices</span>
            <ChevronRight className="w-4 h-4 ml-1" />
          </div>
        </Link>
      </div>
    </div>
  );
}
