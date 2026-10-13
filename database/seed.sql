-- RV FITNESS – GYM MANAGEMENT SYSTEM (Narsobawadi)
-- Database Seed Script: MySQL 8.0
USE rv_fitness_db;

-- 1. USERS (Pass: Admin@123 for admin, Trainer@123 for trainer, Member@123 for members)
INSERT INTO users (id, email, password_hash, role, is_active) VALUES
(1, 'admin@rvfitness.com', '$2a$10$0z8qG2QWbMwqBq2R2P7gveLXZe0/2kC0eU2fWw5v51e5Z1v6v4p1C', 'admin', 1),
(2, 'vikram@rvfitness.com', '$2a$10$3z7qG2QWbMwqBq2R2P7gveLXZe0/2kC0eU2fWw5v51e5Z1v6v4p1C', 'trainer', 1),
(3, 'sneha@rvfitness.com', '$2a$10$3z7qG2QWbMwqBq2R2P7gveLXZe0/2kC0eU2fWw5v51e5Z1v6v4p1C', 'trainer', 1),
(4, 'rohit@gmail.com', '$2a$10$5z6qG2QWbMwqBq2R2P7gveLXZe0/2kC0eU2fWw5v51e5Z1v6v4p1C', 'member', 1),
(5, 'ananya@gmail.com', '$2a$10$5z6qG2QWbMwqBq2R2P7gveLXZe0/2kC0eU2fWw5v51e5Z1v6v4p1C', 'member', 1),
(6, 'sachin@gmail.com', '$2a$10$5z6qG2QWbMwqBq2R2P7gveLXZe0/2kC0eU2fWw5v51e5Z1v6v4p1C', 'member', 1)
ON DUPLICATE KEY UPDATE email=VALUES(email);

-- 2. TRAINERS
INSERT INTO trainers (id, user_id, full_name, phone, email, experience_years, specialization, bio, photo_url, status) VALUES
(1, 2, 'Vikram Patil', '9822012345', 'vikram@rvfitness.com', 8, 'Strength & Conditioning, Bodybuilding', 'Senior coach with 8+ years experience training competitive lifters.', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80', 'active'),
(2, 3, 'Sneha Kulkarni', '9822054321', 'sneha@rvfitness.com', 5, 'Weight Loss, CrossFit, Nutrition', 'Certified clinical sports nutritionist and high-intensity trainer.', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80', 'active')
ON DUPLICATE KEY UPDATE full_name=VALUES(full_name);

-- 3. MEMBERS
INSERT INTO members (id, user_id, member_code, full_name, phone, email, gender, dob, address, emergency_contact, joining_date, status, assigned_trainer_id, height_cm, weight_kg, fitness_goal, medical_notes) VALUES
(1, 4, 'RVF-0001', 'Rohit Deshmukh', '9823112233', 'rohit@gmail.com', 'Male', '1996-05-14', 'Main Bazaar Road, Near Narsimha Mandir, Narsobawadi', 'Father: 9823112200', '2026-01-05', 'active', 1, 178.5, 82.0, 'Muscle Hypertrophy & Strength', 'Healthy.'),
(2, 5, 'RVF-0002', 'Ananya Joshi', '9823445566', 'ananya@gmail.com', 'Female', '2000-08-22', 'Ghat Road, Ward No. 3, Narsobawadi', 'Mother: 9823445500', '2026-06-10', 'active', 2, 163.0, 64.5, 'Fat Loss & Core Toning', 'Healthy.'),
(3, 6, 'RVF-0003', 'Sachin More', '9823778899', 'sachin@gmail.com', 'Male', '1998-11-03', 'Station Road, Kurundwad / Narsobawadi Border', 'Brother: 9823778800', '2026-09-10', 'active', 1, 172.0, 76.0, 'General Fitness & Endurance', 'Healthy.')
ON DUPLICATE KEY UPDATE full_name=VALUES(full_name);

-- 4. MEMBERSHIP PLANS
INSERT INTO membership_plans (id, name, plan_type, duration_days, price, description, benefits, status) VALUES
(1, 'Monthly Starter', 'Monthly', 30, 1200.00, 'Flexible monthly workout routines.', '["Full gym access", "Locker access", "General trainer guidance", "Cardio + Free weights"]', 'active'),
(2, 'Quarterly Pro', 'Quarterly', 90, 3200.00, '3-month transformation package.', '["Full gym access", "Complimentary diet consultation", "Bi-weekly body measurement review", "Locker & Shower"]', 'active'),
(3, 'Half-Yearly Elite', 'Half-Yearly', 180, 5800.00, '6 months of consistent fitness progress.', '["Full gym access", "Customized workout & diet plan", "Monthly body composition tracking", "Priority trainer support"]', 'active'),
(4, 'Yearly Champion', 'Yearly', 365, 10500.00, 'Complete 1-year transformation with maximum savings.', '["Year-round unlimited access", "Personalized nutrition chart", "Dedicated trainer allocation", "Free gym merchandise t-shirt", "Guest passes (3)"]', 'active')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- 5. MEMBERSHIPS
INSERT INTO memberships (id, member_id, plan_id, start_date, end_date, status, notes) VALUES
(1, 1, 4, '2026-01-05', '2027-01-05', 'active', 'Annual Champion member'),
(2, 2, 2, '2026-09-09', '2026-12-08', 'active', 'Quarterly subscription renewed'),
(3, 3, 1, '2026-09-15', '2026-10-15', 'expiring_soon', '1st month plan')
ON DUPLICATE KEY UPDATE status=VALUES(status);

-- 6. INVOICES
INSERT INTO invoices (id, invoice_number, member_id, membership_id, invoice_date, due_date, subtotal, discount, tax_amount, final_amount, amount_paid, balance_amount, payment_status, payment_method, notes) VALUES
(1, 'INV-2026-0001', 1, 1, '2026-01-05', '2026-01-10', 10500.00, 500.00, 0.00, 10000.00, 10000.00, 0.00, 'paid', 'Cash', 'New annual registration'),
(2, 'INV-2026-0002', 2, 2, '2026-09-09', '2026-09-15', 3200.00, 0.00, 0.00, 3200.00, 2000.00, 1200.00, 'partially_paid', 'UPI', 'Quarterly renewal with partial payment'),
(3, 'INV-2026-0003', 3, 3, '2026-09-15', '2026-09-20', 1200.00, 0.00, 0.00, 1200.00, 0.00, 1200.00, 'pending', 'Cash', 'Payment pending at desk')
ON DUPLICATE KEY UPDATE invoice_number=VALUES(invoice_number);

-- 7. INVOICE ITEMS
INSERT INTO invoice_items (id, invoice_id, description, quantity, unit_price, total_price) VALUES
(1, 1, 'Yearly Champion Membership Plan (365 Days)', 1, 10500.00, 10500.00),
(2, 2, 'Quarterly Pro Membership Renewal (90 Days)', 1, 3200.00, 3200.00),
(3, 3, 'Monthly Starter Membership Plan (30 Days)', 1, 1200.00, 1200.00)
ON DUPLICATE KEY UPDATE description=VALUES(description);

-- 8. PAYMENTS & RECEIPTS
INSERT INTO payments (id, payment_number, invoice_id, member_id, payment_date, amount, payment_method, reference_number, notes, received_by_user_id) VALUES
(1, 'PAY-2026-0001', 1, 1, '2026-01-05', 10000.00, 'Cash', 'CASH-REC-001', 'Paid in full cash at reception', 1),
(2, 'PAY-2026-0002', 2, 2, '2026-09-09', 2000.00, 'UPI', 'UPI-982344-9021', 'UPI payment via PhonePe', 1)
ON DUPLICATE KEY UPDATE payment_number=VALUES(payment_number);

INSERT INTO receipts (id, receipt_number, payment_id, invoice_id, member_id, receipt_date, amount, remaining_balance, payment_method, reference_number, received_by_user_id, notes) VALUES
(1, 'RCP-2026-0001', 1, 1, 1, '2026-01-05', 10000.00, 0.00, 'Cash', 'CASH-REC-001', 1, 'Received with thanks'),
(2, 'RCP-2026-0002', 2, 2, 2, '2026-09-09', 2000.00, 1200.00, 'UPI', 'UPI-982344-9021', 1, 'Balance of ₹1,200 due')
ON DUPLICATE KEY UPDATE receipt_number=VALUES(receipt_number);

-- 9. GYM STATUS
INSERT INTO gym_status (id, status, notice_message, today_opening_time, today_closing_time) VALUES
(1, 'OPEN', 'RV Fitness Narsobawadi is OPEN. Morning Batch: 05:30 AM - 10:00 AM | Evening Batch: 05:00 PM - 10:00 PM.', '05:30 AM', '10:00 PM')
ON DUPLICATE KEY UPDATE status=VALUES(status);
