import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Dumbbell, Lock, Mail, ArrowRight, ShieldCheck, KeyRound } from 'lucide-react';
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
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2 mb-2">
            <div className="w-10 h-10 rounded-xl bg-brand-500 flex items-center justify-center shadow-lg shadow-brand-500/20">
              <Dumbbell className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-black text-white tracking-tight">
              RV <span className="text-brand-500">FITNESS</span>
            </span>
          </Link>
          <h2 className="text-2xl font-black text-white">Sign In to Your Account</h2>
          <p className="text-xs text-slate-400">Enter your credentials to access your portal</p>
        </div>

        {searchParams.get('expired') && (
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs text-center">
            Your previous session expired. Please log in again.
          </div>
        )}

        {/* Quick Demo Credentials Pill Box */}
        <div className="p-4 rounded-2xl bg-dark-850 border border-slate-700/80 space-y-2.5">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center">
            Demo Logins (1-Click Fill)
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickFill('admin@rvfitness.com', 'Admin@123')}
              className="py-1.5 px-2 rounded-lg bg-dark-800 hover:bg-slate-700 border border-slate-700 text-[11px] font-bold text-white transition text-center"
            >
              Admin
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('vikram@rvfitness.com', 'Trainer@123')}
              className="py-1.5 px-2 rounded-lg bg-dark-800 hover:bg-slate-700 border border-slate-700 text-[11px] font-bold text-white transition text-center"
            >
              Trainer
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('rohit@gmail.com', 'Member@123')}
              className="py-1.5 px-2 rounded-lg bg-dark-800 hover:bg-slate-700 border border-slate-700 text-[11px] font-bold text-white transition text-center"
            >
              Member
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="p-8 rounded-3xl bg-dark-850 border border-slate-800 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@rvfitness.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-dark-800 border border-slate-700 text-white text-sm focus:border-brand-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-semibold text-slate-300">Password</label>
                <Link to="/forgot-password" className="text-xs text-brand-400 hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-dark-800 border border-slate-700 text-white text-sm focus:border-brand-500 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-bold text-sm bg-brand-500 hover:bg-brand-600 disabled:opacity-50 text-white shadow-lg shadow-brand-500/25 transition mt-2 flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>Verifying credentials...</span>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="pt-6 mt-6 border-t border-slate-800 text-center text-xs text-slate-400">
            <span>New member joining RV Fitness? </span>
            <Link to="/register" className="text-brand-400 font-bold hover:underline">
              Create an Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
