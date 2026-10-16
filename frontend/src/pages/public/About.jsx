import React from 'react';
import { ShieldCheck, Dumbbell, Target, HeartHandshake, Award, Sparkles, CheckCircle2, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function About() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-24 bg-[#0a0a0a] text-zinc-100">
      {/* 1. Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-[0.25em] text-amber-400 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30">
          About RV Fitness
        </span>
        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight">
          FORGED IN NARSOBAWADI. <br />
          <span className="text-gold-gradient">BUILT FOR REAL RESULTS.</span>
        </h1>
        <p className="text-base sm:text-lg text-zinc-300 leading-relaxed font-normal">
          RV Fitness was established with a singular mission: bringing elite, commercial-grade fitness training, science-backed biomechanical equipment, and certified nutrition coaching to the Narsobawadi community.
        </p>
      </div>

      {/* 2. Story & Facility Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="relative group">
          <div className="absolute -inset-1 rounded-3xl bg-amber-500/20 blur-lg group-hover:bg-amber-500/30 transition"></div>
          <div className="relative rounded-3xl overflow-hidden border border-amber-500/40 shadow-2xl bg-zinc-900">
            <img
              src="/images/gym/about_interior.jpg"
              alt="RV Fitness Gym Arena Narsobawadi"
              className="w-full h-[450px] object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent"></div>
            <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-black/85 backdrop-blur-md border border-amber-500/30 text-xs text-zinc-300 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-400" />
                <span className="font-semibold text-white">Main Bazaar Road, Narsobawadi</span>
              </div>
              <span className="text-amber-400 font-bold uppercase tracking-wider text-[11px]">Est. 2026</span>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <span className="text-amber-400 text-xs uppercase tracking-widest font-bold">Our Philosophy</span>
          <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight">
            CONSISTENCY, FORM & DISCIPLINE OVER EGO LIFTING.
          </h2>
          <p className="text-zinc-300 leading-relaxed">
            Whether you are stepping into a gym for the very first time or you are a seasoned lifter preparing for state-level bodybuilding, RV Fitness provides an empowering, respectful atmosphere focused on longevity and injury-free strength progression.
          </p>

          <div className="space-y-4 pt-2">
            <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800/80 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                <Target className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Individualized Goal Architecture</h4>
                <p className="text-xs text-zinc-400 mt-1">Every member receives a tailored workout split and progressive overload monitoring recorded directly in their digital portal.</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800/80 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                <ShieldCheck className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Bio-Mechanical Safety & Ergonomics</h4>
                <p className="text-xs text-zinc-400 mt-1">Our machines follow anatomical motion arcs, reducing joint stress while maximizing peak muscular tension and safety.</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800/80 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                <HeartHandshake className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">The Narsobawadi Fitness Family</h4>
                <p className="text-xs text-zinc-400 mt-1">A vibrant community of mutual encouragement, local athlete transformation stories, and disciplined progress.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Core Pillars in Black & Gold */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="glass-gold p-8 rounded-3xl space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-600 flex items-center justify-center text-black font-black">
            <Dumbbell className="w-6 h-6 text-black" />
          </div>
          <h3 className="text-xl font-bold text-white">1. Modern Equipment</h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            High-precision cable crossover stations, calibrated Olympic bumper plates, multi-grip pull-up rigs, and heavy dumbbells for all fitness stages.
          </p>
        </div>

        <div className="glass-gold p-8 rounded-3xl space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-600 flex items-center justify-center text-black font-black">
            <Award className="w-6 h-6 text-black" />
          </div>
          <h3 className="text-xl font-bold text-white">2. Certified Mentorship</h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Coaches with formal certifications in exercise physiology, sports injury prevention, and clinical macronutrient diet design.
          </p>
        </div>

        <div className="glass-gold p-8 rounded-3xl space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-600 flex items-center justify-center text-black font-black">
            <Sparkles className="w-6 h-6 text-black" />
          </div>
          <h3 className="text-xl font-bold text-white">3. Digital Management</h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Instant digital receipts, live attendance status, weekly workout assignments, and interactive weight progress charts all in one seamless portal.
          </p>
        </div>
      </div>

      {/* 4. Action Banner */}
      <div className="p-10 rounded-3xl bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 border border-amber-500/30 text-center space-y-4">
        <h3 className="text-2xl sm:text-3xl font-black text-white">
          Experience the RV Fitness Difference in Person
        </h3>
        <p className="text-sm text-zinc-400 max-w-xl mx-auto">
          Visit our facility at Narsobawadi today. Morning and evening tours available with our senior trainers.
        </p>
        <div className="pt-2 flex flex-wrap justify-center gap-4">
          <Link to="/register" className="btn-gold px-8 py-3 rounded-xl text-sm font-bold">
            Become a Member
          </Link>
          <Link to="/contact" className="btn-gold-outline px-6 py-3 rounded-xl text-sm font-bold">
            Get Directions to Narsobawadi
          </Link>
        </div>
      </div>
    </div>
  );
}
