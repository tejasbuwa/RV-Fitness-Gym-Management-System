import React, { useState, useEffect } from 'react';
import { Bell, Calendar } from 'lucide-react';
import api from '../../services/api';
import { formatDate } from '../../utils/formatters';

export default function MemberNotices() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/notices')
      .then((res) => {
        if (res.data.success) {
          setNotices(res.data.notices);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-black text-white">Member Announcements & Circulars</h2>
        <p className="text-xs text-slate-400">Official updates from RV Fitness Narsobawadi management.</p>
      </div>

      <div className="space-y-4">
        {loading ? (
          <p className="py-12 text-center text-slate-500 text-xs">Loading announcements...</p>
        ) : notices.length === 0 ? (
          <p className="py-12 text-center text-slate-500 text-xs">No active notices.</p>
        ) : (
          notices.map((n) => (
            <div key={n.id} className="p-6 rounded-3xl bg-dark-850 border border-slate-800 space-y-3">
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-bold uppercase tracking-wider text-brand-400 bg-brand-500/10 px-2.5 py-0.5 rounded border border-brand-500/20">
                  {n.target_audience}
                </span>
                <span className="text-xs text-slate-500">{formatDate(n.publish_date)}</span>
              </div>
              <h3 className="text-base font-bold text-white">{n.title}</h3>
              <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">{n.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
