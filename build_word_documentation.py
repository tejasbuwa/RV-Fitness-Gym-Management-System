import os
import sys
from PIL import Image, ImageDraw, ImageFont
import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn

DOCS_DIR = os.path.abspath("./docs")
IMG_DIR = os.path.join(DOCS_DIR, "images")
os.makedirs(IMG_DIR, exist_ok=True)

# -------------------------------------------------------------
# FONT HELPERS FOR PIL
# -------------------------------------------------------------
def get_font(size, bold=False):
    font_path = "C:/Windows/Fonts/segoeuib.ttf" if bold else "C:/Windows/Fonts/segoeui.ttf"
    if not os.path.exists(font_path):
        font_path = "C:/Windows/Fonts/arialbd.ttf" if bold else "C:/Windows/Fonts/arial.ttf"
    try:
        return ImageFont.truetype(font_path, size)
    except Exception:
        return ImageFont.load_default()

# -------------------------------------------------------------
# 1. GENERATE DIAGRAM 1: FULL SYSTEM ARCHITECTURE
# -------------------------------------------------------------
def generate_diagram_architecture():
    w, h = 1300, 800
    img = Image.new("RGB", (w, h), (248, 250, 252))
    draw = ImageDraw.Draw(img)

    # Title header banner
    draw.rectangle([(0, 0), (w, 90)], fill=(30, 41, 59))
    draw.text((40, 20), "RV FITNESS – FULL-STACK SYSTEM ARCHITECTURE", fill=(255, 255, 255), font=get_font(28, True))
    draw.text((40, 56), "Gym Location: Narsobawadi, Maharashtra | Modern Decoupled SPA + REST API + Relational RDBMS", fill=(148, 163, 184), font=get_font(16))

    # Helper for rounded card
    def draw_card(box, fill_color, border_color, title, subtitle="", items=[], icon=""):
        draw.rounded_rectangle(box, radius=12, fill=fill_color, outline=border_color, width=2)
        x1, y1, x2, y2 = box
        draw.rectangle([(x1, y1), (x2, y1+38)], fill=border_color)
        draw.text((x1+15, y1+9), f"{icon} {title}".strip(), fill=(255, 255, 255), font=get_font(17, True))
        curr_y = y1 + 50
        if subtitle:
            draw.text((x1+15, curr_y), subtitle, fill=(100, 116, 139), font=get_font(13, True))
            curr_y += 24
        for item in items:
            draw.text((x1+18, curr_y), f"• {item}", fill=(51, 65, 85), font=get_font(13))
            curr_y += 22

    # Section 1: User Roles / Client Layer
    draw_card((50, 120, 320, 320), (255, 255, 255), (71, 85, 105), "1. USER ACCESS ROLES", "Role-Based Clients", [
        "Public Visitor (Unauthenticated)",
        "Member (RVF-XXXX ID)",
        "Trainer (Assigned Roster)",
        "Admin (Full System Ledger)"
    ], "[USER]")

    # Section 2: Frontend Client (Port 3000)
    draw_card((360, 120, 680, 480), (255, 255, 255), (15, 118, 110), "2. FRONTEND CLIENT (PORT 3000)", "React 18 + Vite 5 SPA", [
        "Tailwind CSS Responsive Design",
        "Public Website (10 pages)",
        "Admin Portal (Dashboard, Members, Billing)",
        "Trainer Portal (Workouts, Diets, Progress)",
        "Member Portal (Billing, Routines, Telemetry)",
        "Recharts Interactive Graphs",
        "Printable Invoices & Receipts (@media print)",
        "Axios REST Client + JWT Interceptors"
    ], "[UI]")

    # Section 3: REST API & Auth Gateway (Port 5000)
    draw_card((720, 120, 1020, 380), (255, 255, 255), (225, 29, 72), "3. REST API GATEWAY (PORT 5000)", "Node.js + Express.js", [
        "Bearer JWT Authentication (7-day)",
        "bcrypt Password Hashing (10 rounds)",
        "Role-Based Access Control Middleware",
        "Atomic ID Generators (RVF/INV/RCP)",
        "Centralized Error & 404 Handlers",
        "Asynchronous System Audit Logger"
    ], "[API]")

    # Section 4: Controllers & Business Logic
    draw_card((720, 410, 1250, 750), (255, 255, 255), (37, 99, 235), "4. BUSINESS LOGIC CONTROLLERS (15)", "Modular Service Endpoints", [
        "authController (Register, Login, Password Reset, Profile)",
        "memberController (360 Dossier, RVF-XXXX generation, Status)",
        "trainerController (Specializations, Member allocation)",
        "planController & membershipController (Auto Expiry / Renewal)",
        "billingController & paymentController (INV / RCP / Balance logic)",
        "workoutController & dietController (Weekly regime & nutrition)",
        "progressController (Telemetry, Auto BMI calculation)",
        "gymStatusController (Realtime OPEN/CLOSED status Narsobawadi)",
        "reportController (Revenues, Dues, Analytics, Audit Logs)"
    ], "[LOGIC]")

    # Section 5: Relational Database (Port 3306)
    draw_card((50, 510, 680, 750), (255, 255, 255), (180, 83, 9), "5. DATABASE SERVER (PORT 3306)", "MySQL 8.0 InnoDB RDBMS (rv_fitness_db)", [
        "19 Normalized Relational Tables with Foreign Key Constraints",
        "ACID Financial Ledger Transactions (Invoices, Payments, Receipts)",
        "Cascading & Restrict Deletes for Business Integrity Protection",
        "Indexed Search on Email, Member Codes, Phone, and Dates",
        "Dedicated Data Directory in User Space"
    ], "[DB]")

    # Connecting arrows
    def draw_arrow(p1, p2, text=""):
        draw.line([p1, p2], fill=(148, 163, 184), width=3)
        # arrow head
        x, y = p2
        draw.polygon([(x, y), (x-8, y-5), (x-8, y+5)], fill=(148, 163, 184))
        if text:
            mx = (p1[0] + p2[0]) // 2
            my = (p1[1] + p2[1]) // 2 - 12
            draw.text((mx-30, my), text, fill=(100, 116, 139), font=get_font(12, True))

    draw_arrow((320, 200), (360, 200), "HTTPS")
    draw_arrow((680, 200), (720, 200), "REST API")
    draw_arrow((870, 380), (870, 410))
    draw_arrow((720, 630), (680, 630), "SQL Pool")

    path = os.path.join(IMG_DIR, "arch_diagram.png")
    img.save(path, quality=95)
    return path

# -------------------------------------------------------------
# 2. GENERATE DIAGRAM 2: DATABASE ER ENTITIES
# -------------------------------------------------------------
def generate_diagram_er():
    w, h = 1300, 850
    img = Image.new("RGB", (w, h), (248, 250, 252))
    draw = ImageDraw.Draw(img)

    # Title header banner
    draw.rectangle([(0, 0), (w, 85)], fill=(15, 23, 42))
    draw.text((40, 18), "RV FITNESS – DATABASE ENTITY-RELATIONSHIP ARCHITECTURE", fill=(255, 255, 255), font=get_font(26, True))
    draw.text((40, 52), "19 Normalized Relational Tables (MySQL 8.0 Engine: InnoDB | Charset: utf8mb4)", fill=(148, 163, 184), font=get_font(15))

    def draw_entity(box, title, fields=[], border_color=(30, 41, 59)):
        draw.rounded_rectangle(box, radius=8, fill=(255, 255, 255), outline=border_color, width=2)
        x1, y1, x2, y2 = box
        draw.rectangle([(x1, y1), (x2, y1+28)], fill=border_color)
        draw.text((x1+10, y1+6), title, fill=(255, 255, 255), font=get_font(13, True))
        cy = y1 + 34
        for f in fields:
            draw.text((x1+10, cy), f, fill=(51, 65, 85), font=get_font(11))
            cy += 16

    # Users
    draw_entity((40, 110, 220, 230), "USERS", ["id [PK]", "email (UQ)", "password_hash", "role [enum]", "is_active", "reset_token"], (71, 85, 105))
    # Trainers
    draw_entity((270, 110, 470, 230), "TRAINERS", ["id [PK]", "user_id [FK->users]", "full_name, phone", "specialization", "status [enum]"], (37, 99, 235))
    # Members
    draw_entity((520, 110, 750, 260), "MEMBERS", ["id [PK]", "user_id [FK->users]", "member_code (UQ) [RVF-XXXX]", "assigned_trainer_id [FK]", "status [enum]", "weight, height, goals"], (225, 29, 72))

    # Plans
    draw_entity((800, 110, 1020, 230), "MEMBERSHIP_PLANS", ["id [PK]", "name, plan_type", "duration_days, price", "benefits [JSON]", "status [enum]"], (13, 148, 136))
    # Memberships
    draw_entity((1070, 110, 1260, 240), "MEMBERSHIPS", ["id [PK]", "member_id [FK->members]", "plan_id [FK->plans]", "start_date, end_date", "status [active/expired]"], (13, 148, 136))

    # Invoices
    draw_entity((40, 300, 290, 480), "INVOICES", [
        "id [PK]",
        "invoice_number (UQ) [INV-YYYY-XXXX]",
        "member_id [FK->members]",
        "membership_id [FK->memberships]",
        "subtotal, discount, tax",
        "final_amount, amount_paid",
        "balance_amount",
        "payment_status [paid/partial/pending]"
    ], (180, 83, 9))

    # Invoice Items
    draw_entity((330, 300, 520, 410), "INVOICE_ITEMS", [
        "id [PK]",
        "invoice_id [FK->invoices]",
        "description",
        "quantity, unit_price",
        "total_price"
    ], (180, 83, 9))

    # Payments
    draw_entity((560, 300, 800, 450), "PAYMENTS", [
        "id [PK]",
        "payment_number (UQ) [PAY-YYYY-XXXX]",
        "invoice_id [FK->invoices]",
        "member_id [FK->members]",
        "amount, payment_method",
        "reference_number",
        "received_by_user_id [FK]"
    ], (22, 163, 74))

    # Receipts
    draw_entity((840, 300, 1070, 450), "RECEIPTS", [
        "id [PK]",
        "receipt_number (UQ) [RCP-YYYY-XXXX]",
        "payment_id [FK->payments] (UQ)",
        "invoice_id [FK->invoices]",
        "member_id [FK->members]",
        "amount, remaining_balance",
        "received_by_user_id [FK]"
    ], (22, 163, 74))

    # Workouts & Exercises
    draw_entity((40, 530, 280, 670), "WORKOUT_PLANS", [
        "id [PK]",
        "member_id [FK->members]",
        "trainer_id [FK->trainers]",
        "title, goal",
        "start_date, end_date, status"
    ], (124, 58, 237))

    draw_entity((310, 530, 550, 690), "WORKOUT_EXERCISES", [
        "id [PK]",
        "workout_plan_id [FK->workout_plans]",
        "day_of_week [Mon..Sun]",
        "exercise_name, muscle_group",
        "sets, repetitions, rest_seconds"
    ], (124, 58, 237))

    # Diets & Meals
    draw_entity((580, 530, 820, 670), "DIET_PLANS", [
        "id [PK]",
        "member_id [FK->members]",
        "trainer_id [FK->trainers]",
        "title, target_calories",
        "protein_g, carbs_g, fat_g"
    ], (217, 119, 6))

    draw_entity((850, 530, 1070, 690), "DIET_MEALS", [
        "id [PK]",
        "diet_plan_id [FK->diet_plans]",
        "meal_name [Breakfast/Lunch/Dinner]",
        "timing, food_items, calories",
        "protein_g, quantity"
    ], (217, 119, 6))

    # Progress Records
    draw_entity((1100, 300, 1260, 480), "PROGRESS_RECORDS", [
        "id [PK]",
        "member_id [FK->members]",
        "recorded_by_user_id",
        "weight_kg, height_cm",
        "bmi [formula]",
        "chest, waist, hips",
        "observations"
    ], (14, 165, 233))

    # CMS & Operations
    draw_entity((40, 720, 240, 820), "GYM_STATUS", ["id=1 [PK]", "status [OPEN/CLOSED]", "today_opening_time", "today_closing_time", "notice_message"], (15, 118, 110))
    draw_entity((270, 720, 480, 820), "NOTICES", ["id [PK]", "title, content", "target_audience", "publish_date"], (71, 85, 105))
    draw_entity((510, 720, 720, 820), "EVENTS", ["id [PK]", "event_name, location", "event_date, event_time", "status"], (71, 85, 105))
    draw_entity((750, 720, 960, 820), "POSTS (CMS)", ["id [PK]", "title, category", "content, publish_date", "is_published"], (71, 85, 105))
    draw_entity((990, 720, 1260, 820), "AUDIT_LOGS", ["id [PK]", "user_id [FK]", "action, entity_type, entity_id", "details, ip_address, timestamp"], (100, 116, 139))

    path = os.path.join(IMG_DIR, "er_diagram.png")
    img.save(path, quality=95)
    return path

# -------------------------------------------------------------
# 3. GENERATE DIAGRAM 3: AUTHENTICATION & RBAC FLOW
# -------------------------------------------------------------
def generate_diagram_auth_flow():
    w, h = 1200, 520
    img = Image.new("RGB", (w, h), (248, 250, 252))
    draw = ImageDraw.Draw(img)

    # Title header banner
    draw.rectangle([(0, 0), (w, 80)], fill=(30, 41, 59))
    draw.text((40, 16), "AUTHENTICATION & ROLE-BASED ACCESS CONTROL (RBAC) FLOW", fill=(255, 255, 255), font=get_font(24, True))
    draw.text((40, 48), "Stateless 256-Bit JWT + bcrypt Cryptographic Hash + Express Middleware Guard", fill=(148, 163, 184), font=get_font(14))

    def step_box(box, step_num, title, lines, color):
        draw.rounded_rectangle(box, radius=10, fill=(255, 255, 255), outline=color, width=2)
        x1, y1, x2, y2 = box
        draw.rectangle([(x1, y1), (x2, y1+30)], fill=color)
        draw.text((x1+10, y1+6), f"STEP {step_num}: {title}", fill=(255, 255, 255), font=get_font(13, True))
        cy = y1 + 38
        for line in lines:
            draw.text((x1+12, cy), line, fill=(51, 65, 85), font=get_font(12))
            cy += 18

    step_box((40, 110, 240, 260), 1, "Credentials Input", [
        "User enters Email",
        "and Plain Password",
        "Supports 1-Click",
        "Demo Pills on Login",
        "Form validation"
    ], (71, 85, 105))

    step_box((270, 110, 480, 260), 2, "Backend Verify", [
        "Lookup user by email",
        "bcrypt.compare(pwd)",
        "Check account is_active",
        "Fetch role metadata",
        "Generate 7-day JWT"
    ], (37, 99, 235))

    step_box((510, 110, 710, 260), 3, "JWT Token Issued", [
        "Signed with 256-bit",
        "JWT_SECRET",
        "Payload: userId, email,",
        "role (admin/trainer/member)",
        "Stored in LocalStorage"
    ], (22, 163, 74))

    step_box((740, 110, 950, 260), 4, "Axios Interceptor", [
        "Attaches Bearer Token",
        "Header to all requests",
        "Catches 401 Expirations",
        "Auto Redirect to Login",
        "Stateful in AuthContext"
    ], (217, 119, 6))

    step_box((980, 110, 1170, 260), 5, "verifyToken Guard", [
        "Express Middleware",
        "Extracts Bearer Token",
        "Validates signature",
        "Attaches req.user",
        "Rejects invalid (401)"
    ], (124, 58, 237))

    # RBAC Decision Tree below
    draw.rounded_rectangle((200, 310, 1000, 480), radius=12, fill=(241, 245, 249), outline=(71, 85, 105), width=2)
    draw.text((220, 325), "ROLE-BASED AUTHORIZATION GATEWAY: authorizeRoles('admin', 'trainer', 'member')", fill=(15, 23, 42), font=get_font(16, True))

    draw.rounded_rectangle((230, 360, 450, 450), radius=8, fill=(255, 255, 255), outline=(225, 29, 72), width=2)
    draw.text((245, 370), "ADMIN (/admin/*)", fill=(225, 29, 72), font=get_font(14, True))
    draw.text((245, 395), "Full ledger, billing,", fill=(51, 65, 85), font=get_font(12))
    draw.text((245, 415), "all members, reports, status", fill=(51, 65, 85), font=get_font(12))

    draw.rounded_rectangle((490, 360, 710, 450), radius=8, fill=(255, 255, 255), outline=(37, 99, 235), width=2)
    draw.text((505, 370), "TRAINER (/trainer/*)", fill=(37, 99, 235), font=get_font(14, True))
    draw.text((505, 395), "Assigned roster, workout", fill=(51, 65, 85), font=get_font(12))
    draw.text((505, 415), "& diet builder, progress logs", fill=(51, 65, 85), font=get_font(12))

    draw.rounded_rectangle((750, 360, 970, 450), radius=8, fill=(255, 255, 255), outline=(22, 163, 74), width=2)
    draw.text((765, 370), "MEMBER (/member/*)", fill=(22, 163, 74), font=get_font(14, True))
    draw.text((765, 395), "Own active plan, printable", fill=(51, 65, 85), font=get_font(12))
    draw.text((765, 415), "invoices/receipts, progress", fill=(51, 65, 85), font=get_font(12))

    path = os.path.join(IMG_DIR, "auth_flow.png")
    img.save(path, quality=95)
    return path

# -------------------------------------------------------------
# 4. GENERATE DIAGRAM 4: FINANCIAL BILLING STATE MACHINE
# -------------------------------------------------------------
def generate_diagram_billing():
    w, h = 1200, 480
    img = Image.new("RGB", (w, h), (248, 250, 252))
    draw = ImageDraw.Draw(img)

    # Title header banner
    draw.rectangle([(0, 0), (w, 80)], fill=(30, 41, 59))
    draw.text((40, 16), "FINANCIAL INVOICE, PAYMENT & RECEIPT STATE MACHINE", fill=(255, 255, 255), font=get_font(24, True))
    draw.text((40, 48), "Atomic Balance Calculation: Final Amount = Subtotal - Discount + Tax | Balance = Final - Paid", fill=(148, 163, 184), font=get_font(14))

    def node(box, title, status, color, items=[]):
        draw.rounded_rectangle(box, radius=12, fill=(255, 255, 255), outline=color, width=3)
        x1, y1, x2, y2 = box
        draw.rectangle([(x1, y1), (x2, y1+30)], fill=color)
        draw.text((x1+15, y1+6), title, fill=(255, 255, 255), font=get_font(14, True))
        draw.text((x1+15, y1+38), f"STATUS: {status}", fill=color, font=get_font(13, True))
        cy = y1 + 62
        for it in items:
            draw.text((x1+15, cy), f"• {it}", fill=(51, 65, 85), font=get_font(12))
            cy += 18

    node((40, 120, 290, 290), "1. Invoice Generation", "pending", (225, 29, 72), [
        "Number: INV-YYYY-XXXX",
        "Membership plan linked",
        "Amount Paid = 0.00",
        "Balance = Final Amount",
        "Payment Status: pending"
    ])

    node((450, 120, 720, 290), "2. Partial Payment", "partially_paid", (217, 119, 6), [
        "Number: PAY-YYYY-XXXX",
        "0 < Payment < Balance",
        "New Balance = Final - Paid",
        "Receipt RCP-YYYY-XXXX",
        "Status: partially_paid"
    ])

    node((880, 120, 1150, 290), "3. Full Settlement", "paid", (22, 163, 74), [
        "Payment = Balance",
        "Balance becomes 0.00",
        "Final Receipt Issued",
        "Printable Modal Enabled",
        "Status: paid"
    ])

    # Connecting transitions
    draw.line([(290, 205), (450, 205)], fill=(148, 163, 184), width=4)
    draw.polygon([(450, 205), (435, 197), (435, 213)], fill=(148, 163, 184))
    draw.text((310, 180), "Partial Cash/UPI", fill=(100, 116, 139), font=get_font(12, True))

    draw.line([(720, 205), (880, 205)], fill=(148, 163, 184), width=4)
    draw.polygon([(880, 205), (865, 197), (865, 213)], fill=(148, 163, 184))
    draw.text((740, 180), "Balance Cleared", fill=(100, 116, 139), font=get_font(12, True))

    # Bottom summary box
    draw.rounded_rectangle((40, 330, 1150, 440), radius=10, fill=(241, 245, 249), outline=(71, 85, 105), width=2)
    draw.text((60, 345), "FINANCIAL INVARIANTS & INTEGRITY CONSTRAINTS", fill=(15, 23, 42), font=get_font(15, True))
    draw.text((60, 375), "1. Payment amounts can NEVER exceed the remaining invoice balance (prevents negative debt).", fill=(51, 65, 85), font=get_font(12))
    draw.text((60, 395), "2. Every payment atomically generates a sequential official receipt (RCP-YYYY-XXXX).", fill=(51, 65, 85), font=get_font(12))
    draw.text((60, 415), "3. Invoices cannot be deleted if linked payments exist (strict relational audit compliance).", fill=(51, 65, 85), font=get_font(12))

    path = os.path.join(IMG_DIR, "billing_flow.png")
    img.save(path, quality=95)
    return path

# -------------------------------------------------------------
# 5. GENERATE DIAGRAM 5: MEMBER LIFECYCLE WORKFLOW
# -------------------------------------------------------------
def generate_diagram_member_lifecycle():
    w, h = 1200, 460
    img = Image.new("RGB", (w, h), (248, 250, 252))
    draw = ImageDraw.Draw(img)

    # Title header banner
    draw.rectangle([(0, 0), (w, 80)], fill=(30, 41, 59))
    draw.text((40, 16), "END-TO-END MEMBER LIFECYCLE & FITNESS TELEMETRY WORKFLOW", fill=(255, 255, 255), font=get_font(24, True))
    draw.text((40, 48), "From Onboarding to Training, Nutrition, Progress Telemetry & Renewal", fill=(148, 163, 184), font=get_font(14))

    stages = [
        ("1. Registration", "Public or Admin", ["Demographics", "Auto ID: RVF-XXXX", "Active User Account"], (71, 85, 105)),
        ("2. Membership", "Plan Assignment", ["Monthly / Annual", "End Date Computed", "Auto Invoice Gen"], (15, 118, 110)),
        ("3. Trainer Assigned", "Dedicated Coach", ["Vikram Patil / Sneha", "Specialization match", "Roster integration"], (37, 99, 235)),
        ("4. Coaching Plan", "Workout & Diet", ["Monday..Sunday routine", "Macro & calorie goal", "Customized meals"], (124, 58, 237)),
        ("5. Telemetry & Log", "Biometric Progress", ["Weight, Chest, Waist", "Auto BMI calculation", "Interactive Chart"], (14, 165, 233)),
        ("6. Renewal", "Subscription Cycle", ["7-day expiry notice", "1-click renewal", "Renewal invoice"], (22, 163, 74))
    ]

    box_w = 170
    gap = 20
    start_x = 40
    y = 120

    for idx, (title, sub, items, color) in enumerate(stages):
        bx = start_x + idx * (box_w + gap)
        draw.rounded_rectangle((bx, y, bx + box_w, y + 260), radius=10, fill=(255, 255, 255), outline=color, width=2)
        draw.rectangle([(bx, y), (bx + box_w, y + 32)], fill=color)
        draw.text((bx + 8, y + 8), title, fill=(255, 255, 255), font=get_font(12, True))
        draw.text((bx + 10, y + 42), sub, fill=(100, 116, 139), font=get_font(11, True))
        cy = y + 68
        for it in items:
            draw.text((bx + 10, cy), f"• {it}", fill=(51, 65, 85), font=get_font(11))
            cy += 18
        if idx < len(stages) - 1:
            ax = bx + box_w + 4
            draw.text((ax, y + 120), ">", fill=(148, 163, 184), font=get_font(18, True))

    draw.rounded_rectangle((40, 400, 1160, 440), radius=6, fill=(241, 245, 249))
    draw.text((55, 412), "Facility Location: RV Fitness, Narsobawadi | Seamless progression between Admin, Trainer, and Member portals.", fill=(51, 65, 85), font=get_font(12, True))

    path = os.path.join(IMG_DIR, "member_lifecycle.png")
    img.save(path, quality=95)
    return path

# -------------------------------------------------------------
# BUILD WORD DOCUMENT
# -------------------------------------------------------------
def build_docx():
    print("Generating diagrams...")
    p1 = generate_diagram_architecture()
    p2 = generate_diagram_er()
    p3 = generate_diagram_auth_flow()
    p4 = generate_diagram_billing()
    p5 = generate_diagram_member_lifecycle()
    print("Diagrams generated successfully.")

    doc = docx.Document()

    # Configure Margins: 1 inch on all sides
    sections = doc.sections
    for section in sections:
        section.top_margin = Inches(1)
        section.bottom_margin = Inches(1)
        section.left_margin = Inches(1)
        section.right_margin = Inches(1)
        # Header & Footer
        header = section.header
        hp = header.paragraphs[0]
        hp.text = "RV FITNESS – GYM MANAGEMENT SYSTEM (Narsobawadi)"
        hp.alignment = WD_ALIGN_PARAGRAPH.RIGHT
        footer = section.footer
        fp = footer.paragraphs[0]
        fp.text = "Confidential System Architecture & Technical Documentation"
        fp.alignment = WD_ALIGN_PARAGRAPH.LEFT

    # Helper styling functions
    def set_cell_background(cell, hex_color):
        shading = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{hex_color}"/>')
        cell._tc.get_or_add_tcPr().append(shading)

    def add_custom_heading(text, level, space_before=14, space_after=6):
        h = doc.add_heading(text, level=level)
        h.paragraph_format.space_before = Pt(space_before)
        h.paragraph_format.space_after = Pt(space_after)
        run = h.runs[0]
        if level == 1:
            run.font.size = Pt(20)
            run.font.color.rgb = RGBColor(30, 41, 59) # Slate 800
        elif level == 2:
            run.font.size = Pt(15)
            run.font.color.rgb = RGBColor(225, 29, 72) # Rose/Crimson
        elif level == 3:
            run.font.size = Pt(12)
            run.font.color.rgb = RGBColor(71, 85, 105) # Slate 600
        return h

    def add_styled_paragraph(text, bold_prefix="", space_after=6):
        p = doc.add_paragraph()
        p.paragraph_format.space_after = Pt(space_after)
        p.paragraph_format.line_spacing = 1.15
        if bold_prefix:
            r1 = p.add_run(bold_prefix)
            r1.bold = True
            r1.font.color.rgb = RGBColor(15, 23, 42)
        r2 = p.add_run(text)
        r2.font.color.rgb = RGBColor(51, 65, 85)
        return p

    def add_callout(text, title="NOTE"):
        tbl = doc.add_table(rows=1, cols=1)
        tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
        cell = tbl.cell(0, 0)
        set_cell_background(cell, "F1F5F9")
        p = cell.paragraphs[0]
        p.paragraph_format.space_before = Pt(6)
        p.paragraph_format.space_after = Pt(6)
        r1 = p.add_run(f"[{title}] ")
        r1.bold = True
        r1.font.color.rgb = RGBColor(37, 99, 235)
        r2 = p.add_run(text)
        r2.font.color.rgb = RGBColor(30, 41, 59)
        doc.add_paragraph().paragraph_format.space_after = Pt(4)

    # ---------------------------------------------------------
    # COVER / TITLE BLOCK
    # ---------------------------------------------------------
    title_p = doc.add_paragraph()
    title_p.paragraph_format.space_before = Pt(36)
    title_p.paragraph_format.space_after = Pt(8)
    title_p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    t_run = title_p.add_run("RV FITNESS – GYM MANAGEMENT SYSTEM")
    t_run.bold = True
    t_run.font.size = Pt(28)
    t_run.font.color.rgb = RGBColor(30, 41, 59)

    sub_p = doc.add_paragraph()
    sub_p.paragraph_format.space_after = Pt(4)
    sub_p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    s_run = sub_p.add_run("Comprehensive Technical Architecture & Operations Guide")
    s_run.font.size = Pt(16)
    s_run.font.color.rgb = RGBColor(225, 29, 72)

    loc_p = doc.add_paragraph()
    loc_p.paragraph_format.space_after = Pt(24)
    loc_p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    l_run = loc_p.add_run("Gym Location: Narsobawadi, Maharashtra, India | Version: 1.0 (Production-Ready)")
    l_run.font.size = Pt(11)
    l_run.font.italic = True
    l_run.font.color.rgb = RGBColor(100, 116, 139)

    # Insert Architecture Diagram on Cover Area
    doc.add_picture(p1, width=Inches(6.5))
    cap1 = doc.add_paragraph("Figure 1: Full-Stack System Architecture of RV Fitness Narsobawadi")
    cap1.alignment = WD_ALIGN_PARAGRAPH.CENTER
    cap1.paragraph_format.space_after = Pt(24)
    doc.add_page_break()

    # ---------------------------------------------------------
    # CHAPTER 1: EXECUTIVE SUMMARY & TECH STACK
    # ---------------------------------------------------------
    add_custom_heading("1. Executive Summary & Technology Stack", level=1)
    add_styled_paragraph("RV Fitness is a comprehensive full-stack gym management platform engineered for commercial gym operations in Narsobawadi. The system is not a UI prototype; every feature is linked to a live MySQL 8.0 relational database with atomic billing transactions, JWT role-based security, member management, trainer assignment, custom workout and diet plans, biometric telemetry tracking, and an operational gym status CMS.")

    tech_table = doc.add_table(rows=1, cols=3)
    tech_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    hdr = tech_table.rows[0].cells
    hdr[0].text = "Architecture Layer"
    hdr[1].text = "Technology Chosen"
    hdr[2].text = "Core Responsibility"
    for c in hdr:
        set_cell_background(c, "1E293B")
        c.paragraphs[0].runs[0].font.color.rgb = RGBColor(255, 255, 255)
        c.paragraphs[0].runs[0].bold = True

    tech_data = [
        ("Frontend Framework", "React 18 + Vite 5", "Component SPA, Hot Module Replacement, Client Routing"),
        ("Styling & Icons", "Tailwind CSS + Lucide React", "Responsive utility classes, fitness branding, mobile navigation"),
        ("Data Visualization", "Recharts 2.13", "Interactive charts for weight progress and business KPIs"),
        ("HTTP Client", "Axios 1.7", "Centralized REST client, JWT injection, 401 session recovery"),
        ("Backend Runtime", "Node.js 20 LTS + Express.js", "Modular REST API, asynchronous I/O, error handling middleware"),
        ("Database Server", "MySQL 8.0 (InnoDB)", "19 normalized tables, foreign keys, ACID financial ledgers"),
        ("Authentication", "JWT + bcryptjs", "Stateless 256-bit token signing and 10-round salted password hashes"),
        ("Print Engine", "Native CSS @media print", "Pixel-perfect official invoices and payment receipts")
    ]
    for row in tech_data:
        r = tech_table.add_row().cells
        r[0].text = row[0]
        r[1].text = row[1]
        r[2].text = row[2]
        r[0].paragraphs[0].runs[0].bold = True
    tech_table.autofit = True
    doc.add_paragraph().paragraph_format.space_after = Pt(14)

    # ---------------------------------------------------------
    # CHAPTER 2: DATABASE ENTITY-RELATIONSHIP ARCHITECTURE
    # ---------------------------------------------------------
    add_custom_heading("2. Relational Database Design (19 Normalized Tables)", level=1)
    add_styled_paragraph("The relational database schema is stored under rv_fitness_db and strictly enforces foreign key referential integrity using MySQL 8.0 InnoDB engine with utf8mb4 collation.")

    doc.add_picture(p2, width=Inches(6.5))
    cap2 = doc.add_paragraph("Figure 2: Entity-Relationship Diagram of the 19 Normalized Relational Tables")
    cap2.alignment = WD_ALIGN_PARAGRAPH.CENTER
    cap2.paragraph_format.space_after = Pt(12)

    db_table = doc.add_table(rows=1, cols=3)
    db_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    hdr = db_table.rows[0].cells
    hdr[0].text = "Table Name"
    hdr[1].text = "Primary Keys & FKs"
    hdr[2].text = "Description & Critical Columns"
    for c in hdr:
        set_cell_background(c, "1E293B")
        c.paragraphs[0].runs[0].font.color.rgb = RGBColor(255, 255, 255)
        c.paragraphs[0].runs[0].bold = True

    tables_info = [
        ("users", "id (PK)", "System authentication: email (unique), password_hash, role (admin/trainer/member), is_active"),
        ("trainers", "id (PK), user_id (FK->users)", "Trainer roster: full_name, phone, specialization, experience_years, bio, status"),
        ("members", "id (PK), user_id (FK), assigned_trainer_id (FK)", "Member directory: member_code (RVF-XXXX, UQ), full_name, phone, height, weight, goals"),
        ("membership_plans", "id (PK)", "Plan tiers: name, plan_type (Monthly/Quarterly/Annual), duration_days, price, benefits (JSON)"),
        ("memberships", "id (PK), member_id (FK), plan_id (FK)", "Active subscriptions: start_date, end_date, status (active, expiring_soon, expired)"),
        ("invoices", "id (PK), member_id (FK), membership_id (FK)", "Billing documents: invoice_number (INV-YYYY-XXXX), final_amount, amount_paid, balance, status"),
        ("invoice_items", "id (PK), invoice_id (FK->invoices)", "Line item charges: description, quantity, unit_price, total_price"),
        ("payments", "id (PK), invoice_id (FK), member_id (FK)", "Cash/UPI transactions: payment_number (PAY-YYYY-XXXX), amount, method, reference"),
        ("receipts", "id (PK), payment_id (FK, UQ), invoice_id (FK)", "Official receipts: receipt_number (RCP-YYYY-XXXX), amount, remaining_balance, cashier"),
        ("workout_plans", "id (PK), member_id (FK), trainer_id (FK)", "Personalized routine headers: title, goal, start_date, end_date, status"),
        ("workout_exercises", "id (PK), workout_plan_id (FK)", "Daily exercises: day_of_week (Mon..Sun), exercise_name, muscle_group, sets, reps, rest"),
        ("diet_plans", "id (PK), member_id (FK), trainer_id (FK)", "Macronutrient diet charts: title, target_calories, protein_g, carbs_g, fat_g"),
        ("diet_meals", "id (PK), diet_plan_id (FK)", "Scheduled meals: meal_name (Breakfast..Dinner), timing, food_items, calories, quantity"),
        ("progress_records", "id (PK), member_id (FK), recorded_by (FK)", "Biometric telemetry: weight_kg, height_cm, bmi (calculated), chest, waist, hips, arms, observations"),
        ("notices", "id (PK), created_by_user_id (FK)", "Internal and public notices: title, content, target_audience (all/members/trainers)"),
        ("events", "id (PK)", "Competitions and workshops: event_name, event_date, event_time, location (Narsobawadi)"),
        ("posts", "id (PK)", "CMS articles: title, category (tip/achievement/update/offer), content, is_published"),
        ("gym_status", "id=1 (Singleton PK)", "Realtime operational status: status (OPEN/CLOSED/HOLIDAY), opening_time, closing_time, notice"),
        ("audit_logs", "id (PK), user_id (FK)", "Security audit trail: action, entity_type, entity_id, details, ip_address, timestamp")
    ]
    for row in tables_info:
        r = db_table.add_row().cells
        r[0].text = row[0]
        r[1].text = row[1]
        r[2].text = row[2]
        r[0].paragraphs[0].runs[0].bold = True
    db_table.autofit = True
    doc.add_paragraph().paragraph_format.space_after = Pt(14)
    doc.add_page_break()

    # ---------------------------------------------------------
    # CHAPTER 3: AUTHENTICATION & SECURITY MIDDLEWARE
    # ---------------------------------------------------------
    add_custom_heading("3. Authentication & Role-Based Access Control (RBAC)", level=1)
    add_styled_paragraph("The security architecture employs stateless 256-bit JSON Web Tokens (JWT) coupled with 10-round salted bcrypt password hashes. Plain text passwords are never stored.")

    doc.add_picture(p3, width=Inches(6.5))
    cap3 = doc.add_paragraph("Figure 3: Authentication Lifecycle and Role-Based Route Guards")
    cap3.alignment = WD_ALIGN_PARAGRAPH.CENTER
    cap3.paragraph_format.space_after = Pt(12)

    add_custom_heading("Core Security Components", level=2)
    add_styled_paragraph("Validates incoming HTTP requests containing the Authorization: Bearer <token> header. Verifies the token against process.env.JWT_SECRET, confirms the user exists and is_active in MySQL, and populates req.user.", bold_prefix="1. verifyToken Middleware: ")
    add_styled_paragraph("Restricts route access based on user role. Accepts allowed roles (e.g. authorizeRoles('admin')) and returns HTTP 403 Forbidden if the user lacks adequate permissions.", bold_prefix="2. authorizeRoles Middleware: ")
    add_styled_paragraph("Guards client-side React routes. Verifies authentication state from AuthContext, validates role permissions, and redirects unauthorized visitors to /login or role dashboards.", bold_prefix="3. ProtectedRoute Component: ")

    # ---------------------------------------------------------
    # CHAPTER 4: FINANCIAL & BILLING STATE MACHINE
    # ---------------------------------------------------------
    add_custom_heading("4. Billing, Invoices & Payment Ledger", level=1)
    add_styled_paragraph("The financial module guarantees strict consistency. All payments atomically adjust invoice amounts, prevent overpayments, and issue sequential receipts.")

    doc.add_picture(p4, width=Inches(6.5))
    cap4 = doc.add_paragraph("Figure 4: Financial Invoice and Payment State Machine")
    cap4.alignment = WD_ALIGN_PARAGRAPH.CENTER
    cap4.paragraph_format.space_after = Pt(12)

    add_custom_heading("Mathematical Ledger Rules", level=2)
    add_styled_paragraph("Final Amount = Subtotal - Discount + Tax Amount", bold_prefix="• Final Amount Formula: ")
    add_styled_paragraph("Remaining Balance = Final Amount - Total Amount Paid", bold_prefix="• Balance Formula: ")
    add_styled_paragraph("A payment is valid if and only if: 0 < Payment Amount <= Remaining Balance. Payments exceeding balance are blocked.", bold_prefix="• Payment Validation: ")
    add_styled_paragraph("Invoices transition from 'pending' (0 paid) to 'partially_paid' (partial balance remaining) to 'paid' (balance = 0.00).", bold_prefix="• Status Transitions: ")

    # ---------------------------------------------------------
    # CHAPTER 5: MEMBER COACHING & LIFECYCLE
    # ---------------------------------------------------------
    add_custom_heading("5. Member Lifecycle & Coaching Telemetry", level=1)
    add_styled_paragraph("Members experience a structured lifecycle from initial onboarding to trainer allocation, customized weekly routines, dietary guidance, and biometric progress tracking.")

    doc.add_picture(p5, width=Inches(6.5))
    cap5 = doc.add_paragraph("Figure 5: End-to-End Member Progression & Telemetry Workflow")
    cap5.alignment = WD_ALIGN_PARAGRAPH.CENTER
    cap5.paragraph_format.space_after = Pt(12)

    add_custom_heading("Biometric Telemetry & BMI Calculation", level=2)
    add_styled_paragraph("Whenever a trainer records a progress check-in, the system automatically computes the member's Body Mass Index (BMI): BMI = weight_kg / (height_m ^ 2). Measurements for chest, waist, hips, arms, and thighs are preserved chronologically and visualized via Recharts.", bold_prefix="• Automated Telemetry: ")

    doc.add_page_break()

    # ---------------------------------------------------------
    # CHAPTER 6: COMPLETE BACKEND FUNCTION REFERENCE
    # ---------------------------------------------------------
    add_custom_heading("6. Complete Backend Function Reference (15 Controllers)", level=1)
    add_styled_paragraph("Below is the exhaustive catalog of all functions across the 15 backend controller modules:")

    ctrl_table = doc.add_table(rows=1, cols=3)
    ctrl_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    hdr = ctrl_table.rows[0].cells
    hdr[0].text = "Controller Module"
    hdr[1].text = "Exported Functions"
    hdr[2].text = "Key Logic & DB Operations"
    for c in hdr:
        set_cell_background(c, "1E293B")
        c.paragraphs[0].runs[0].font.color.rgb = RGBColor(255, 255, 255)
        c.paragraphs[0].runs[0].bold = True

    controllers_info = [
        ("authController.js", "register, login, getMe, forgotPassword, resetPassword, updateProfile, generateToken", "User registration with RVF-XXXX allocation, password comparison, JWT signing, profile updates"),
        ("memberController.js", "getMembers, getMemberById, createMember, updateMember, toggleMemberStatus, deleteMember", "Full-text search, 360-degree member dossier aggregation, status toggles, referential integrity check"),
        ("trainerController.js", "getTrainers, getTrainerById, createTrainer, updateTrainer, toggleTrainerStatus", "Trainer hiring, client count subqueries, specialization updates, member roster"),
        ("planController.js", "getPlans, createPlan, updatePlan, togglePlanStatus", "Membership plan tiers, JSON benefits parsing, price management"),
        ("membershipController.js", "getMemberships, assignMembership, renewMembership, cancelMembership", "Auto date calculation (end_date = start_date + duration), automatic renewal invoice creation"),
        ("billingController.js", "getInvoices, getInvoiceById, createInvoice, cancelInvoice", "Sequential INV-YYYY-XXXX generation, line items insertion, payment status monitoring"),
        ("paymentController.js", "getPayments, recordPayment, getReceipts, getReceiptById", "Atomic payment recording, balance recalculation, RCP-YYYY-XXXX receipt generation"),
        ("workoutController.js", "getWorkoutByMemberId, createWorkoutPlan, deleteWorkoutPlan", "Weekly schedule authoring (Mon..Sun), exercise grouping, sets and reps assignment"),
        ("dietController.js", "getDietByMemberId, createDietPlan, deleteDietPlan", "Nutrition chart builder, daily calorie goals, scheduled meals breakdown"),
        ("progressController.js", "getProgressByMemberId, recordProgress, deleteProgress", "Telemetry logging, automated BMI calculation, chronological ordering for charts"),
        ("noticeController.js", "getNotices, createNotice, deleteNotice", "Gym announcements targeted to all, members, or trainers"),
        ("eventController.js", "getEvents, createEvent, deleteEvent", "Community bootcamps, workshops, competitions in Narsobawadi"),
        ("postController.js", "getPosts, createPost, deletePost", "CMS updates, transformation achievements, workout tips, offers"),
        ("gymStatusController.js", "getGymStatus, updateGymStatus", "Realtime operational status (OPEN/CLOSED/HOLIDAY), operating hours"),
        ("reportController.js", "getAdminDashboard, getTrainerDashboard, getMemberDashboard, getReports, getAuditLogs", "Analytical reports (revenue, dues, rosters), live KPI summaries, audit trail")
    ]
    for row in controllers_info:
        r = ctrl_table.add_row().cells
        r[0].text = row[0]
        r[1].text = row[1]
        r[2].text = row[2]
        r[0].paragraphs[0].runs[0].bold = True
    ctrl_table.autofit = True
    doc.add_paragraph().paragraph_format.space_after = Pt(14)

    # ---------------------------------------------------------
    # CHAPTER 7: FRONTEND VIEWS & MODALS
    # ---------------------------------------------------------
    add_custom_heading("7. Frontend Page Catalog (25 Distinct Views)", level=1)
    add_styled_paragraph("The frontend is structured into 4 role-based view portals:")

    add_styled_paragraph("Home, About, Facilities, Membership Plans, Trainers, Photo Gallery, Announcements, Gym Status, Contact (Narsobawadi), and Public Navigation/Footer.", bold_prefix="1. Public Website (10 Views): ")
    add_styled_paragraph("Login (with 1-Click Quick Demo Login Pills), Register (Public Member Onboarding), and Forgot Password.", bold_prefix="2. Authentication Portal (3 Views): ")
    add_styled_paragraph("Executive Dashboard (Recharts KPIs), Member Directory, Member 360 Detail, Trainer Management, Plan Editor, Invoice Ledger, Payment Processing, Analytics & Reports, Content CMS, and Security Audit Logs.", bold_prefix="3. Admin Portal (10 Views): ")
    add_styled_paragraph("Trainer Dashboard, Assigned Client Roster, Weekly Workout Manager, Diet & Nutrition Manager, and Biometric Progress Logger.", bold_prefix="4. Trainer Portal (5 Views): ")
    add_styled_paragraph("Member Home Dashboard, Personal Profile, Invoices & Payment Receipts, Assigned Workout Schedule, Diet Chart, Weight Progress Chart, and Gym Bulletins.", bold_prefix="5. Member Portal (7 Views): ")
    add_styled_paragraph("PrintInvoiceModal (official tax invoice) and PrintReceiptModal (official fee receipt) with @media print stylesheets.", bold_prefix="6. Printable Document Modals: ")

    # ---------------------------------------------------------
    # CHAPTER 8: OPERATIONAL SCRIPTS & CREDENTIALS
    # ---------------------------------------------------------
    add_custom_heading("8. Operational Batch Launchers & Demo Credentials", level=1)
    add_styled_paragraph("To ensure continuous operation without dependency on terminal sessions, three standalone batch files are provided:")

    add_styled_paragraph("Double-click to start MySQL (Port 3306), Node Backend (Port 5000), and Vite Frontend (Port 3000), automatically opening the browser to http://127.0.0.1:3000.", bold_prefix="• START_RV_FITNESS.bat: ")
    add_styled_paragraph("Cleanly stops all background services with one double-click.", bold_prefix="• STOP_RV_FITNESS.bat: ")
    add_styled_paragraph("Synchronizes and pushes repository commits to GitHub (https://github.com/tejasbuwa/RV-Fitness-Gym-Management-System.git).", bold_prefix="• PUSH_TO_GITHUB.bat: ")

    cred_table = doc.add_table(rows=1, cols=4)
    cred_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    hdr = cred_table.rows[0].cells
    hdr[0].text = "Role"
    hdr[1].text = "Name"
    hdr[2].text = "Email"
    hdr[3].text = "Password"
    for c in hdr:
        set_cell_background(c, "1E293B")
        c.paragraphs[0].runs[0].font.color.rgb = RGBColor(255, 255, 255)
        c.paragraphs[0].runs[0].bold = True

    demo_creds = [
        ("Admin", "Super Admin", "admin@rvfitness.com", "Admin@123"),
        ("Trainer", "Vikram Patil", "vikram@rvfitness.com", "Trainer@123"),
        ("Trainer", "Sneha Kulkarni", "sneha@rvfitness.com", "Trainer@123"),
        ("Member", "Rohit Deshmukh (RVF-0001)", "rohit@gmail.com", "Member@123"),
        ("Member", "Ananya Joshi (RVF-0002)", "ananya@gmail.com", "Member@123"),
        ("Member", "Sachin More (RVF-0003)", "sachin@gmail.com", "Member@123")
    ]
    for row in demo_creds:
        r = cred_table.add_row().cells
        r[0].text = row[0]
        r[1].text = row[1]
        r[2].text = row[2]
        r[3].text = row[3]
        r[0].paragraphs[0].runs[0].bold = True
    cred_table.autofit = True

    out_path = os.path.join(DOCS_DIR, "RV_Fitness_Complete_System_Documentation.docx")
    doc.save(out_path)
    print(f"Document successfully written to: {out_path}")
    return out_path

if __name__ == "__main__":
    out = build_docx()
