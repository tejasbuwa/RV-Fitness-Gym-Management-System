import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Dumbbell,
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
  User
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

  return (
    <div className="min-h-screen bg-dark-900 flex text-slate-100 antialiased">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-dark-850 border-r border-slate-800 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand header */}
        <div className="h-16 px-6 border-b border-slate-800 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-brand-500 flex items-center justify-center shadow-lg shadow-brand-500/20">
              <Dumbbell className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-lg font-extrabold tracking-tight text-white">
                RV <span className="text-brand-500">FITNESS</span>
              </span>
              <span className="block text-[9px] uppercase font-semibold text-slate-400 tracking-wider">
                Narsobawadi
              </span>
            </div>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-white lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Identity Pill */}
        <div className="p-4 mx-3 my-3 rounded-xl bg-dark-800/80 border border-slate-700/60 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-brand-500/20 border border-brand-500/40 flex items-center justify-center text-brand-400 font-bold text-sm shrink-0">
            {user?.fullName ? user.fullName[0].toUpperCase() : 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">{user?.fullName || user?.email}</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-brand-500/10 text-brand-400 border border-brand-500/20">
                {user?.role}
              </span>
              {user?.memberCode && (
                <span className="text-[11px] font-mono text-slate-400 font-semibold">
                  {user.memberCode}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto py-2">
          {currentNav.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/admin' && item.path !== '/trainer' && item.path !== '/member' && location.pathname.startsWith(item.path));
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition ${
                  isActive
                    ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/20 font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span className="flex-1">{item.name}</span>
                {isActive && <ChevronRight className="w-4 h-4 text-white/70" />}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-3 border-t border-slate-800 space-y-1">
          <Link
            to="/"
            target="_blank"
            className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800/40 transition"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              View Public Website
            </span>
          </Link>
          <button
            onClick={logout}
            className="w-full flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-rose-400 hover:bg-rose-500/10 transition"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-72 flex flex-col min-h-screen">
        {/* Top Navbar */}
        <header className="h-16 bg-dark-850/80 backdrop-blur-md border-b border-slate-800 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 lg:hidden"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-sm font-semibold text-white capitalize flex items-center gap-2">
                <span>{user?.role} Portal</span>
                <span className="text-slate-600">/</span>
                <span className="text-slate-400 font-normal text-xs">RV Fitness Narsobawadi</span>
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {user?.memberCode && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-lg bg-dark-800 border border-slate-700 text-xs">
                <span className="text-slate-400">Member ID:</span>
                <span className="font-mono font-bold text-brand-400">{user.memberCode}</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-xs font-medium text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span className="hidden sm:inline">System Active</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
