import React from 'react';
import { MapPin, Navigation, ExternalLink, Clock, Phone, Sparkles } from 'lucide-react';

export const GOOGLE_MAPS_SHORT_LINK = 'https://maps.app.goo.gl/5ipUPj43g7gZcxaQA';
export const GOOGLE_MAPS_DIRECTIONS_URL = 'https://www.google.com/maps/dir/?api=1&destination=16.6964166,74.6011262';
export const GOOGLE_MAPS_EMBED_URL = 'https://maps.google.com/maps?q=RV%20Fitness%20Narsobawadi@16.6964166,74.6011262&t=&z=17&ie=UTF8&iwloc=&output=embed';

export default function GymLocationMap({
  variant = 'full', // 'full' (with side/bottom details) or 'standalone' (just map container with header/buttons)
  height = '460px',
  className = ''
}) {
  return (
    <div className={`relative rounded-3xl overflow-hidden border border-amber-500/30 bg-zinc-950/90 shadow-2xl ${className}`}>
      {/* Ambient background radiance */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {variant === 'full' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 items-stretch">
          {/* Map Left/Top Column (Desktop: 7 cols) */}
          <div className="lg:col-span-7 relative min-h-[380px] lg:min-h-[500px]">
            <iframe
              title="RV Fitness Narsobawadi Google Maps Location"
              src={GOOGLE_MAPS_EMBED_URL}
              width="100%"
              height="100%"
              className="w-full h-full min-h-[380px] lg:min-h-[500px] border-0 grayscale-[15%] contrast-[105%] hover:grayscale-0 transition-all duration-500"
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>

            {/* Overlaid Floating Badge on Map */}
            <div className="absolute top-4 left-4 p-3 rounded-2xl bg-black/85 backdrop-blur-md border border-amber-500/40 text-xs text-white shadow-xl flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <div>
                <p className="font-bold text-white text-xs">RV FITNESS</p>
                <p className="text-[10px] text-amber-400 font-semibold">Narsobawadi, Maharashtra</p>
              </div>
            </div>

            {/* Overlaid Floating Directions Pill for Quick Access */}
            <div className="absolute bottom-4 right-4 flex items-center gap-2">
              <a
                href={GOOGLE_MAPS_DIRECTIONS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 rounded-xl bg-amber-500 text-black text-xs font-black shadow-lg hover:bg-amber-400 transition flex items-center gap-1.5"
              >
                <Navigation className="w-3.5 h-3.5 fill-black" />
                <span>Directions</span>
              </a>
            </div>
          </div>

          {/* Location Info Right Column (Desktop: 5 cols) */}
          <div className="lg:col-span-5 p-7 sm:p-9 flex flex-col justify-between space-y-6 bg-gradient-to-b from-zinc-950 via-[#111111] to-black border-t lg:border-t-0 lg:border-l border-zinc-800/80">
            <div className="space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[11px] font-bold uppercase tracking-wider">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>Official Gym Landmark</span>
              </div>

              <div>
                <h3 className="text-2xl font-black text-white">
                  FIND YOUR <span className="text-gold-gradient">FITNESS DESTINATION</span>
                </h3>
                <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">
                  Located in the heart of Narsobawadi. Easy access from Main Bazaar Road with dedicated parking for bikes and cars.
                </p>
              </div>

              {/* Landmark & Address Details */}
              <div className="space-y-3.5 text-xs text-zinc-300">
                <div className="p-3.5 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-1">
                  <p className="text-amber-400 font-bold uppercase text-[10px] tracking-wider">Address & Location</p>
                  <p className="font-semibold text-white text-xs leading-relaxed">
                    Main Bazaar Road, Near Narsimha Mandir Chowk, Narsobawadi, Dist. Kolhapur, Maharashtra – 416104
                  </p>
                  <p className="text-[11px] text-zinc-500 pt-1">
                    GPS Coordinates: <span className="text-zinc-400 font-mono">16.6964° N, 74.6011° E</span>
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-amber-400 font-bold uppercase text-[10px] tracking-wider flex items-center gap-1.5">
                      <Clock className="w-3 h-3 text-amber-400" />
                      <span>Training Shifts</span>
                    </p>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                      Open 6 Days
                    </span>
                  </div>
                  <div className="text-[11px] text-zinc-300 pt-1 space-y-1">
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Morning:</span>
                      <span className="font-semibold text-white">05:30 AM – 10:00 AM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Evening:</span>
                      <span className="font-semibold text-white">04:30 PM – 10:00 PM</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 text-[11px] text-zinc-300">
                  <Phone className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Desk Helpline: <strong className="text-white">+91 98220 12345 / 98234 45566</strong></span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-zinc-800 flex flex-col sm:flex-row gap-3">
              <a
                href={GOOGLE_MAPS_DIRECTIONS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold flex-1 py-3 px-4 rounded-xl font-bold text-xs inline-flex items-center justify-center gap-2 shadow-gold-glow"
              >
                <Navigation className="w-4 h-4 text-black fill-black" />
                <span>Get Directions</span>
              </a>

              <a
                href={GOOGLE_MAPS_SHORT_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold-outline flex-1 py-3 px-4 rounded-xl font-bold text-xs inline-flex items-center justify-center gap-2"
              >
                <span>View on Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      ) : (
        /* Standalone Map Container */
        <div className="relative w-full overflow-hidden" style={{ height }}>
          <iframe
            title="RV Fitness Narsobawadi Google Maps"
            src={GOOGLE_MAPS_EMBED_URL}
            width="100%"
            height="100%"
            className="w-full h-full border-0 grayscale-[10%] contrast-[105%]"
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>

          {/* Floating Action Controls */}
          <div className="absolute top-4 left-4 right-4 sm:right-auto flex flex-wrap items-center gap-2.5">
            <div className="px-3 py-2 rounded-xl bg-black/85 backdrop-blur-md border border-amber-500/40 text-xs text-white shadow-xl flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-bold text-xs">RV Fitness Narsobawadi</span>
            </div>

            <a
              href={GOOGLE_MAPS_DIRECTIONS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold transition flex items-center gap-1.5 shadow-lg"
            >
              <Navigation className="w-3.5 h-3.5 fill-black" />
              <span>Get Directions</span>
            </a>

            <a
              href={GOOGLE_MAPS_SHORT_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 rounded-xl bg-black/80 hover:bg-black text-zinc-300 hover:text-white border border-zinc-700 text-xs font-semibold transition flex items-center gap-1.5"
            >
              <span>View on Maps</span>
              <ExternalLink className="w-3 h-3 text-amber-400" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
