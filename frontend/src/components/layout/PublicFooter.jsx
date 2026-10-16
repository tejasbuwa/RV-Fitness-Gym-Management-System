import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, Instagram, Facebook, Youtube, ShieldCheck, Dumbbell, Award } from 'lucide-react';

export default function PublicFooter() {
  return (
    <footer className="bg-black border-t border-amber-500/20 pt-16 pb-12 text-zinc-400 relative overflow-hidden">
      {/* Subtle gold glow in background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-24 bg-amber-500/5 blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-14">
          {/* Col 1: Brand & Bio */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <img
                src="/images/logo.png"
                alt="RV FITNESS"
                className="h-12 w-auto object-contain drop-shadow-[0_0_10px_rgba(212,175,55,0.4)]"
              />
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-wider text-white">
                  RV <span className="text-gold-gradient font-black">FITNESS</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-amber-500/90 -mt-0.5">
                  Narsobawadi
                </span>
              </div>
            </div>
            <p className="text-sm text-zinc-400 leading-relaxed mb-6">
              Narsobawadi’s elite gym and strength conditioning facility. Outfitted with high-precision biomechanical machinery, certified personal trainers, and customized nutrition programs to transform your physique.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300 hover:text-amber-400 hover:border-amber-500/50 hover:shadow-[0_0_15px_rgba(212,175,55,0.25)] transition"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300 hover:text-amber-400 hover:border-amber-500/50 hover:shadow-[0_0_15px_rgba(212,175,55,0.25)] transition"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300 hover:text-amber-400 hover:border-amber-500/50 hover:shadow-[0_0_15px_rgba(212,175,55,0.25)] transition"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="text-amber-400 font-bold text-xs uppercase tracking-[0.2em] mb-5">
              Quick Navigation
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/about" className="hover:text-amber-300 transition flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500/40"></span>
                  About RV Fitness
                </Link>
              </li>
              <li>
                <Link to="/facilities" className="hover:text-amber-300 transition flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500/40"></span>
                  Equipment & Facilities
                </Link>
              </li>
              <li>
                <Link to="/plans" className="hover:text-amber-300 transition flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500/40"></span>
                  Membership Plans
                </Link>
              </li>
              <li>
                <Link to="/trainers" className="hover:text-amber-300 transition flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500/40"></span>
                  Certified Coaches
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="hover:text-amber-300 transition flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500/40"></span>
                  Photo Gallery
                </Link>
              </li>
              <li>
                <Link to="/announcements" className="hover:text-amber-300 transition flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500/40"></span>
                  Notices & Events
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Operating Shifts */}
          <div>
            <h4 className="text-amber-400 font-bold text-xs uppercase tracking-[0.2em] mb-5">
              Operating Schedule
            </h4>
            <div className="space-y-3.5 text-sm">
              <div className="flex items-start gap-3 p-3 rounded-xl bg-zinc-950/80 border border-zinc-900">
                <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-zinc-200 text-xs">Morning Session</p>
                  <p className="text-zinc-400 text-xs">05:30 AM – 10:00 AM (Mon – Sat)</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-xl bg-zinc-950/80 border border-zinc-900">
                <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-zinc-200 text-xs">Evening Session</p>
                  <p className="text-zinc-400 text-xs">04:30 PM – 10:00 PM (Mon – Sat)</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-xl bg-zinc-950/80 border border-zinc-900">
                <Clock className="w-4 h-4 text-zinc-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-zinc-400 text-xs">Sunday Special Batch</p>
                  <p className="text-zinc-500 text-xs">06:00 AM – 09:30 AM (Rest / Cardio)</p>
                </div>
              </div>
            </div>
          </div>

          {/* Col 4: Narsobawadi Location & Contact */}
          <div>
            <h4 className="text-amber-400 font-bold text-xs uppercase tracking-[0.2em] mb-5">
              Gym Location & Support
            </h4>
            <div className="space-y-3.5 text-sm">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-1" />
                <p className="text-zinc-300 leading-snug">
                  Main Bazaar Road, Near Narsimha Mandir Chowk, Narsobawadi, Maharashtra – 416104
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <a href="tel:+919822012345" className="text-zinc-300 hover:text-amber-400 transition font-medium">
                  +91 98220 12345 / 98234 45566
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <a href="mailto:info@rvfitness.com" className="text-zinc-300 hover:text-amber-400 transition font-medium">
                  info@rvfitness.com
                </a>
              </div>
              <div className="pt-2">
                <Link
                  to="/status"
                  className="inline-flex items-center gap-2 text-xs font-semibold text-amber-400 hover:text-amber-300 transition"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  View Today's Operational Status
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <p>© {new Date().getFullYear()} RV FITNESS – Narsobawadi. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="text-amber-500/80 font-semibold tracking-wider uppercase text-[10px]">
              Built for Champions
            </span>
            <span>•</span>
            <Link to="/login" className="hover:text-amber-400 transition">Staff & Member Portal</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
