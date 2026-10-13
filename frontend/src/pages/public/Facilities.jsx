import React from 'react';
import { Dumbbell, Flame, HeartPulse, Check, Sparkles, Wind, Shield } from 'lucide-react';

export default function Facilities() {
  const facilityList = [
    {
      title: 'Free Weight & Powerlifting Zone',
      desc: 'Olympic standard 20kg barbells, bumper plates, competition power cages, flat/incline/decline benches, and dumbbells ranging up to 45 kg.',
      image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80',
      features: ['Olympic Power Cages', 'Solid Rubber Dumbbells (2.5kg - 45kg)', 'Specialty Barbells (EZ, Hex, Safety Squat)']
    },
    {
      title: 'Plate-Loaded Machine Floor',
      desc: 'Isolate muscle groups safely with converging and diverging motion machines including Hack Squats, Leg Press, Lat Pulldowns, and Cable Crossovers.',
      image: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=600&q=80',
      features: ['Linear 45-degree Leg Press', 'Dual Cable Cross-over Station', 'Chest-supported T-Bar Row']
    },
    {
      title: 'Cardio & Conditioning Sector',
      desc: 'Burn calories and boost cardiovascular stamina with interactive commercial treadmills, magnetic elliptical trainers, and spin bikes.',
      image: 'https://images.unsplash.com/photo-1576678927484-cc907957088c?auto=format&fit=crop&w=600&q=80',
      features: ['High-incline Commercial Treadmills', 'Assault Air Bike & Rowing Ergometer', 'Heart Rate Telemetry Sensors']
    },
    {
      title: 'CrossFit & Functional Arena',
      desc: 'High-intensity functional zone featuring battle ropes, plyometric jump boxes, kettlebells, medicine balls, and TRX suspension training straps.',
      image: 'https://images.unsplash.com/photo-1517963879433-6ad2b056d712?auto=format&fit=crop&w=600&q=80',
      features: ['Heavy Battle Ropes (15m)', 'Cast-iron Kettlebells (4kg - 32kg)', 'Plyo Boxes & Agility Ladders']
    },
    {
      title: 'Clean Shower & Personal Lockers',
      desc: 'Hygienic changing areas, individual passcode-protected lockers, and filtered drinking water stations.',
      image: 'https://images.unsplash.com/photo-1584824486509-112e4181ff6b?auto=format&fit=crop&w=600&q=80',
      features: ['Individual Secure Lockers', 'Clean Washrooms & Showers', 'RO Water Dispensary']
    },
    {
      title: 'Biometric Body Composition Lab',
      desc: 'Regularly updated digital stadiometer, body fat caliper assessments, and digital weighing scales to record verifiable progress.',
      image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=600&q=80',
      features: ['Digital Calibrated Weighing Scale', 'BMI & Body Circumference Calipers', 'Progress Tracking Archive']
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-brand-500">Premium Infrastructure</span>
        <h1 className="text-4xl font-black text-white">World-Class Gym Facilities in Narsobawadi</h1>
        <p className="text-sm text-slate-400">
          Engineered for performance, safety, and hygiene. We invest in commercial-grade apparatus so your workouts are frictionless.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {facilityList.map((f, i) => (
          <div key={i} className="rounded-2xl bg-dark-850 border border-slate-800 overflow-hidden hover:border-slate-700 transition flex flex-col justify-between">
            <div>
              <img src={f.image} alt={f.title} className="w-full h-48 object-cover object-center" />
              <div className="p-6 space-y-3">
                <h3 className="text-lg font-bold text-white">{f.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{f.desc}</p>
                <div className="pt-2 space-y-1.5 border-t border-slate-800">
                  {f.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-[11px] text-slate-300">
                      <Check className="w-3.5 h-3.5 text-brand-400 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
