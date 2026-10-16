import React, { useState, useEffect } from 'react';
import { Activity, Clock, MapPin, Calendar, CheckCircle2, AlertCircle, Phone, Sparkles } from 'lucide-react';
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

  const isOpen = status?.status === 'OPEN';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 space-y-12 bg-[#0a0a0a] text-zinc-100">
      <div className="text-center space-y-4">
        <span className="text-xs font-bold uppercase tracking-[0.25em] text-amber-400 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30">
          Live Facility Feeds
        </span>
        <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
          LIVE OPERATIONAL STATUS: <br />
          <span className="text-gold-gradient">RV FITNESS NARSOBAWADI</span>
        </h1>
        <p className="text-sm sm:text-base text-zinc-400 max-w-xl mx-auto">
          Real-time updates directly from the gym admin desk. Check live shift timings, holiday announcements, and trainer availability.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-16 text-zinc-400 text-sm">Querying live facility data...</div>
      ) : (
        <div className="glass-gold p-8 sm:p-12 rounded-3xl border border-amber-500/30 shadow-2xl text-center space-y-8 bg-zinc-950/80">
          {/* Status Badge */}
          <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-full border text-base font-black uppercase tracking-wider ${
            isOpen
              ? 'bg-amber-500/10 border-amber-500/40 text-amber-400 shadow-[0_0_25px_rgba(234,179,8,0.2)]'
              : 'bg-rose-500/10 border-rose-500/40 text-rose-400 shadow-[0_0_25px_rgba(244,63,94,0.2)]'
          }`}>
            <span className={`w-3.5 h-3.5 rounded-full ${isOpen ? 'bg-amber-400 animate-pulse' : 'bg-rose-500'}`}></span>
            <span>Current Status: {status?.status || 'OPEN'}</span>
          </div>

          <div className="max-w-xl mx-auto space-y-3">
            <p className="text-xl sm:text-2xl font-bold text-white leading-relaxed font-sans">
              "{status?.noticeMessage}"
            </p>
            {status?.updatedAt && (
              <p className="text-xs text-zinc-500">
                Official update timestamp: {formatDate(status.updatedAt)}
              </p>
            )}
          </div>

          {/* Shifts Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-6 border-t border-zinc-800 text-left">
            <div className="p-6 rounded-2xl bg-black border border-zinc-800 space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>Morning Training Batch</span>
              </span>
              <p className="text-2xl font-black text-white">{status?.todayOpeningTime || '05:30 AM'} – 10:00 AM</p>
              <p className="text-xs text-zinc-400">Personal coaching, strength arena & cardio floors operational.</p>
            </div>

            <div className="p-6 rounded-2xl bg-black border border-zinc-800 space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>Evening Training Batch</span>
              </span>
              <p className="text-2xl font-black text-white">04:30 PM – {status?.todayClosingTime || '10:00 PM'}</p>
              <p className="text-xs text-zinc-400">Full floor access, CrossFit agility zone & showers active.</p>
            </div>
          </div>

          {/* Quick Help Line */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-400 border-t border-zinc-800/80">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-amber-400" />
              <span>Main Bazaar Road, Narsobawadi</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-amber-400" />
              <span className="text-zinc-300 font-semibold">Front Desk: +91 98220 12345</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
