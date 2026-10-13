# RV FITNESS – TESTING & QUALITY ASSURANCE CHECKLIST
**Gym Location:** Narsobawadi, Maharashtra

This checklist confirms the verification of all modules and requirements:

---

## 🧪 1. Authentication & Role-Based Access Control (RBAC)
- [x] **Registration**: New members can register on the public site and receive an auto-generated permanent Member ID (`RVF-XXXX`).
- [x] **Password Hashing**: Passwords verified to be stored strictly as bcrypt hashes in MySQL (no plaintext).
- [x] **JWT Token Generation**: Tokens correctly signed with secret key and validated via Bearer header.
- [x] **Session Expiration**: Interceptors gracefully detect expired tokens and redirect to login.
- [x] **Role Authorization**:
  - [x] Admin can access `/admin/*` and backend `/api/admin/*` routes.
  - [x] Trainer restricted from viewing financial reports and billing settings.
  - [x] Member can only view their own profile, invoices, receipts, workouts, and diets.
  - [x] Public visitors cannot access internal portal routes without logging in.

---

## 🏋️ 2. Member & Trainer Management
- [x] **Member Code Uniqueness**: Auto-incrementing format `RVF-0001`, `RVF-0002` verified with unique constraint.
- [x] **Member Search & Filter**: Search by name, mobile, and member code works dynamically.
- [x] **Member Status Toggle**: Toggling member between active/inactive propagates to user authentication table.
- [x] **360 Member Profile**: Shows active plan, expiry countdown, invoices, receipts, and weight trend graphs.
- [x] **Trainer Roster**: Shows trainer qualifications, experience, and allocated clients.

---

## 💳 3. Billing, Invoices & Payment Ledger
- [x] **Invoice Generation**: Generates unique invoice number (`INV-2026-XXXX`) with line items.
- [x] **Atomic Calculations**:
  - [x] `Subtotal - Discount + Tax = Final Amount`.
  - [x] `Final Amount - Payments = Remaining Balance`.
- [x] **Partial & Full Payments**:
  - [x] Verified recording ₹600 partial payment on ₹1200 invoice updates balance to ₹600 and status to `partially_paid`.
  - [x] Verified paying remaining ₹600 clears balance to ₹0 and updates status to `paid`.
- [x] **Overpayment Guard**: Server strictly prevents payment amounts exceeding outstanding invoice balances.
- [x] **Official Payment Receipts**: Every recorded transaction generates unique receipt `RCP-2026-XXXX`.
- [x] **Printable PDF Formats**:
  - [x] Tested printable invoice sheet with official gym letterhead and GST details.
  - [x] Tested printable receipt slip with authorized signature area.

---

## 🥗 4. Fitness, Workouts & Diets
- [x] **Workout Split Builder**: Day-by-day routines with sets, reps, muscle groups, and coach notes.
- [x] **Nutrition Chart Builder**: Meal timings, food portions, and calorie distribution.
- [x] **Progress Tracker**:
  - [x] Automatic calculation of BMI: `Weight / (Height in m)^2`.
  - [x] Recharts line graph visually plotting historical weight progress over time.

---

## 📢 5. CMS, Announcements & Live Gym Status
- [x] **Live Gym Status**: Real-time status switch (`OPEN`, `CLOSED`, `HOLIDAY`, `TEMPORARILY_CLOSED`) and shift times.
- [x] **Targeted Notices**: Filtered by audience (`all`, `members`, `trainers`).
- [x] **Events & Competitions**: Displays Narsobawadi competitions with dates and venues.

---

## 📊 6. Reports & Security Audit Trail
- [x] **Revenue Analytics**: Monthly revenue trends plotted via Recharts AreaChart.
- [x] **Pending Payments Ledger**: Highlights overdue dues for desk follow-up.
- [x] **Audit Trail**: Real-time capture of actor, action, timestamp, and IP address for compliance.
