import React, { useState, useEffect } from 'react';
import { Bell, Calendar, Tag, Activity, Clock, Plus, Trash2, Send, CheckCircle2 } from 'lucide-react';
import api from '../../services/api';
import { formatDate } from '../../utils/formatters';
import { useNotification } from '../../context/NotificationContext';

export default function ContentManagement() {
  const [gymStatus, setGymStatus] = useState({
    status: 'OPEN',
    noticeMessage: '',
    todayOpeningTime: '05:30 AM',
    todayClosingTime: '10:00 PM'
  });
  const [notices, setNotices] = useState([]);
  const [events, setEvents] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Forms
  const [noticeForm, setNoticeForm] = useState({ title: '', content: '', targetAudience: 'all' });
  const [eventForm, setEventForm] = useState({ eventName: '', description: '', eventDate: '', eventTime: '04:00 PM', location: 'RV Fitness, Narsobawadi' });
  const [postForm, setPostForm] = useState({ title: '', category: 'tip', content: '' });

  const { success, error } = useNotification();

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = () => {
    setLoading(true);
    Promise.all([
      api.get('/gym-status'),
      api.get('/notices'),
      api.get('/events'),
      api.get('/posts')
    ])
      .then(([gRes, nRes, eRes, pRes]) => {
        if (gRes.data.success) setGymStatus(gRes.data.status);
        if (nRes.data.success) setNotices(nRes.data.notices);
        if (eRes.data.success) setEvents(eRes.data.events);
        if (pRes.data.success) setPosts(pRes.data.posts);
      })
      .catch(() => error('Failed to fetch CMS content.'))
      .finally(() => setLoading(false));
  };

  const handleUpdateGymStatus = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put('/gym-status', gymStatus);
      if (res.data.success) {
        success(res.data.message);
      }
    } catch (err) {
      error(err.response?.data?.message || 'Failed to update gym status.');
    }
  };

  const handleCreateNotice = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/notices', noticeForm);
      if (res.data.success) {
        success(res.data.message);
        setNoticeForm({ title: '', content: '', targetAudience: 'all' });
        fetchContent();
      }
    } catch (err) {
      error(err.response?.data?.message || 'Failed to post notice.');
    }
  };

  const handleDeleteNotice = async (id) => {
    try {
      await api.delete(`/notices/${id}`);
      success('Notice removed.');
      fetchContent();
    } catch {
      error('Failed to remove notice.');
    }
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/events', eventForm);
      if (res.data.success) {
        success(res.data.message);
        setEventForm({ eventName: '', description: '', eventDate: '', eventTime: '04:00 PM', location: 'RV Fitness, Narsobawadi' });
        fetchContent();
      }
    } catch (err) {
      error(err.response?.data?.message || 'Failed to create event.');
    }
  };

  const handleDeleteEvent = async (id) => {
    try {
      await api.delete(`/events/${id}`);
      success('Event removed.');
      fetchContent();
    } catch {
      error('Failed to remove event.');
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/posts', postForm);
      if (res.data.success) {
        success(res.data.message);
        setPostForm({ title: '', category: 'tip', content: '' });
        fetchContent();
      }
    } catch (err) {
      error(err.response?.data?.message || 'Failed to create post.');
    }
  };

  const handleDeletePost = async (id) => {
    try {
      await api.delete(`/posts/${id}`);
      success('Post removed.');
      fetchContent();
    } catch {
      error('Failed to remove post.');
    }
  };

  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-2xl font-black text-white">CMS, Announcements & Gym Status</h2>
        <p className="text-xs text-slate-400">Broadcast notices, schedule events, publish tips, and toggle live gym operational status.</p>
      </div>

      {/* 1. REAL-TIME GYM STATUS CONTROLS */}
      <div className="p-6 sm:p-8 rounded-3xl bg-dark-850 border border-slate-800 space-y-6">
        <div className="flex items-center gap-3">
          <Activity className="w-5 h-5 text-brand-500" />
          <h3 className="text-lg font-black text-white">Live Gym Operational Status (Narsobawadi)</h3>
        </div>

        <form onSubmit={handleUpdateGymStatus} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Status Mode</label>
              <select
                value={gymStatus.status}
                onChange={(e) => setGymStatus({ ...gymStatus, status: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-dark-800 border border-slate-700 text-white text-xs focus:border-brand-500 focus:outline-none"
              >
                <option value="OPEN">OPEN (Operating Normally)</option>
                <option value="CLOSED">CLOSED (Shift Finished)</option>
                <option value="HOLIDAY">HOLIDAY (Festival / Holiday)</option>
                <option value="TEMPORARILY_CLOSED">TEMPORARILY CLOSED (Maintenance)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Today Opening Shift</label>
              <input
                type="text"
                value={gymStatus.todayOpeningTime}
                onChange={(e) => setGymStatus({ ...gymStatus, todayOpeningTime: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-dark-800 border border-slate-700 text-white text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Today Closing Shift</label>
              <input
                type="text"
                value={gymStatus.todayClosingTime}
                onChange={(e) => setGymStatus({ ...gymStatus, todayClosingTime: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-dark-800 border border-slate-700 text-white text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Notice / Message Shown on Website</label>
            <input
              type="text"
              value={gymStatus.noticeMessage || ''}
              onChange={(e) => setGymStatus({ ...gymStatus, noticeMessage: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-dark-800 border border-slate-700 text-white text-xs"
            />
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl text-xs font-bold bg-brand-500 hover:bg-brand-600 text-white shadow-lg transition"
          >
            Save & Publish Live Status
          </button>
        </form>
      </div>

      {/* 2. BROADCAST NOTICES */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 p-6 rounded-3xl bg-dark-850 border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Bell className="w-4 h-4 text-brand-500" />
            <span>Broadcast New Notice</span>
          </h3>
          <form onSubmit={handleCreateNotice} className="space-y-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">Notice Title *</label>
              <input
                type="text"
                required
                value={noticeForm.title}
                onChange={(e) => setNoticeForm({ ...noticeForm, title: e.target.value })}
                placeholder="e.g. Schedule update or maintenance"
                className="w-full px-3 py-2 rounded-xl bg-dark-800 border border-slate-700 text-white text-xs"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">Target Audience</label>
              <select
                value={noticeForm.targetAudience}
                onChange={(e) => setNoticeForm({ ...noticeForm, targetAudience: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-dark-800 border border-slate-700 text-white text-xs"
              >
                <option value="all">All (Public & All Portals)</option>
                <option value="members">Members Only</option>
                <option value="trainers">Trainers Only</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">Notice Content *</label>
              <textarea
                rows="3"
                required
                value={noticeForm.content}
                onChange={(e) => setNoticeForm({ ...noticeForm, content: e.target.value })}
                placeholder="Detailed announcement..."
                className="w-full px-3 py-2 rounded-xl bg-dark-800 border border-slate-700 text-white text-xs"
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl text-xs font-bold bg-brand-500 hover:bg-brand-600 text-white shadow"
            >
              Broadcast Notice
            </button>
          </form>
        </div>

        <div className="lg:col-span-7 p-6 rounded-3xl bg-dark-850 border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white">Active Notices Archive</h3>
          <div className="divide-y divide-slate-800 text-xs">
            {notices.map((n) => (
              <div key={n.id} className="py-3 flex justify-between items-start gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">{n.title}</span>
                    <span className="text-[10px] uppercase font-bold text-brand-400 bg-brand-500/10 px-1.5 py-0.2 rounded border border-brand-500/20">
                      {n.target_audience}
                    </span>
                  </div>
                  <p className="text-slate-400 leading-relaxed text-[11px]">{n.content}</p>
                  <p className="text-[10px] text-slate-500">{formatDate(n.publish_date)}</p>
                </div>
                <button onClick={() => handleDeleteNotice(n.id)} className="text-slate-500 hover:text-rose-400 p-1">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
