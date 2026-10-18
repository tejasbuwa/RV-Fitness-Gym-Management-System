# 🏋️ RV FITNESS – GYM MANAGEMENT SYSTEM
**Official Center Location:** Narsobawadi, Maharashtra  
**Repository:** [tejasbuwa/RV-Fitness-Gym-Management-System](https://github.com/tejasbuwa/RV-Fitness-Gym-Management-System)

[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite&logoColor=white)](https://vitejs.dev)
[![Node.js](https://img.shields.io/badge/Node.js-20.x-339933?logo=node.js&logoColor=white)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express-4.21-000000?logo=express&logoColor=white)](https://expressjs.com)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?logo=mysql&logoColor=white)](https://mysql.com)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![Status](https://img.shields.io/badge/Build-100%25%20Functional%20%26%20Tested-emerald)]()

A complete, production-ready full-stack gym management web application built for **RV Fitness** in Narsobawadi. Engineered with a React (Vite) + Tailwind CSS frontend, Node.js + Express REST API backend, and a normalized MySQL 8.0 relational database with role-based access control, billing, printable invoices, receipts, workout/diet management, and real-time operational status.

---

## 🌟 Quick Access — Active Working Links

> 🟢 **Main Website & Login Portal**: **[http://localhost:3000/login](http://localhost:3000/login)**  
> 🏠 **Home Page**: **[http://localhost:3000](http://localhost:3000)**  
> 👑 **Admin Management Dashboard**: **[http://localhost:3000/admin](http://localhost:3000/admin)**  
> 🏋️ **Trainer Portal**: **[http://localhost:3000/trainer](http://localhost:3000/trainer)**  
> 👤 **Member Portal**: **[http://localhost:3000/member](http://localhost:3000/member)**  
> ⚙️ **Backend REST API**: **[http://localhost:5000](http://localhost:5000)**  
> 🩺 **Backend Health Check**: **[http://localhost:5000/api/health](http://localhost:5000/api/health)**  

All authentication flows, admin dashboards, member registrations, trainers management, and billing features are verified, 100% functional, and tested.

---

## 🔑 1-Click Demo Login Credentials

The application includes 1-click quick autofill buttons on the login screen for instant demo evaluation:

| Role | Email / Member ID | Password | Access Level & Permissions |
| :--- | :--- | :--- | :--- |
| 👑 **Admin** | `admin@rvfitness.com` | `Admin@123` *(or `admin123`)* | Full system access, billing, memberships, reports, CMS, audit logs |
| 🏋️ **Trainer 1 (Vikram)** | `vikram@rvfitness.com` | `Trainer@123` | Head Coach (Strength). Client routines, diets, progress tracking |
| 🥗 **Trainer 2 (Sneha)** | `sneha@rvfitness.com` | `Trainer@123` | CrossFit & Nutrition Coach. Client meal plans & fat loss routines |
| 👤 **Member 1 (Rohit)** | `rohit@gmail.com` *(or `RVF-0001`)* | `Member@123` | Annual Champion plan, paid in full, assigned to Vikram |
| 👤 **Member 2 (Ananya)** | `ananya@gmail.com` *(or `RVF-0002`)* | `Member@123` | Quarterly Pro plan, active, partial balance ₹1,200 |
| 👤 **Member 3 (Sachin)** | `sachin@gmail.com` *(or `RVF-0003`)* | `Member@123` | Monthly Starter plan, active, desk pending balance ₹1,200 |

---

## 📍 Gym Location & Social Links

* 📍 **Official Google Maps Location**: [RV Fitness Narsobawadi on Google Maps](https://maps.app.goo.gl/5ipUPj43g7gZcxaQA) (`16.6964° N, 74.6011° E`)
* 📸 **Official Instagram Profile**: [@rv_fitness5](https://www.instagram.com/rv_fitness5?dlrf=MTkwcXZ4c3M2MmxpMg==)

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
* **Runtime**: Node.js v20.x
* **Framework**: Express.js REST API
* **Database Driver**: `mysql2/promise` with connection pooling and prepared statements
* **Authentication**: JSON Web Tokens (JWT) with salted `bcryptjs` password hashing
* **Security**: Helmet, CORS, central error handling, role-based middlewares
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
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/               # PublicNavbar, PublicFooter, DashboardLayout, ProtectedRoute
│   │   │   ├── common/               # GymLocationMap, SectionHeader
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
│   ├── public/
│   │   ├── _redirects                # SPA redirect configuration for deployment
│   │   ├── images/                   # Gym assets, client photos, logo
│   │   └── logo.png
│   ├── index.html
│   ├── vercel.json                   # Vercel SPA rewrite rules
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
│
├── database/
│   ├── schema.sql                    # Relational MySQL DDL schema
│   └── seed.sql                      # Demo seed SQL script
│
├── vercel.json                       # Root Vercel SPA rewrite configuration
├── .env.example                      # Root environment variables guide
└── README.md
```

---

## 🏃 Setup & Run Locally

### Step 1: Start Backend (Port 5000)
```bash
cd backend
npm install
npm run dev
```

### Step 2: Start Frontend (Port 3000)
```bash
cd frontend
npm install
npm run dev
```

### Step 3: Access Working App
Open your browser and navigate to:
**[http://localhost:3000/login](http://localhost:3000/login)**

---

## 📄 License & Attribution
Designed and built for **RV Fitness – Narsobawadi**. All rights reserved.
