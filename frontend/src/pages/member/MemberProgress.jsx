import React, { useState, useEffect } from 'react';
import { Activity, Scale, TrendingDown, Calendar, CheckCircle } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { formatDate } from '../../utils/formatters';

export default function MemberProgress() {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.memberId) {
      api.get(`/progress/member/${user.memberId}`)
        .then((res) => {
          if (res.data.success) {
            setHistory(res.data.records);
            setChartData(res.data.chartData);
          }
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [user]);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-black text-white">My Fitness Transformation Progress</h2>
        <p className="text-xs text-slate-400">Verifiable biometric history recorded during physical check-ins.</p>
      </div>

      {loading ? (
        <div className="py-20 text-center text-slate-400 text-xs">Loading progress history...</div>
      ) : (
        <div className="space-y-8">
          {/* Chart */}
          <div className="p-6 rounded-3xl bg-dark-850 border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white">Weight Journey (kg)</h3>
            <div className="h-64 w-full pt-2">
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
                  No check-ins logged yet.
                </div>
              )}
            </div>
          </div>

          {/* Measurements History Table */}
          <div className="p-6 rounded-3xl bg-dark-850 border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white">Check-in Assessment Logs</h3>
            <div className="divide-y divide-slate-800 text-xs">
              {history.length === 0 ? (
                <p className="py-8 text-center text-slate-500">No assessment logs recorded.</p>
              ) : (
                history.map((h) => (
                  <div key={h.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-black text-white text-base">{h.weight_kg} kg</span>
                        {h.bmi && (
                          <span className="font-mono text-xs font-bold text-brand-400 bg-brand-500/10 px-2 py-0.5 rounded border border-brand-500/20">
                            BMI: {h.bmi}
                          </span>
                        )}
                      </div>
                      <p className="text-slate-300 text-xs mt-1">{h.fitness_observations || 'Regular coach evaluation'}</p>
                    </div>

                    <div className="text-left sm:text-right space-y-1">
                      <span className="text-slate-400 font-semibold">{formatDate(h.recorded_date)}</span>
                      <div className="flex flex-wrap sm:justify-end gap-3 text-[11px] text-slate-400">
                        {h.chest_inches && <span>Chest: <strong className="text-white">{h.chest_inches}"</strong></span>}
                        {h.waist_inches && <span>Waist: <strong className="text-white">{h.waist_inches}"</strong></span>}
                        {h.arms_inches && <span>Arms: <strong className="text-white">{h.arms_inches}"</strong></span>}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
