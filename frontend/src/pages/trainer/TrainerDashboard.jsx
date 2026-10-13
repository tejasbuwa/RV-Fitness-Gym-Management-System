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
      <div className="p-6 rounded-3xl bg-dark-850 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-brand-400">Trainer Command</span>
          <h2 className="text-2xl font-black text-white mt-0.5">Assigned Members & Workout Management</h2>
          <p className="text-xs text-slate-400 mt-1">Design customized workout routines, diet charts, and record progress.</p>
        </div>
        <div className="flex gap-3">
          <Link
            to="/trainer/workouts"
            className="px-4 py-2 rounded-xl text-xs font-bold bg-brand-500 hover:bg-brand-600 text-white shadow transition flex items-center gap-1.5"
          >
            <Dumbbell className="w-4 h-4" />
            <span>Create Workout Plan</span>
          </Link>
          <Link
            to="/trainer/progress"
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-dark-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition flex items-center gap-1.5"
          >
            <Activity className="w-4 h-4" />
            <span>Log Check-In</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-6 rounded-2xl bg-dark-850 border border-slate-800">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Assigned Clients</span>
            <Users className="w-5 h-5 text-brand-400" />
          </div>
          <span className="text-3xl font-black text-white">{stats?.assignedMembers || 0}</span>
          <p className="text-xs text-emerald-400 font-medium mt-2">{stats?.activeMembers || 0} currently active</p>
        </div>

        <div className="p-6 rounded-2xl bg-dark-850 border border-slate-800">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Active Workouts</span>
            <Dumbbell className="w-5 h-5 text-blue-400" />
          </div>
          <span className="text-3xl font-black text-white">{stats?.activeWorkouts || 0}</span>
          <p className="text-xs text-slate-400 mt-2">Active assigned routines</p>
        </div>

        <div className="p-6 rounded-2xl bg-dark-850 border border-slate-800">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Active Diets</span>
            <Utensils className="w-5 h-5 text-emerald-400" />
          </div>
          <span className="text-3xl font-black text-white">{stats?.activeDiets || 0}</span>
          <p className="text-xs text-slate-400 mt-2">Personal nutrition schedules</p>
        </div>

        <div className="p-6 rounded-2xl bg-dark-850 border border-slate-800">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Check-ins This Month</span>
            <Activity className="w-5 h-5 text-amber-400" />
          </div>
          <span className="text-3xl font-black text-white">{recentProgress.length}</span>
          <p className="text-xs text-slate-400 mt-2">Recent biometric logs</p>
        </div>
      </div>

      {/* Recent Client Progress */}
      <div className="p-6 rounded-3xl bg-dark-850 border border-slate-800 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-base font-bold text-white">Recent Biometric Progress Updates</h3>
          <Link to="/trainer/progress" className="text-xs text-brand-400 hover:underline font-semibold">
            Log New Check-In
          </Link>
        </div>
        <div className="divide-y divide-slate-800 text-xs">
          {recentProgress.length === 0 ? (
            <p className="text-slate-500 py-6 text-center">No progress entries logged yet.</p>
          ) : (
            recentProgress.map((pr) => (
              <div key={pr.id} className="py-3.5 flex items-center justify-between">
                <div>
                  <p className="font-bold text-white">{pr.member_name} ({pr.member_code})</p>
                  <p className="text-slate-400 text-[11px] mt-0.5">{pr.fitness_observations || 'Regular check-in'}</p>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-brand-400 text-sm">{pr.weight_kg} kg</span>
                  {pr.bmi && <span className="text-slate-400 block text-[11px]">BMI: {pr.bmi}</span>}
                  <span className="text-[10px] text-slate-500">{formatDate(pr.recorded_date)}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
