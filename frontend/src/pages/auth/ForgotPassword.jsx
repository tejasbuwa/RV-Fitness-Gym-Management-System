import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { KeyRound, Mail, ArrowRight, CheckCircle2, Lock } from 'lucide-react';
import api from '../../services/api';
import { useNotification } from '../../context/NotificationContext';

export default function ForgotPassword() {
  const [step, setStep] = useState(1); // 1: Request token, 2: Reset password
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
        setToken(res.data.resetToken); // Pre-fill token for local demo convenience
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
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-brand-500/10 border border-brand-500/20 text-brand-500 mx-auto flex items-center justify-center mb-2">
            <KeyRound className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-white">Reset Account Password</h2>
          <p className="text-xs text-slate-400">Recover your RV Fitness portal access</p>
        </div>

        <div className="p-8 rounded-3xl bg-dark-850 border border-slate-800 shadow-xl">
          {step === 1 && (
            <form onSubmit={handleRequestToken} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Registered Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. rohit@gmail.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-dark-800 border border-slate-700 text-white text-sm focus:border-brand-500 focus:outline-none"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl font-bold text-sm bg-brand-500 hover:bg-brand-600 disabled:opacity-50 text-white shadow-lg transition"
              >
                {loading ? 'Generating Code...' : 'Request Reset Code'}
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Reset Verification Token</label>
                <input
                  type="text"
                  required
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="Paste token or verification code"
                  className="w-full px-4 py-2.5 rounded-xl bg-dark-800 border border-slate-700 text-white text-sm focus:border-brand-500 focus:outline-none font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">New Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-dark-800 border border-slate-700 text-white text-sm focus:border-brand-500 focus:outline-none"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl font-bold text-sm bg-brand-500 hover:bg-brand-600 disabled:opacity-50 text-white shadow-lg transition"
              >
                {loading ? 'Updating Password...' : 'Save New Password'}
              </button>
            </form>
          )}

          {step === 3 && (
            <div className="text-center space-y-4 py-4">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
              <h3 className="text-base font-bold text-white">Password Updated!</h3>
              <p className="text-xs text-slate-400">You may now log in with your updated credentials.</p>
              <Link
                to="/login"
                className="inline-block py-2.5 px-6 rounded-xl font-bold text-xs bg-brand-500 text-white hover:bg-brand-600 transition"
              >
                Return to Login
              </Link>
            </div>
          )}

          <div className="pt-6 mt-6 border-t border-slate-800 text-center text-xs text-slate-400">
            <Link to="/login" className="text-brand-400 hover:underline">
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
