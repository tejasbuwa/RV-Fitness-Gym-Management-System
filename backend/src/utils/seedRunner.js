const bcrypt = require('bcryptjs');
const { pool, query } = require('../config/db');

async function seedDatabase() {
  console.log('--- Starting RV Fitness Database Seeder ---');

  // Disable FK checks temporarily for clean re-seed
  await query('SET FOREIGN_KEY_CHECKS = 0');
  await query('TRUNCATE TABLE audit_logs');
  await query('TRUNCATE TABLE receipts');
  await query('TRUNCATE TABLE payments');
  await query('TRUNCATE TABLE invoice_items');
  await query('TRUNCATE TABLE invoices');
  await query('TRUNCATE TABLE memberships');
  await query('TRUNCATE TABLE diet_meals');
  await query('TRUNCATE TABLE diet_plans');
  await query('TRUNCATE TABLE workout_exercises');
  await query('TRUNCATE TABLE workout_plans');
  await query('TRUNCATE TABLE progress_records');
  await query('TRUNCATE TABLE members');
  await query('TRUNCATE TABLE trainers');
  await query('TRUNCATE TABLE membership_plans');
  await query('TRUNCATE TABLE notices');
  await query('TRUNCATE TABLE events');
  await query('TRUNCATE TABLE posts');
  await query('TRUNCATE TABLE gym_status');
  await query('TRUNCATE TABLE users');
  await query('SET FOREIGN_KEY_CHECKS = 1');

  // Hash passwords
  const adminPass = bcrypt.hashSync('Admin@123', 10);
  const trainerPass = bcrypt.hashSync('Trainer@123', 10);
  const memberPass = bcrypt.hashSync('Member@123', 10);

  // 1. Seed Users
  console.log('Seeding Users...');
  const [adminUserRes] = await pool.execute(
    'INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)',
    ['admin@rvfitness.com', adminPass, 'admin']
  );
  const adminUserId = adminUserRes.insertId;

  const [t1UserRes] = await pool.execute(
    'INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)',
    ['vikram@rvfitness.com', trainerPass, 'trainer']
  );
  const t1UserId = t1UserRes.insertId;

  const [t2UserRes] = await pool.execute(
    'INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)',
    ['sneha@rvfitness.com', trainerPass, 'trainer']
  );
  const t2UserId = t2UserRes.insertId;

  const [m1UserRes] = await pool.execute(
    'INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)',
    ['rohit@gmail.com', memberPass, 'member']
  );
  const m1UserId = m1UserRes.insertId;

  const [m2UserRes] = await pool.execute(
    'INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)',
    ['ananya@gmail.com', memberPass, 'member']
  );
  const m2UserId = m2UserRes.insertId;

  const [m3UserRes] = await pool.execute(
    'INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)',
    ['sachin@gmail.com', memberPass, 'member']
  );
  const m3UserId = m3UserRes.insertId;

  // 2. Seed Trainers
  console.log('Seeding Trainers...');
  const [t1Res] = await pool.execute(
    `INSERT INTO trainers (user_id, full_name, phone, email, experience_years, specialization, bio, photo_url, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      t1UserId,
      'Vikram Patil',
      '9822012345',
      'vikram@rvfitness.com',
      8,
      'Strength & Conditioning, Bodybuilding',
      'Certified strength coach with 8+ years coaching athletes and bodybuilding contenders in Sangli & Kolhapur districts.',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      'active'
    ]
  );
  const t1Id = t1Res.insertId;

  const [t2Res] = await pool.execute(
    `INSERT INTO trainers (user_id, full_name, phone, email, experience_years, specialization, bio, photo_url, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      t2UserId,
      'Sneha Kulkarni',
      '9822054321',
      'sneha@rvfitness.com',
      5,
      'Weight Loss, Functional CrossFit, Nutrition',
      'Certified clinical sports nutritionist and high-intensity functional training specialist focusing on healthy fat loss.',
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
      'active'
    ]
  );
  const t2Id = t2Res.insertId;

  // 3. Seed Members
  console.log('Seeding Members...');
  const [m1Res] = await pool.execute(
    `INSERT INTO members (user_id, member_code, full_name, phone, email, gender, dob, address, emergency_contact, joining_date, status, assigned_trainer_id, height_cm, weight_kg, fitness_goal, medical_notes)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      m1UserId,
      'RVF-0001',
      'Rohit Deshmukh',
      '9823112233',
      'rohit@gmail.com',
      'Male',
      '1996-05-14',
      'Main Bazaar Road, Near Narsimha Mandir, Narsobawadi',
      'Father: 9823112200',
      '2026-01-05',
      'active',
      t1Id,
      178.5,
      82.0,
      'Muscle Hypertrophy & Strength',
      'No past cardiac or spine issues. Healthy.'
    ]
  );
  const m1Id = m1Res.insertId;

  const [m2Res] = await pool.execute(
    `INSERT INTO members (user_id, member_code, full_name, phone, email, gender, dob, address, emergency_contact, joining_date, status, assigned_trainer_id, height_cm, weight_kg, fitness_goal, medical_notes)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      m2UserId,
      'RVF-0002',
      'Ananya Joshi',
      '9823445566',
      'ananya@gmail.com',
      'Female',
      '2000-08-22',
      'Ghat Road, Ward No. 3, Narsobawadi',
      'Mother: 9823445500',
      '2026-06-10',
      'active',
      t2Id,
      163.0,
      64.5,
      'Fat Loss & Core Toning',
      'Mild ankle sprain 2 years ago, fully recovered.'
    ]
  );
  const m2Id = m2Res.insertId;

  const [m3Res] = await pool.execute(
    `INSERT INTO members (user_id, member_code, full_name, phone, email, gender, dob, address, emergency_contact, joining_date, status, assigned_trainer_id, height_cm, weight_kg, fitness_goal, medical_notes)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      m3UserId,
      'RVF-0003',
      'Sachin More',
      '9823778899',
      'sachin@gmail.com',
      'Male',
      '1998-11-03',
      'Station Road, Kurundwad / Narsobawadi Border',
      'Brother: 9823778800',
      '2026-09-10',
      'active',
      t1Id,
      172.0,
      76.0,
      'General Fitness & Endurance',
      'None.'
    ]
  );
  const m3Id = m3Res.insertId;

  // 4. Seed Membership Plans
  console.log('Seeding Membership Plans...');
  const plans = [
    {
      name: 'Monthly Starter',
      plan_type: 'Monthly',
      duration_days: 30,
      price: 1200.00,
      description: 'Ideal for trial and flexible monthly workout routines.',
      benefits: JSON.stringify(['Full gym access', 'Locker access', 'General trainer guidance', 'Cardio + Free weights'])
    },
    {
      name: 'Quarterly Pro',
      plan_type: 'Quarterly',
      duration_days: 90,
      price: 3200.00,
      description: 'Most popular 3-month package for serious transformation.',
      benefits: JSON.stringify(['Full gym access', 'Complimentary diet consultation', 'Bi-weekly body measurement review', 'Locker & Shower'])
    },
    {
      name: 'Half-Yearly Elite',
      plan_type: 'Half-Yearly',
      duration_days: 180,
      price: 5800.00,
      description: '6 months of consistent fitness progress with dedicated support.',
      benefits: JSON.stringify(['Full gym access', 'Customized workout & diet plan', 'Monthly body composition tracking', 'Priority trainer support'])
    },
    {
      name: 'Yearly Champion',
      plan_type: 'Yearly',
      duration_days: 365,
      price: 10500.00,
      description: 'Complete 1-year transformation plan with maximum savings.',
      benefits: JSON.stringify(['Year-round unlimited access', 'Personalized nutrition chart', 'Dedicated trainer allocation', 'Free gym merchandise t-shirt', 'Guest passes (3)'])
    },
    {
      name: 'Personal Training Add-on',
      plan_type: 'Custom',
      duration_days: 30,
      price: 3500.00,
      description: '1-on-1 personal coaching with customized routines every week.',
      benefits: JSON.stringify(['1-on-1 dedicated coaching', 'Daily macro & meal tracking', 'Weekly posture correction', 'Form analysis'])
    }
  ];

  const planIds = [];
  for (const p of plans) {
    const [res] = await pool.execute(
      `INSERT INTO membership_plans (name, plan_type, duration_days, price, description, benefits, status)
       VALUES (?, ?, ?, ?, ?, ?, 'active')`,
      [p.name, p.plan_type, p.duration_days, p.price, p.description, p.benefits]
    );
    planIds.push(res.insertId);
  }

  // 5. Seed Memberships
  console.log('Seeding Memberships...');
  // Rohit: Yearly Champion (Starts 2026-01-05, Ends 2027-01-05)
  const [sub1Res] = await pool.execute(
    `INSERT INTO memberships (member_id, plan_id, start_date, end_date, status, notes)
     VALUES (?, ?, '2026-01-05', '2027-01-05', 'active', 'Annual Champion member')`,
    [m1Id, planIds[3]]
  );
  const sub1Id = sub1Res.insertId;

  // Ananya: Quarterly Pro (Starts 2026-06-10, Ends 2026-09-08 -> renewed to 2026-12-08)
  const [sub2Res] = await pool.execute(
    `INSERT INTO memberships (member_id, plan_id, start_date, end_date, status, notes)
     VALUES (?, ?, '2026-09-09', '2026-12-08', 'active', 'Quarterly subscription renewed')`,
    [m2Id, planIds[1]]
  );
  const sub2Id = sub2Res.insertId;

  // Sachin: Monthly Starter (Starts 2026-09-15, Ends 2026-10-15 - Expiring Soon)
  const [sub3Res] = await pool.execute(
    `INSERT INTO memberships (member_id, plan_id, start_date, end_date, status, notes)
     VALUES (?, ?, '2026-09-15', '2026-10-15', 'expiring_soon', '1st month plan')`,
    [m3Id, planIds[0]]
  );
  const sub3Id = sub3Res.insertId;

  // 6. Seed Invoices, Items, Payments & Receipts
  console.log('Seeding Billing, Invoices & Receipts...');

  // Invoice 1: Rohit (Yearly Champion ₹10,500 - Paid)
  const [inv1Res] = await pool.execute(
    `INSERT INTO invoices (invoice_number, member_id, membership_id, invoice_date, due_date, subtotal, discount, tax_amount, final_amount, amount_paid, balance_amount, payment_status, payment_method, notes)
     VALUES (?, ?, ?, '2026-01-05', '2026-01-10', 10500.00, 500.00, 0.00, 10000.00, 10000.00, 0.00, 'paid', 'Cash', 'New annual registration')`,
    ['INV-2026-0001', m1Id, sub1Id]
  );
  const inv1Id = inv1Res.insertId;

  await pool.execute(
    `INSERT INTO invoice_items (invoice_id, description, quantity, unit_price, total_price)
     VALUES (?, ?, ?, ?, ?)`,
    [inv1Id, 'Yearly Champion Membership Plan (365 Days)', 1, 10500.00, 10500.00]
  );

  const [pay1Res] = await pool.execute(
    `INSERT INTO payments (payment_number, invoice_id, member_id, payment_date, amount, payment_method, reference_number, notes, received_by_user_id)
     VALUES (?, ?, ?, '2026-01-05', 10000.00, 'Cash', 'CASH-REC-001', 'Paid in full cash at reception', ?)`,
    ['PAY-2026-0001', inv1Id, m1Id, adminUserId]
  );
  const pay1Id = pay1Res.insertId;

  await pool.execute(
    `INSERT INTO receipts (receipt_number, payment_id, invoice_id, member_id, receipt_date, amount, remaining_balance, payment_method, reference_number, received_by_user_id, notes)
     VALUES (?, ?, ?, ?, '2026-01-05', 10000.00, 0.00, 'Cash', 'CASH-REC-001', ?, 'Received with thanks')`,
    ['RCP-2026-0001', pay1Id, inv1Id, m1Id, adminUserId]
  );

  // Invoice 2: Ananya (Quarterly Pro ₹3,200 - Partially Paid ₹2,000, Balance ₹1,200)
  const [inv2Res] = await pool.execute(
    `INSERT INTO invoices (invoice_number, member_id, membership_id, invoice_date, due_date, subtotal, discount, tax_amount, final_amount, amount_paid, balance_amount, payment_status, payment_method, notes)
     VALUES (?, ?, ?, '2026-09-09', '2026-09-15', 3200.00, 0.00, 0.00, 3200.00, 2000.00, 1200.00, 'partially_paid', 'UPI', 'Quarterly renewal with partial payment')`,
    ['INV-2026-0002', m2Id, sub2Id]
  );
  const inv2Id = inv2Res.insertId;

  await pool.execute(
    `INSERT INTO invoice_items (invoice_id, description, quantity, unit_price, total_price)
     VALUES (?, ?, ?, ?, ?)`,
    [inv2Id, 'Quarterly Pro Membership Renewal (90 Days)', 1, 3200.00, 3200.00]
  );

  const [pay2Res] = await pool.execute(
    `INSERT INTO payments (payment_number, invoice_id, member_id, payment_date, amount, payment_method, reference_number, notes, received_by_user_id)
     VALUES (?, ?, ?, '2026-09-09', 2000.00, 'UPI', 'UPI-982344-9021', 'UPI payment via PhonePe', ?)`,
    ['PAY-2026-0002', inv2Id, m2Id, adminUserId]
  );
  const pay2Id = pay2Res.insertId;

  await pool.execute(
    `INSERT INTO receipts (receipt_number, payment_id, invoice_id, member_id, receipt_date, amount, remaining_balance, payment_method, reference_number, received_by_user_id, notes)
     VALUES (?, ?, ?, ?, '2026-09-09', 2000.00, 1200.00, 'UPI', 'UPI-982344-9021', ?, 'Balance of ₹1,200 due')`,
    ['RCP-2026-0002', pay2Id, inv2Id, m2Id, adminUserId]
  );

  // Invoice 3: Sachin (Monthly Starter ₹1,200 - Pending)
  const [inv3Res] = await pool.execute(
    `INSERT INTO invoices (invoice_number, member_id, membership_id, invoice_date, due_date, subtotal, discount, tax_amount, final_amount, amount_paid, balance_amount, payment_status, payment_method, notes)
     VALUES (?, ?, ?, '2026-09-15', '2026-09-20', 1200.00, 0.00, 0.00, 1200.00, 0.00, 1200.00, 'pending', 'Cash', 'Payment pending at desk')`,
    ['INV-2026-0003', m3Id, sub3Id]
  );
  const inv3Id = inv3Res.insertId;

  await pool.execute(
    `INSERT INTO invoice_items (invoice_id, description, quantity, unit_price, total_price)
     VALUES (?, ?, ?, ?, ?)`,
    [inv3Id, 'Monthly Starter Membership Plan (30 Days)', 1, 1200.00, 1200.00]
  );

  // 7. Seed Workout Plans
  console.log('Seeding Workout Plans & Exercises...');
  const [w1Res] = await pool.execute(
    `INSERT INTO workout_plans (member_id, trainer_id, title, goal, start_date, end_date, status, notes)
     VALUES (?, ?, 'Hypertrophy & Strength 5-Day Split', 'Build lean muscle mass and improve bench/squat strength', '2026-01-10', '2026-12-31', 'active', 'Warm up 10 mins with dynamic stretches before each session.')`,
    [m1Id, t1Id]
  );
  const w1Id = w1Res.insertId;

  const exercises = [
    { day: 'Monday', name: 'Barbell Bench Press', muscle: 'Chest', sets: 4, reps: '8-10', dur: 15, rest: 90, inst: 'Keep shoulder blades retracted, touch chest smoothly.' },
    { day: 'Monday', name: 'Incline Dumbbell Press', muscle: 'Chest', sets: 3, reps: '10-12', dur: 12, rest: 60, inst: 'Incline bench at 30 degrees.' },
    { day: 'Monday', name: 'Tricep Rope Pushdown', muscle: 'Triceps', sets: 3, reps: '12-15', dur: 10, rest: 60, inst: 'Squeeze triceps at bottom extension.' },
    { day: 'Tuesday', name: 'Barbell Deadlift', muscle: 'Back', sets: 4, reps: '6-8', dur: 20, rest: 120, inst: 'Maintain neutral spine, push through heels.' },
    { day: 'Tuesday', name: 'Lat Pulldowns', muscle: 'Back', sets: 4, reps: '10-12', dur: 12, rest: 60, inst: 'Pull towards upper sternum.' },
    { day: 'Wednesday', name: 'Barbell Back Squat', muscle: 'Legs', sets: 4, reps: '8-10', dur: 20, rest: 90, inst: 'Descend to parallel, brace core.' },
    { day: 'Wednesday', name: 'Leg Press', muscle: 'Quads / Glutes', sets: 3, reps: '12-15', dur: 12, rest: 60, inst: 'Do not lock knees at the peak.' },
    { day: 'Thursday', name: 'Overhead Military Press', muscle: 'Shoulders', sets: 4, reps: '8-10', dur: 15, rest: 90, inst: 'Strict vertical press.' },
    { day: 'Friday', name: 'Barbell Bicep Curls', muscle: 'Biceps', sets: 3, reps: '10-12', dur: 10, rest: 60, inst: 'Elbows pinned to sides.' }
  ];

  for (const ex of exercises) {
    await pool.execute(
      `INSERT INTO workout_exercises (workout_plan_id, day_of_week, exercise_name, muscle_group, sets, repetitions, duration_mins, rest_seconds, instructions)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [w1Id, ex.day, ex.name, ex.muscle, ex.sets, ex.reps, ex.dur, ex.rest, ex.inst]
    );
  }

  // 8. Seed Diet Plans
  console.log('Seeding Diet Plans & Meals...');
  const [d1Res] = await pool.execute(
    `INSERT INTO diet_plans (member_id, trainer_id, title, target_calories, daily_protein_g, daily_carbs_g, daily_fat_g, notes, status)
     VALUES (?, ?, 'High-Protein Muscle Growth Regimen', 2450, 160, 280, 65, 'Drink at least 3.5 liters of clean water daily. Avoid sugary processed drinks.', 'active')`,
    [m1Id, t1Id]
  );
  const d1Id = d1Res.insertId;

  const meals = [
    { meal: 'Breakfast', timing: '07:30 AM', food: '4 Boiled Egg Whites + 2 Whole Eggs + 1 cup Rolled Oats with Almonds & Milk', qty: '1 Plate', cal: 520, pro: 32, notes: 'Rich in slow-release carbs and clean albumin protein.' },
    { meal: 'Mid-Morning', timing: '10:30 AM', food: '1 Seasonal Banana + 1 scoop Whey Protein with Water', qty: '1 Shake', cal: 240, pro: 26, notes: 'Post-commute muscle glycogen replenishment.' },
    { meal: 'Lunch', timing: '01:30 PM', food: '150g Grilled Chicken Breast or Paneer Bhurji + 2 Multigrain Rotis + Dal Bowl + Green Salad', qty: '1 Thali', cal: 680, pro: 45, notes: 'Balanced meal with high fiber.' },
    { meal: 'Pre-Workout Snack', timing: '05:00 PM', food: '2 Slices Brown Bread with 1 tbsp Natural Peanut Butter + Black Coffee', qty: '2 Toast', cal: 260, pro: 10, notes: 'Take 45 minutes prior to gym workout.' },
    { meal: 'Dinner', timing: '08:30 PM', food: '1 Bowl Brown Rice + Soya Chunks Curry or Fish Curry + Steamed Veggies', qty: '1 Bowl', cal: 550, pro: 38, notes: 'Light digestion carbohydrate and amino acids for overnight recovery.' }
  ];

  for (const m of meals) {
    await pool.execute(
      `INSERT INTO diet_meals (diet_plan_id, meal_name, timing, food_items, quantity, calories, protein_g, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [d1Id, m.meal, m.timing, m.food, m.qty, m.cal, m.pro, m.notes]
    );
  }

  // 9. Seed Progress Records
  console.log('Seeding Progress Records...');
  const progressEntries = [
    { member: m1Id, user: t1UserId, date: '2026-01-10', weight: 85.5, height: 178.5, bmi: 26.8, chest: 40.0, waist: 35.0, arms: 14.0, obs: 'Initial baseline assessment upon joining RV Fitness.' },
    { member: m1Id, user: t1UserId, date: '2026-04-10', weight: 83.5, height: 178.5, bmi: 26.2, chest: 41.0, waist: 33.5, arms: 14.8, obs: 'Good reduction in waist circumference, bicep peak improved.' },
    { member: m1Id, user: t1UserId, date: '2026-07-15', weight: 82.0, height: 178.5, bmi: 25.7, chest: 42.0, waist: 32.0, arms: 15.5, obs: 'Substantial lean mass improvement; chest +2 inches, waist -3 inches.' },
    { member: m2Id, user: t2UserId, date: '2026-06-12', weight: 68.0, height: 163.0, bmi: 25.6, chest: 36.0, waist: 32.0, arms: 11.5, obs: 'Initial onboarding assessment.' },
    { member: m2Id, user: t2UserId, date: '2026-09-10', weight: 64.5, height: 163.0, bmi: 24.3, chest: 34.5, waist: 29.5, arms: 11.0, obs: 'Outstanding 3.5 kg healthy fat reduction! Energy levels noticeably elevated.' }
  ];

  for (const p of progressEntries) {
    await pool.execute(
      `INSERT INTO progress_records (member_id, recorded_by_user_id, recorded_date, weight_kg, height_cm, bmi, chest_inches, waist_inches, arms_inches, fitness_observations)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [p.member, p.user, p.date, p.weight, p.height, p.bmi, p.chest, p.waist, p.arms, p.obs]
    );
  }

  // 10. Seed Notices, Events & Posts
  console.log('Seeding Notices, Events & Posts...');
  await pool.execute(
    `INSERT INTO notices (title, content, target_audience, is_active, publish_date, created_by_user_id)
     VALUES (?, ?, 'all', 1, '2026-10-01', ?)`,
    [
      'Diwali Festival Gym Timings Announcement',
      'Dear RV Fitness Members, On the auspicious occasion of Diwali (Laxmi Pujan), morning session will operate 06:00 AM - 09:30 AM. Evening session remains closed for festivities. Regular timings resume from next day.',
      adminUserId
    ]
  );

  await pool.execute(
    `INSERT INTO notices (title, content, target_audience, is_active, publish_date, created_by_user_id)
     VALUES (?, ?, 'members', 1, '2026-10-05', ?)`,
    [
      'Personal Hygiene & Towel Policy Mandatory',
      'To maintain optimal hygiene across cardio and strength zones, all members are kindly requested to bring their gym towels and clean indoor workout shoes.',
      adminUserId
    ]
  );

  await pool.execute(
    `INSERT INTO events (event_name, description, event_date, event_time, location, image_url, status, created_by_user_id)
     VALUES (?, ?, '2026-10-25', '04:00 PM - 08:00 PM', 'RV Fitness Arena, Narsobawadi', 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80', 'upcoming', ?)`,
    [
      'Narsobawadi Open Arm Wrestling & Deadlift Challenge',
      'Annual strength showdown for all fitness enthusiasts in Kolhapur & Sangli border region. Exciting cash prizes, protein supplements, and championship trophies!',
      adminUserId
    ]
  );

  await pool.execute(
    `INSERT INTO posts (title, category, content, image_url, is_published, publish_date, created_by_user_id)
     VALUES (?, 'tip', ?, 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80', 1, '2026-10-02', ?)`,
    [
      '5 Rules for Optimal Post-Workout Recovery',
      '1. Hydrate immediately with electrolytes.\n2. Ingest 25-30g of fast absorbing protein within 45 minutes.\n3. Do not skip cool-down stretching.\n4. Prioritize 7-8 hours of deep restorative sleep.\n5. Consistency beats extreme intensity every single time.',
      adminUserId
    ]
  );

  await pool.execute(
    `INSERT INTO posts (title, category, content, image_url, is_published, publish_date, created_by_user_id)
     VALUES (?, 'achievement', ?, 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=600&q=80', 1, '2026-10-04', ?)`,
    [
      'Transformation Spotlight: Rohit Deshmukh (-3.5 kg Fat, +3 kg Muscle)',
      'Congratulations to our member Rohit Deshmukh for his outstanding 9-month transformation under Head Coach Vikram Patil! Dedication, clean nutrition, and zero skipped workout days.',
      adminUserId
    ]
  );

  // 11. Seed Gym Status
  console.log('Seeding Gym Status...');
  await pool.execute(
    `INSERT INTO gym_status (id, status, notice_message, today_opening_time, today_closing_time, updated_by_user_id)
     VALUES (1, 'OPEN', 'RV Fitness Narsobawadi is OPEN. Morning Batch: 05:30 AM - 10:00 AM | Evening Batch: 05:00 PM - 10:00 PM.', '05:30 AM', '10:00 PM', ?)
     ON DUPLICATE KEY UPDATE status=VALUES(status), notice_message=VALUES(notice_message)`,
    [adminUserId]
  );

  // 12. Seed Initial Audit Log
  await pool.execute(
    `INSERT INTO audit_logs (user_id, action, entity_type, entity_id, details, ip_address)
     VALUES (?, 'SYSTEM_SEEDED', 'system', 1, 'Initial database seeding executed with production sample data.', '127.0.0.1')`,
    [adminUserId]
  );

  console.log('--- RV Fitness Database Seeder Completed Successfully! ---');
  process.exit(0);
}

seedDatabase().catch((err) => {
  console.error('Seeder failed:', err);
  process.exit(1);
});
