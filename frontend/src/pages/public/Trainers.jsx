import React, { useState, useEffect } from 'react';
import { Award, Mail, Phone, Calendar } from 'lucide-react';
import api from '../../services/api';

export default function Trainers() {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/trainers')
      .then((res) => {
        if (res.data.success) {
          setTrainers(res.data.trainers);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-brand-500">Certified Staff</span>
        <h1 className="text-4xl font-black text-white">Meet Our Strength Coaches</h1>
        <p className="text-sm text-slate-400">
          Our certified coaching staff combines anatomical science with decades of strength training experience to ensure every rep is safe and effective.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-400 text-sm">Loading trainer roster...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {trainers.map((t) => (
            <div key={t.id} className="rounded-3xl bg-dark-850 border border-slate-800 p-8 space-y-6">
              <div className="flex flex-col sm:flex-row gap-6 items-center">
                <img
                  src={t.photo_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                  alt={t.full_name}
                  className="w-32 h-32 rounded-2xl object-cover border-2 border-slate-700 shadow-md shrink-0"
                />
                <div className="space-y-1 text-center sm:text-left">
                  <span className="text-[11px] font-bold text-brand-400 uppercase tracking-wider">
                    {t.experience_years} Years Coaching Experience
                  </span>
                  <h3 className="text-2xl font-black text-white">{t.full_name}</h3>
                  <p className="text-xs text-rose-300 font-semibold">{t.specialization}</p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800">
                <p className="text-xs text-slate-300 leading-relaxed">{t.bio}</p>
              </div>

              <div className="pt-2 flex flex-wrap gap-4 text-xs text-slate-400">
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-brand-400" />
                  <span>{t.phone}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-brand-400" />
                  <span>{t.email}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
