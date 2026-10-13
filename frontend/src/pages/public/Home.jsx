import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Dumbbell,
  ShieldCheck,
  Flame,
  Award,
  ArrowRight,
  Clock,
  MapPin,
  CheckCircle2,
  Users,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import api from '../../services/api';
import { formatCurrency } from '../../utils/formatters';

export default function Home() {
  const [plans, setPlans] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [gymStatus, setGymStatus] = useState(null);

  useEffect(() => {
    api.get('/membership-plans?status=active')
      .then((res) => setPlans(res.data.plans.slice(0, 3)))
      .catch(() => {});

    api.get('/trainers')
      .then((res) => setTrainers(res.data.trainers.slice(0, 2)))
      .catch(() => {});

    api.get('/gym-status')
      .then((res) => setGymStatus(res.data.status))
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-24 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 lg:pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Pill status */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/60 text-xs font-semibold text-slate-300">
                <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse"></span>
                <span>Narsobawadi’s Most Advanced Gym & Training Center</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1]">
                TRANSFORM YOUR <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-rose-500 to-amber-400">STRENGTH</span> & MINDSET.
              </h1>

              <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Welcome to <strong className="text-slate-200">RV Fitness Narsobawadi</strong>. Experience world-class biomechanical training equipment, dedicated certified strength coaches, and customized nutrition guidance designed for your goals.
              </p>

              {/* Status and Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to="/register"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold bg-brand-500 hover:bg-brand-600 text-white shadow-xl shadow-brand-500/25 transition transform active:scale-95"
                >
                  <span>Start Your Membership</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/facilities"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold bg-dark-800 border border-slate-700 text-slate-200 hover:text-white hover:bg-slate-700/50 transition"
                >
                  <span>Explore Facilities</span>
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-slate-800/80 text-left">
                <div>
                  <p className="text-2xl sm:text-3xl font-black text-white">500+</p>
                  <p className="text-xs text-slate-400 font-medium">Active Members</p>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-black text-white">100%</p>
                  <p className="text-xs text-slate-400 font-medium">Certified Coaches</p>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-black text-brand-400">2 Shifts</p>
                  <p className="text-xs text-slate-400 font-medium">Morning & Evening</p>
                </div>
              </div>
            </div>

            {/* Hero Image Showcase */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden border border-slate-800 shadow-2xl bg-dark-850 group">
                <img
                  src="https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=800&q=80"
                  alt="RV Fitness Gym Arena Narsobawadi"
                  className="w-full h-[450px] object-cover object-center group-hover:scale-105 transition duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-transparent to-transparent"></div>
                {/* Floating status card */}
                {gymStatus && (
                  <div className="absolute bottom-5 left-5 right-5 p-4 rounded-2xl bg-dark-900/90 backdrop-blur-md border border-slate-700/80">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Live Gym Status</span>
                      <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                        gymStatus.status === 'OPEN' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      }`}>
                        {gymStatus.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 font-medium line-clamp-1">{gymStatus.noticeMessage}</p>
                    <p className="text-[11px] text-brand-400 font-semibold mt-1">
                      Shift Hours: {gymStatus.todayOpeningTime} – {gymStatus.todayClosingTime}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CORE ADVANTAGES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-500">Why RV Fitness</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Built for Everyday Athletes & Beginners</h2>
          <p className="text-sm text-slate-400">Everything you need to hit your physical peak under one roof in Narsobawadi.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: Dumbbell,
              title: 'Heavy Strength Arena',
              desc: 'Olympic barbells, custom squat racks, dumbbell sets up to 45kg, and plate-loaded machines.'
            },
            {
              icon: Flame,
              title: 'Cardio & CrossFit Zone',
              desc: 'High-end treadmills, cross-trainers, assault bikes, rowing ergometers, and battle ropes.'
            },
            {
              icon: Award,
              title: 'Personalized Coaching',
              desc: 'Certified trainers who build custom workout splits and check your posture every session.'
            },
            {
              icon: ShieldCheck,
              title: 'Diet & Macro Guidance',
              desc: 'Customized daily calorie and macro plans calculated to match your body composition.'
            }
          ].map((feat, i) => {
            const Icon = feat.icon;
            return (
              <div
                key={i}
                className="p-6 rounded-2xl bg-dark-850 border border-slate-800 hover:border-brand-500/50 hover:bg-dark-800/60 transition group"
              >
                <div className="w-12 h-12 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-500 mb-5 group-hover:bg-brand-500 group-hover:text-white transition">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{feat.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{feat.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. MEMBERSHIP PLANS PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-brand-500">Transparent Pricing</span>
            <h2 className="text-3xl font-extrabold text-white mt-1">Flexible Membership Plans</h2>
            <p className="text-sm text-slate-400 mt-1">Select the package that fits your lifestyle. No hidden joining fees.</p>
          </div>
          <Link to="/plans" className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-400 hover:text-brand-300">
            <span>View All Plans</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((p) => {
            const benefits = Array.isArray(p.benefits) ? p.benefits : [];
            return (
              <div
                key={p.id}
                className="relative p-8 rounded-3xl bg-dark-850 border border-slate-800 hover:border-slate-700 flex flex-col justify-between transition"
              >
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-brand-400 bg-brand-500/10 px-3 py-1 rounded-full border border-brand-500/20">
                      {p.plan_type}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">{p.duration_days} Days</span>
                  </div>
                  <h3 className="text-xl font-bold text-white">{p.name}</h3>
                  <div className="mt-4 mb-6">
                    <span className="text-3xl font-black text-white">{formatCurrency(p.price)}</span>
                    <span className="text-xs text-slate-400 ml-1">/ package</span>
                  </div>
                  <p className="text-xs text-slate-400 mb-6 leading-relaxed">{p.description}</p>
                  <ul className="space-y-3 mb-8">
                    {benefits.map((b, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <Link
                  to={`/register?planId=${p.id}`}
                  className="w-full text-center py-3 px-4 rounded-xl font-bold text-sm bg-brand-500 hover:bg-brand-600 text-white transition shadow-md shadow-brand-500/20"
                >
                  Join This Plan
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. TRAINERS SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-500">Expert Coaching</span>
          <h2 className="text-3xl font-extrabold text-white">Meet Your RV Fitness Trainers</h2>
          <p className="text-sm text-slate-400">Passionate, certified instructors dedicated to your fitness transformation.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {trainers.map((t) => (
            <div key={t.id} className="p-6 rounded-3xl bg-dark-850 border border-slate-800 flex flex-col sm:flex-row gap-6 items-center">
              <img
                src={t.photo_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                alt={t.full_name}
                className="w-28 h-28 rounded-2xl object-cover border border-slate-700 shrink-0"
              />
              <div className="space-y-2 text-center sm:text-left">
                <span className="text-[11px] font-bold text-brand-400 uppercase tracking-wider">{t.experience_years} Years Experience</span>
                <h3 className="text-xl font-bold text-white">{t.full_name}</h3>
                <p className="text-xs text-slate-300 font-semibold">{t.specialization}</p>
                <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">{t.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. LOCATION & HOURS CTA BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-dark-800 via-dark-850 to-dark-800 border border-slate-700 relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center relative z-10">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-brand-400 uppercase tracking-widest">
                <MapPin className="w-4 h-4" />
                <span>Visit Us in Narsobawadi</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Ready to Start Your Transformation Journey?
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                Step inside RV Fitness Narsobawadi today. Experience our equipment, meet coach Vikram & coach Sneha, and get a tailored fitness evaluation.
              </p>
              <div className="pt-2 flex flex-wrap gap-4">
                <Link
                  to="/contact"
                  className="px-6 py-3 rounded-xl font-bold text-sm bg-brand-500 hover:bg-brand-600 text-white shadow-lg transition"
                >
                  Get Directions & Contact
                </Link>
                <Link
                  to="/status"
                  className="px-6 py-3 rounded-xl font-semibold text-sm bg-dark-700 hover:bg-slate-700 text-slate-200 transition"
                >
                  Check Live Shifts
                </Link>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-dark-900/80 border border-slate-700/60 space-y-4 text-xs">
              <h4 className="font-bold text-sm text-white uppercase tracking-wider">Facility Address</h4>
              <p className="text-slate-300 leading-relaxed">
                Main Bazaar Road, Near Narsimha Mandir, Narsobawadi, Dist. Kolhapur, Maharashtra 416104
              </p>
              <div className="border-t border-slate-800 pt-3 space-y-2">
                <div className="flex justify-between text-slate-300">
                  <span>Morning Shift:</span>
                  <span className="font-semibold text-white">05:30 AM – 10:00 AM</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Evening Shift:</span>
                  <span className="font-semibold text-white">05:00 PM – 10:00 PM</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Sunday Recovery:</span>
                  <span className="font-semibold text-amber-400">06:00 AM – 10:00 AM</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
