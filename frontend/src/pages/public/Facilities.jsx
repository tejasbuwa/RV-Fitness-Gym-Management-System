import React from 'react';
import { Dumbbell, Activity, Flame, Shield, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Facilities() {
  const facilityList = [
    {
      id: 'free-weights',
      title: 'Olympic Free Weights & Strength Arena',
      subtitle: 'Heavy Powerlifting & Bodybuilding Compound Zone',
      desc: 'Engineered for serious lifters. Includes calibrated Olympic barbells, heavy-duty squat racks with safety catches, flat/incline competition benches, and solid rubber hex dumbbells up to 50kg.',
      img: '/images/gym/facility_weights.jpg',
      features: [
        'Competition-spec Olympic Barbells & Bumper Plates',
        'Dumbbell Racks with Pairs from 2.5kg to 50kg',
        '3 Heavy Duty Power Racks with Pull-Up Grips',
        'Shock-absorbent high-density rubber gym flooring'
      ]
    },
    {
      id: 'cardio',
      title: 'Digital Cardio & Fat-Loss Matrix',
      subtitle: 'Advanced Aerobic Conditioning Zone',
      desc: 'Top-of-the-line commercial cardiovascular machines equipped with digital heart rate monitors, programmable interval training, and ergonomic impact reduction.',
      img: '/images/gym/facility_cardio.jpg',
      features: [
        'Commercial Motorized & Curved Treadmills',
        'High-Intensity Spin Bikes & Recumbent Cycles',
        'Elliptical Cross Trainers with incline variance',
        'Stair Climber Stepmill for high caloric burn'
      ]
    },
    {
      id: 'crossfit',
      title: 'CrossFit & Functional Agility Turf',
      subtitle: 'Dynamic Conditioning & Calisthenics Zone',
      desc: 'Dedicated functional turf section built for athletic agility, HIIT conditioning, battle rope endurance, and calisthenic bodyweight strength.',
      img: '/images/gym/facility_crossfit.jpg',
      features: [
        'Heavy Battle Ropes & Suspension Ring Straps',
        'Cast Iron Competition Kettlebells (4kg to 32kg)',
        'Multi-height Plyometric Jump Boxes',
        'Weight Sled & Sprint Turf Track'
      ]
    },
    {
      id: 'machines',
      title: 'Pin & Plate-Loaded Machine Circuit',
      subtitle: 'Biomechanical Hypertrophy Isolation',
      desc: 'Target every muscle group with optimal leverage and zero tendon strain. Featuring dual adjustable cable crossovers, leg press, lat pulldowns, seated rows, and pec decks.',
      img: '/images/gym/facility_machines.jpg',
      features: [
        'Dual Adjustable Cable Crossover Tower',
        '45-Degree Plate-Loaded Leg Press & Hack Squat',
        'Seated Cable Rows, Lat Pulldowns & High Rows',
        'Isolateral Chest & Shoulder Press Stations'
      ]
    },
    {
      id: 'lockers',
      title: 'Luxury Private Lockers & Shower Suites',
      subtitle: 'Hygienic Post-Workout Comfort',
      desc: 'Cleanliness and member privacy are paramount. Enjoy individual security lockers, daily sanitized changing rooms, and pressurized hot/cold shower cubicles.',
      img: '/images/gym/facility_lockers.jpg',
      features: [
        'Secure Personal Lockers with key/combination tags',
        'Continuous sanitation and air purification',
        'Separate changing cubicles for Men and Women',
        'Fresh water dispensers & grooming vanity mirrors'
      ]
    },
    {
      id: 'recovery',
      title: 'Recovery, Core & Mobility Studio',
      subtitle: 'Warmup, Post-Workout Stretching & Flexibility',
      desc: 'Dedicated quiet studio for pre-workout dynamic mobility, core abdominal circuits, foam rolling, and post-workout static decompression.',
      img: '/images/gym/facility_yoga.jpg',
      features: [
        'High-density yoga and stretching mats',
        'Full set of foam rollers and trigger-point balls',
        'Resistance bands & mobility mobility dowels',
        'Abdominal roller wheels and Roman chairs'
      ]
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-20 bg-[#0a0a0a] text-zinc-100">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-[0.25em] text-amber-400 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30">
          World-Class Standards
        </span>
        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight">
          PREMIUM GYM FACILITIES & <br />
          <span className="text-gold-gradient">ADVANCED EQUIPMENT</span>
        </h1>
        <p className="text-base sm:text-lg text-zinc-300 font-normal leading-relaxed">
          Every zone of <strong className="text-amber-400">RV Fitness Narsobawadi</strong> is designed with precision to offer safety, peak performance, and an unmatched training atmosphere.
        </p>
      </div>

      {/* Facilities Alternating Showcase */}
      <div className="space-y-16">
        {facilityList.map((facility, index) => {
          const isEven = index % 2 === 0;
          return (
            <div
              key={facility.id}
              className="glass-gold rounded-3xl overflow-hidden p-6 sm:p-10 border border-amber-500/20 hover:border-amber-500/40 transition duration-300"
            >
              <div className={`grid grid-cols-1 lg:grid-cols-12 gap-10 items-center`}>
                {/* Visual Column */}
                <div className={`lg:col-span-6 relative group ${isEven ? 'lg:order-1' : 'lg:order-2'}`}>
                  <div className="relative rounded-2xl overflow-hidden border border-amber-500/30 shadow-2xl">
                    <img
                      src={facility.img}
                      alt={facility.title}
                      className="w-full h-[360px] object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                    <span className="absolute bottom-4 left-4 px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-amber-500/40 text-xs font-bold text-amber-400">
                      Narsobawadi Facility
                    </span>
                  </div>
                </div>

                {/* Content Column */}
                <div className={`lg:col-span-6 space-y-5 ${isEven ? 'lg:order-2' : 'lg:order-1'}`}>
                  <span className="text-xs uppercase font-bold tracking-widest text-amber-400">
                    {facility.subtitle}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black text-white">
                    {facility.title}
                  </h2>
                  <p className="text-sm text-zinc-300 leading-relaxed">
                    {facility.desc}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    {facility.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-2.5 text-xs text-zinc-300">
                        <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom CTA */}
      <div className="p-10 rounded-3xl bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 border border-amber-500/30 text-center space-y-5">
        <h3 className="text-2xl sm:text-4xl font-black text-white">
          Ready to Train with the Best Equipment in Town?
        </h3>
        <p className="text-sm text-zinc-400 max-w-xl mx-auto">
          Sign up today and experience the energy of RV Fitness Narsobawadi firsthand.
        </p>
        <div className="flex flex-wrap justify-center gap-4 pt-2">
          <Link to="/register" className="btn-gold px-8 py-3.5 rounded-xl font-bold text-sm">
            Start Your Membership
          </Link>
          <Link to="/plans" className="btn-gold-outline px-6 py-3.5 rounded-xl font-bold text-sm">
            View Membership Plans
          </Link>
        </div>
      </div>
    </div>
  );
}
