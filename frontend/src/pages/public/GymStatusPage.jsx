import React, { useState, useEffect } from 'react';
import { Activity, Clock, MapPin, Calendar, CheckCircle2, AlertCircle } from 'lucide-react';
import api from '../../services/api';
import { formatDate } from '../../utils/formatters';

export default function GymStatusPage() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/gym-status')
      .then((res) => {
        if (res.data.success) {
          setStatus(res.data.status);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 space-y-10">
      <div className="text-center space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-brand-500">Real-Time Facility Status</span>
        <h1 className="text-4xl font-black text-white">Live Gym Status: Narsobawadi</h1>
        <p className="text-sm text-slate-400">
          Check if RV Fitness is currently accepting workout sessions, scheduled shift times, or holiday alerts.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-400 text-sm">Querying live gym feed...</div>
      ) : (
        <div className="p-8 sm:p-12 rounded-3xl bg-dark-850 border border-slate-700 shadow-2xl text-center space-y-8">
          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full border text-base font-extrabold uppercase tracking-wider bg-emerald-500/10 border-emerald-500/30 text-emerald-400">
            <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Current Status: {status?.status || 'OPEN'}</span>
          </div>

          <div className="max-w-lg mx-auto">
            <p className="text-lg font-semibold text-white leading-relaxed">
              "{status?.noticeMessage}"
            </p>
            {status?.updatedAt && (
              <p className="text-xs text-slate-400 mt-2">
                Last verified: {formatDate(status.updatedAt)}
              </p>
            )}
          </div>

          {/* Shifts Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-slate-800 text-left">
            <div className="p-5 rounded-2xl bg-dark-800 border border-slate-750 space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-brand-400">Morning Workout Batch</span>
              <p className="text-xl font-black text-white">{status?.todayOpeningTime || '05:30 AM'} – 10:00 AM</p>
              <p className="text-xs text-slate-400">Personal trainers & strength floors fully active.</p>
            </div>
            <div className="p-5 rounded-2xl bg-dark-800 border border-slate-750 space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-brand-400">Evening Workout Batch</span>
              <p className="text-xl font-black text-white">05:00 PM – {status?.todayClosingTime || '10:00 PM'}</p>
              <p className="text-xs text-slate-400">High intensity functional and powerlifting slots.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
