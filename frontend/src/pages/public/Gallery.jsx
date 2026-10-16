import React, { useState } from 'react';
import { Camera, Eye, X, ZoomIn, Filter } from 'lucide-react';

export default function Gallery() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedImage, setSelectedImage] = useState(null);

  const galleryItems = [
    {
      id: 1,
      title: 'Heavy Barbell Deadlift Station',
      category: 'strength',
      categoryLabel: 'Strength & Weights',
      img: '/images/gym/gallery_strength_1.jpg',
      desc: 'Olympic calibrated bumper plates and competition deadlift platform.'
    },
    {
      id: 2,
      title: 'Powerlifting Squat Rack & Bench Arena',
      category: 'strength',
      categoryLabel: 'Strength & Weights',
      img: '/images/gym/gallery_strength_2.jpg',
      desc: 'Heavy-duty power racks with adjustable safety pins and spotter steps.'
    },
    {
      id: 3,
      title: 'Heavy Dumbbell Station (Up to 50kg)',
      category: 'strength',
      categoryLabel: 'Strength & Weights',
      img: '/images/gym/facility_weights.jpg',
      desc: 'Full tiered dumbbell rack with solid rubber hex weights.'
    },
    {
      id: 4,
      title: 'Digital High-Speed Treadmills',
      category: 'cardio',
      categoryLabel: 'Cardio Matrix',
      img: '/images/gym/gallery_cardio_1.jpg',
      desc: 'Commercial curved and motorized treadmills for intense cardio sessions.'
    },
    {
      id: 5,
      title: 'Group Spin Cycle & HIIT Studio',
      category: 'cardio',
      categoryLabel: 'Cardio Matrix',
      img: '/images/gym/gallery_cardio_2.jpg',
      desc: 'Precision resistance spin bikes for fat-burning anaerobic conditioning.'
    },
    {
      id: 6,
      title: 'CrossFit Agility Turf & Battle Ropes',
      category: 'crossfit',
      categoryLabel: 'CrossFit & Turf',
      img: '/images/gym/gallery_crossfit_1.jpg',
      desc: 'High-density synthetic sprint turf for sled pushes and rope slams.'
    },
    {
      id: 7,
      title: 'Functional Calisthenics & Kettlebells',
      category: 'crossfit',
      categoryLabel: 'CrossFit & Turf',
      img: '/images/gym/gallery_crossfit_2.jpg',
      desc: 'Cast-iron Russian kettlebells and multi-grip pull-up rigs.'
    },
    {
      id: 8,
      title: 'RV Fitness Narsobawadi Evening Ambience',
      category: 'facility',
      categoryLabel: 'Facility & Ambience',
      img: '/images/gym/gallery_interior_1.jpg',
      desc: 'Warm golden interior lighting and spacious workout zones.'
    },
    {
      id: 9,
      title: 'Plate-Loaded Hammer Strength Circuit',
      category: 'facility',
      categoryLabel: 'Facility & Ambience',
      img: '/images/gym/gallery_interior_2.jpg',
      desc: 'Converging chest and shoulder press machines with natural motion arcs.'
    },
    {
      id: 10,
      title: 'Luxury Locker Room & Shower Suites',
      category: 'facility',
      categoryLabel: 'Facility & Ambience',
      img: '/images/gym/facility_lockers.jpg',
      desc: 'Private secure lockers and hygienic hot/cold shower cubicles.'
    },
    {
      id: 11,
      title: 'Athletic Conditioning & Battle Ropes',
      category: 'crossfit',
      categoryLabel: 'CrossFit & Turf',
      img: '/images/gym/gallery_transformation_1.jpg',
      desc: 'Full body functional circuit conditioning in progress.'
    },
    {
      id: 12,
      title: 'Dedicated Bodybuilding & Hypertrophy Training',
      category: 'strength',
      categoryLabel: 'Strength & Weights',
      img: '/images/gym/gallery_transformation_2.jpg',
      desc: 'Targeted muscular hypertrophy guided by certified mentors.'
    }
  ];

  const categories = [
    { id: 'all', label: 'All Photos' },
    { id: 'strength', label: 'Strength & Weights' },
    { id: 'cardio', label: 'Cardio Matrix' },
    { id: 'crossfit', label: 'CrossFit & Turf' },
    { id: 'facility', label: 'Facility & Interiors' }
  ];

  const filteredItems = activeCategory === 'all'
    ? galleryItems
    : galleryItems.filter(item => item.category === activeCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-16 bg-[#0a0a0a] text-zinc-100">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-[0.25em] text-amber-400 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30">
          Visual Experience
        </span>
        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight">
          RV FITNESS <span className="text-gold-gradient">PHOTO GALLERY</span>
        </h1>
        <p className="text-base sm:text-lg text-zinc-300 font-normal leading-relaxed">
          Take a visual tour inside our premium Narsobawadi gym facility, from heavy strength zones to digital cardio circuits and functional turf.
        </p>
      </div>

      {/* Filter Tabs in Black & Gold */}
      <div className="flex flex-wrap items-center justify-center gap-2.5">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition duration-200 ${
              activeCategory === cat.id
                ? 'btn-gold shadow-lg shadow-amber-500/20'
                : 'bg-zinc-900/90 text-zinc-400 border border-zinc-800 hover:border-amber-500/30 hover:text-white'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            onClick={() => setSelectedImage(item)}
            className="group relative rounded-3xl overflow-hidden cursor-pointer border border-amber-500/20 hover:border-amber-500/50 transition-all duration-300 shadow-xl bg-zinc-950"
          >
            <div className="h-72 overflow-hidden">
              <img
                src={item.img}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-85 group-hover:opacity-95 transition-opacity"></div>

            {/* Hover overlay content */}
            <div className="absolute inset-0 p-6 flex flex-col justify-between">
              <div className="flex justify-between items-center">
                <span className="px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-amber-500/40 text-[10px] uppercase font-bold text-amber-400">
                  {item.categoryLabel}
                </span>
                <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300 opacity-0 group-hover:opacity-100 transition duration-300">
                  <ZoomIn className="w-4 h-4" />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition">
                  {item.title}
                </h3>
                <p className="text-xs text-zinc-300 mt-1 line-clamp-2">
                  {item.desc}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md p-4 sm:p-8 flex items-center justify-center"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-zinc-950 border border-amber-500/40 rounded-3xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/70 text-zinc-300 hover:text-white border border-zinc-700"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="max-h-[70vh] overflow-hidden bg-black">
              <img
                src={selectedImage.img}
                alt={selectedImage.title}
                className="w-full h-full object-contain mx-auto"
              />
            </div>
            <div className="p-6 bg-zinc-950 border-t border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs uppercase font-bold text-amber-400">
                  {selectedImage.categoryLabel}
                </span>
                <h3 className="text-xl font-bold text-white mt-0.5">{selectedImage.title}</h3>
                <p className="text-xs text-zinc-400 mt-1">{selectedImage.desc}</p>
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
