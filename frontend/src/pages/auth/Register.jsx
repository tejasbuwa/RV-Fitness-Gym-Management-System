import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, User, Mail, Lock, Phone, MapPin, Target, Sparkles, CheckCircle2 } from 'lucide-react';
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
      success(res.message || 'Registration successful! Welcome to RV Fitness Narsobawadi.');
      navigate('/member');
    } catch (err) {
      error(err.response?.data?.message || err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-14 bg-[#0a0a0a]">
      <div className="w-full max-w-2xl space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <Link to="/" className="inline-flex flex-col items-center group">
            <div className="relative mb-2">
              <div className="absolute -inset-2 rounded-full bg-amber-500/20 blur-md group-hover:bg-amber-500/40 transition"></div>
              <img
                src="/images/logo.png"
                alt="RV FITNESS Logo"
                className="relative h-16 w-auto object-contain drop-shadow-[0_0_15px_rgba(212,175,55,0.4)] group-hover:scale-105 transition-transform"
              />
            </div>
            <span className="text-2xl font-black text-white tracking-tight">
              RV <span className="text-gold-gradient font-black">FITNESS</span>
            </span>
            <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-amber-400 -mt-0.5">
              Narsobawadi Membership Enrollment
            </span>
          </Link>
          <h2 className="text-2xl font-black text-white">Create Your Member Account</h2>
          <p className="text-xs text-zinc-400">
            A permanent <span className="text-amber-400 font-bold">RVF-XXXX</span> Member ID will be automatically generated upon approval.
          </p>
        </div>

        {/* Registration Card */}
        <div className="glass-gold p-8 sm:p-10 rounded-3xl border border-amber-500/30 shadow-2xl bg-zinc-950/90">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5">
                  Full Legal Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rohit Deshmukh"
                    value={form.fullName}
                    onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-black border border-zinc-800 text-white placeholder-zinc-600 focus:border-amber-500 outline-none text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5">
                  Mobile Number *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3.5" />
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 9823112233"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-black border border-zinc-800 text-white placeholder-zinc-600 focus:border-amber-500 outline-none text-sm"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5">
                Email Address (Login Username) *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  placeholder="e.g. rohit@gmail.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-black border border-zinc-800 text-white placeholder-zinc-600 focus:border-amber-500 outline-none text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5">
                  Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    required
                    placeholder="Min 6 characters"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-black border border-zinc-800 text-white placeholder-zinc-600 focus:border-amber-500 outline-none text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5">
                  Confirm Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    required
                    placeholder="Re-type password"
                    value={form.confirmPassword}
                    onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-black border border-zinc-800 text-white placeholder-zinc-600 focus:border-amber-500 outline-none text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5">
                  Gender
                </label>
                <select
                  value={form.gender}
                  onChange={(e) => setForm({ ...form, gender: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-black border border-zinc-800 text-white focus:border-amber-500 outline-none text-sm"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5">
                  Height (cm)
                </label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="e.g. 175"
                  value={form.heightCm}
                  onChange={(e) => setForm({ ...form, heightCm: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-black border border-zinc-800 text-white placeholder-zinc-600 focus:border-amber-500 outline-none text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="e.g. 74"
                  value={form.weightKg}
                  onChange={(e) => setForm({ ...form, weightKg: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-black border border-zinc-800 text-white placeholder-zinc-600 focus:border-amber-500 outline-none text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5">
                Primary Fitness Goal
              </label>
              <select
                value={form.fitnessGoal}
                onChange={(e) => setForm({ ...form, fitnessGoal: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-black border border-zinc-800 text-white focus:border-amber-500 outline-none text-sm"
              >
                <option value="Muscle Hypertrophy & Strength">Muscle Hypertrophy & Strength</option>
                <option value="Weight Loss & Fat Reduction">Weight Loss & Fat Reduction</option>
                <option value="General Athletic Conditioning">General Athletic Conditioning</option>
                <option value="Competitive Bodybuilding">Competitive Bodybuilding</option>
                <option value="CrossFit & Flexibility">CrossFit & Flexibility</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-gold w-full py-4 rounded-xl font-bold text-sm tracking-wide flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
            >
              {loading ? (
                <span>Generating Member Account & RVF-XXXX ID...</span>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-black" />
                  <span>Register & Access Member Portal</span>
                  <ArrowRight className="w-4 h-4 text-black" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-zinc-900 text-center text-xs text-zinc-400">
            <span>Already have an active membership? </span>
            <Link to="/login" className="text-amber-400 hover:text-amber-300 font-bold ml-1">
              Log in to your portal
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
