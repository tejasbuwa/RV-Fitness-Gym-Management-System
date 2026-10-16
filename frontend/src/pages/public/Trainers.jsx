import React, { useState, useEffect } from 'react';
import { Award, Dumbbell, Star, CheckCircle2, Phone, Mail, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

export default function Trainers() {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Local fallback high-res photos
  const trainerPhotos = {
    'Vikram Patil': '/images/gym/trainer_vikram.jpg',
    'Sneha Kulkarni': '/images/gym/trainer_sneha.jpg',
  };

  useEffect(() => {
    api.get('/trainers')
      .then((res) => {
        if (res.data.success) {
          setTrainers(res.data.trainers);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-20 bg-[#0a0a0a] text-zinc-100">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-[0.25em] text-amber-400 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30">
          Elite Coaching Staff
        </span>
        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight">
          MEET OUR CERTIFIED <br />
          <span className="text-gold-gradient">FITNESS MENTORS</span>
        </h1>
        <p className="text-base sm:text-lg text-zinc-300 font-normal leading-relaxed">
          At RV Fitness Narsobawadi, our trainers combine science, biomechanics, and discipline to guarantee steady and injury-free transformations.
        </p>
      </div>

      {/* Trainers Showcase Cards */}
      {loading ? (
        <div className="py-20 text-center text-zinc-400">Loading coaching staff...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {trainers.map((trainer) => {
            const photoSrc = trainer.photo_url || trainerPhotos[trainer.full_name] || '/images/gym/trainer_vikram.jpg';
            return (
              <div
                key={trainer.id}
                className="glass-gold rounded-3xl overflow-hidden group hover:-translate-y-2 transition-all duration-300 border border-amber-500/20 hover:border-amber-500/50"
              >
                <div className="relative h-80 overflow-hidden">
                  <img
                    src={photoSrc}
                    alt={trainer.full_name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>

                  {/* Experience Badge */}
                  <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-black/85 backdrop-blur-md border border-amber-500/40 text-amber-300 text-xs font-bold flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span>{trainer.experience_years}+ Years Experience</span>
                  </div>

                  {/* Name overlay */}
                  <div className="absolute bottom-4 left-6 right-6">
                    <span className="text-[11px] uppercase font-bold tracking-wider text-amber-400 block">
                      Certified Coach
                    </span>
                    <h3 className="text-2xl font-black text-white">{trainer.full_name}</h3>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div className="p-3 rounded-xl bg-zinc-950/80 border border-zinc-900">
                    <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Specialization</p>
                    <p className="text-sm font-semibold text-amber-300 mt-0.5">{trainer.specialization}</p>
                  </div>

                  <p className="text-xs text-zinc-400 leading-relaxed min-h-[48px]">
                    {trainer.bio || 'Dedicated strength and fitness coach with extensive practical background guiding members in Narsobawadi to reach their peak physical fitness.'}
                  </p>

                  <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-400">
                    <div className="flex items-center gap-2 text-zinc-300">
                      <Phone className="w-3.5 h-3.5 text-amber-400" />
                      <span>{trainer.phone}</span>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-semibold text-[11px]">
                      Active Roster
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Coaching Standards Banner */}
      <div className="p-10 rounded-3xl bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 border border-amber-500/30">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
          <div className="space-y-2">
            <h4 className="text-lg font-bold text-white flex items-center justify-center md:justify-start gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              <span>Certified Mentorship</span>
            </h4>
            <p className="text-xs text-zinc-400">
              Coaches hold recognized national and international fitness certifications in strength conditioning and nutrition.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="text-lg font-bold text-white flex items-center justify-center md:justify-start gap-2">
              <Dumbbell className="w-5 h-5 text-amber-400" />
              <span>Form & Posture Correction</span>
            </h4>
            <p className="text-xs text-zinc-400">
              Zero tolerance for sloppy mechanics. We focus on bio-mechanical alignment to keep your spine, shoulders, and knees safe.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="text-lg font-bold text-white flex items-center justify-center md:justify-start gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span>Direct Mobile Access</span>
            </h4>
            <p className="text-xs text-zinc-400">
              Your assigned trainer updates your weekly routine and answers nutrition queries directly via your RV Fitness Member Dashboard.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
