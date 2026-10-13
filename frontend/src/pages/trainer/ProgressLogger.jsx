import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Activity, Plus, TrendingDown, Scale, User, Calendar, CheckCircle2 } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import api from '../../services/api';
import { formatDate } from '../../utils/formatters';
import { useNotification } from '../../context/NotificationContext';

export default function ProgressLogger() {
  const [searchParams] = useSearchParams();
  const initialMemberId = searchParams.get('memberId') || '';

  const [members, setMembers] = useState([]);
  const [selectedMemberId, setSelectedMemberId] = useState(initialMemberId);
  const [history, setHistory] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Check-in form
  const [form, setForm] = useState({
    recordedDate: new Date().toISOString().split('T')[0],
    weightKg: '',
    heightCm: '',
    chestInches: '',
    waistInches: '',
    armsInches: '',
    fitnessObservations: ''
  });

  const { success, error } = useNotification();

  useEffect(() => {
    fetchMembers();
  }, []);

  useEffect(() => {
    if (selectedMemberId) {
      fetchProgress(selectedMemberId);
    }
  }, [selectedMemberId]);

  const fetchMembers = () => {
    api.get('/members')
      .then((res) => {
        if (res.data.success) {
          setMembers(res.data.members);
          if (!selectedMemberId && res.data.members.length > 0) {
            setSelectedMemberId(res.data.members[0].id);
          }
        }
      })
      .catch(() => {});
  };

  const fetchProgress = (memberId) => {
    setLoading(true);
    api.get(`/progress/member/${memberId}`)
      .then((res) => {
        if (res.data.success) {
          setHistory(res.data.records);
          setChartData(res.data.chartData);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  // Real-time BMI calculation preview
  const calculatedBmi = () => {
    const w = parseFloat(form.weightKg);
    const h = parseFloat(form.heightCm);
    if (w > 0 && h > 0) {
      const hM = h / 100;
      return (w / (hM * hM)).toFixed(1);
    }
    return null;
  };

  const handleRecordProgress = async (e) => {
    e.preventDefault();
    if (!selectedMemberId || !form.weightKg) {
      error('Please select a member and enter current weight.');
      return;
    }

    try {
      const res = await api.post('/progress', {
        memberId: parseInt(selectedMemberId, 10),
        ...form
      });
      if (res.data.success) {
        success('Biometric check-in recorded successfully!');
        setForm({
          recordedDate: new Date().toISOString().split('T')[0],
          weightKg: '',
          heightCm: form.heightCm,
          chestInches: '',
          waistInches: '',
          armsInches: '',
          fitnessObservations: ''
        });
        fetchProgress(selectedMemberId);
      }
    } catch (err) {
      error(err.response?.data?.message || 'Failed to log progress.');
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-black text-white">Client Progress Logger</h2>
        <p className="text-xs text-slate-400">Track weight, BMI, and body measurement improvements over time.</p>
      </div>

      {/* Select Client Card */}
      <div className="p-5 rounded-2xl bg-dark-850 border border-slate-800 flex items-center gap-3">
        <User className="w-5 h-5 text-brand-500" />
        <span className="text-xs font-bold text-white uppercase tracking-wider">Select Client:</span>
        <select
          value={selectedMemberId}
          onChange={(e) => setSelectedMemberId(e.target.value)}
          className="px-3.5 py-2 rounded-xl bg-dark-800 border border-slate-700 text-white text-xs font-semibold focus:border-brand-500 focus:outline-none"
        >
          {members.map((m) => (
            <option key={m.id} value={m.id}>
              {m.full_name} ({m.member_code})
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Check-in Form */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-dark-850 border border-slate-800 space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-slate-800">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Scale className="w-4 h-4 text-brand-500" />
              <span>Record Biometric Check-In</span>
            </h3>
            {calculatedBmi() && (
              <span className="text-xs font-mono font-bold text-brand-400 bg-brand-500/10 px-2 py-0.5 rounded border border-brand-500/20">
                BMI: {calculatedBmi()}
              </span>
            )}
          </div>

          <form onSubmit={handleRecordProgress} className="space-y-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">Check-in Date *</label>
              <input
                type="date"
                required
                value={form.recordedDate}
                onChange={(e) => setForm({ ...form, recordedDate: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-dark-800 border border-slate-700 text-white text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">Weight (kg) *</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  placeholder="e.g. 78.5"
                  value={form.weightKg}
                  onChange={(e) => setForm({ ...form, weightKg: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-dark-800 border border-slate-700 text-white text-xs font-mono"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">Height (cm)</label>
                <input
                  type="number"
                  step="0.5"
                  placeholder="e.g. 175"
                  value={form.heightCm}
                  onChange={(e) => setForm({ ...form, heightCm: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-dark-800 border border-slate-700 text-white text-xs font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-[10px] font-semibold text-slate-400 mb-1">Chest (in)</label>
                <input
                  type="number"
                  step="0.5"
                  value={form.chestInches}
                  onChange={(e) => setForm({ ...form, chestInches: e.target.value })}
                  className="w-full px-2 py-1.5 rounded-lg bg-dark-800 border border-slate-700 text-white text-xs font-mono text-center"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-slate-400 mb-1">Waist (in)</label>
                <input
                  type="number"
                  step="0.5"
                  value={form.waistInches}
                  onChange={(e) => setForm({ ...form, waistInches: e.target.value })}
                  className="w-full px-2 py-1.5 rounded-lg bg-dark-800 border border-slate-700 text-white text-xs font-mono text-center"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-slate-400 mb-1">Arms (in)</label>
                <input
                  type="number"
                  step="0.5"
                  value={form.armsInches}
                  onChange={(e) => setForm({ ...form, armsInches: e.target.value })}
                  className="w-full px-2 py-1.5 rounded-lg bg-dark-800 border border-slate-700 text-white text-xs font-mono text-center"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">Trainer Observations</label>
              <textarea
                rows="3"
                value={form.fitnessObservations}
                onChange={(e) => setForm({ ...form, fitnessObservations: e.target.value })}
                placeholder="Strength improvements, posture analysis..."
                className="w-full px-3 py-2 rounded-xl bg-dark-800 border border-slate-700 text-white text-xs"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl text-xs font-bold bg-brand-500 hover:bg-brand-600 text-white shadow"
            >
              Save Biometric Log
            </button>
          </form>
        </div>

        {/* History & Chart */}
        <div className="lg:col-span-7 space-y-6">
          {/* Chart */}
          <div className="p-6 rounded-3xl bg-dark-850 border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white">Client Weight Trend (kg)</h3>
            <div className="h-56 w-full pt-2">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e2638" />
                    <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 11 }} />
                    <YAxis stroke="#64748b" tick={{ fontSize: 11 }} domain={['dataMin - 2', 'dataMax + 2']} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0f1420', borderColor: '#334155', borderRadius: '12px', fontSize: '12px', color: '#fff' }}
                      formatter={(v) => [`${v} kg`, 'Weight']}
                    />
                    <Line type="monotone" dataKey="weight" stroke="#e11d48" strokeWidth={3} dot={{ r: 5 }} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-slate-500 text-xs">
                  No biometric entries to chart.
                </div>
              )}
            </div>
          </div>

          {/* Historical Logs List */}
          <div className="p-6 rounded-3xl bg-dark-850 border border-slate-800 space-y-3">
            <h3 className="text-base font-bold text-white">Past Biometric Logs</h3>
            <div className="divide-y divide-slate-800 text-xs">
              {history.map((h) => (
                <div key={h.id} className="py-3 flex justify-between items-center">
                  <div>
                    <span className="font-mono font-bold text-white text-sm">{h.weight_kg} kg</span>
                    {h.bmi && <span className="text-slate-400 ml-2">BMI: {h.bmi}</span>}
                    <p className="text-[11px] text-slate-400 mt-0.5">{h.fitness_observations || 'Check-in'}</p>
                  </div>
                  <div className="text-right text-[11px] text-slate-500">
                    <p className="font-semibold text-slate-300">{formatDate(h.recorded_date)}</p>
                    {h.waist_inches && <span>Waist: {h.waist_inches}" | Chest: {h.chest_inches}"</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
