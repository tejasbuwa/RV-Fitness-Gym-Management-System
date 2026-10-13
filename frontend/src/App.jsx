import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';

// Layouts
import PublicNavbar from './components/layout/PublicNavbar';
import PublicFooter from './components/layout/PublicFooter';
import DashboardLayout from './components/layout/DashboardLayout';
import ProtectedRoute from './components/layout/ProtectedRoute';

// Public Pages
import Home from './pages/public/Home';
import About from './pages/public/About';
import Facilities from './pages/public/Facilities';
import Plans from './pages/public/Plans';
import Trainers from './pages/public/Trainers';
import Gallery from './pages/public/Gallery';
import Announcements from './pages/public/Announcements';
import GymStatusPage from './pages/public/GymStatusPage';
import Contact from './pages/public/Contact';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import MemberList from './pages/admin/MemberList';
import MemberDetail from './pages/admin/MemberDetail';
import TrainerList from './pages/admin/TrainerList';
import PlanList from './pages/admin/PlanList';
import InvoiceList from './pages/admin/InvoiceList';
import PaymentList from './pages/admin/PaymentList';
import ReportsPage from './pages/admin/ReportsPage';
import ContentManagement from './pages/admin/ContentManagement';
import AuditLogsPage from './pages/admin/AuditLogsPage';

// Trainer Pages
import TrainerDashboard from './pages/trainer/TrainerDashboard';
import AssignedMembers from './pages/trainer/AssignedMembers';
import WorkoutManager from './pages/trainer/WorkoutManager';
import DietManager from './pages/trainer/DietManager';
import ProgressLogger from './pages/trainer/ProgressLogger';

// Member Pages
import MemberDashboard from './pages/member/MemberDashboard';
import MemberBilling from './pages/member/MemberBilling';
import MemberWorkout from './pages/member/MemberWorkout';
import MemberDiet from './pages/member/MemberDiet';
import MemberProgress from './pages/member/MemberProgress';
import MemberNotices from './pages/member/MemberNotices';
import MemberProfile from './pages/member/MemberProfile';

function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-dark-900 text-slate-100">
      <PublicNavbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <PublicFooter />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <NotificationProvider>
          <Routes>
            {/* Public Pages with Nav & Footer */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/facilities" element={<Facilities />} />
              <Route path="/plans" element={<Plans />} />
              <Route path="/trainers" element={<Trainers />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/announcements" element={<Announcements />} />
              <Route path="/status" element={<GymStatusPage />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
            </Route>

            {/* Admin Portal */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <DashboardLayout>
                    <AdminDashboard />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/members"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <DashboardLayout>
                    <MemberList />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/members/:id"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <DashboardLayout>
                    <MemberDetail />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/trainers"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <DashboardLayout>
                    <TrainerList />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/plans"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <DashboardLayout>
                    <PlanList />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/invoices"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <DashboardLayout>
                    <InvoiceList />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/payments"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <DashboardLayout>
                    <PaymentList />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/reports"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <DashboardLayout>
                    <ReportsPage />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/cms"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <DashboardLayout>
                    <ContentManagement />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/audit-logs"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <DashboardLayout>
                    <AuditLogsPage />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            {/* Trainer Portal */}
            <Route
              path="/trainer"
              element={
                <ProtectedRoute allowedRoles={['trainer', 'admin']}>
                  <DashboardLayout>
                    <TrainerDashboard />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/trainer/members"
              element={
                <ProtectedRoute allowedRoles={['trainer', 'admin']}>
                  <DashboardLayout>
                    <AssignedMembers />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/trainer/workouts"
              element={
                <ProtectedRoute allowedRoles={['trainer', 'admin']}>
                  <DashboardLayout>
                    <WorkoutManager />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/trainer/diets"
              element={
                <ProtectedRoute allowedRoles={['trainer', 'admin']}>
                  <DashboardLayout>
                    <DietManager />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/trainer/progress"
              element={
                <ProtectedRoute allowedRoles={['trainer', 'admin']}>
                  <DashboardLayout>
                    <ProgressLogger />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            {/* Member Portal */}
            <Route
              path="/member"
              element={
                <ProtectedRoute allowedRoles={['member']}>
                  <DashboardLayout>
                    <MemberDashboard />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/member/billing"
              element={
                <ProtectedRoute allowedRoles={['member']}>
                  <DashboardLayout>
                    <MemberBilling />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/member/workout"
              element={
                <ProtectedRoute allowedRoles={['member']}>
                  <DashboardLayout>
                    <MemberWorkout />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/member/diet"
              element={
                <ProtectedRoute allowedRoles={['member']}>
                  <DashboardLayout>
                    <MemberDiet />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/member/progress"
              element={
                <ProtectedRoute allowedRoles={['member']}>
                  <DashboardLayout>
                    <MemberProgress />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/member/notices"
              element={
                <ProtectedRoute allowedRoles={['member']}>
                  <DashboardLayout>
                    <MemberNotices />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/member/profile"
              element={
                <ProtectedRoute allowedRoles={['member']}>
                  <DashboardLayout>
                    <MemberProfile />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </NotificationProvider>
      </AuthProvider>
    </Router>
  );
}
