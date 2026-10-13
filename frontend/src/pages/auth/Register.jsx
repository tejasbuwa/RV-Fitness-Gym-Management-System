import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Dumbbell, ArrowRight, User, Mail, Lock, Phone, MapPin, Target, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';

export default function Register() {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    gender: 'Male',
    dob: '',
    address: '',
    emergencyContact: '',
    heightCm: '',
    weightKg: '',
    fitnessGoal: 'Muscle Hypertrophy & Strength'
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const { success, error } = useNotification();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.fullName || !form.email || !form.phone || !form.password) {
      error('Please complete all required fields.');
      return;
    }

    if (form.password !== form.confirmPassword) {
      error('Passwords do not match.');
      return;
    }

    if (form.password.length < 6) {
      error('Password must be at least 6 characters.');
      return;
    }

    try {
      setLoading(true);
      const res = await register(form);
      success(res.message || 'Registration successful! Welcome to RV Fitness.');
      navigate('/member');
    } catch (err) {
      error(err.response?.data?.message || err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl space-y-6">
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2 mb-2">
            <div className="w-10 h-10 rounded-xl bg-brand-500 flex items-center justify-center shadow-lg shadow-brand-500/20">
              <Dumbbell className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-black text-white tracking-tight">
              RV <span className="text-brand-500">FITNESS</span>
            </span>
          </Link>
          <h2 className="text-2xl font-black text-white">Member Registration</h2>
          <p className="text-xs text-slate-400">Join Narsobawadi's premier fitness facility and get your official Member ID</p>
        </div>

        <div className="p-8 rounded-3xl bg-dark-850 border border-slate-800 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  placeholder="e.g. Rohit Deshmukh"
                  className="w-full px-4 py-2.5 rounded-xl bg-dark-800 border border-slate-700 text-white text-sm focus:border-brand-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Mobile Number *</label>
                <input
                  type="tel"
                  required
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="e.g. 9823112233"
                  className="w-full px-4 py-2.5 rounded-xl bg-dark-800 border border-slate-700 text-white text-sm focus:border-brand-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address *</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="rohit@gmail.com"
                className="w-full px-4 py-2.5 rounded-xl bg-dark-800 border border-slate-700 text-white text-sm focus:border-brand-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Password *</label>
                <input
                  type="password"
                  required
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="At least 6 characters"
                  className="w-full px-4 py-2.5 rounded-xl bg-dark-800 border border-slate-700 text-white text-sm focus:border-brand-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Confirm Password *</label>
                <input
                  type="password"
                  required
                  value={form.confirmPassword}
                  onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                  placeholder="Confirm password"
                  className="w-full px-4 py-2.5 rounded-xl bg-dark-800 border border-slate-700 text-white text-sm focus:border-brand-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Gender</label>
                <select
                  value={form.gender}
                  onChange={(e) => setForm({ ...form, gender: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-dark-800 border border-slate-700 text-white text-sm focus:border-brand-500 focus:outline-none"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Height (cm)</label>
                <input
                  type="number"
                  step="0.5"
                  value={form.heightCm}
                  onChange={(e) => setForm({ ...form, heightCm: e.target.value })}
                  placeholder="e.g. 175"
                  className="w-full px-3 py-2.5 rounded-xl bg-dark-800 border border-slate-700 text-white text-sm focus:border-brand-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Weight (kg)</label>
                <input
                  type="number"
                  step="0.5"
                  value={form.weightKg}
                  onChange={(e) => setForm({ ...form, weightKg: e.target.value })}
                  placeholder="e.g. 75"
                  className="w-full px-3 py-2.5 rounded-xl bg-dark-800 border border-slate-700 text-white text-sm focus:border-brand-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Primary Fitness Goal</label>
              <select
                value={form.fitnessGoal}
                onChange={(e) => setForm({ ...form, fitnessGoal: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl bg-dark-800 border border-slate-700 text-white text-sm focus:border-brand-500 focus:outline-none"
              >
                <option value="Muscle Hypertrophy & Strength">Muscle Hypertrophy & Strength</option>
                <option value="Fat Loss & Core Toning">Fat Loss & Core Toning</option>
                <option value="Cardiovascular Stamina & Endurance">Cardiovascular Stamina & Endurance</option>
                <option value="General Health & Posture Correction">General Health & Posture Correction</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Address / Landmark (Narsobawadi)</label>
              <input
                type="text"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                placeholder="e.g. Main Bazaar Road, Narsobawadi"
                className="w-full px-4 py-2.5 rounded-xl bg-dark-800 border border-slate-700 text-white text-sm focus:border-brand-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl font-bold text-sm bg-brand-500 hover:bg-brand-600 disabled:opacity-50 text-white shadow-lg shadow-brand-500/25 transition mt-4 flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>Generating your Member Account...</span>
              ) : (
                <>
                  <span>Create Account & Get Member ID</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="pt-6 mt-6 border-t border-slate-800 text-center text-xs text-slate-400">
            <span>Already have an account? </span>
            <Link to="/login" className="text-brand-400 font-bold hover:underline">
              Sign In Here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
