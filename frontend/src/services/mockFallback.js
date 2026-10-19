// Standalone mock fallback for static production hosts (e.g. Vercel) when backend is offline or unconfigured
export const mockTrainers = [
  {
    id: 1,
    full_name: 'Vikram Patil',
    phone: '9822012345',
    email: 'vikram@rvfitness.com',
    experience_years: 8,
    specialization: 'Strength & Conditioning, Bodybuilding',
    bio: 'Certified strength coach with 8+ years coaching athletes and bodybuilding contenders in Sangli & Kolhapur districts.',
    photo_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    status: 'active'
  },
  {
    id: 2,
    full_name: 'Sneha Kulkarni',
    phone: '9822054321',
    email: 'sneha@rvfitness.com',
    experience_years: 5,
    specialization: 'Weight Loss, Functional CrossFit, Nutrition',
    bio: 'Certified clinical sports nutritionist and high-intensity functional training specialist focusing on healthy fat loss.',
    photo_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    status: 'active'
  }
];

export const mockPlans = [
  {
    id: 1,
    name: 'Monthly Starter',
    plan_type: 'Monthly',
    duration_days: 30,
    price: 1200.00,
    description: 'Ideal for trial and flexible monthly workout routines.',
    benefits: ['Full gym access', 'Locker access', 'General trainer guidance', 'Cardio + Free weights'],
    status: 'active'
  },
  {
    id: 2,
    name: 'Quarterly Pro',
    plan_type: 'Quarterly',
    duration_days: 90,
    price: 3200.00,
    description: 'Most popular 3-month package for serious transformation.',
    benefits: ['Full gym access', 'Complimentary diet consultation', 'Bi-weekly body measurement review', 'Locker & Shower'],
    status: 'active'
  },
  {
    id: 3,
    name: 'Half-Yearly Elite',
    plan_type: 'Half-Yearly',
    duration_days: 180,
    price: 5800.00,
    description: '6 months of consistent fitness progress with dedicated support.',
    benefits: ['Full gym access', 'Customized workout & diet plan', 'Monthly body composition tracking', 'Priority trainer support'],
    status: 'active'
  },
  {
    id: 4,
    name: 'Yearly Champion',
    plan_type: 'Yearly',
    duration_days: 365,
    price: 10500.00,
    description: 'Complete 1-year transformation plan with maximum savings.',
    benefits: ['Year-round unlimited access', 'Personalized nutrition chart', 'Dedicated trainer allocation', 'Free gym merchandise t-shirt', 'Guest passes (3)'],
    status: 'active'
  }
];

export const mockMembers = [
  {
    id: 1,
    member_code: 'RVF-0001',
    full_name: 'Rohit Deshmukh',
    phone: '9823112233',
    email: 'rohit@gmail.com',
    gender: 'Male',
    status: 'active',
    joining_date: '2026-01-05',
    assigned_trainer_id: 1,
    trainer_name: 'Vikram Patil',
    plan_name: 'Yearly Champion',
    height_cm: 178.5,
    weight_kg: 82.0,
    fitness_goal: 'Muscle Hypertrophy & Strength'
  },
  {
    id: 2,
    member_code: 'RVF-0002',
    full_name: 'Ananya Joshi',
    phone: '9823445566',
    email: 'ananya@gmail.com',
    gender: 'Female',
    status: 'active',
    joining_date: '2026-06-10',
    assigned_trainer_id: 2,
    trainer_name: 'Sneha Kulkarni',
    plan_name: 'Quarterly Pro',
    height_cm: 163.0,
    weight_kg: 64.5,
    fitness_goal: 'Fat Loss & Core Toning'
  },
  {
    id: 3,
    member_code: 'RVF-0003',
    full_name: 'Sachin More',
    phone: '9823778899',
    email: 'sachin@gmail.com',
    gender: 'Male',
    status: 'active',
    joining_date: '2026-09-10',
    assigned_trainer_id: 1,
    trainer_name: 'Vikram Patil',
    plan_name: 'Monthly Starter',
    height_cm: 172.0,
    weight_kg: 76.0,
    fitness_goal: 'General Fitness & Endurance'
  },
  {
    id: 4,
    member_code: 'RVF-0004',
    full_name: 'Rohan Patil',
    phone: '9822998877',
    email: 'rohan.patil@testexample.com',
    gender: 'Male',
    status: 'active',
    joining_date: '2026-10-01',
    assigned_trainer_id: 1,
    trainer_name: 'Vikram Patil',
    plan_name: 'Quarterly Pro',
    height_cm: 175.0,
    weight_kg: 80.0,
    fitness_goal: 'Bodybuilding'
  }
];

export const mockInvoices = [
  {
    id: 1,
    invoice_number: 'INV-2026-0001',
    member_id: 1,
    member_name: 'Rohit Deshmukh',
    member_code: 'RVF-0001',
    invoice_date: '2026-01-05',
    due_date: '2026-01-10',
    final_amount: 10500.00,
    amount_paid: 10500.00,
    balance_amount: 0.00,
    payment_status: 'paid',
    payment_method: 'Cash'
  },
  {
    id: 2,
    invoice_number: 'INV-2026-0002',
    member_id: 2,
    member_name: 'Ananya Joshi',
    member_code: 'RVF-0002',
    invoice_date: '2026-09-09',
    due_date: '2026-09-15',
    final_amount: 3200.00,
    amount_paid: 2000.00,
    balance_amount: 1200.00,
    payment_status: 'partially_paid',
    payment_method: 'UPI'
  },
  {
    id: 3,
    invoice_number: 'INV-2026-0003',
    member_id: 3,
    member_name: 'Sachin More',
    member_code: 'RVF-0003',
    invoice_date: '2026-09-15',
    due_date: '2026-09-20',
    final_amount: 1200.00,
    amount_paid: 0.00,
    balance_amount: 1200.00,
    payment_status: 'pending',
    payment_method: 'Cash'
  }
];

export const mockReceipts = [
  {
    id: 1,
    receipt_number: 'REC-2026-0001',
    invoice_id: 1,
    invoice_number: 'INV-2026-0001',
    member_id: 1,
    member_name: 'Rohit Deshmukh',
    member_code: 'RVF-0001',
    amount_paid: 10500.00,
    payment_method: 'Cash',
    payment_date: '2026-01-05',
    notes: 'Full payment received for 1-Year Champion membership plan'
  },
  {
    id: 2,
    receipt_number: 'REC-2026-0002',
    invoice_id: 2,
    invoice_number: 'INV-2026-0002',
    member_id: 2,
    member_name: 'Ananya Joshi',
    member_code: 'RVF-0002',
    amount_paid: 2000.00,
    payment_method: 'UPI',
    payment_date: '2026-09-09',
    notes: 'Advance installment payment received via UPI'
  }
];

export const mockAuditLogs = [
  {
    id: 1,
    action: 'MEMBER_REGISTERED',
    entity_type: 'member',
    entity_id: 4,
    details: 'New member registered: Rohan Patil (RVF-0004)',
    ip_address: '127.0.0.1',
    created_at: '2026-10-18T10:30:00Z',
    user_email: 'admin@rvfitness.com'
  },
  {
    id: 2,
    action: 'PAYMENT_RECEIVED',
    entity_type: 'payment',
    entity_id: 2,
    details: 'Received ₹2,000 for Invoice INV-2026-0002 via UPI',
    ip_address: '127.0.0.1',
    created_at: '2026-10-17T14:15:00Z',
    user_email: 'admin@rvfitness.com'
  },
  {
    id: 3,
    action: 'ADMIN_LOGIN',
    entity_type: 'auth',
    entity_id: 1,
    details: 'Admin logged into RV Fitness Executive Portal',
    ip_address: '127.0.0.1',
    created_at: '2026-10-19T07:20:00Z',
    user_email: 'admin@rvfitness.com'
  }
];

export const mockWorkout = {
  id: 1,
  title: 'Hypertrophy 5-Day Split',
  description: 'Chest, Back, Shoulders, Legs, and Core rotation with progressive overload.',
  status: 'active',
  exercises: [
    { name: 'Barbell Bench Press', sets: 4, reps: '8-10', target_muscle: 'Chest' },
    { name: 'Incline Dumbbell Press', sets: 3, reps: '10-12', target_muscle: 'Upper Chest' },
    { name: 'Lat Pulldowns', sets: 4, reps: '10-12', target_muscle: 'Back' },
    { name: 'Seated Cable Rows', sets: 3, reps: '12', target_muscle: 'Mid Back' },
    { name: 'Overhead Barbell Press', sets: 4, reps: '8-10', target_muscle: 'Deltoids' },
    { name: 'Barbell Squats', sets: 4, reps: '8-10', target_muscle: 'Quadriceps' },
    { name: 'Romanian Deadlifts', sets: 3, reps: '10-12', target_muscle: 'Hamstrings' }
  ]
};

export const mockDiet = {
  id: 1,
  title: 'High-Protein Muscle Growth Plan',
  target_calories: 2450,
  protein_grams: 165,
  carbs_grams: 270,
  fats_grams: 65,
  notes: 'Drink at least 3.5 liters of clean water daily. Avoid sugary packaged snacks.',
  meals: [
    { meal_time: '07:30 AM', meal_name: 'Breakfast', items: 'Oats with milk, 4 egg whites / paneer, 1 banana' },
    { meal_time: '11:00 AM', meal_name: 'Mid-Morning', items: 'Handful of almonds & walnuts, 1 apple' },
    { meal_time: '01:30 PM', meal_name: 'Lunch', items: 'Brown rice / 3 rotis, chicken breast / soya chunks, dal, green salad' },
    { meal_time: '05:00 PM', meal_name: 'Pre-Workout', items: 'Black coffee, 2 slices whole wheat bread with peanut butter' },
    { meal_time: '08:30 PM', meal_name: 'Post-Workout Dinner', items: 'Whey protein shake / boiled eggs, stir-fried vegetables, paneer bhurji' }
  ]
};

export const mockProgress = [
  { id: 1, recorded_date: '2026-07-15', weight_kg: 82.0, chest_cm: 105, waist_cm: 86, arms_cm: 38, notes: 'Good strength gains on bench press' },
  { id: 2, recorded_date: '2026-08-15', weight_kg: 81.2, chest_cm: 106, waist_cm: 84, arms_cm: 38.5, notes: 'Visible fat loss around waist' },
  { id: 3, recorded_date: '2026-09-15', weight_kg: 80.5, chest_cm: 106.5, waist_cm: 83, arms_cm: 39, notes: 'Solid arm growth and shoulder definition' }
];

export const mockGymStatus = {
  id: 1,
  status: 'OPEN',
  noticeMessage: 'RV Fitness Narsobawadi is operating normally. Morning Batch: 05:30 AM - 10:00 AM | Evening Batch: 04:30 PM - 10:00 PM.',
  todayOpeningTime: '05:30 AM',
  todayClosingTime: '10:00 PM'
};

export const mockNotices = [
  {
    id: 1,
    title: 'Diwali Festival Gym Timings Announcement',
    content: 'Dear RV Fitness Members, On the auspicious occasion of Diwali (Laxmi Pujan), morning session will operate 06:00 AM - 09:30 AM. Evening session remains closed for festivities. Regular timings resume from next day.',
    target_audience: 'all',
    is_active: 1,
    publish_date: '2026-10-01'
  },
  {
    id: 2,
    title: 'Personal Hygiene & Towel Policy Mandatory',
    content: 'To maintain optimal hygiene across cardio and strength zones, all members are kindly requested to bring their gym towels and clean indoor workout shoes.',
    target_audience: 'members',
    is_active: 1,
    publish_date: '2026-10-05'
  }
];

export const mockEvents = [
  {
    id: 1,
    event_name: 'Narsobawadi Open Arm Wrestling & Deadlift Challenge',
    description: 'Annual strength showdown for all fitness enthusiasts in Kolhapur & Sangli border region. Exciting cash prizes, protein supplements, and championship trophies!',
    event_date: '2026-10-25',
    event_time: '04:00 PM - 08:00 PM',
    location: 'RV Fitness Arena, Narsobawadi',
    image_url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80',
    status: 'upcoming'
  }
];

export const mockPosts = [
  {
    id: 1,
    title: '5 Rules for Optimal Post-Workout Recovery',
    category: 'tip',
    content: '1. Hydrate immediately with electrolytes.\n2. Ingest 25-30g of fast absorbing protein within 45 minutes.\n3. Do not skip cool-down stretching.\n4. Prioritize 7-8 hours of deep restorative sleep.\n5. Consistency beats extreme intensity every single time.',
    image_url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80',
    is_published: 1,
    publish_date: '2026-10-02'
  }
];

export const mockAdminDashboard = {
  stats: {
    totalMembers: 48,
    activeMembers: 44,
    expiringMemberships: 3,
    expiredMemberships: 1,
    todayCollection: 4500,
    monthlyRevenue: 85200,
    pendingAmount: 6400,
    overdueAmount: 1200,
    totalRevenue: 245000,
    totalTrainers: 4
  },
  gymStatus: mockGymStatus,
  revenueTrend: [
    { month_name: 'May', revenue: 62000 },
    { month_name: 'Jun', revenue: 71000 },
    { month_name: 'Jul', revenue: 78000 },
    { month_name: 'Aug', revenue: 82000 },
    { month_name: 'Sep', revenue: 89000 },
    { month_name: 'Oct', revenue: 85200 }
  ],
  recentMembers: mockMembers,
  recentInvoices: mockInvoices,
  recentPayments: [
    { id: 1, payment_number: 'PAY-2026-0001', member_name: 'Rohit Deshmukh', amount: 10500, payment_method: 'Cash', payment_date: '2026-01-05' },
    { id: 2, payment_number: 'PAY-2026-0002', member_name: 'Ananya Joshi', amount: 2000, payment_method: 'UPI', payment_date: '2026-09-09' }
  ]
};

export const mockReportData = [
  { label: 'May 2026', total: 62000, count: 18 },
  { label: 'Jun 2026', total: 71000, count: 22 },
  { label: 'Jul 2026', total: 78000, count: 25 },
  { label: 'Aug 2026', total: 82000, count: 27 },
  { label: 'Sep 2026', total: 89000, count: 31 },
  { label: 'Oct 2026', total: 85200, count: 29 }
];

export const mockReportSummary = {
  totalRevenue: 245000,
  totalTransactions: 48,
  activeCount: 44,
  pendingCount: 4
};

// Handle fallback requests when backend is unreachable or returns 404/405 on static deployments
export function getMockResponse(config) {
  const url = (config.url || '').toLowerCase();
  const method = (config.method || 'get').toLowerCase();

  // 1. Auth Login
  if (url.includes('/login') && method === 'post') {
    let body = {};
    try { body = typeof config.data === 'string' ? JSON.parse(config.data) : (config.data || {}); } catch (e) {}
    const email = String(body.email || '').trim().toLowerCase();
    const pass = String(body.password || '').trim();

    if ((email === 'admin@rvfitness.com' || email === 'admin') && (pass === 'Admin@123' || pass === 'admin123')) {
      return {
        success: true,
        message: 'Login successful (Executive Access).',
        token: 'rv_demo_jwt_admin_session_token_2026',
        user: { id: 1, email: 'admin@rvfitness.com', role: 'admin', fullName: 'RV Fitness Administrator', photoUrl: null }
      };
    }
    if ((email === 'vikram@rvfitness.com' || email === 'vikram') && (pass === 'Trainer@123' || pass === 'trainer123')) {
      return {
        success: true,
        message: 'Login successful (Head Coach).',
        token: 'rv_demo_jwt_trainer_session_token_2026',
        user: { id: 2, email: 'vikram@rvfitness.com', role: 'trainer', fullName: 'Vikram Patil', trainerId: 1, specialization: 'Strength & Conditioning', photoUrl: null }
      };
    }
    if ((email === 'sneha@rvfitness.com' || email === 'sneha') && (pass === 'Trainer@123' || pass === 'trainer123')) {
      return {
        success: true,
        message: 'Login successful (Coach Sneha).',
        token: 'rv_demo_jwt_trainer_session_token_2026',
        user: { id: 3, email: 'sneha@rvfitness.com', role: 'trainer', fullName: 'Sneha Kulkarni', trainerId: 2, specialization: 'Nutrition & CrossFit', photoUrl: null }
      };
    }
    if ((email === 'rohit@gmail.com' || email === 'rvf-0001' || email === 'rohit') && (pass === 'Member@123' || pass === 'member123')) {
      return {
        success: true,
        message: 'Login successful (Member Portal).',
        token: 'rv_demo_jwt_member_session_token_2026',
        user: { id: 4, email: 'rohit@gmail.com', role: 'member', fullName: 'Rohit Deshmukh', memberId: 1, memberCode: 'RVF-0001', photoUrl: null }
      };
    }
    return {
      success: false,
      message: 'Invalid credentials. For live demo, please click one of the 1-Click Demo Login pills (Admin, Vikram, Sneha, Rohit) or use Admin@123.'
    };
  }

  // 2. Auth Register
  if (url.includes('/register') && method === 'post') {
    let body = {};
    try { body = typeof config.data === 'string' ? JSON.parse(config.data) : (config.data || {}); } catch (e) {}
    const newCode = `RVF-${Math.floor(1000 + Math.random() * 9000)}`;
    const newInv = `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    return {
      success: true,
      message: `Registration successful! Welcome to RV Fitness. Your Member ID is ${newCode}.`,
      token: `rv_demo_jwt_reg_${Date.now()}`,
      user: {
        id: Math.floor(100 + Math.random() * 900),
        email: body.email,
        role: 'member',
        fullName: body.fullName || 'New Member',
        memberCode: newCode,
        memberId: 99
      },
      membership: { planId: body.planId || 2, planName: 'Selected Membership', startDate: new Date().toISOString().split('T')[0], status: 'active' },
      invoice: { invoiceNumber: newInv, amount: 3200, dueDate: new Date().toISOString().split('T')[0], paymentStatus: 'pending' }
    };
  }

  // 3. Forgot Password
  if (url.includes('/forgot-password') && method === 'post') {
    const generatedToken = 'RVF-DEMO-RESET-KEY-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    return {
      success: true,
      message: 'Password reset code generated successfully. For testing, the token has been auto-provided.',
      resetToken: generatedToken
    };
  }

  // 4. Reset Password
  if (url.includes('/reset-password') && method === 'post') {
    return {
      success: true,
      message: 'Password has been reset successfully. You may now login.'
    };
  }

  // 5. Auth Me
  if (url.includes('/me') && method === 'get') {
    const savedUser = localStorage.getItem('rv_fitness_user');
    if (savedUser) {
      try { return { success: true, user: JSON.parse(savedUser) }; } catch (e) {}
    }
    return { success: true, user: { id: 1, email: 'admin@rvfitness.com', role: 'admin', fullName: 'RV Fitness Administrator' } };
  }

  // 6. Dashboards
  if (url.includes('/dashboard/admin')) return { success: true, ...mockAdminDashboard };
  if (url.includes('/dashboard/member')) {
    return {
      success: true,
      member: mockMembers[0],
      membership: { plan_name: 'Yearly Champion', status: 'active', end_date: '2027-01-05' },
      workoutPlan: mockWorkout,
      dietPlan: mockDiet,
      recentProgress: mockProgress[0],
      unpaidInvoices: 0
    };
  }
  if (url.includes('/dashboard/trainer')) {
    return {
      success: true,
      stats: { totalAssignedMembers: 12, activeWorkouts: 8, activeDiets: 8, logsThisWeek: 15 },
      assignedMembers: mockMembers
    };
  }

  // 7. Entities & Operations
  if (url.includes('/trainers')) {
    if (method === 'get') return { success: true, trainers: mockTrainers };
    return { success: true, message: 'Trainer updated successfully.' };
  }

  if (url.includes('/membership-plans') || url.includes('/plans')) {
    if (method === 'get') return { success: true, plans: mockPlans };
    return { success: true, message: 'Membership plan updated successfully.' };
  }

  if (url.includes('/members')) {
    if (method === 'get') {
      const matchId = url.match(/\/members\/(\d+)/);
      if (matchId) {
        return {
          success: true,
          member: {
            ...mockMembers[0],
            memberships: [{ id: 1, plan_name: 'Yearly Champion', plan_type: 'Yearly', start_date: '2026-01-05', end_date: '2027-01-05', status: 'active', price: 10500 }],
            invoices: mockInvoices,
            receipts: mockReceipts,
            workouts: [mockWorkout],
            diets: [mockDiet],
            progress: mockProgress
          },
          members: mockMembers
        };
      }
      return { success: true, members: mockMembers };
    }
    return { success: true, message: 'Member action saved successfully.' };
  }

  if (url.includes('/invoices')) {
    if (method === 'get') {
      const matchId = url.match(/\/invoices\/(\d+)/);
      if (matchId) {
        return { success: true, invoice: mockInvoices[0], invoices: mockInvoices };
      }
      return { success: true, invoices: mockInvoices };
    }
    return { success: true, message: 'Invoice updated successfully.' };
  }

  if (url.includes('/payments')) {
    if (method === 'get') return { success: true, payments: mockAdminDashboard.recentPayments };
    return { success: true, message: 'Payment recorded successfully.' };
  }

  if (url.includes('/receipts')) {
    if (method === 'get') {
      const matchId = url.match(/\/receipts\/(\d+)/);
      if (matchId) {
        return { success: true, receipt: mockReceipts[0], receipts: mockReceipts };
      }
      return { success: true, receipts: mockReceipts };
    }
    return { success: true, message: 'Receipt updated successfully.' };
  }

  if (url.includes('/audit-logs')) return { success: true, auditLogs: mockAuditLogs };
  if (url.includes('/reports')) return { success: true, data: mockReportData, summary: mockReportSummary };
  if (url.includes('/gym-status')) return { success: true, status: mockGymStatus };
  if (url.includes('/notices')) return { success: true, notices: mockNotices };
  if (url.includes('/events')) return { success: true, events: mockEvents };
  if (url.includes('/posts')) return { success: true, posts: mockPosts };
  if (url.includes('/workouts')) return { success: true, workout: mockWorkout, workouts: [mockWorkout] };
  if (url.includes('/diets')) return { success: true, diet: mockDiet, diets: [mockDiet] };
  if (url.includes('/progress')) return { success: true, progress: mockProgress };

  // Default catch-all for any other API mutation
  if (method === 'post' || method === 'put' || method === 'patch' || method === 'delete') {
    return { success: true, message: 'Operation saved successfully.' };
  }

  return null;
}
