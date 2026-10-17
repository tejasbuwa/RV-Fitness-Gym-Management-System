import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  ArrowRight,
  User,
  Mail,
  Lock,
  Phone,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  CreditCard,
  Dumbbell,
  Clock,
  ChevronRight,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import api from '../../services/api';
import { formatCurrency, formatDate } from '../../utils/formatters';

export default function Register() {
  const [searchParams] = useSearchParams();
  const initialPlanId = searchParams.get('planId') || '';

  const [plans, setPlans] = useState([]);
  const [selectedPlanId, setSelectedPlanId] = useState(initialPlanId);
  const [plansLoading, setPlansLoading] = useState(true);

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    gender: 'Male',
    dob: '',
    address: '',
    emergencyContact: '',
    heightCm: '',
    weightKg: '',
    fitnessGoal: 'Muscle Hypertrophy & Strength'
  });

  const [loading, setLoading] = useState(false);
  const [completedRegistration, setCompletedRegistration] = useState(null);

  const { register } = useAuth();
  const { success, error } = useNotification();
  const navigate = useNavigate();

  // Load available membership plans
  useEffect(() => {
    api.get('/membership-plans')
      .then((res) => {
        if (res.data.success && Array.isArray(res.data.plans)) {
          setPlans(res.data.plans);
          // If query param planId provided and valid
          if (initialPlanId) {
            setSelectedPlanId(initialPlanId);
          } else if (res.data.plans.length > 0) {
            // Default to popular Quarterly or first plan
            const popular = res.data.plans.find((p) => p.name.includes('Quarterly')) || res.data.plans[0];
            setSelectedPlanId(String(popular.id));
          }
        }
      })
      .catch(() => {})
      .finally(() => setPlansLoading(false));
  }, [initialPlanId]);

  const selectedPlan = plans.find((p) => String(p.id) === String(selectedPlanId));

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.fullName || !form.email || !form.phone || !form.password) {
      error('Please complete all required fields.');
      return;
    }

    if (form.password !== form.confirmPassword) {
      error('Passwords do not match.');
      return;
    }

    if (form.password.length < 6) {
      error('Password must be at least 6 characters.');
      return;
    }

    try {
      setLoading(true);
      const payload = {
        ...form,
        planId: selectedPlanId ? parseInt(selectedPlanId, 10) : null
      };

      const res = await register(payload);
      success(res.message || 'Registration successful! Welcome to RV Fitness Narsobawadi.');

      // Save registration state to show executable Step 2 screen
      setCompletedRegistration({
        user: res.user,
        membership: res.membership,
        invoice: res.invoice,
        plan: selectedPlan
      });
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Registration failed. Please check your details.';
      error(msg);
    } finally {
      setLoading(false);
    }
  };

  // STEP 2: REGISTRATION COMPLETE & NEXT STEPS CONFIRMATION
  if (completedRegistration) {
    const { user, membership, invoice, plan } = completedRegistration;

    return (
      <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-[#0a0a0a]">
        <div className="w-full max-w-2xl space-y-6 animate-fade-in">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mb-1">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-3xl font-black text-white">
              Welcome to <span className="text-gold-gradient font-black">RV FITNESS</span>!
            </h2>
            <p className="text-xs text-zinc-400">
              Your member account has been officially created for our Narsobawadi center.
            </p>
          </div>

          {/* Digital Member ID Pass Card */}
          <div className="relative rounded-3xl overflow-hidden p-7 bg-gradient-to-br from-zinc-900 via-black to-zinc-950 border-2 border-gold-500/40 shadow-gold-glow text-white space-y-6">
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Top Bar of Card */}
            <div className="flex justify-between items-start relative z-10">
              <div className="flex items-center gap-3">
                <img
                  src="/images/logo.png"
                  alt="RV Fitness"
                  className="w-12 h-12 object-contain rounded-full bg-black p-1 shadow"
                />
                <div>
                  <h4 className="font-black text-lg text-white tracking-wide">RV FITNESS</h4>
                  <p className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">Narsobawadi VIP Member</p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                Active Member
              </span>
            </div>

            {/* Middle Section: Member Code & Details */}
            <div className="grid grid-cols-2 gap-4 pt-2 relative z-10 border-t border-zinc-800/80">
              <div>
                <p className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Member Name</p>
                <p className="text-base font-black text-white mt-0.5">{user?.fullName || form.fullName}</p>
                <p className="text-xs text-zinc-400">{user?.email || form.email}</p>
              </div>

              <div className="text-right">
                <p className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">Permanent Member ID</p>
                <p className="text-2xl font-mono font-black text-amber-400 mt-0.5 tracking-wider">
                  {user?.memberCode || 'RVF-PENDING'}
                </p>
                <p className="text-[10px] text-zinc-500 mt-0.5">Use at Gym Entry & Reception</p>
              </div>
            </div>

            {/* Bottom Section: Plan & Invoice Info */}
            <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
              <div>
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Assigned Package</span>
                <span className="text-sm font-bold text-white">
                  {plan ? plan.name : membership?.planName || 'General Membership'}
                </span>
                {plan && (
                  <span className="text-xs text-amber-400 ml-2 font-mono font-semibold">
                    ({formatCurrency(plan.price)})
                  </span>
                )}
              </div>

              {invoice && (
                <div className="text-left sm:text-right">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Invoice Reference</span>
                  <span className="font-mono text-xs font-bold text-zinc-200">{invoice.invoiceNumber}</span>
                  <span className="block text-[10px] text-amber-400 font-semibold uppercase">Payment Pending</span>
                </div>
              )}
            </div>
          </div>

          {/* Actionable Next Steps */}
          <div className="p-6 rounded-3xl glass-gold border border-amber-500/20 bg-zinc-950/90 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Executable Next Steps</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-3 p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
                <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 font-black flex items-center justify-center shrink-0 mt-0.5">
                  1
                </div>
                <div>
                  <p className="font-bold text-white">Collect Your RFID Gym Keycard</p>
                  <p className="text-zinc-400 text-[11px] mt-0.5">
                    Visit the RV Fitness desk at Narsobawadi main branch and provide Member ID <strong className="text-amber-400">{user?.memberCode}</strong> to receive your biometric keycard.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
                <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 font-black flex items-center justify-center shrink-0 mt-0.5">
                  2
                </div>
                <div>
                  <p className="font-bold text-white">Settle Membership Fee & Get Tax Receipt</p>
                  <p className="text-zinc-400 text-[11px] mt-0.5">
                    Pay invoice <strong>{invoice?.invoiceNumber || 'pending'}</strong> at the desk via UPI, Cash, or Card to get your official stamped receipt.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
                <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 font-black flex items-center justify-center shrink-0 mt-0.5">
                  3
                </div>
                <div>
                  <p className="font-bold text-white">Trainer Allocation & Personalized Workout Split</p>
                  <p className="text-zinc-400 text-[11px] mt-0.5">
                    Head Strength Coach Vikram Patil will review your fitness goals ({form.fitnessGoal}) and schedule your initial physical assessment.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3">
              <button
                onClick={() => navigate('/member')}
                className="btn-gold py-3.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-gold-glow"
              >
                <span>Proceed to Member Dashboard</span>
                <ArrowRight className="w-4 h-4 text-black" />
              </button>

              <button
                onClick={() => navigate('/member/billing')}
                className="btn-gold-outline py-3.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2"
              >
                <CreditCard className="w-4 h-4" />
                <span>View My Plan & Invoices</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // STEP 1: REGISTRATION & JOIN NOW FORM
  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-14 bg-[#0a0a0a]">
      <div className="w-full max-w-2xl space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <Link to="/" className="inline-flex flex-col items-center group">
            <div className="relative mb-2">
              <div className="absolute -inset-2 rounded-full bg-amber-500/20 blur-md group-hover:bg-amber-500/40 transition"></div>
              <img
                src="/images/logo.png"
                alt="RV FITNESS Logo"
                className="relative h-16 w-auto object-contain drop-shadow-[0_0_15px_rgba(212,175,55,0.4)] group-hover:scale-105 transition-transform"
              />
            </div>
            <span className="text-2xl font-black text-white tracking-tight">
              RV <span className="text-gold-gradient font-black">FITNESS</span>
            </span>
            <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-amber-400 -mt-0.5">
              Narsobawadi Membership Enrollment
            </span>
          </Link>
          <h2 className="text-2xl sm:text-3xl font-black text-white">Join RV Fitness Narsobawadi</h2>
          <p className="text-xs text-zinc-400">
            Fill in your details below to receive your permanent <span className="text-amber-400 font-bold">RVF-XXXX</span> Member ID and unlock training access.
          </p>
        </div>

        {/* Selected Plan Showcase Banner */}
        {selectedPlan && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 via-yellow-600/10 to-amber-500/15 border border-amber-500/30 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                <Dumbbell className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">Selected Package</span>
                <h4 className="text-sm font-black text-white">{selectedPlan.name}</h4>
                <p className="text-[11px] text-zinc-400">{selectedPlan.duration_days} Days Access</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-lg font-black text-amber-400 font-mono">
                {formatCurrency(selectedPlan.price)}
              </span>
              <span className="block text-[10px] text-zinc-500">Includes all zone privileges</span>
            </div>
          </div>
        )}

        {/* Registration Card */}
        <div className="glass-gold p-6 sm:p-10 rounded-3xl border border-amber-500/30 shadow-2xl bg-zinc-950/90">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Membership Plan Choice */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5 flex items-center justify-between">
                <span>Select Membership Package *</span>
                <Link to="/plans" target="_blank" className="text-amber-400 hover:underline text-[11px] lowercase">
                  view tier comparison &rarr;
                </Link>
              </label>
              <select
                value={selectedPlanId}
                onChange={(e) => setSelectedPlanId(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-black border border-zinc-800 text-white focus:border-amber-500 outline-none text-sm font-semibold"
              >
                <option value="">No Plan Selected (Choose at Gym Desk)</option>
                {plans.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} — {formatCurrency(p.price)} ({p.duration_days} Days)
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5">
                  Full Legal Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rohit Deshmukh"
                    value={form.fullName}
                    onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-black border border-zinc-800 text-white placeholder-zinc-600 focus:border-amber-500 outline-none text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5">
                  Mobile Number *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3.5" />
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 9823112233"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-black border border-zinc-800 text-white placeholder-zinc-600 focus:border-amber-500 outline-none text-sm"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5">
                Email Address (Member Login ID) *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  placeholder="e.g. rohit@gmail.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-black border border-zinc-800 text-white placeholder-zinc-600 focus:border-amber-500 outline-none text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5">
                  Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    required
                    placeholder="Min 6 characters"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-black border border-zinc-800 text-white placeholder-zinc-600 focus:border-amber-500 outline-none text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5">
                  Confirm Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    required
                    placeholder="Re-type password"
                    value={form.confirmPassword}
                    onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-black border border-zinc-800 text-white placeholder-zinc-600 focus:border-amber-500 outline-none text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5">
                  Gender
                </label>
                <select
                  value={form.gender}
                  onChange={(e) => setForm({ ...form, gender: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-black border border-zinc-800 text-white focus:border-amber-500 outline-none text-sm"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5">
                  Height (cm)
                </label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="e.g. 175"
                  value={form.heightCm}
                  onChange={(e) => setForm({ ...form, heightCm: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-black border border-zinc-800 text-white placeholder-zinc-600 focus:border-amber-500 outline-none text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="e.g. 74"
                  value={form.weightKg}
                  onChange={(e) => setForm({ ...form, weightKg: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-black border border-zinc-800 text-white placeholder-zinc-600 focus:border-amber-500 outline-none text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5">
                Primary Fitness Goal
              </label>
              <select
                value={form.fitnessGoal}
                onChange={(e) => setForm({ ...form, fitnessGoal: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-black border border-zinc-800 text-white focus:border-amber-500 outline-none text-sm"
              >
                <option value="Muscle Hypertrophy & Strength">Muscle Hypertrophy & Strength</option>
                <option value="Weight Loss & Fat Reduction">Weight Loss & Fat Reduction</option>
                <option value="General Athletic Conditioning">General Athletic Conditioning</option>
                <option value="Competitive Bodybuilding">Competitive Bodybuilding</option>
                <option value="CrossFit & Flexibility">CrossFit & Flexibility</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-gold w-full py-4 rounded-xl font-bold text-sm tracking-wide flex items-center justify-center gap-2 mt-4 disabled:opacity-50 shadow-gold-glow"
            >
              {loading ? (
                <span>Generating Member Account & RVF-XXXX ID...</span>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-black" />
                  <span>Join RV Fitness Now & Continue</span>
                  <ArrowRight className="w-4 h-4 text-black" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-zinc-900 text-center text-xs text-zinc-400">
            <span>Already have an active membership? </span>
            <Link to="/login" className="text-amber-400 hover:text-amber-300 font-bold ml-1">
              Log in to your portal
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
