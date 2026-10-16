import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { KeyRound, Mail, ArrowRight, CheckCircle2, Lock } from 'lucide-react';
import api from '../../services/api';
import { useNotification } from '../../context/NotificationContext';

export default function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { success, error } = useNotification();

  const handleRequestToken = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await api.post('/auth/forgot-password', { email });
      success(res.data.message || 'Reset token generated!');
      if (res.data.resetToken) {
        setToken(res.data.resetToken);
      }
      setStep(2);
    } catch (err) {
      error(err.response?.data?.message || 'Failed to request reset token.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await api.post('/auth/reset-password', { token, newPassword });
      success(res.data.message || 'Password reset successfully!');
      setStep(3);
    } catch (err) {
      error(err.response?.data?.message || 'Failed to reset password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-14 bg-[#0a0a0a]">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-3">
          <Link to="/" className="inline-flex flex-col items-center group">
            <div className="relative mb-2">
              <div className="absolute -inset-2 rounded-full bg-amber-500/20 blur-md group-hover:bg-amber-500/40 transition"></div>
              <img
                src="/images/logo.png"
                alt="RV FITNESS Logo"
                className="relative h-14 w-auto object-contain drop-shadow-[0_0_12px_rgba(212,175,55,0.4)]"
              />
            </div>
            <h2 className="text-2xl font-black text-white">Reset Account Password</h2>
            <p className="text-xs text-zinc-400">Recover your RV Fitness portal access</p>
          </Link>
        </div>

        <div className="glass-gold p-8 rounded-3xl border border-amber-500/30 shadow-2xl bg-zinc-950/90">
          {step === 1 && (
            <form onSubmit={handleRequestToken} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5">
                  Account Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    required
                    placeholder="e.g. member@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-black border border-zinc-800 text-white placeholder-zinc-600 focus:border-amber-500 outline-none text-sm transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-gold w-full py-3.5 rounded-xl font-bold text-sm tracking-wide flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
              >
                {loading ? 'Generating Security Token...' : 'Generate Reset Token'}
                <ArrowRight className="w-4 h-4 text-black" />
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5">
                  Security Token
                </label>
                <input
                  type="text"
                  required
                  placeholder="Security token string"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-black border border-zinc-800 text-white placeholder-zinc-600 focus:border-amber-500 outline-none text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    required
                    placeholder="Min 6 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-black border border-zinc-800 text-white placeholder-zinc-600 focus:border-amber-500 outline-none text-sm"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-gold w-full py-3.5 rounded-xl font-bold text-sm tracking-wide flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
              >
                {loading ? 'Updating Password...' : 'Save New Password'}
              </button>
            </form>
          )}

          {step === 3 && (
            <div className="text-center space-y-4 py-4">
              <CheckCircle2 className="w-12 h-12 text-amber-400 mx-auto" />
              <h3 className="text-lg font-bold text-white">Password Updated!</h3>
              <p className="text-xs text-zinc-400">
                Your account password has been updated. You can now log into your RV Fitness portal.
              </p>
              <Link
                to="/login"
                className="btn-gold inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold"
              >
                <span>Proceed to Login</span>
                <ArrowRight className="w-4 h-4 text-black" />
              </Link>
            </div>
          )}

          <div className="mt-6 pt-6 border-t border-zinc-900 text-center text-xs text-zinc-400">
            <Link to="/login" className="text-amber-400 hover:text-amber-300 font-bold">
              ← Return to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
