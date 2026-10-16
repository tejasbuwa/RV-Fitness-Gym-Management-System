import React, { useState, useEffect } from 'react';
import { Bell, Calendar, MapPin, Clock, Tag, Sparkles } from 'lucide-react';
import api from '../../services/api';
import { formatDate } from '../../utils/formatters';

export default function Announcements() {
  const [notices, setNotices] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fallback event images
  const eventImages = [
    '/images/gym/event_bootcamp.jpg',
    '/images/gym/event_powerlifting.jpg',
    '/images/gym/event_nutrition.jpg'
  ];

  useEffect(() => {
    Promise.all([
      api.get('/notices'),
      api.get('/events')
    ])
      .then(([noticesRes, eventsRes]) => {
        if (noticesRes.data.success) setNotices(noticesRes.data.notices);
        if (eventsRes.data.success) setEvents(eventsRes.data.events);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-20 bg-[#0a0a0a] text-zinc-100">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-[0.25em] text-amber-400 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30">
          Gym Bulletins & Community
        </span>
        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight">
          ANNOUNCEMENTS & <span className="text-gold-gradient">UPCOMING EVENTS</span>
        </h1>
        <p className="text-base sm:text-lg text-zinc-300 font-normal leading-relaxed">
          Stay informed with current gym updates, holiday notices, competition announcements, and special fitness workshops at RV Fitness Narsobawadi.
        </p>
      </div>

      {/* 1. Official Gym Notices */}
      <div className="space-y-6">
        <div className="flex items-center gap-2.5 pb-3 border-b border-zinc-800">
          <Bell className="w-5 h-5 text-amber-400" />
          <h2 className="text-2xl font-bold text-white">Official Bulletins & Notices</h2>
        </div>

        {loading ? (
          <div className="py-10 text-center text-zinc-400">Loading notices...</div>
        ) : notices.length === 0 ? (
          <div className="p-8 rounded-2xl bg-zinc-950 border border-zinc-800 text-center text-zinc-400 text-sm">
            No active announcements currently posted.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notices.map((notice) => (
              <div
                key={notice.id}
                className="glass-gold p-6 rounded-3xl border border-amber-500/20 hover:border-amber-500/40 flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-3">
                    <span className="px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 font-semibold uppercase text-[10px]">
                      Audience: {notice.target_audience}
                    </span>
                    <span className="text-zinc-500 font-medium">
                      {formatDate(notice.publish_date)}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{notice.title}</h3>
                  <p className="text-xs text-zinc-300 leading-relaxed whitespace-pre-line">
                    {notice.content}
                  </p>
                </div>
                <div className="pt-3 border-t border-zinc-800/80 text-[11px] text-zinc-500 flex items-center justify-between">
                  <span>RV Fitness Desk</span>
                  <span className="text-emerald-400 font-medium">Active Notice</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 2. Upcoming Events & Workshops */}
      <div className="space-y-6">
        <div className="flex items-center gap-2.5 pb-3 border-b border-zinc-800">
          <Calendar className="w-5 h-5 text-amber-400" />
          <h2 className="text-2xl font-bold text-white">Upcoming Events & Competitions</h2>
        </div>

        {loading ? (
          <div className="py-10 text-center text-zinc-400">Loading events...</div>
        ) : events.length === 0 ? (
          <div className="p-8 rounded-2xl bg-zinc-950 border border-zinc-800 text-center text-zinc-400 text-sm">
            No upcoming events scheduled right now.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {events.map((event, index) => {
              const coverImg = event.image_url || eventImages[index % eventImages.length];
              return (
                <div
                  key={event.id}
                  className="glass-gold rounded-3xl overflow-hidden group hover:-translate-y-1.5 transition-all duration-300 border border-amber-500/20"
                >
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={coverImg}
                      alt={event.event_name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
                    <span className="absolute top-4 right-4 px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-amber-500/40 text-amber-300 text-xs font-bold uppercase">
                      {event.status}
                    </span>
                  </div>

                  <div className="p-6 space-y-4">
                    <h3 className="text-xl font-bold text-white group-hover:text-amber-300 transition">
                      {event.event_name}
                    </h3>
                    <p className="text-xs text-zinc-300 leading-relaxed line-clamp-3">
                      {event.description}
                    </p>

                    <div className="space-y-2 pt-2 border-t border-zinc-800 text-xs text-zinc-400">
                      <div className="flex items-center gap-2 text-zinc-300">
                        <Calendar className="w-4 h-4 text-amber-400 shrink-0" />
                        <span>Date: {formatDate(event.event_date)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-zinc-300">
                        <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                        <span>Time: {event.event_time}</span>
                      </div>
                      <div className="flex items-center gap-2 text-zinc-300">
                        <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                        <span>{event.location || 'RV Fitness, Narsobawadi'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
