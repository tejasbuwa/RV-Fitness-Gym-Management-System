import React, { useState, useEffect } from 'react';
import { Bell, Calendar, Tag, Info, ArrowUpRight } from 'lucide-react';
import api from '../../services/api';
import { formatDate } from '../../utils/formatters';

export default function Announcements() {
  const [notices, setNotices] = useState([]);
  const [events, setEvents] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/notices'),
      api.get('/events'),
      api.get('/posts')
    ])
      .then(([nRes, eRes, pRes]) => {
        if (nRes.data.success) setNotices(nRes.data.notices);
        if (eRes.data.success) setEvents(eRes.data.events);
        if (pRes.data.success) setPosts(pRes.data.posts);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-brand-500">Community Hub</span>
        <h1 className="text-4xl font-black text-white">Announcements, Events & Tips</h1>
        <p className="text-sm text-slate-400">
          Stay up-to-date with official gym updates, competitions in Narsobawadi, and expert training advice.
        </p>
      </div>

      {/* 1. Official Notices */}
      <section className="space-y-6">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <Bell className="w-5 h-5 text-brand-500" />
          <h2 className="text-xl font-bold text-white">Official Gym Notices</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {notices.map((n) => (
            <div key={n.id} className="p-6 rounded-2xl bg-dark-850 border border-slate-800 space-y-3">
              <div className="flex justify-between items-start gap-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded border border-amber-500/20">
                  Notice
                </span>
                <span className="text-xs text-slate-400">{formatDate(n.publish_date)}</span>
              </div>
              <h3 className="text-base font-bold text-white">{n.title}</h3>
              <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">{n.content}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 2. Upcoming Events */}
      <section className="space-y-6">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <Calendar className="w-5 h-5 text-brand-500" />
          <h2 className="text-xl font-bold text-white">Upcoming Events & Competitions</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {events.map((e) => (
            <div key={e.id} className="rounded-2xl bg-dark-850 border border-slate-800 overflow-hidden flex flex-col sm:flex-row">
              {e.image_url && (
                <img src={e.image_url} alt={e.event_name} className="w-full sm:w-48 h-48 object-cover shrink-0" />
              )}
              <div className="p-6 space-y-2 flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    {e.status}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">{formatDate(e.event_date)}</span>
                </div>
                <h3 className="text-base font-bold text-white">{e.event_name}</h3>
                <p className="text-xs text-slate-400 line-clamp-2">{e.description}</p>
                <div className="pt-2 text-[11px] text-slate-300 space-y-1">
                  <p><span className="text-slate-500 font-semibold">Time:</span> {e.event_time}</p>
                  <p><span className="text-slate-500 font-semibold">Venue:</span> {e.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Fitness Tips & Updates */}
      <section className="space-y-6">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <Tag className="w-5 h-5 text-brand-500" />
          <h2 className="text-xl font-bold text-white">Fitness Tips & Spotlights</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {posts.map((p) => (
            <div key={p.id} className="p-6 rounded-2xl bg-dark-850 border border-slate-800 space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-brand-400 bg-brand-500/10 px-2.5 py-0.5 rounded border border-brand-500/20">
                {p.category}
              </span>
              <h3 className="text-base font-bold text-white">{p.title}</h3>
              <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">{p.content}</p>
              <p className="text-[11px] text-slate-500">{formatDate(p.publish_date)}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
