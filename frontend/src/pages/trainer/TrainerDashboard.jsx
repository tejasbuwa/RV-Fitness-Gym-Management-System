import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, Dumbbell, Utensils, Activity, ArrowRight, Clock, Plus } from 'lucide-react';
import api from '../../services/api';
import { formatDate } from '../../utils/formatters';

export default function TrainerDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/dashboard/trainer')
      .then((res) => {
        if (res.data.success) {
          setData(res.data);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="py-20 text-center text-slate-400 text-sm">Loading Coach Dashboard...</div>;
  }

  const { stats, recentProgress = [] } = data || {};

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="p-6 md:p-8 rounded-3xl bg-dark-900 border border-gold-500/20 relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gold-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <span className="text-xs font-bold uppercase tracking-widest text-gold-400">Trainer Command</span>
          <h2 className="text-2xl md:text-3xl font-black text-white mt-1">Assigned Members & Workout Management</h2>
          <p className="text-xs text-zinc-400 mt-1">Design customized workout routines, diet charts, and record member progress.</p>
        </div>
        <div className="flex flex-wrap gap-3 relative z-10">
          <Link
            to="/trainer/workouts"
            className="px-4 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-black shadow-gold-glow transition flex items-center gap-1.5"
          >
            <Dumbbell className="w-4 h-4" />
            <span>Create Workout Plan</span>
          </Link>
          <Link
            to="/trainer/progress"
            className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-dark-800 hover:bg-dark-750 text-gold-300 border border-gold-500/30 transition flex items-center gap-1.5"
          >
            <Activity className="w-4 h-4" />
            <span>Log Check-In</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-6 rounded-2xl bg-dark-900 border border-gold-500/20 hover:border-gold-500/40 transition">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Assigned Clients</span>
            <div className="p-2 rounded-xl bg-gold-500/10 text-gold-400">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <span className="text-3xl font-black text-white">{stats?.assignedMembers || 0}</span>
          <p className="text-xs text-emerald-400 font-medium mt-2 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            {stats?.activeMembers || 0} currently active
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-dark-900 border border-gold-500/20 hover:border-gold-500/40 transition">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Active Workouts</span>
            <div className="p-2 rounded-xl bg-gold-500/10 text-gold-400">
              <Dumbbell className="w-5 h-5" />
            </div>
          </div>
          <span className="text-3xl font-black text-white">{stats?.activeWorkouts || 0}</span>
          <p className="text-xs text-zinc-400 mt-2">Active assigned routines</p>
        </div>

        <div className="p-6 rounded-2xl bg-dark-900 border border-gold-500/20 hover:border-gold-500/40 transition">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Active Diets</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Utensils className="w-5 h-5" />
            </div>
          </div>
          <span className="text-3xl font-black text-white">{stats?.activeDiets || 0}</span>
          <p className="text-xs text-zinc-400 mt-2">Personal nutrition schedules</p>
        </div>

        <div className="p-6 rounded-2xl bg-dark-900 border border-gold-500/20 hover:border-gold-500/40 transition">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Check-ins This Month</span>
            <div className="p-2 rounded-xl bg-gold-500/10 text-gold-400">
              <Activity className="w-5 h-5" />
            </div>
          </div>
          <span className="text-3xl font-black text-white">{recentProgress.length}</span>
          <p className="text-xs text-zinc-400 mt-2">Recent biometric logs</p>
        </div>
      </div>

      {/* Recent Client Progress */}
      <div className="p-6 rounded-3xl bg-dark-900 border border-gold-500/20 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-base font-bold text-white">Recent Biometric Progress Updates</h3>
          <Link to="/trainer/progress" className="text-xs text-gold-400 hover:text-gold-300 font-semibold transition">
            Log New Check-In &rarr;
          </Link>
        </div>
        <div className="divide-y divide-zinc-800 text-xs">
          {recentProgress.length === 0 ? (
            <p className="text-zinc-500 py-6 text-center">No progress entries logged yet.</p>
          ) : (
            recentProgress.map((pr) => (
              <div key={pr.id} className="py-3.5 flex items-center justify-between">
                <div>
                  <p className="font-bold text-white">{pr.member_name} ({pr.member_code})</p>
                  <p className="text-zinc-400 text-[11px] mt-0.5">{pr.fitness_observations || 'Regular check-in'}</p>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-gold-400 text-sm">{pr.weight_kg} kg</span>
                  {pr.bmi && <span className="text-zinc-400 block text-[11px]">BMI: {pr.bmi}</span>}
                  <span className="text-[10px] text-zinc-500">{formatDate(pr.recorded_date)}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
