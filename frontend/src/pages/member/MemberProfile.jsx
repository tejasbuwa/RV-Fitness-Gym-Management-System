import React, { useState, useEffect } from 'react';
import { User, Phone, Mail, MapPin, Target, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { useNotification } from '../../context/NotificationContext';

export default function MemberProfile() {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState({
    fullName: '',
    phone: '',
    address: '',
    emergencyContact: '',
    fitnessGoal: ''
  });
  const [loading, setLoading] = useState(false);
  const { success, error } = useNotification();

  useEffect(() => {
    if (user?.memberId) {
      api.get(`/members/${user.memberId}`)
        .then((res) => {
          if (res.data.success) {
            const m = res.data.member;
            setProfile({
              fullName: m.full_name || '',
              phone: m.phone || '',
              address: m.address || '',
              emergencyContact: m.emergency_contact || '',
              fitnessGoal: m.fitness_goal || ''
            });
          }
        })
        .catch(() => {});
    }
  }, [user]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await api.put('/auth/profile', profile);
      if (res.data.success) {
        success('Profile updated successfully.');
        updateUser({ fullName: profile.fullName, phone: profile.phone });
      }
    } catch (err) {
      error(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h2 className="text-2xl font-black text-white">Profile Settings</h2>
        <p className="text-xs text-slate-400">Keep your contact information and fitness goals up-to-date.</p>
      </div>

      <div className="p-8 rounded-3xl bg-dark-850 border border-slate-800 space-y-6">
        <div className="flex items-center gap-4 pb-6 border-b border-slate-800">
          <div className="w-16 h-16 rounded-2xl bg-brand-500/20 border border-brand-500/40 flex items-center justify-center font-black text-2xl text-brand-400">
            {profile.fullName ? profile.fullName[0] : 'M'}
          </div>
          <div>
            <h3 className="text-lg font-black text-white">{profile.fullName || user?.email}</h3>
            <span className="font-mono text-xs font-bold text-brand-400 bg-brand-500/10 px-2 py-0.5 rounded border border-brand-500/20">
              {user?.memberCode || 'MEMBER'}
            </span>
            <p className="text-xs text-slate-400 mt-1">{user?.email}</p>
          </div>
        </div>

        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
            <input
              type="text"
              required
              value={profile.fullName}
              onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-dark-800 border border-slate-700 text-white text-xs"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Mobile Number</label>
              <input
                type="tel"
                required
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-dark-800 border border-slate-700 text-white text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Emergency Contact</label>
              <input
                type="text"
                value={profile.emergencyContact}
                onChange={(e) => setProfile({ ...profile, emergencyContact: e.target.value })}
                placeholder="Parent / Spouse phone"
                className="w-full px-4 py-2.5 rounded-xl bg-dark-800 border border-slate-700 text-white text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Primary Fitness Goal</label>
            <input
              type="text"
              value={profile.fitnessGoal}
              onChange={(e) => setProfile({ ...profile, fitnessGoal: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-dark-800 border border-slate-700 text-white text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Address in Narsobawadi</label>
            <input
              type="text"
              value={profile.address}
              onChange={(e) => setProfile({ ...profile, address: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-dark-800 border border-slate-700 text-white text-xs"
            />
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-brand-500 hover:bg-brand-600 shadow-lg transition"
            >
              {loading ? 'Saving Changes...' : 'Update Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
