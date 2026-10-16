import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ArrowRight, MapPin, Sparkles, User, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

export default function PublicNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [gymStatus, setGymStatus] = useState(null);
  const { user } = useAuth();
  const location = useLocation();

  useEffect(() => {
    api.get('/gym-status')
      .then((res) => {
        if (res.data.success) {
          setGymStatus(res.data.status);
        }
      })
      .catch(() => {});
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Facilities', path: '/facilities' },
    { name: 'Plans', path: '/plans' },
    { name: 'Trainers', path: '/trainers' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Announcements', path: '/announcements' },
    { name: 'Live Status', path: '/status' },
    { name: 'Contact', path: '/contact' },
  ];

  const getDashboardPath = () => {
    if (!user) return '/login';
    if (user.role === 'admin') return '/admin';
    if (user.role === 'trainer') return '/trainer';
    return '/member';
  };

  return (
    <header className="sticky top-0 z-50 bg-black/90 backdrop-blur-xl border-b border-amber-500/20">
      {/* Top Luxury Micro Bar */}
      <div className="bg-gradient-to-r from-black via-zinc-950 to-black px-4 py-1.5 border-b border-amber-500/10 text-xs text-zinc-400">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-zinc-300 font-medium">Narsobawadi, Maharashtra</span>
            <span className="text-zinc-600">|</span>
            <span className="text-zinc-400">Morning 05:30 AM – 10:00 PM</span>
          </div>

          <div className="flex items-center gap-4">
            {gymStatus && (
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                    gymStatus.status === 'OPEN' ? 'bg-amber-400' : 'bg-rose-400'
                  }`}></span>
                  <span className={`relative inline-flex rounded-full h-2 w-2 ${
                    gymStatus.status === 'OPEN' ? 'bg-amber-500' : 'bg-rose-500'
                  }`}></span>
                </span>
                <span className={`font-bold uppercase tracking-wider text-[11px] ${
                  gymStatus.status === 'OPEN' ? 'text-amber-400' : 'text-rose-400'
                }`}>
                  Gym is {gymStatus.status}
                </span>
              </div>
            )}
            <span className="hidden sm:inline text-zinc-500">•</span>
            <span className="hidden sm:inline text-amber-500/90 font-semibold tracking-wider text-[11px] uppercase">
              Premium Unisex Fitness
            </span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo with official RV FITNESS emblem */}
          <Link to="/" className="flex items-center gap-3 group py-1">
            <div className="relative">
              <div className="absolute -inset-1 rounded-full bg-amber-500/20 blur-sm group-hover:bg-amber-500/40 transition"></div>
              <img
                src="/images/logo.png"
                alt="RV FITNESS Logo"
                className="relative h-12 w-auto object-contain drop-shadow-[0_0_12px_rgba(212,175,55,0.45)] group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-tight text-white flex items-center leading-none">
                RV <span className="text-gold-gradient ml-1.5 font-extrabold">FITNESS</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-[0.28em] text-amber-400/90 mt-1">
                Narsobawadi
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1.5">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition duration-200 ${
                    isActive
                      ? 'text-amber-400 bg-amber-500/10 border border-amber-500/30 font-semibold shadow-[0_0_15px_rgba(234,179,8,0.15)]'
                      : 'text-zinc-300 hover:text-amber-300 hover:bg-zinc-900/60'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            {user ? (
              <Link
                to={getDashboardPath()}
                className="btn-gold flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm"
              >
                <User className="w-4 h-4" />
                <span>Dashboard ({user.role})</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="btn-gold-outline px-4 py-2 rounded-xl text-sm"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="btn-gold flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm"
                >
                  <Sparkles className="w-4 h-4 text-black" />
                  <span>Join Now</span>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-2">
            {user && (
              <Link
                to={getDashboardPath()}
                className="btn-gold px-3 py-1.5 rounded-lg text-xs"
              >
                Dashboard
              </Link>
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl bg-zinc-900 border border-amber-500/20 text-zinc-300 hover:text-amber-400 hover:border-amber-500/40"
              aria-label="Toggle Menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isOpen && (
        <div className="lg:hidden bg-zinc-950/95 backdrop-blur-2xl border-b border-amber-500/20 px-4 pt-3 pb-6 space-y-2">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-2.5 rounded-xl text-base font-medium transition ${
                  isActive
                    ? 'text-amber-400 bg-amber-500/10 border border-amber-500/30 font-semibold'
                    : 'text-zinc-300 hover:text-white hover:bg-zinc-900'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
          <div className="pt-4 border-t border-zinc-800 flex flex-col gap-2.5">
            {!user ? (
              <>
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="btn-gold-outline w-full py-2.5 rounded-xl text-center font-semibold text-sm"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className="btn-gold w-full py-2.5 rounded-xl text-center font-bold text-sm"
                >
                  Join RV Fitness Today
                </Link>
              </>
            ) : (
              <Link
                to={getDashboardPath()}
                onClick={() => setIsOpen(false)}
                className="btn-gold w-full py-2.5 rounded-xl text-center font-bold text-sm"
              >
                Open Dashboard ({user.role})
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
