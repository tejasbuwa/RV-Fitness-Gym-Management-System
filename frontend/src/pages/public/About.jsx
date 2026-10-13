import React from 'react';
import { ShieldCheck, Dumbbell, Target, HeartHandshake, Award } from 'lucide-react';

export default function About() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-widest text-brand-500">About RV Fitness</span>
        <h1 className="text-4xl sm:text-5xl font-black text-white">Forged in Narsobawadi. Built for Real Results.</h1>
        <p className="text-base text-slate-400 leading-relaxed">
          RV Fitness was established with a clear mission: bringing elite, commercial-grade fitness training, science-backed biomechanical machinery, and certified nutrition coaching to the Narsobawadi community.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="rounded-3xl overflow-hidden border border-slate-800 shadow-2xl">
          <img
            src="https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80"
            alt="RV Fitness Gym Narsobawadi"
            className="w-full h-[400px] object-cover"
          />
        </div>
        <div className="space-y-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Our Philosophy: Consistency & Form Over Ego Lifting</h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            Whether you are picking up a dumbbell for the first time or preparing for competitive athletics, RV Fitness provides an uplifting, respectful atmosphere free of judgment.
          </p>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-brand-500/10 text-brand-400 mt-1">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Customized Programming</h4>
                <p className="text-xs text-slate-400">Every member receives individual workout splits and progressive overload monitoring.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-brand-500/10 text-brand-400 mt-1">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Safety & Ergonomics</h4>
                <p className="text-xs text-slate-400">Bio-mechanical converging machines minimize tendon strain while maximizing muscle activation.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-brand-500/10 text-brand-400 mt-1">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Narsobawadi Fitness Community</h4>
                <p className="text-xs text-slate-400">A tightly-knit culture of mutual support, local achievements, and healthy transformation.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
