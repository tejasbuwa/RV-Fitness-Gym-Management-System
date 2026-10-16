import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Sparkles, Shield, ArrowRight, Clock, HelpCircle, Star } from 'lucide-react';
import api from '../../services/api';
import { formatCurrency } from '../../utils/formatters';

export default function Plans() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/membership-plans?status=active')
      .then((res) => {
        if (res.data.success) {
          setPlans(res.data.plans);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-20 bg-[#0a0a0a] text-zinc-100">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-[0.25em] text-amber-400 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30">
          Memberships & Subscriptions
        </span>
        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight">
          CHOOSE YOUR TRANSFORMATION <br />
          <span className="text-gold-gradient">MEMBERSHIP PLAN</span>
        </h1>
        <p className="text-base sm:text-lg text-zinc-300 font-normal leading-relaxed">
          Transparent, all-inclusive pricing with no hidden registration fees. Every plan includes full gym access in Narsobawadi, customized routines, and digital telemetry tracking.
        </p>
      </div>

      {/* Plan Cards Grid */}
      {loading ? (
        <div className="py-20 text-center text-zinc-400">Loading membership packages...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {plans.map((plan, index) => {
            const isFeatured = plan.name.toLowerCase().includes('pro') || plan.name.toLowerCase().includes('yearly');
            let benefitsList = [];
            try {
              benefitsList = typeof plan.benefits === 'string' ? JSON.parse(plan.benefits) : (plan.benefits || []);
            } catch (e) {
              benefitsList = ['Full Gym Access', 'General Coaching', 'Locker Room'];
            }

            return (
              <div
                key={plan.id}
                className={`relative rounded-3xl p-7 flex flex-col justify-between transition-all duration-300 ${
                  isFeatured
                    ? 'bg-gradient-to-b from-zinc-900 via-zinc-950 to-black border-2 border-amber-500 shadow-[0_0_30px_rgba(234,179,8,0.25)] lg:-translate-y-2'
                    : 'glass-gold bg-zinc-950/70 border border-zinc-800 hover:border-amber-500/40'
                }`}
              >
                {isFeatured && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full bg-gradient-to-r from-amber-400 to-yellow-600 text-black font-extrabold text-[10px] uppercase tracking-wider shadow-lg flex items-center gap-1">
                    <Star className="w-3 h-3 fill-black" />
                    <span>Recommended</span>
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs uppercase font-bold tracking-widest text-amber-400">
                      {plan.plan_type}
                    </span>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-zinc-800 text-zinc-300">
                      {plan.duration_days} Days
                    </span>
                  </div>

                  <h3 className="text-2xl font-black text-white mb-2">{plan.name}</h3>
                  <p className="text-xs text-zinc-400 mb-6 leading-relaxed min-h-[36px]">{plan.description}</p>

                  <div className="mb-6 pb-6 border-b border-zinc-800">
                    <span className="text-4xl font-black text-white">
                      {formatCurrency(plan.price)}
                    </span>
                    <span className="text-xs text-zinc-500 ml-1.5 font-medium">/ package</span>
                  </div>

                  <div className="space-y-3 mb-8">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Included Features:</p>
                    {benefitsList.map((benefit, bIndex) => (
                      <div key={bIndex} className="flex items-start gap-2.5 text-xs text-zinc-300">
                        <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        <span>{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Link
                  to={`/register?planId=${plan.id}`}
                  className={`w-full py-3.5 rounded-xl text-center font-bold text-sm transition ${
                    isFeatured
                      ? 'btn-gold shadow-lg shadow-amber-500/20'
                      : 'btn-gold-outline'
                  }`}
                >
                  Enroll in {plan.name}
                </Link>
              </div>
            );
          })}
        </div>
      )}

      {/* Plan Privileges Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
        <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">No Hidden Joining Charges</h4>
            <p className="text-xs text-zinc-400 mt-1">What you see is exactly what you pay. Transparent rates with printable receipts provided immediately upon enrollment.</p>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Full Shift Flexibility</h4>
            <p className="text-xs text-zinc-400 mt-1">Workout during either morning (05:30 AM – 10:00 AM) or evening (04:30 PM – 10:00 PM) shifts without extra fees.</p>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">7-Day Expiry Notifications</h4>
            <p className="text-xs text-zinc-400 mt-1">Receive automated advance alerts before your subscription expires so you can renew smoothly without missing workouts.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
