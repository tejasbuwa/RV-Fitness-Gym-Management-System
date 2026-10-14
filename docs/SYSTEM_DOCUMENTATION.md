# RV FITNESS – GYM MANAGEMENT SYSTEM
## Comprehensive System & Technical Documentation
**Gym Location:** Narsobawadi, Maharashtra, India  
**System Architecture:** Full-Stack Decoupled Client-Server (SPA + REST API + Relational RDBMS)  
**Target Repository:** `https://github.com/tejasbuwa/RV-Fitness-Gym-Management-System.git`  
**Generated On:** October 2026  

---

## 1. Executive Summary & Project Purpose

**RV FITNESS** is an end-to-end gym management web application engineered for the modern fitness facility located in **Narsobawadi**. Rather than a static prototype or mock UI, the platform operates on real database transactions, atomic financial balance calculations, role-based security access control (RBAC), personalized workout/diet chart authoring, biometric progress telemetry, printable accounting documents, and an operational gym status CMS.

---

## 2. Technology Stack & Design Decisions

| Layer | Technology | Version / Spec | Justification |
| :--- | :--- | :--- | :--- |
| **Frontend Framework** | React + Vite | React 18, Vite 5 | Fast HMR, component modularity, high rendering performance |
| **Styling & UI** | Tailwind CSS + Lucide Icons | Tailwind v3 | Clean, responsive design across mobile, tablet, and desktop |
| **Data Visualization** | Recharts | v2.13 | Interactive charts for weight telemetry, revenues, and membership analytics |
| **HTTP Client** | Axios | v1.7 | Centralized interceptors for JWT injection and 401 session recovery |
| **Backend Runtime** | Node.js + Express.js | Node v20 LTS, Express v4 | Event-driven I/O, modular router pattern, asynchronous middleware |
| **Database** | MySQL Server | 8.0 (InnoDB engine) | ACID transaction compliance, foreign key integrity, relational queries |
| **Security & Auth** | JWT + bcryptjs | 256-bit secret, 10 salt rounds | Stateless authentication with cryptographic password hashing |
| **Print Output** | CSS `@media print` | Browser-native rendering | Crisp invoices & receipts without external heavy PDF binary dependencies |

---

## 3. System Architecture & Directory Tree

```
rv-fitness/
├── START_RV_FITNESS.bat         # 1-Click launcher (Starts MySQL, Backend, Frontend & opens browser)
├── STOP_RV_FITNESS.bat          # 1-Click shutdown script
├── PUSH_TO_GITHUB.bat           # 1-Click GitHub sync and push helper
├── README.md                    # Project overview & startup instructions
├── .gitignore                   # Excludes node_modules, .env, dist, and temporary logs
├── database/
│   ├── schema.sql               # MySQL 8.0 DDL (19 relational normalized tables)
│   └── seed.sql                 # Seed records (Admin, Trainers, Members, Invoices, Diets)
├── docs/
│   ├── API_DOCUMENTATION.md     # Detailed REST API endpoints
│   ├── TESTING_CHECKLIST.md     # Quality assurance & test verification checklist
│   └── SYSTEM_DOCUMENTATION.md  # Master architectural documentation
├── backend/
│   ├── .env.example             # Template for configuration & secrets
│   ├── package.json             # Express, MySQL2, bcryptjs, jsonwebtoken, cors, helmet, morgan
│   └── src/
│       ├── server.js            # Express app entry, middleware chain & route mounting
│       ├── config/
│       │   └── db.js            # MySQL2 connection pool with utf8mb4 collation
│       ├── middleware/
│       │   ├── authMiddleware.js  # JWT token validation & req.user attachment
│       │   ├── roleMiddleware.js  # Role-based access control (Admin, Trainer, Member)
│       │   └── errorMiddleware.js # 404 and global 500 JSON error handlers
│       ├── utils/
│       │   ├── idGenerator.js   # Atomic generators (RVF-XXXX, INV-YYYY-XXXX, RCP-YYYY-XXXX)
│       │   ├── auditLogger.js   # Audit log writer for critical mutations
│       │   └── seedRunner.js    # Programmatic database seeder utility
│       ├── routes/              # 15 Express Routers
│       └── controllers/         # 15 Business Logic Controllers
└── frontend/
    ├── index.html               # HTML5 shell with responsive viewport & favicon
    ├── vite.config.js           # Vite configuration with `/api` proxy to localhost:5000
    ├── tailwind.config.js       # Custom gym color palettes (crimson, slate, amber, emerald)
    ├── package.json             # React, React Router v6, Axios, Recharts, Lucide React
    └── src/
        ├── App.jsx              # Client-side routing table & layout boundaries
        ├── main.jsx             # React DOM root entry
        ├── index.css            # Tailwind directives and @media print stylesheets
        ├── context/
        │   ├── AuthContext.jsx         # Global user session & JWT management
        │   └── NotificationContext.jsx # Toast notification alert bus
        ├── services/
        │   └── api.js                  # Axios client with request/response interceptors
        ├── utils/
        │   └── formatters.js           # Currency (₹), date, BMI, and badge helpers
        ├── components/
        │   ├── layout/
        │   │   ├── PublicNavbar.jsx    # Public navigation with live gym status indicator
        │   │   ├── PublicFooter.jsx    # Location details (Narsobawadi) & operating hours
        │   │   ├── DashboardLayout.jsx # Role-aware sidebar, topbar, and notifications
        │   │   └── ProtectedRoute.jsx  # Route guards checking authentication & roles
        │   └── printable/
        │       ├── PrintInvoiceModal.jsx # Official printable invoice format
        │       └── PrintReceiptModal.jsx # Official printable payment receipt format
        └── pages/
            ├── public/                 # Home, About, Facilities, Plans, Trainers, Gallery, etc.
            ├── auth/                   # Login (with 1-click pills), Register, ForgotPassword
            ├── admin/                  # Admin Dashboard, Members, Invoices, Reports, Audit Logs
            ├── trainer/                # Trainer Dashboard, Workouts, Diets, Biometric Progress
            └── member/                 # Member Dashboard, Subscriptions, Workouts, Receipts
```

---

## 4. Relational Database Schema (19 Normalized Tables)

All tables use `InnoDB` engine with `utf8mb4` charset and strict relational foreign keys:

1. **`users`**: System credentials, encrypted `password_hash`, role enum (`admin`, `trainer`, `member`), active flags, and reset tokens.
2. **`trainers`**: Trainer professional profile (`experience_years`, `specialization`, `phone`, `bio`, `photo_url`, `status`) linked to `user_id`.
3. **`members`**: Member core demographics (`member_code` `RVF-XXXX`, `full_name`, `phone`, `dob`, `gender`, `address`, `emergency_contact`, `height_cm`, `weight_kg`, `assigned_trainer_id`, `status`).
4. **`membership_plans`**: Subscription packages (`Monthly`, `Quarterly`, `Half-Yearly`, `Yearly`, `Custom`) with `duration_days`, `price`, and `benefits` JSON array.
5. **`memberships`**: Subscriptions linking member to plan with `start_date`, `end_date`, and calculated status (`active`, `expiring_soon`, `expired`, `cancelled`).
6. **`invoices`**: Billing documents with unique sequential `invoice_number` (`INV-YYYY-XXXX`), `subtotal`, `discount`, `tax_amount`, `final_amount`, `amount_paid`, `balance_amount`, and `payment_status`.
7. **`invoice_items`**: Line items per invoice (`description`, `quantity`, `unit_price`, `total_price`).
8. **`payments`**: Payment transaction records (`payment_number` `PAY-YYYY-XXXX`, `payment_method`: `Cash`, `UPI`, `Bank Transfer`, `Card`, `amount`, `reference_number`, `received_by_user_id`).
9. **`receipts`**: Receipts linked to payments with `receipt_number` (`RCP-YYYY-XXXX`), `remaining_balance`, and authorized collector.
10. **`workout_plans`**: Customized workout regimes assigned by trainers to members (`title`, `goal`, `start_date`, `end_date`, `status`).
11. **`workout_exercises`**: Day-wise exercises (`day_of_week`, `exercise_name`, `muscle_group`, `sets`, `repetitions`, `duration_mins`, `rest_seconds`, `instructions`).
12. **`diet_plans`**: Calorie and macronutrient targeted meal structures (`title`, `target_calories`, `daily_protein_g`, `daily_carbs_g`, `daily_fat_g`).
13. **`diet_meals`**: Meal schedules (`meal_name`: Breakfast, Lunch, Dinner, Snack; `timing`, `food_items`, `quantity`, `calories`).
14. **`progress_records`**: Biometric telemetry history (`weight_kg`, `height_cm`, calculated `bmi`, body measurements: chest, waist, hips, arms, thighs, photo, observations).
15. **`notices`**: Bulletins published by Admin targeted to `all`, `members`, or `trainers`.
16. **`events`**: Gym competitions, bootcamps, and yoga workshops displayed publicly and internally.
17. **`posts`**: CMS content for announcements, transformation achievements, workout tips, and special offers.
18. **`gym_status`**: Singleton operational status (`OPEN`, `CLOSED`, `HOLIDAY`, `TEMPORARILY_CLOSED`), opening hours, closing hours, and banner notices.
19. **`audit_logs`**: System audit trail logging timestamp, user, action, entity type, entity ID, and client IP address.

---

## 5. Backend Controllers & Function Reference

The backend REST API is organized into 15 controllers implementing atomic transaction logic and input validation:

### 1. `authController.js`
* `generateToken(user)`: Encodes JWT with `userId`, `email`, `role`, and expiration (7 days).
* `register(req, res, next)`: Registers a public member, creates `users` record with bcrypt hash, allocates next `RVF-XXXX` code, writes `members` record, and returns JWT.
* `login(req, res, next)`: Verifies user credentials using `bcrypt.compare`, validates active status, fetches linked role details (`memberCode` or trainer specialization), and returns session token.
* `getMe(req, res, next)`: Resolves current user's authenticated profile, joined with member or trainer table records.
* `forgotPassword(req, res, next)`: Generates cryptographic hex reset token and 1-hour expiry for password recovery.
* `resetPassword(req, res, next)`: Validates token expiry, hashes new password with bcrypt (10 rounds), and clears reset token.
* `updateProfile(req, res, next)`: Updates personal details, phone, emergency contact, or fitness goals.

### 2. `memberController.js`
* `getMembers(req, res, next)`: Retrieves paginated member list supporting text search (name, code, phone), status filtering, and trainer assignment filter.
* `getMemberById(req, res, next)`: Fetches full 360-degree member dossier including active membership, past subscriptions, financial invoices, payments, and weight progress history.
* `createMember(req, res, next)`: Admin-only member creation with auto-generated credentials and `RVF-XXXX` ID.
* `updateMember(req, res, next)`: Modifies member fields (trainer assignment, contact info, biometric baseline).
* `toggleMemberStatus(req, res, next)`: Toggles status between `active` and `inactive`.
* `deleteMember(req, res, next)`: Restricts deletion if financial records exist; deletes otherwise with audit logging.

### 3. `trainerController.js`
* `getTrainers(req, res, next)`: Returns list of trainers with counts of actively assigned members.
* `getTrainerById(req, res, next)`: Fetches trainer profile, experience, specialization, and member roster.
* `createTrainer(req, res, next)`: Creates trainer user account and trainer profile.
* `updateTrainer(req, res, next)`: Edits trainer profile details.
* `toggleTrainerStatus(req, res, next)`: Activates or deactivates trainer account.

### 4. `planController.js`
* `getPlans(req, res, next)`: Returns available plans (Monthly, Quarterly, Half-Yearly, Yearly, Custom).
* `createPlan(req, res, next)`: Creates new membership plan with duration, price, and benefit points.
* `updatePlan(req, res, next)`: Updates plan details and pricing.
* `togglePlanStatus(req, res, next)`: Activates or retires plans.

### 5. `membershipController.js`
* `getMemberships(req, res, next)`: Lists all assigned subscriptions with auto-evaluated status flags (`active`, `expiring_soon`, `expired`).
* `assignMembership(req, res, next)`: Assigns a plan to a member, computes `start_date` and `end_date`, updates member status to `active`, and automatically creates the corresponding invoice.
* `renewMembership(req, res, next)`: Renews membership seamlessly from current expiry date or today's date, generating renewal invoice.
* `cancelMembership(req, res, next)`: Marks subscription as `cancelled`.

### 6. `billingController.js`
* `getInvoices(req, res, next)`: Retrieves invoices with search by invoice number, member name, and payment status (`paid`, `partially_paid`, `pending`).
* `getInvoiceById(req, res, next)`: Fetches complete invoice with member details, line items, and payment receipts.
* `createInvoice(req, res, next)`: Atomically generates sequential `INV-YYYY-XXXX` invoice number, inserts invoice header, inserts invoice line items, and calculates total balance.
* `cancelInvoice(req, res, next)`: Cancels unpaid invoices.

### 7. `paymentController.js`
* `getPayments(req, res, next)`: Lists payment history with receipt cross-references.
* `recordPayment(req, res, next)`: **Core Financial Transaction**:
  1. Validates invoice existence and verifies payment does not exceed remaining balance.
  2. Generates sequential `PAY-YYYY-XXXX` payment ID.
  3. Inserts payment row into `payments` table.
  4. Calculates new balance (`final_amount - (amount_paid + current_payment)`).
  5. Updates invoice `amount_paid`, `balance_amount`, and sets `payment_status` (`paid` if balance = 0, else `partially_paid`).
  6. Generates sequential `RCP-YYYY-XXXX` receipt in `receipts` table.
* `getReceipts(req, res, next)`: Returns paginated receipt records.
* `getReceiptById(req, res, next)`: Fetches printable receipt details with gym header and transaction metadata.

### 8. `workoutController.js`
* `getWorkoutByMemberId(req, res, next)`: Fetches active workout plan and exercises grouped by day of week.
* `createWorkoutPlan(req, res, next)`: Deactivates previous plan, inserts new `workout_plans` entry, and bulk-inserts all `workout_exercises`.
* `deleteWorkoutPlan(req, res, next)`: Removes assigned workout regime.

### 9. `dietController.js`
* `getDietByMemberId(req, res, next)`: Retrieves member's current nutrition chart, daily calorie targets, and meal breakdown.
* `createDietPlan(req, res, next)`: Deactivates prior diet plan, creates new `diet_plans` record, and bulk-inserts `diet_meals`.
* `deleteDietPlan(req, res, next)`: Deletes diet regime.

### 10. `progressController.js`
* `getProgressByMemberId(req, res, next)`: Fetches historical weight logs and biometric measurements sorted chronologically for chart plotting.
* `recordProgress(req, res, next)`: Calculates BMI automatically using formula: $\text{BMI} = \frac{\text{weight\_kg}}{(\text{height\_m})^2}$, inserts log into `progress_records`, and updates member's current weight.
* `deleteProgress(req, res, next)`: Deletes an errant progress log entry.

### 11. `noticeController.js`
* `getNotices(req, res, next)`: Returns active notices filtered by user role (`all`, `members`, `trainers`).
* `createNotice(req, res, next)`: Publishes gym announcement.
* `deleteNotice(req, res, next)`: Deactivates notice.

### 12. `eventController.js`
* `getEvents(req, res, next)`: Lists upcoming gym events and workshops.
* `createEvent(req, res, next)`: Adds new event with date, time, and location.
* `deleteEvent(req, res, next)`: Removes event.

### 13. `postController.js`
* `getPosts(req, res, next)`: Returns published posts (announcements, offers, fitness tips).
* `createPost(req, res, next)`: Publishes CMS article/update.
* `deletePost(req, res, next)`: Removes CMS post.

### 14. `gymStatusController.js`
* `getGymStatus(req, res, next)`: Public endpoint returning current status (`OPEN`, `CLOSED`, `HOLIDAY`), custom notice, and today's hours.
* `updateGymStatus(req, res, next)`: Admin endpoint to toggle gym operational status in real-time.

### 15. `reportController.js`
* `getAdminDashboard(req, res, next)`: Compiles live KPI cards (Total Members, Active, Inactive, Expiring, Expired, Trainers, Today's Collection, Monthly Revenue, Pending Dues, Recent Invoices, Recent Payments).
* `getTrainerDashboard(req, res, next)`: Aggregates trainer's assigned client count, active workout plans, and recent progress updates.
* `getMemberDashboard(req, res, next)`: Returns member's active plan, days remaining until expiry, assigned trainer, pending balance, and quick links to workout/diet.
* `getReports(req, res, next)`: Generates analytical reports based on query filter (`revenue`, `members`, `pending-payments`, `trainer-members`).
* `getAuditLogs(req, res, next)`: Returns system audit logs with date filtering and pagination.

---

## 6. Utilities & Middleware Reference

### `idGenerator.js`
* `generateMemberCode(connection)`: Queries `SELECT MAX(id) FROM members` and returns formatted permanent ID: `RVF-0001`, `RVF-0002`, etc.
* `generateInvoiceNumber(connection)`: Extracts year and max ID to generate `INV-YYYY-XXXX` (e.g. `INV-2026-0001`).
* `generatePaymentNumber(connection)`: Generates unique payment code `PAY-YYYY-XXXX`.
* `generateReceiptNumber(connection)`: Generates receipt reference `RCP-YYYY-XXXX`.

### `auditLogger.js`
* `logAudit({ userId, action, entityType, entityId, details, req })`: Inserts audit log row capturing timestamp, operator ID, action performed, entity affected, metadata, and remote IP address.

### `authMiddleware.js`
* `verifyToken(req, res, next)`: Validates HTTP Authorization header `Bearer <token>`, verifies JWT signature, confirms user exists and is active, and populates `req.user`.

### `roleMiddleware.js`
* `authorizeRoles(...roles)`: RBAC gatekeeper validating `roles.includes(req.user.role)`. Rejects unauthorized requests with HTTP `403 Forbidden`.

---

## 7. Frontend Architecture & Component Mapping

### 1. Global Contexts
* **`AuthContext.jsx`**: Manages user authentication lifecycle, stores JWT in localStorage, provides `login()`, `logout()`, `updateUser()`, and `refreshMe()`.
* **`NotificationContext.jsx`**: Provides non-blocking UI toast notifications (`success`, `error`, `info`, `warning`).

### 2. Service Layer (`api.js`)
* Centralized Axios instance configured with `baseURL: '/api'`.
* **Request Interceptor**: Injects `Authorization: Bearer <token>` into headers.
* **Response Interceptor**: Automatically intercepts HTTP 401 errors, clears expired tokens, and redirects user to `/login`.
* Provides structured API namespaces: `authAPI`, `membersAPI`, `trainersAPI`, `plansAPI`, `membershipsAPI`, `billingAPI`, `paymentsAPI`, `workoutsAPI`, `dietsAPI`, `progressAPI`, `noticesAPI`, `eventsAPI`, `postsAPI`, `gymStatusAPI`, `reportsAPI`.

### 3. Utility Formatters (`formatters.js`)
* `formatCurrency(val)`: Formats numbers into Indian Rupee strings (`₹10,500.00`).
* `formatDate(dateStr)`: Converts ISO strings into readable local dates (`14 Oct 2026`).
* `formatDateTime(dateStr)`: Formats date with timestamp.
* `calculateBMI(weightKg, heightCm)`: Computes numeric BMI.
* `getBMICategory(bmi)`: Maps BMI value to category (Underweight, Normal, Overweight, Obese) with Tailwind color classes.

### 4. Printable Document Modals
* **`PrintInvoiceModal.jsx`**: Displays official RV Fitness Narsobawadi invoice with logo header, gym address, GST/contact details, invoice number, member info, line item table, discount, final amount, paid amount, balance due, and authorized stamp area.
* **`PrintReceiptModal.jsx`**: Displays formal payment receipt with receipt number, payment date, member details, payment method, transaction reference, amount paid, and remaining balance.

### 5. Portal Pages Breakdown
* **Public Pages (10)**:
  * `Home.jsx`: Hero banner with Narsobawadi badge, quick status indicator, facility highlights, plan pricing cards, trainer showcase, and call-to-action.
  * `About.jsx`: History, mission, and fitness philosophy of RV Fitness in Narsobawadi.
  * `Facilities.jsx`: Comprehensive showcase of cardio zone, free weights, CrossFit floor, lockers, and showers.
  * `Plans.jsx`: Transparent membership options with feature lists and direct enrollment triggers.
  * `Trainers.jsx`: Certified trainer bios, specializations, and booking info.
  * `Gallery.jsx`: High-resolution gym photo gallery with category filters.
  * `Announcements.jsx`: Public notices and community events.
  * `GymStatusPage.jsx`: Live operational status indicator with operating hours and holiday notices.
  * `Contact.jsx`: Interactive contact form, phone numbers, and physical location map reference in Narsobawadi.
* **Authentication Pages (3)**:
  * `Login.jsx`: Secure login with email and password, featuring **1-Click Quick Demo Login Pills** (Admin, Vikram Trainer, Sneha Trainer, Member).
  * `Register.jsx`: Public membership registration collecting demographics and fitness goals.
  * `ForgotPassword.jsx`: Password reset recovery form.
* **Admin Portal Pages (10)**:
  * `AdminDashboard.jsx`: Primary executive overview featuring financial revenue KPI cards, membership distribution charts, and live gym status toggle switch.
  * `MemberList.jsx`: Searchable, filterable member directory with status pills, trainer assignments, and pagination.
  * `MemberDetail.jsx`: Comprehensive member dossier containing personal info, subscription history, invoices, payments, and progress telemetry.
  * `TrainerList.jsx`: Trainer management directory for hiring, editing, and assigning members.
  * `PlanList.jsx`: Membership plan editor for creating and updating membership plans.
  * `InvoiceList.jsx`: Complete billing management interface with invoice generation modal and print preview.
  * `PaymentList.jsx`: Payment processing interface with atomic payment recording and receipt printing.
  * `ReportsPage.jsx`: Filterable reporting dashboard for revenue, members, dues, and trainer rosters with CSV export and print view.
  * `ContentManagement.jsx`: CMS manager for notices, events, and gym updates.
  * `AuditLogsPage.jsx`: Security audit log viewer.
* **Trainer Portal Pages (5)**:
  * `TrainerDashboard.jsx`: Summary of assigned members, active plans, and recent member activities.
  * `AssignedMembers.jsx`: Client roster with quick links to workout and diet planning.
  * `WorkoutManager.jsx`: Day-by-day exercise routine builder (Monday to Sunday) with muscle groups, sets, reps, and instructions.
  * `DietManager.jsx`: Calorie and meal plan authoring tool with protein, carbs, and timing parameters.
  * `ProgressLogger.jsx`: Biometric measurement entry form with automatic BMI calculation and telemetry logging.
* **Member Portal Pages (7)**:
  * `MemberDashboard.jsx`: Member home showing membership validity, assigned trainer, pending balance, and quick links.
  * `MemberProfile.jsx`: Profile view and editable contact information.
  * `MemberBilling.jsx`: Financial overview displaying all invoices, payment receipts, and balance status with print modals.
  * `MemberWorkout.jsx`: Member's personal assigned workout schedule organized by weekday.
  * `MemberDiet.jsx`: Member's personal assigned diet and meal plan.
  * `MemberProgress.jsx`: Interactive weight progress chart (Recharts) and biometric measurements history.
  * `MemberNotices.jsx`: Gym bulletins and community announcements.

---

## 8. Business Logic & Calculation Rules

### 1. Unique Permanent ID Generation
* **Member Code Format**: `RVF-XXXX` (e.g., `RVF-0001`, `RVF-0002`). Formatted via zero-padded 4-digit sequential integer.
* **Invoice Number Format**: `INV-YYYY-XXXX` (e.g., `INV-2026-0001`). Unique constraint prevents duplicates.
* **Payment Number Format**: `PAY-YYYY-XXXX` (e.g., `PAY-2026-0001`).
* **Receipt Number Format**: `RCP-YYYY-XXXX` (e.g., `RCP-2026-0001`).

### 2. Membership Duration & Status Automation
* $\text{End Date} = \text{Start Date} + \text{Duration Days}$.
* Membership status automatically calculated based on current date:
  * If $\text{Current Date} > \text{End Date} \implies \text{status} = \text{'expired'}$.
  * If $\text{End Date} - \text{Current Date} \le 7 \text{ days} \implies \text{status} = \text{'expiring\_soon'}$.
  * Otherwise $\implies \text{status} = \text{'active'}$.

### 3. Financial Balance & Payment Invariants
* $\text{Final Amount} = \text{Subtotal} - \text{Discount} + \text{Tax}$.
* $\text{Remaining Balance} = \text{Final Amount} - \text{Amount Paid}$.
* **Constraint**: A recorded payment must satisfy:
  $$0 < \text{Payment Amount} \le \text{Remaining Balance}$$
* **Invoice Status Transition**:
  * $\text{Remaining Balance} = 0 \implies \text{payment\_status} = \text{'paid'}$.
  * $\text{Amount Paid} > 0 \land \text{Remaining Balance} > 0 \implies \text{payment\_status} = \text{'partially\_paid'}$.
  * $\text{Amount Paid} = 0 \implies \text{payment\_status} = \text{'pending'}$.

---

## 9. Operating Scripts & Automation Launchers

Three standalone Windows batch launchers ensure complete independence from external IDEs:

1. **`START_RV_FITNESS.bat`** (Located on Desktop and project root):
   * Performs port checks on 3306, 5000, and 3000.
   * Starts MySQL 8.0 server daemon in background if not already running.
   * Starts Node.js Express backend API on port 5000.
   * Starts Vite React frontend web server on port 3000.
   * Automatically launches default browser to `http://127.0.0.1:3000`.
2. **`STOP_RV_FITNESS.bat`** (Located on Desktop and project root):
   * Safely terminates all Node and MySQL processes with one double-click.
3. **`PUSH_TO_GITHUB.bat`** (Located on Desktop and project root):
   * Inspects Git remotes, stages updates, and pushes to `https://github.com/tejasbuwa/RV-Fitness-Gym-Management-System.git` main branch.

---

## 10. Default Demo User Accounts & Test Credentials

| Role | Name | Email | Password | Pre-seeded Data |
| :--- | :--- | :--- | :--- | :--- |
| **Admin** | Super Admin | `admin@rvfitness.com` | `Admin@123` | Full access, financial ledger, gym status control |
| **Trainer** | Vikram Patil | `vikram@rvfitness.com` | `Trainer@123` | 8 yrs exp, assigned to Rohit & Sachin, author of Strength routines |
| **Trainer** | Sneha Kulkarni | `sneha@rvfitness.com` | `Trainer@123` | 5 yrs exp, assigned to Ananya, author of CrossFit & nutrition |
| **Member** | Rohit Deshmukh | `rohit@gmail.com` | `Member@123` | ID `RVF-0001`, Yearly Plan, Paid `INV-2026-0001`, active workout |
| **Member** | Ananya Joshi | `ananya@gmail.com` | `Member@123` | ID `RVF-0002`, Quarterly Plan, Partially paid `INV-2026-0002` |
| **Member** | Sachin More | `sachin@gmail.com` | `Member@123` | ID `RVF-0003`, Monthly Plan, Pending payment `INV-2026-0003` |
| **Visitor** | Public Guest | *(None required)* | — | Landing page, Narsobawadi facilities, gallery, live status |
