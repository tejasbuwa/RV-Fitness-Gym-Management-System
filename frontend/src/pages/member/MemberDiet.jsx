import React, { useState, useEffect } from 'react';
import { Utensils, Clock, Flame, CheckCircle, HeartPulse } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

export default function MemberDiet() {
  const { user } = useAuth();
  const [dietPlan, setDietPlan] = useState(null);
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.memberId) {
      api.get(`/diets/member/${user.memberId}`)
        .then((res) => {
          if (res.data.success) {
            setDietPlan(res.data.dietPlan);
            setMeals(res.data.meals || []);
          }
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [user]);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-black text-white">My Daily Nutrition Schedule</h2>
        <p className="text-xs text-slate-400">Structured daily fuel prescribed by your personal coach.</p>
      </div>

      {loading ? (
        <div className="py-20 text-center text-slate-400 text-xs">Loading nutrition chart...</div>
      ) : !dietPlan ? (
        <div className="p-12 rounded-3xl bg-dark-850 border border-slate-800 text-center space-y-3">
          <Utensils className="w-12 h-12 text-slate-500 mx-auto" />
          <h3 className="text-base font-bold text-white">No Diet Plan Configured Yet</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Your trainer has not generated your personalized nutrition targets. Consult your coach during your next training session!
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Diet Header */}
          <div className="p-6 rounded-3xl bg-dark-850 border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/20">
                  Daily Nutrition Guide
                </span>
                <h3 className="text-xl font-black text-white mt-1">{dietPlan.title}</h3>
              </div>
              <div className="flex items-center gap-4 text-xs font-mono">
                <div className="text-right">
                  <span className="text-slate-400 block text-[10px]">Calories</span>
                  <span className="text-emerald-400 font-bold text-sm">{dietPlan.target_calories} kcal</span>
                </div>
                {dietPlan.daily_protein_g && (
                  <div className="text-right">
                    <span className="text-slate-400 block text-[10px]">Protein</span>
                    <span className="text-brand-400 font-bold text-sm">{dietPlan.daily_protein_g}g</span>
                  </div>
                )}
              </div>
            </div>

            {dietPlan.notes && (
              <p className="text-xs text-slate-400 pt-3 border-t border-slate-800 italic">
                Coach Guidelines: "{dietPlan.notes}"
              </p>
            )}
          </div>

          {/* Meals Timeline List */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Meal Breakdown</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {meals.map((m, idx) => (
                <div key={m.id || idx} className="p-5 rounded-2xl bg-dark-850 border border-slate-800 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-emerald-400 uppercase tracking-wider text-xs">{m.meal_name}</span>
                    <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 bg-dark-800 px-2.5 py-1 rounded-lg border border-slate-750">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{m.timing}</span>
                    </span>
                  </div>

                  <p className="text-sm font-bold text-white leading-snug">{m.food_items}</p>

                  <div className="flex justify-between items-center pt-2 border-t border-slate-800 text-xs">
                    <span className="text-slate-400">Serving: <strong className="text-slate-200">{m.quantity}</strong></span>
                    <span className="font-mono font-bold text-emerald-400">{m.calories} kcal</span>
                  </div>

                  {m.notes && (
                    <p className="text-[11px] text-slate-400 italic">
                      "{m.notes}"
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
