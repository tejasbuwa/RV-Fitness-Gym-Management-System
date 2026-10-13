# RV FITNESS – REST API DOCUMENTATION
**Gym Location:** Narsobawadi, Maharashtra  
**Base URL:** `http://127.0.0.1:5000/api`

---

## 1. Authentication & Accounts (`/api/auth`)

### `POST /api/auth/register`
* **Access**: Public
* **Payload**:
  ```json
  {
    "fullName": "Rohit Deshmukh",
    "email": "rohit@gmail.com",
    "phone": "9823112233",
    "password": "Member@123",
    "gender": "Male",
    "dob": "1996-05-14",
    "address": "Main Bazaar Road, Narsobawadi",
    "emergencyContact": "9823112200",
    "heightCm": 178.5,
    "weightKg": 82.0,
    "fitnessGoal": "Muscle Hypertrophy"
  }
  ```
* **Response**: `201 Created` with JWT token and assigned permanent `memberCode` (`RVF-XXXX`).

### `POST /api/auth/login`
* **Access**: Public
* **Payload**: `{ "email": "admin@rvfitness.com", "password": "Admin@123" }`
* **Response**: `200 OK` with JWT token and profile data (`role`, `memberCode`, etc.).

### `GET /api/auth/me`
* **Access**: Bearer Token
* **Response**: Current user profile with role-specific details.

### `POST /api/auth/forgot-password`
* **Access**: Public
* **Payload**: `{ "email": "rohit@gmail.com" }`
* **Response**: Generates security reset token.

### `POST /api/auth/reset-password`
* **Access**: Public
* **Payload**: `{ "token": "...", "newPassword": "..." }`

---

## 2. Members Management (`/api/members`)

### `GET /api/members`
* **Access**: Admin, Trainer (assigned clients only)
* **Query Params**: `search`, `status` (`active`, `inactive`, `pending`), `trainerId`, `page`, `limit`
* **Response**: Array of members with active subscription status and pending balance.

### `GET /api/members/:id`
* **Access**: Admin, Trainer (assigned), Member (own profile only)
* **Response**: 360-degree member details including memberships history, invoices, payments, and progress history.

### `POST /api/members`
* **Access**: Admin
* **Payload**: Member registration data. Generates user account and permanent `RVF-XXXX` code.

### `PUT /api/members/:id`
* **Access**: Admin
* **Payload**: Updated member fields.

### `PATCH /api/members/:id/status`
* **Access**: Admin
* **Payload**: `{ "status": "active" | "inactive" | "pending" }`

---

## 3. Trainers (`/api/trainers`)

### `GET /api/trainers`
* **Access**: Public (Active only), Admin (All)
* **Response**: List of trainers with experience, specialization, and assigned client counts.

### `POST /api/trainers`
* **Access**: Admin
* **Payload**: Trainer profile with user account credentials.

### `PATCH /api/trainers/:id/status`
* **Access**: Admin
* **Payload**: `{ "status": "active" | "inactive" }`

---

## 4. Membership Plans & Subscriptions (`/api/membership-plans`, `/api/memberships`)

### `GET /api/membership-plans`
* **Access**: Public / Admin

### `POST /api/membership-plans`
* **Access**: Admin
* **Payload**: `{ "name": "...", "planType": "...", "durationDays": 90, "price": 3200, "benefits": [...] }`

### `POST /api/memberships/assign`
* **Access**: Admin
* **Payload**: `{ "memberId": 1, "planId": 2, "startDate": "2026-10-01", "generateInvoice": true }`
* **Response**: Creates subscription, computes `endDate`, and generates linked invoice.

### `POST /api/memberships/renew`
* **Access**: Admin
* **Payload**: `{ "memberId": 1, "planId": 2, "generateInvoice": true }`

---

## 5. Billing, Invoices & Payments (`/api/invoices`, `/api/payments`, `/api/receipts`)

### `GET /api/invoices`
* **Access**: Admin, Member (own only)
* **Query Params**: `status`, `memberId`, `search`

### `POST /api/invoices`
* **Access**: Admin
* **Payload**: `{ "memberId": 1, "discount": 0, "taxAmount": 0, "items": [{ "description": "...", "quantity": 1, "unitPrice": 1500 }] }`

### `POST /api/payments`
* **Access**: Admin
* **Payload**: `{ "invoiceId": 1, "amount": 1000, "paymentMethod": "UPI", "referenceNumber": "UPI-1234" }`
* **Business Logic**: Atomically recalculates remaining balance, updates invoice status (`paid` vs `partially_paid`), and issues receipt (`RCP-YYYY-XXXX`).

### `GET /api/receipts/:id`
* **Access**: Admin, Member (own only)
* **Response**: Full printable receipt data with breakdown.

---

## 6. Fitness & Coaching (`/api/workouts`, `/api/diets`, `/api/progress`)

### `GET /api/workouts/member/:memberId`
* **Access**: Admin, Trainer, Member (own)

### `POST /api/workouts`
* **Access**: Trainer, Admin
* **Payload**: `{ "memberId": 1, "title": "...", "exercises": [...] }`

### `POST /api/diets`
* **Access**: Trainer, Admin
* **Payload**: `{ "memberId": 1, "title": "...", "targetCalories": 2400, "meals": [...] }`

### `POST /api/progress`
* **Access**: Trainer, Admin
* **Payload**: `{ "memberId": 1, "weightKg": 82.5, "heightCm": 178, "chestInches": 41, "waistInches": 33 }`
* **Logic**: Automatically calculates and stores BMI.

---

## 7. Operational Status & CMS (`/api/gym-status`, `/api/notices`, `/api/events`, `/api/posts`, `/api/reports`, `/api/audit-logs`)

* `GET /api/gym-status` (Public)
* `PUT /api/gym-status` (Admin)
* `GET /api/reports?type=revenue|members|pending-payments|trainer-members` (Admin)
* `GET /api/audit-logs` (Admin)
