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
  Sparkles,
  Zap,
  Target,
  Trophy,
  ZoomIn,
  X
} from 'lucide-react';
import api from '../../services/api';
import { formatCurrency } from '../../utils/formatters';
import GymLocationMap from '../../components/common/GymLocationMap';

export default function Home() {
  const [plans, setPlans] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [gymStatus, setGymStatus] = useState(null);
  const [lightboxImage, setLightboxImage] = useState(null);

  useEffect(() => {
    api.get('/membership-plans?status=active')
      .then((res) => {
        if (res.data.success && res.data.plans) {
          setPlans(res.data.plans.slice(0, 3));
        }
      })
      .catch(() => {});

    api.get('/trainers')
      .then((res) => {
        if (res.data.success && res.data.trainers) {
          setTrainers(res.data.trainers.slice(0, 3));
        }
      })
      .catch(() => {});

    api.get('/gym-status')
      .then((res) => {
        if (res.data.success) {
          setGymStatus(res.data.status);
        }
      })
      .catch(() => {});
  }, []);

  const facilityHighlights = [
    {
      title: 'Heavy Strength & Olympic Free Weights',
      desc: 'Olympic barbells, custom calibrated plates, and dumbbells ranging up to 50kg.',
      img: '/images/gym/facility_weights.jpg',
      tag: 'Strength Arena'
    },
    {
      title: 'Advanced Digital Cardio Matrix',
      desc: 'Commercial curved treadmills, spin cycles, and elliptical trainers with heart-rate telemetry.',
      img: '/images/gym/facility_cardio.jpg',
      tag: 'Cardio Studio'
    },
    {
      title: 'CrossFit & Functional Sprint Turf',
      desc: 'Dedicated agility turf, battle ropes, plyometric boxes, and kettlebells.',
      img: '/images/gym/facility_crossfit.jpg',
      tag: 'Functional Zone'
    },
    {
      title: 'Luxury Amenities & Private Lockers',
      desc: 'Hygienic private changing suites, secure lockers, and refreshing shower stations.',
      img: '/images/gym/facility_lockers.jpg',
      tag: 'Amenities'
    }
  ];

  const championPhotos = [
    {
      img: '/images/client/rv-gym-warrior-pose.jpg',
      title: 'Warrior Silhouette & Focus',
      tag: 'Dedication',
      categoryLabel: 'Champions & Athletes',
      desc: 'Artistic athletic silhouette highlighting focus, poise, and warrior discipline.'
    },
    {
      img: '/images/client/rv-gym-front-biceps-warrior.jpg',
      title: 'Front Double Biceps Definition',
      tag: 'Hypertrophy',
      categoryLabel: 'Champions & Athletes',
      desc: 'Biceps peak and quad conditioning in front of the RV Fitness warrior mantra.'
    },
    {
      img: '/images/client/rv-gym-side-chest-pose.jpg',
      title: 'Side Chest & Vascular Peak',
      tag: 'Conditioning',
      categoryLabel: 'Champions & Athletes',
      desc: 'Exceptional side chest mass, striations, and peak vascularity in training floor.'
    },
    {
      img: '/images/client/rv-gym-branding-back-pose.jpg',
      title: 'RV Fitness Arena - Back Lat Spread',
      tag: 'Branding & Power',
      categoryLabel: 'Champions & Athletes',
      desc: 'Superior lat width and tricep pose set against the official RV Fitness wall.'
    },
    {
      img: '/images/client/rv-gym-physique-monochrome.jpg',
      title: 'Classic Aesthetic Physique',
      tag: 'Aesthetics',
      categoryLabel: 'Champions & Athletes',
      desc: 'Monochrome artistic portrait showcasing classical muscular balance and symmetry.'
    }
  ];

  return (
    <div className="space-y-28 pb-24 text-zinc-100 bg-[#0a0a0a]">
      {/* 1. HERO SECTION WITH REAL CLIENT BODYBUILDER & GOLD ACCENTS */}
      <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden pt-12 pb-20">
        {/* Background Gym Image with Cinematic Dark Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/gym/hero_bg.jpg"
            alt="RV Fitness Gym Narsobawadi"
            className="w-full h-full object-cover object-center scale-105 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/85 to-black/80"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.08)_0%,transparent_70%)]"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-7 text-center lg:text-left">
              {/* Location & Brand Pill */}
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-zinc-900/90 border border-amber-500/30 text-xs font-semibold text-zinc-300 shadow-[0_0_20px_rgba(212,175,55,0.15)]">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse"></span>
                <span className="text-amber-300 uppercase tracking-wider font-bold">Narsobawadi’s Premier Fitness Destination</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.08] font-sans">
                BUILD YOUR <br />
                <span className="text-gold-gradient drop-shadow-[0_2px_15px_rgba(212,175,55,0.3)]">STRONGER SELF</span>.
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-zinc-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Welcome to <strong className="text-amber-400 font-semibold">RV FITNESS Narsobawadi</strong>. Experience state-of-the-art bio-mechanical training machinery, certified elite coaches, and custom meal planning tailored for serious transformations.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to="/register"
                  className="btn-gold w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl text-base tracking-wide"
                >
                  <Sparkles className="w-5 h-5 text-black" />
                  <span>Join Now</span>
                  <ArrowRight className="w-5 h-5 text-black" />
                </Link>

                <Link
                  to="/plans"
                  className="btn-gold-outline w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl text-base"
                >
                  <span>Explore Programs</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Real-time Status Card & Trust Statistics */}
              <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-zinc-800/80 text-left">
                <div className="p-3.5 rounded-xl bg-zinc-950/70 border border-zinc-800">
                  <p className="text-2xl sm:text-3xl font-black text-amber-400">500+</p>
                  <p className="text-xs text-zinc-400 font-medium">Active Members</p>
                </div>
                <div className="p-3.5 rounded-xl bg-zinc-950/70 border border-zinc-800">
                  <p className="text-2xl sm:text-3xl font-black text-white">100%</p>
                  <p className="text-xs text-zinc-400 font-medium">Certified Coaches</p>
                </div>
                <div className="p-3.5 rounded-xl bg-zinc-950/70 border border-zinc-800">
                  <p className="text-2xl sm:text-3xl font-black text-amber-400">2 Shifts</p>
                  <p className="text-xs text-zinc-400 font-medium">Morning & Evening</p>
                </div>
                <div className="p-3.5 rounded-xl bg-zinc-950/70 border border-zinc-800">
                  <p className="text-2xl sm:text-3xl font-black text-white">#1</p>
                  <p className="text-xs text-zinc-400 font-medium">In Narsobawadi</p>
                </div>
              </div>
            </div>

            {/* Right Hero Visual Feature with Real Client Bodybuilder Photo */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Golden ambient glow */}
                <div className="absolute -inset-2 rounded-3xl bg-gradient-to-r from-amber-500/20 via-yellow-500/30 to-amber-600/20 blur-xl opacity-75"></div>

                <div
                  className="relative rounded-3xl overflow-hidden border border-amber-500/40 shadow-2xl bg-zinc-900 group cursor-pointer"
                  onClick={() => setLightboxImage({
                    img: '/images/client/rv-gym-hero-bodybuilder.jpg',
                    title: 'Championship Front Double Biceps Pose',
                    categoryLabel: 'Championship Athlete',
                    desc: 'Elite athlete physique and front double biceps conditioning photographed inside RV Fitness Narsobawadi.'
                  })}
                >
                  <img
                    src="/images/client/rv-gym-hero-bodybuilder.jpg"
                    alt="RV Fitness Elite Athlete Training - Build Your Stronger Self"
                    className="w-full h-[500px] object-cover object-top sm:object-center group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-transparent"></div>

                  {/* Overlaid Floating Badge */}
                  <div className="absolute bottom-5 left-5 right-5 p-4 rounded-2xl bg-black/85 backdrop-blur-md border border-amber-500/30 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-yellow-600 flex items-center justify-center text-black font-bold">
                        <Trophy className="w-5 h-5 text-black" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">Championship Bodybuilding</p>
                        <p className="text-xs text-amber-400/90 font-medium">Strength & Conditioning Mentorship</p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 font-bold text-[11px] border border-amber-500/40">
                      Unisex
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. ABOUT RV FITNESS NARSOBAWADI WITH OFFICIAL BRANDING PHOTO */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 relative">
            <div
              className="relative rounded-3xl overflow-hidden border border-amber-500/30 shadow-2xl group cursor-pointer"
              onClick={() => setLightboxImage({
                img: '/images/client/rv-gym-branding-squat-biceps.jpg',
                title: 'Official RV Fitness Arena & Wall Logo',
                categoryLabel: 'Our Gym & Branding',
                desc: 'Athlete squat bicep pose showcasing the training floor and official RV FITNESS wall logo in Narsobawadi.'
              })}
            >
              <img
                src="/images/client/rv-gym-branding-squat-biceps.jpg"
                alt="RV Fitness Training Floor and Wall Branding"
                className="w-full h-[460px] object-cover object-top group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-zinc-950/85 backdrop-blur-md border border-zinc-800 text-xs text-zinc-300 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-amber-400" />
                  <span>Narsobawadi, Near Narsimha Mandir</span>
                </div>
                <span className="text-amber-400 font-bold">Official RV Fitness Arena</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-xs font-bold text-amber-400 uppercase tracking-widest">
              About RV Fitness
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight">
              A LEGACY OF DISCIPLINE, <br />
              <span className="text-gold-gradient">COMMUNITY & POWER.</span>
            </h2>

            <p className="text-zinc-300 leading-relaxed">
              Founded in Narsobawadi, <strong className="text-white">RV Fitness</strong> was established to bring international-standard fitness infrastructure, scientific workout methodology, and goal-oriented coaching to the local fitness community.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-zinc-950/70 border border-zinc-800/80 space-y-2">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                  <CheckCircle2 className="w-4 h-4 text-amber-400" />
                  <span>Custom Workout Routines</span>
                </div>
                <p className="text-xs text-zinc-400">Day-by-day customized training charts assigned directly to your mobile portal.</p>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-950/70 border border-zinc-800/80 space-y-2">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                  <CheckCircle2 className="w-4 h-4 text-amber-400" />
                  <span>Clinical Nutrition Plans</span>
                </div>
                <p className="text-xs text-zinc-400">Macro-balanced dietary schedules crafted by certified sports nutritionists.</p>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-950/70 border border-zinc-800/80 space-y-2">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                  <CheckCircle2 className="w-4 h-4 text-amber-400" />
                  <span>Biometric Progress Tracking</span>
                </div>
                <p className="text-xs text-zinc-400">Periodic weight, body measurement, and BMI analytics recorded in real-time.</p>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-950/70 border border-zinc-800/80 space-y-2">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                  <CheckCircle2 className="w-4 h-4 text-amber-400" />
                  <span>Printable Official Invoices</span>
                </div>
                <p className="text-xs text-zinc-400">Instant digital and printable receipts for every membership transaction.</p>
              </div>
            </div>

            <div className="pt-4">
              <Link
                to="/about"
                className="btn-gold-outline inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold"
              >
                <span>Read Full Gym Story</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. ACHIEVEMENTS & CHAMPIONSHIP AWARDS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden border border-amber-500/40 p-8 sm:p-12 lg:p-16 bg-gradient-to-b from-zinc-950 via-[#111111] to-black shadow-2xl">
          {/* Subtle Ambient Gold Radiance */}
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center relative z-10">
            {/* Left Trophy Image Feature */}
            <div className="lg:col-span-6 relative group">
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-amber-500/30 to-yellow-500/30 blur-lg group-hover:opacity-100 opacity-70 transition duration-500"></div>
              <div className="relative rounded-3xl overflow-hidden border-2 border-amber-500/50 shadow-[0_0_35px_rgba(212,175,55,0.2)] bg-black">
                <img
                  src="/images/client/rv-gym-trophy-awards.jpg"
                  alt="RV Fitness Championship Trophies and Silver Gada"
                  className="w-full h-[460px] object-cover object-center group-hover:scale-105 transition-transform duration-700 cursor-pointer"
                  onClick={() => setLightboxImage({
                    img: '/images/client/rv-gym-trophy-awards.jpg',
                    title: 'Championship Trophies & Silver Gada',
                    categoryLabel: 'Achievements & Awards',
                    desc: 'Official trophies, championship cups, and the sacred silver gada earned by RV Fitness athletes in competitive bodybuilding.'
                  })}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent"></div>

                {/* Overlay Badge */}
                <div className="absolute bottom-5 left-5 right-5 p-4 rounded-2xl bg-black/80 backdrop-blur-md border border-amber-500/30 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-yellow-600 flex items-center justify-center text-black font-bold">
                      <Trophy className="w-5 h-5 text-black" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">Championship Honors</p>
                      <p className="text-xs text-amber-400">Trophies & Traditional Silver Gada</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setLightboxImage({
                      img: '/images/client/rv-gym-trophy-awards.jpg',
                      title: 'Championship Trophies & Silver Gada',
                      categoryLabel: 'Achievements & Awards',
                      desc: 'Official trophies, championship cups, and the sacred silver gada earned by RV Fitness athletes in competitive bodybuilding.'
                    })}
                    className="p-2 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 hover:text-white transition"
                    title="Enlarge Trophy Showcase"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Right Achievements Text & Highlights */}
            <div className="lg:col-span-6 space-y-6 text-left">
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-amber-400 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 inline-block">
                Achievements & Awards
              </span>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight">
                HONORS OF DEDICATION & <br />
                <span className="text-gold-gradient">ATHLETIC EXCELLENCE.</span>
              </h2>

              <p className="text-zinc-300 leading-relaxed text-sm sm:text-base">
                The championship cups, state-level awards, and sacred silver gada showcased at <strong className="text-amber-400 font-semibold">RV Fitness Narsobawadi</strong> are the hard-earned fruits of relentless discipline, strict nutritional adherence, and hundreds of hours spent under the iron.
              </p>

              <div className="space-y-4 pt-2">
                <div className="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800/80 flex items-start gap-4 hover:border-amber-500/40 transition">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                    <Trophy className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Championship Trophies & Honors</h4>
                    <p className="text-xs text-zinc-400 mt-1">Recognizing excellence in physique conditioning, stage posing, and competitive athletic preparation.</p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800/80 flex items-start gap-4 hover:border-amber-500/40 transition">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                    <Award className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Traditional Silver Gada of Strength</h4>
                    <p className="text-xs text-zinc-400 mt-1">A timeless symbol of raw physical power, indomitable spirit, and warrior perseverance.</p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800/80 flex items-start gap-4 hover:border-amber-500/40 transition">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                    <Flame className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Inspiring Every Member's Journey</h4>
                    <p className="text-xs text-zinc-400 mt-1">Every trophy on our desk stands as proof that with the right coaching and determination, extraordinary transformations are achieved.</p>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  to="/gallery"
                  className="btn-gold-outline inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold"
                >
                  <span>Explore Achievements in Gallery</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FACILITIES & EQUIPMENT GRID WITH HIGH-RES IMAGES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-amber-400 font-bold text-xs uppercase tracking-[0.25em] px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30">
            World-Class Amenities
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            EQUIPMENT DESIGNED FOR <span className="text-gold-gradient">CHAMPIONS</span>
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base">
            Every section of RV Fitness Narsobawadi is equipped with commercial-grade fitness machines tailored for strength, hypertrophy, and functional endurance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {facilityHighlights.map((facility, index) => (
            <div
              key={index}
              className="glass-gold rounded-2xl overflow-hidden group hover:-translate-y-1.5 transition-all duration-300"
            >
              <div className="relative h-56 overflow-hidden">
                <img
                  src={facility.img}
                  alt={facility.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
                <span className="absolute top-3.5 right-3.5 px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-amber-500/40 text-[11px] font-bold text-amber-400">
                  {facility.tag}
                </span>
              </div>
              <div className="p-5 space-y-2.5">
                <h3 className="font-bold text-lg text-white group-hover:text-amber-300 transition">
                  {facility.title}
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  {facility.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            to="/facilities"
            className="btn-gold-outline inline-flex items-center gap-2 px-7 py-3 rounded-xl text-sm font-bold"
          >
            <span>View All Gym Facilities & Zones</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* 4. MEMBERSHIP PLANS WITH LUXURY BLACK & GOLD CARDS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-amber-400 font-bold text-xs uppercase tracking-[0.25em] px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30">
            Transparent Pricing
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            MEMBERSHIP PACKAGES AT <span className="text-gold-gradient">RV FITNESS</span>
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base">
            Choose a plan that fits your transformation timeline. All plans include full floor access, trainer guidance, and digital telemetry tracking.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan, index) => {
            const isFeatured = index === 1; // Highlight middle plan (Quarterly Pro)
            let benefitsList = [];
            try {
              benefitsList = typeof plan.benefits === 'string' ? JSON.parse(plan.benefits) : (plan.benefits || []);
            } catch (e) {
              benefitsList = ['Full Gym Access', 'General Trainer Guidance', 'Locker Facility'];
            }

            return (
              <div
                key={plan.id}
                className={`relative rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 ${
                  isFeatured
                    ? 'bg-gradient-to-b from-zinc-900 via-zinc-950 to-black border-2 border-amber-500 shadow-[0_0_35px_rgba(234,179,8,0.25)] md:-translate-y-2'
                    : 'glass-gold bg-zinc-950/70 border border-zinc-800'
                }`}
              >
                {isFeatured && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-amber-400 to-yellow-600 text-black font-extrabold text-xs uppercase tracking-wider shadow-lg">
                    Most Popular Choice
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs uppercase font-bold tracking-widest text-amber-400">
                      {plan.plan_type} Package
                    </span>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-zinc-800 text-zinc-300">
                      {plan.duration_days} Days
                    </span>
                  </div>

                  <h3 className="text-2xl font-black text-white mb-2">{plan.name}</h3>
                  <p className="text-xs text-zinc-400 mb-6 leading-relaxed">{plan.description}</p>

                  <div className="mb-6 pb-6 border-b border-zinc-800">
                    <span className="text-4xl font-black text-white">
                      {formatCurrency(plan.price)}
                    </span>
                    <span className="text-xs text-zinc-500 ml-2">/ duration</span>
                  </div>

                  <div className="space-y-3 mb-8">
                    <p className="text-xs font-bold uppercase tracking-wider text-zinc-300">Included Privileges:</p>
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
                      ? 'btn-gold'
                      : 'btn-gold-outline'
                  }`}
                >
                  Join with {plan.name}
                </Link>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <Link
            to="/plans"
            className="text-amber-400 hover:text-amber-300 font-semibold text-sm inline-flex items-center gap-1.5"
          >
            <span>Compare all membership tiers and features</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* 5. CHAMPIONS SHOWCASE & FITNESS GALLERY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
          <span className="text-amber-400 font-bold text-xs uppercase tracking-[0.25em] px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30">
            Champion's Showcase
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            FORGED BY DISCIPLINE: <span className="text-gold-gradient">ATHLETE GALLERY</span>
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base">
            Real conditioning, muscular aesthetics, and stage-ready dedication photographed inside RV Fitness Narsobawadi.
          </p>
        </div>

        {/* Responsive Grid with Lightbox Trigger */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {championPhotos.map((item, index) => (
            <div
              key={index}
              onClick={() => setLightboxImage(item)}
              className="group relative rounded-3xl overflow-hidden cursor-pointer border border-amber-500/25 hover:border-amber-500/70 transition-all duration-300 shadow-xl bg-zinc-950 hover:-translate-y-1.5"
            >
              <div className="h-80 sm:h-96 overflow-hidden">
                <img
                  src={item.img}
                  alt={item.title}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-85 group-hover:opacity-95 transition-opacity"></div>

              <div className="absolute inset-0 p-5 flex flex-col justify-between">
                <div className="flex justify-between items-center">
                  <span className="px-2.5 py-1 rounded-full bg-black/85 backdrop-blur-md border border-amber-500/40 text-[10px] uppercase font-bold text-amber-400">
                    {item.tag}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300 opacity-0 group-hover:opacity-100 transition duration-300">
                    <ZoomIn className="w-4 h-4" />
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition">
                    {item.title}
                  </h3>
                  <p className="text-[11px] text-zinc-300 mt-1 line-clamp-2">
                    {item.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            to="/gallery"
            className="btn-gold inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-sm font-bold shadow-gold-glow"
          >
            <span>View Full Photo & Trophy Gallery</span>
            <ArrowRight className="w-4 h-4 text-black" />
          </Link>
        </div>
      </section>

      {/* 6. TRAINERS SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-amber-400 font-bold text-xs uppercase tracking-[0.25em] px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30">
            Expert Coaching
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            MEET OUR CERTIFIED <span className="text-gold-gradient">COACHES</span>
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base">
            Train under certified fitness mentors with extensive track records in competitive bodybuilding, weight loss, and athletic conditioning.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {trainers.map((trainer) => (
            <div
              key={trainer.id}
              className="glass-gold rounded-3xl overflow-hidden group hover:-translate-y-1.5 transition-all duration-300"
            >
              <div className="relative h-72 overflow-hidden">
                <img
                  src={trainer.photo_url || '/images/gym/trainer_vikram.jpg'}
                  alt={trainer.full_name}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/images/gym/trainer_equipment_barbell.jpg';
                  }}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
                <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold">
                  {trainer.experience_years}+ Years Experience
                </div>
              </div>
              <div className="p-6 space-y-3">
                <div>
                  <h3 className="text-xl font-bold text-white">{trainer.full_name}</h3>
                  <p className="text-xs font-semibold text-amber-400">{trainer.specialization}</p>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed line-clamp-2">
                  {trainer.bio || 'Certified fitness specialist dedicated to helping members achieve their peak physical conditioning in Narsobawadi.'}
                </p>
                <div className="pt-2 flex items-center justify-between text-xs text-zinc-400 border-t border-zinc-800/80">
                  <span>Available in Narsobawadi</span>
                  <span className="text-amber-400 font-semibold">Active Coach</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            to="/trainers"
            className="btn-gold-outline inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold"
          >
            <span>View All Trainers & Coaching Specialties</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* 7. VISIT OUR GYM / GOOGLE MAPS LOCATION SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
          <span className="text-amber-400 font-bold text-xs uppercase tracking-[0.25em] px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 inline-flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5" />
            <span>Visit Our Gym</span>
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            FIND YOUR <span className="text-gold-gradient">FITNESS DESTINATION</span>
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
            Centrally situated in Narsobawadi with direct road access, spacious parking, and morning & evening training shifts. Explore our interactive location below.
          </p>
        </div>

        <GymLocationMap variant="full" />
      </section>

      {/* 8. CALL TO ACTION BANNER WITH LOCAL HIGH-RES GYM BACKGROUND */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden border border-amber-500/30 p-10 sm:p-16 text-center space-y-6">
          <img
            src="/images/gym/cta_bg.jpg"
            alt="RV Fitness Motivation"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/85 to-black/95"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.15)_0%,transparent_70%)]"></div>

          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <span className="px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-xs font-bold text-amber-300 uppercase tracking-widest">
              Ready To Transform?
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              YOUR JOURNEY BEGINS TODAY AT <br />
              <span className="text-gold-gradient">RV FITNESS NARSOBAWADI</span>
            </h2>
            <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">
              Step into the best shape of your life. Join now to receive an immediate permanent Member ID, customized workout split, and trainer consultation.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                to="/register"
                className="btn-gold w-full sm:w-auto px-8 py-4 rounded-xl text-base font-bold shadow-2xl"
              >
                Join RV Fitness Now
              </Link>
              <Link
                to="/contact"
                className="btn-gold-outline w-full sm:w-auto px-8 py-4 rounded-xl text-base font-bold"
              >
                Locate Gym in Narsobawadi
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Lightbox Modal for Full View */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md p-4 sm:p-8 flex items-center justify-center"
          onClick={() => setLightboxImage(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-zinc-950 border border-amber-500/40 rounded-3xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/70 text-zinc-300 hover:text-white border border-zinc-700 transition"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="max-h-[75vh] overflow-hidden bg-black flex items-center justify-center">
              <img
                src={lightboxImage.img}
                alt={lightboxImage.title}
                className="w-full h-full max-h-[75vh] object-contain mx-auto"
              />
            </div>
            <div className="p-6 bg-zinc-950 border-t border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs uppercase font-bold text-amber-400">
                  {lightboxImage.categoryLabel || 'RV Fitness Showcase'}
                </span>
                <h3 className="text-xl font-bold text-white mt-0.5">{lightboxImage.title}</h3>
                <p className="text-xs text-zinc-400 mt-1">{lightboxImage.desc}</p>
              </div>
              <span className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs font-bold text-amber-300 shrink-0">
                RV Fitness Narsobawadi
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
