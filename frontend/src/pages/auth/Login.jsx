import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, Mail, ArrowRight, ShieldCheck, KeyRound, Sparkles, UserCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { success, error } = useNotification();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      error('Please fill in both email and password.');
      return;
    }

    try {
      setLoading(true);
      const user = await login(email, password);
      success(`Welcome back, ${user.fullName || user.email}!`);
      if (user.role === 'admin') navigate('/admin');
      else if (user.role === 'trainer') navigate('/trainer');
      else navigate('/member');
    } catch (err) {
      error(err.response?.data?.message || err.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = (roleEmail, rolePass) => {
    setEmail(roleEmail);
    setPassword(rolePass);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-14 bg-[#0a0a0a]">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header with Official Logo */}
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
              Narsobawadi Portal
            </span>
          </Link>
          <h2 className="text-2xl font-black text-white">Sign In to Your Account</h2>
          <p className="text-xs text-zinc-400">Enter your credentials to access your fitness portal</p>
        </div>

        {searchParams.get('expired') && (
          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs text-center font-medium">
            Your previous session has expired. Please log in again.
          </div>
        )}

        {/* 1-Click Quick Demo Credentials Pill Box */}
        <div className="glass-gold p-4.5 rounded-2xl border border-amber-500/30 space-y-3 bg-zinc-950/80">
          <div className="flex items-center justify-center gap-1.5 text-[11px] font-bold text-amber-400 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>1-Click Demo Login Pills</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button
              type="button"
              onClick={() => handleQuickFill('admin@rvfitness.com', 'Admin@123')}
              className="py-2 px-2.5 rounded-xl bg-zinc-900 hover:bg-amber-500/10 border border-zinc-800 hover:border-amber-500/50 text-[11px] font-bold text-zinc-200 hover:text-amber-300 transition text-center"
            >
              👑 Admin
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('vikram@rvfitness.com', 'Trainer@123')}
              className="py-2 px-2.5 rounded-xl bg-zinc-900 hover:bg-amber-500/10 border border-zinc-800 hover:border-amber-500/50 text-[11px] font-bold text-zinc-200 hover:text-amber-300 transition text-center"
            >
              🏋️ Vikram
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('sneha@rvfitness.com', 'Trainer@123')}
              className="py-2 px-2.5 rounded-xl bg-zinc-900 hover:bg-amber-500/10 border border-zinc-800 hover:border-amber-500/50 text-[11px] font-bold text-zinc-200 hover:text-amber-300 transition text-center"
            >
              🥗 Sneha
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('rohit@gmail.com', 'Member@123')}
              className="py-2 px-2.5 rounded-xl bg-zinc-900 hover:bg-amber-500/10 border border-zinc-800 hover:border-amber-500/50 text-[11px] font-bold text-zinc-200 hover:text-amber-300 transition text-center"
            >
              👤 Member
            </button>
          </div>
        </div>

        {/* Login Form */}
        <div className="glass-gold p-8 rounded-3xl border border-amber-500/30 shadow-2xl bg-zinc-950/90">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  placeholder="e.g. admin@rvfitness.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-black border border-zinc-800 text-white placeholder-zinc-600 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none text-sm transition"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-amber-400 hover:text-amber-300 font-semibold"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-black border border-zinc-800 text-white placeholder-zinc-600 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none text-sm transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-gold w-full py-3.5 rounded-xl text-center font-bold text-sm tracking-wide flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
            >
              {loading ? (
                <span>Authenticating with Database...</span>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4 text-black" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-zinc-900 text-center text-xs text-zinc-400">
            <span>Don't have a membership account yet? </span>
            <Link to="/register" className="text-amber-400 hover:text-amber-300 font-bold ml-1">
              Join RV Fitness
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
