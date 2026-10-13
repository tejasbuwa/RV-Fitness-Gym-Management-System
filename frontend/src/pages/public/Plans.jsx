import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, ShieldCheck, Zap } from 'lucide-react';
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
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-brand-500">Membership Tiers</span>
        <h1 className="text-4xl font-black text-white">Invest in Your Physical Health</h1>
        <p className="text-sm text-slate-400">
          Straightforward pricing with no hidden registration surcharges. All plans grant full equipment access in Narsobawadi.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-400 text-sm">Loading membership plans...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {plans.map((p) => {
            const isPopular = p.name.includes('Quarterly') || p.name.includes('Yearly');
            const benefits = Array.isArray(p.benefits) ? p.benefits : [];

            return (
              <div
                key={p.id}
                className={`relative rounded-3xl p-8 flex flex-col justify-between transition ${
                  isPopular
                    ? 'bg-dark-850 border-2 border-brand-500 shadow-xl shadow-brand-500/10'
                    : 'bg-dark-850 border border-slate-800'
                }`}
              >
                {isPopular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-brand-500 text-white font-bold text-[10px] uppercase tracking-wider px-3.5 py-1 rounded-full shadow-md">
                    Most Recommended
                  </div>
                )}

                <div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-brand-400 bg-brand-500/10 px-3 py-1 rounded-full border border-brand-500/20">
                      {p.plan_type}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">{p.duration_days} Days Validity</span>
                  </div>

                  <h3 className="text-2xl font-black text-white">{p.name}</h3>

                  <div className="my-6">
                    <span className="text-4xl font-black text-white">{formatCurrency(p.price)}</span>
                    <span className="text-xs text-slate-400 ml-1">/ term</span>
                  </div>

                  <p className="text-xs text-slate-400 mb-6 leading-relaxed">{p.description}</p>

                  <div className="space-y-3 mb-8 pt-4 border-t border-slate-800">
                    <p className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">Plan Inclusions:</p>
                    {benefits.map((b, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{b}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Link
                  to={`/register?planId=${p.id}`}
                  className={`w-full text-center py-3.5 px-4 rounded-xl font-bold text-sm transition shadow-lg ${
                    isPopular
                      ? 'bg-brand-500 hover:bg-brand-600 text-white shadow-brand-500/20'
                      : 'bg-dark-750 hover:bg-slate-700 text-white border border-slate-700'
                  }`}
                >
                  Choose {p.name}
                </Link>
              </div>
            );
          })}
        </div>
      )}

      {/* Guarantee box */}
      <div className="p-8 rounded-2xl bg-dark-850 border border-slate-800 text-center max-w-2xl mx-auto space-y-2">
        <ShieldCheck className="w-8 h-8 text-brand-500 mx-auto" />
        <h3 className="text-base font-bold text-white">Need a Customized Student or Family Package?</h3>
        <p className="text-xs text-slate-400">
          Walk in to our Narsobawadi center or give us a call to discuss custom timings and tailored packages.
        </p>
      </div>
    </div>
  );
}
