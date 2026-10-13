# RV FITNESS – GYM MANAGEMENT SYSTEM
**Gym Location:** Narsobawadi, Maharashtra

A complete, production-ready full-stack gym management web application built for **RV Fitness** in Narsobawadi. Engineered with a React (Vite) + Tailwind CSS frontend, Node.js + Express REST API backend, and a normalized MySQL 8.0 relational database with role-based access control, billing, printable invoices, receipts, workout/diet management, and real-time operational status.

---

## 🚀 Live Services & Ports

* **Frontend Web Application (Vite Dev Server)**: [http://127.0.0.1:3000](http://127.0.0.1:3000)
* **Backend REST API (Node.js/Express)**: [http://127.0.0.1:5000](http://127.0.0.1:5000)
* **API Health Check**: [http://127.0.0.1:5000/api/health](http://127.0.0.1:5000/api/health)
* **Database**: MySQL 8.0 on `127.0.0.1:3306`, Database: `rv_fitness_db`

---

## 🔑 Demo Login Credentials

The application includes 1-click quick autofill buttons on the login screen for instant demo evaluation:

| Role | Email | Password | Details / Permissions |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@rvfitness.com` | `Admin@123` | Full system access, billing, memberships, reports, CMS, audit logs |
| **Trainer 1** | `vikram@rvfitness.com` | `Trainer@123` | Head Coach (Strength). Access to assigned clients, routines, diets, progress |
| **Trainer 2** | `sneha@rvfitness.com` | `Trainer@123` | CrossFit & Nutrition Coach. Access to assigned clients |
| **Member 1** | `rohit@gmail.com` | `Member@123` | Member ID: `RVF-0001` (Annual Champion plan, paid, assigned to Vikram) |
| **Member 2** | `ananya@gmail.com` | `Member@123` | Member ID: `RVF-0002` (Quarterly Pro plan, partial balance ₹1,200) |
| **Member 3** | `sachin@gmail.com` | `Member@123` | Member ID: `RVF-0003` (Monthly Starter plan, pending balance ₹1,200) |

---

## 🛠 Technology Stack

### Frontend
* **Core Framework**: React 18 + Vite
* **Styling**: Tailwind CSS + Custom Athletic Color Palette (Deep Onyx, Crimson Amber, Slate)
* **Icons**: Lucide React
* **State Management**: React Context API (`AuthContext`, `NotificationContext`)
* **HTTP Client**: Axios with automatic JWT Bearer token injection and error interceptors
* **Charts & Analytics**: Recharts (Monthly revenue trends, weight progress over time)
* **Print & Export**: Print stylesheets for professional invoices and official payment receipts

### Backend
* **Runtime**: Node.js v20.18.0
* **Framework**: Express.js REST API
* **Database Driver**: `mysql2/promise` with connection pooling and prepared statements
* **Authentication**: JSON Web Tokens (JWT) with salted `bcryptjs` password hashing (10-12 salt rounds)
* **Security**: Helmet, CORS whitelist, central error handling, role-based middlewares
* **Audit Trail**: Real-time logging of financial, operational, and security transactions

### Database
* **Database Server**: MySQL 8.0 (InnoDB engine, utf8mb4 character set)
* **19 Normalized Tables**: `users`, `trainers`, `members`, `membership_plans`, `memberships`, `invoices`, `invoice_items`, `payments`, `receipts`, `workout_plans`, `workout_exercises`, `diet_plans`, `diet_meals`, `progress_records`, `notices`, `events`, `posts`, `gym_status`, `audit_logs`

---

## 📁 Project Directory Structure

```
rv-fitness/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js                 # MySQL pool connection and transaction helpers
│   │   ├── controllers/
│   │   │   ├── authController.js     # Login, register, profile, reset password
│   │   │   ├── memberController.js   # Member CRUD, search, filter, status toggle
│   │   │   ├── trainerController.js  # Trainer CRUD, assigned clients
│   │   │   ├── planController.js     # Membership plans catalog
│   │   │   ├── membershipController.js # Subscriptions, auto end-date calculation
│   │   │   ├── billingController.js  # Invoices with line items & atomic balance
│   │   │   ├── paymentController.js  # Payments, multiple payments, receipt generation
│   │   │   ├── workoutController.js  # Custom workout split routines & exercises
│   │   │   ├── dietController.js     # Diet meal timing & calorie allocation
│   │   │   ├── progressController.js # Member biometric check-ins & BMI calculation
│   │   │   ├── noticeController.js   # Targeted notice broadcasts
│   │   │   ├── eventController.js    # Upcoming events management
│   │   │   ├── postController.js     # CMS blog posts, fitness tips
│   │   │   ├── gymStatusController.js# Real-time gym status & shifts
│   │   │   └── reportController.js   # Analytics, revenue, audit logs
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js     # JWT verification & user context injection
│   │   │   ├── roleMiddleware.js     # Role verification (admin, trainer, member)
│   │   │   └── errorMiddleware.js    # Central error handler
│   │   ├── routes/                   # Modular route files for each entity
│   │   ├── utils/
│   │   │   ├── idGenerator.js        # RVF-0001, INV-2026-0001, RCP-2026-0001
│   │   │   ├── auditLogger.js        # Audit trail logging helper
│   │   │   └── seedRunner.js         # Production seeder script
│   │   └── server.js                 # Express server bootstrap
│   ├── .env
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/               # PublicNavbar, PublicFooter, DashboardLayout, ProtectedRoute
│   │   │   └── printable/            # PrintInvoiceModal, PrintReceiptModal
│   │   ├── context/
│   │   │   ├── AuthContext.jsx       # Global auth state, login, register, logout
│   │   │   └── NotificationContext.jsx # Toast notification alert system
│   │   ├── pages/
│   │   │   ├── public/               # Home, About, Facilities, Plans, Trainers, Gallery, Announcements, Status, Contact
│   │   │   ├── auth/                 # Login, Register, ForgotPassword
│   │   │   ├── admin/                # AdminDashboard, MemberList, MemberDetail, TrainerList, PlanList, InvoiceList, PaymentList, ReportsPage, ContentManagement, AuditLogsPage
│   │   │   ├── trainer/              # TrainerDashboard, AssignedMembers, WorkoutManager, DietManager, ProgressLogger
│   │   │   └── member/               # MemberDashboard, MemberBilling, MemberWorkout, MemberDiet, MemberProgress, MemberNotices, MemberProfile
│   │   ├── services/
│   │   │   └── api.js                # Axios client with request & response interceptors
│   │   ├── utils/
│   │   │   └── formatters.js         # Currency (₹ INR), date, status styling
│   │   ├── App.jsx                   # Master routing tree with role protection
│   │   ├── main.jsx
│   │   └── index.css                 # Tailwind CSS & print media stylesheets
│   ├── index.html
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
│
├── database/
│   ├── schema.sql                    # Relational MySQL DDL schema
│   └── seed.sql                      # Demo seed SQL script
│
├── docs/
│   ├── API_DOCUMENTATION.md          # REST API endpoints reference
│   └── TESTING_CHECKLIST.md          # Full testing verification checklist
└── README.md
```

---

## ⚙️ Core Business Logic Implemented

1. **Member ID Auto-Generation (`RVF-XXXX`)**:
   Approved member registrations automatically query the highest existing member code and generate a sequential permanent ID (e.g. `RVF-0001`, `RVF-0002`). This ID is permanent and referenced across billing, workouts, diets, and progress history.
2. **Atomic Billing & Remaining Balance Engine**:
   - `Final Amount = Subtotal - Discount + Tax`
   - `Remaining Balance = Final Amount - Total Payments`
   - Validates that incoming payments cannot exceed the outstanding balance.
   - Updates invoice payment status automatically:
     - `Balance == 0` -> `paid`
     - `Balance > 0 && Amount Paid > 0` -> `partially_paid`
     - `Amount Paid == 0` -> `pending`
3. **Official Receipts (`RCP-YYYY-XXXX`)**:
   Every recorded payment instantly generates an official payment receipt with remaining balance and transaction reference.
4. **Subscription Expiry Engine**:
   - Computes `end_date = start_date + duration_days`.
   - Dynamic status updater flags memberships as `active`, `expiring_soon` (within 7 days), or `expired`.
   - Renewal chains from current expiration date if still active, or from today if already expired.
5. **Real-Time Gym Status**:
   - Displays live status (`OPEN`, `CLOSED`, `HOLIDAY`, `TEMPORARILY_CLOSED`) across the public website and all portals.
   - Admin can update opening/closing shifts and broadcast special festival timings.

---

## 🏃 Setup & Installation Guide

### Prerequisites
* Node.js v18+ and npm
* MySQL Server 8.0

### Step 1: Clone or Navigate to Directory
```bash
cd rv-fitness
```

### Step 2: Database Initialization
Import the schema and initial seed data into MySQL:
```bash
mysql -u root -p < database/schema.sql
```

### Step 3: Backend Setup
```bash
cd backend
npm install
# Verify or edit .env configuration
npm run seed     # Seeds demo accounts and test data
npm start        # Launches API on port 5000
```

### Step 4: Frontend Setup
```bash
cd ../frontend
npm install
npm run dev      # Launches React app on http://localhost:3000
```

---

## 📄 License & Attribution
Designed and built for **RV Fitness – Narsobawadi**.
All rights reserved.
