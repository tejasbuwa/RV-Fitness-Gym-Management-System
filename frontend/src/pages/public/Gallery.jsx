import React from 'react';

export default function Gallery() {
  const photos = [
    {
      title: 'Heavy Dumbbell Free-Weight Arena',
      tag: 'Strength Area',
      url: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=800&q=80'
    },
    {
      title: 'Powerlifting Olympic Racks & Deadlift Platform',
      tag: 'Squat & Deadlift',
      url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80'
    },
    {
      title: 'High-Performance Cardio Sector',
      tag: 'Treadmills & Endurance',
      url: 'https://images.unsplash.com/photo-1576678927484-cc907957088c?auto=format&fit=crop&w=800&q=80'
    },
    {
      title: 'Functional CrossFit & Plyometric Zone',
      tag: 'CrossFit',
      url: 'https://images.unsplash.com/photo-1517963879433-6ad2b056d712?auto=format&fit=crop&w=800&q=80'
    },
    {
      title: 'Dedicated Cable & Chest Press Suite',
      tag: 'Machine Training',
      url: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=800&q=80'
    },
    {
      title: 'Personal Training & Posture Coaching Session',
      tag: 'Coaching',
      url: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=800&q=80'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-brand-500">Visual Tour</span>
        <h1 className="text-4xl font-black text-white">RV Fitness Narsobawadi in Action</h1>
        <p className="text-sm text-slate-400">
          Take a look inside our gym environment. Clean, high energy, and equipped for champions.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {photos.map((item, idx) => (
          <div
            key={idx}
            className="group relative rounded-2xl overflow-hidden border border-slate-800 bg-dark-850 shadow-lg aspect-[4/3]"
          >
            <img
              src={item.url}
              alt={item.title}
              className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/20 to-transparent opacity-80 group-hover:opacity-90 transition"></div>
            <div className="absolute bottom-4 left-4 right-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-brand-400 bg-brand-500/20 px-2 py-0.5 rounded border border-brand-500/30">
                {item.tag}
              </span>
              <h3 className="text-sm font-bold text-white mt-1.5">{item.title}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
