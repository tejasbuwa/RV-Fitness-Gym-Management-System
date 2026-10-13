import React from 'react';
import { Link } from 'react-router-dom';
import { Dumbbell, MapPin, Phone, Mail, Clock, Instagram, Facebook, Youtube } from 'lucide-react';

export default function PublicFooter() {
  return (
    <footer className="bg-dark-900 border-t border-slate-800 pt-16 pb-12 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Col 1: Brand & Bio */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-brand-500 flex items-center justify-center shadow-lg shadow-brand-500/20">
                <Dumbbell className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-xl font-extrabold tracking-tight text-white">
                  RV <span className="text-brand-500">FITNESS</span>
                </span>
                <span className="block text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
                  Narsobawadi
                </span>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed mb-4">
              Narsobawadi’s premier gym & fitness training facility. Built with state-of-the-art bio-mechanical equipment, certified coaches, and custom nutrition programs.
            </p>
            <div className="flex items-center gap-3">
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-lg bg-dark-800 border border-slate-700 flex items-center justify-center text-slate-300 hover:text-brand-400 hover:border-brand-500 transition">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-lg bg-dark-800 border border-slate-700 flex items-center justify-center text-slate-300 hover:text-brand-400 hover:border-brand-500 transition">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-lg bg-dark-800 border border-slate-700 flex items-center justify-center text-slate-300 hover:text-brand-400 hover:border-brand-500 transition">
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Quick Navigation</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="hover:text-white transition">About Our Gym</Link></li>
              <li><Link to="/facilities" className="hover:text-white transition">Equipment & Facilities</Link></li>
              <li><Link to="/plans" className="hover:text-white transition">Membership Plans</Link></li>
              <li><Link to="/trainers" className="hover:text-white transition">Our Certified Trainers</Link></li>
              <li><Link to="/gallery" className="hover:text-white transition">Facility Gallery</Link></li>
              <li><Link to="/announcements" className="hover:text-white transition">Notices & Events</Link></li>
            </ul>
          </div>

          {/* Col 3: Operating Shifts */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Operating Hours</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-brand-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-white font-medium">Morning Shift</p>
                  <p className="text-xs text-slate-400">05:30 AM – 10:00 AM (Mon – Sat)</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-brand-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-white font-medium">Evening Shift</p>
                  <p className="text-xs text-slate-400">05:00 PM – 10:00 PM (Mon – Sat)</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-white font-medium">Sunday Schedule</p>
                  <p className="text-xs text-slate-400">06:00 AM – 10:00 AM (Recovery & Cardio)</p>
                </div>
              </div>
            </div>
          </div>

          {/* Col 4: Narsobawadi Location */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Gym Address</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-brand-500 shrink-0 mt-0.5" />
                <span>Main Bazaar Road, Near Narsimha Mandir, Narsobawadi, Dist. Kolhapur, Maharashtra 416104</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-brand-500 shrink-0" />
                <span>+91 98220 12345 / 98220 54321</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-brand-500 shrink-0" />
                <span>contact@rvfitness.com</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} RV FITNESS – Narsobawadi. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built for Strength, Health, & Community Transformation.
          </p>
        </div>
      </div>
    </footer>
  );
}
