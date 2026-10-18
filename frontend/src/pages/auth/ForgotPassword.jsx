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
      let res;
      try {
        res = await api.post('/auth/forgot-password', { email });
      } catch (err1) {
        if (err1.response && err1.response.status === 404) {
          res = await api.post('/forgot-password', { email });
        } else {
          throw err1;
        }
      }

      if (res && res.data && res.data.success) {
        success(res.data.message || 'Reset token generated successfully!');
        if (res.data.resetToken) {
          setToken(res.data.resetToken);
        }
        setStep(2);
      } else {
        error(res?.data?.message || 'Failed to request reset token.');
      }
    } catch (err) {
      console.error('Password reset request error:', err);
      const errMsg =
        err.response?.data?.message ||
        (err.response?.status === 404
          ? 'No registered account found with that email, or server is restarting. Please check your email.'
          : err.message || 'Failed to request reset token.');
      error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      let res;
      try {
        res = await api.post('/auth/reset-password', { token, newPassword });
      } catch (err1) {
        if (err1.response && err1.response.status === 404) {
          res = await api.post('/reset-password', { token, newPassword });
        } else {
          throw err1;
        }
      }

      if (res && res.data && res.data.success) {
        success(res.data.message || 'Password reset successfully!');
        setStep(3);
      } else {
        error(res?.data?.message || 'Failed to reset password.');
      }
    } catch (err) {
      console.error('Password reset completion error:', err);
      const errMsg =
        err.response?.data?.message ||
        (err.response?.status === 404
          ? 'Reset endpoint not found (404). Please ensure server is running.'
          : err.message || 'Failed to reset password.');
      error(errMsg);
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
                  Account Email Address or Member ID
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. member@gmail.com or RVF-2026-..."
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
              {token && (
                <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold flex items-center gap-1.5">
                      <KeyRound className="w-4 h-4 text-amber-400" />
                      Generated Security Token
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(token);
                        success('Token copied to clipboard!');
                      }}
                      className="text-[11px] font-bold text-amber-400 hover:text-amber-300 underline"
                    >
                      Copy
                    </button>
                  </div>
                  <div className="font-mono text-[11px] bg-black/60 p-2 rounded border border-zinc-800 break-all select-all text-amber-200">
                    {token}
                  </div>
                  <p className="text-[11px] text-zinc-400">
                    Your token is pre-filled below. Set your new password and click Save.
                  </p>
                </div>
              )}

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

              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs text-zinc-400 hover:text-white transition"
                >
                  ← Change Email
                </button>
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
