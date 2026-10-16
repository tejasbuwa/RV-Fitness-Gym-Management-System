import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  UserCheck,
  CreditCard,
  Receipt,
  FileText,
  BarChart3,
  Bell,
  Activity,
  Utensils,
  LogOut,
  Menu,
  X,
  ExternalLink,
  ChevronRight,
  Shield,
  Layers,
  History,
  User,
  Dumbbell,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout, isAdmin, isTrainer, isMember } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Role-specific navigation items
  const adminNav = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Members Directory', path: '/admin/members', icon: Users },
    { name: 'Trainers', path: '/admin/trainers', icon: UserCheck },
    { name: 'Membership Plans', path: '/admin/plans', icon: Layers },
    { name: 'Invoices & Billing', path: '/admin/invoices', icon: FileText },
    { name: 'Payments & Receipts', path: '/admin/payments', icon: Receipt },
    { name: 'Business Reports', path: '/admin/reports', icon: BarChart3 },
    { name: 'CMS & Announcements', path: '/admin/cms', icon: Bell },
    { name: 'Audit Logs', path: '/admin/audit-logs', icon: History },
  ];

  const trainerNav = [
    { name: 'Trainer Dashboard', path: '/trainer', icon: LayoutDashboard },
    { name: 'Assigned Members', path: '/trainer/members', icon: Users },
    { name: 'Workout Builder', path: '/trainer/workouts', icon: Dumbbell },
    { name: 'Diet Nutrition Plans', path: '/trainer/diets', icon: Utensils },
    { name: 'Log Member Progress', path: '/trainer/progress', icon: Activity },
  ];

  const memberNav = [
    { name: 'My Dashboard', path: '/member', icon: LayoutDashboard },
    { name: 'Billing & Receipts', path: '/member/billing', icon: CreditCard },
    { name: 'My Workout Routine', path: '/member/workout', icon: Dumbbell },
    { name: 'My Nutrition Plan', path: '/member/diet', icon: Utensils },
    { name: 'My Fitness Progress', path: '/member/progress', icon: Activity },
    { name: 'Announcements', path: '/member/notices', icon: Bell },
    { name: 'Profile Settings', path: '/member/profile', icon: User },
  ];

  const currentNav = isAdmin ? adminNav : isTrainer ? trainerNav : memberNav;

  const roleBadgeColor = isAdmin
    ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
    : isTrainer
    ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
    : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex text-zinc-100 antialiased">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-black border-r border-amber-500/20 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand header with official logo */}
        <div className="h-20 px-6 border-b border-amber-500/15 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img
              src="/images/logo.png"
              alt="RV FITNESS"
              className="h-10 w-auto object-contain drop-shadow-[0_0_8px_rgba(212,175,55,0.4)]"
            />
            <div className="flex flex-col">
              <span className="text-lg font-black tracking-wider text-white">
                RV <span className="text-gold-gradient font-black">FITNESS</span>
              </span>
              <span className="block text-[9px] uppercase font-bold tracking-[0.22em] text-amber-400/90 -mt-0.5">
                Narsobawadi
              </span>
            </div>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-1 rounded-lg text-zinc-400 hover:text-white lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Card */}
        <div className="p-4 mx-4 my-4 rounded-2xl bg-zinc-950 border border-zinc-800/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-yellow-600 flex items-center justify-center font-bold text-black text-sm shrink-0">
              {user?.fullName?.charAt(0) || user?.email?.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="font-bold text-sm text-white truncate">{user?.fullName || 'User'}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${roleBadgeColor}`}>
                  {user?.role}
                </span>
                {user?.memberCode && (
                  <span className="text-[10px] font-mono text-amber-400 font-bold">
                    {user.memberCode}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation links */}
        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-1">
          {currentNav.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition duration-200 ${
                  isActive
                    ? 'text-amber-300 bg-amber-500/10 border border-amber-500/30 font-semibold shadow-[0_0_15px_rgba(212,175,55,0.15)]'
                    : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-zinc-400'}`} />
                  <span>{item.name}</span>
                </div>
                {isActive && <ChevronRight className="w-4 h-4 text-amber-400" />}
              </Link>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-zinc-900 space-y-2">
          <Link
            to="/"
            target="_blank"
            className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs text-zinc-400 hover:text-amber-300 hover:bg-zinc-900 transition"
          >
            <div className="flex items-center gap-2">
              <ExternalLink className="w-4 h-4 text-amber-400" />
              <span>Visit Public Site</span>
            </div>
            <span className="text-[10px] text-zinc-500">Narsobawadi</span>
          </Link>

          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="w-full flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-72 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 h-16 bg-black/90 backdrop-blur-md border-b border-amber-500/15 px-4 sm:px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white lg:hidden"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-zinc-400 hidden sm:inline">RV Fitness Portal</span>
              <span className="text-zinc-600 hidden sm:inline">/</span>
              <span className="font-semibold text-amber-400 capitalize">
                {location.pathname.replace(/^\/[^/]+\/?/, '').replace('-', ' ') || 'Dashboard'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900/90 border border-amber-500/20 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-zinc-300 font-medium">Narsobawadi System Online</span>
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
