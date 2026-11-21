# weeChat Admin Command Suite

Dual-folder architecture containing a **Dedicated Admin Backend** (`admin/backend`) and a **Dedicated Admin Frontend** (`admin/frontend`).

Directly connected to the primary MongoDB Atlas database cluster (`mongodb+srv://.../chat-app`).

---

## Architecture Overview

```
admin/
├── backend/                  # Dedicated Standalone Express Server (Port 4000)
│   ├── .env                  # Direct connection to main MongoDB Atlas
│   ├── package.json
│   ├── server.js             # API entrypoint (Mounts /api/auth, /api/users, /api/queries, etc.)
│   └── src/
│       ├── config/           # MongoDB Atlas connector
│       ├── controllers/      # Query resolver, user CRUD, demographics, ads, payments
│       ├── middleware/       # Admin RBAC authentication guard
│       ├── models/           # Mongoose schemas (User, SupportTicket, AuthSession, etc.)
│       ├── routes/           # Dedicated admin REST endpoints
│       └── utils/            # GeoIP device parser, ApiError, ApiResponse
│
└── frontend/                 # Dedicated React 19 + Vite Web Application (Port 5174)
    ├── index.html
    ├── package.json
    ├── vite.config.js
    └── src/
        ├── api/              # Axios instance targeting http://localhost:4000/api/
        ├── components/
        │   ├── AdminLoginModal.jsx
        │   ├── OverviewTab.jsx       # KPIs, Demographics & Feature Usage
        │   ├── UsersTab.jsx          # Client CRUD & User List
        │   ├── UserInspectorModal.jsx# Device/Login History, Location & Sessions
        │   ├── UserEditModal.jsx     # User Edit/Create Modal
        │   ├── QueriesTab.jsx        # Client Query Helpdesk & Resolution Resolver
        │   ├── AdsTab.jsx            # Website Ad Placements Manager
        │   └── PaymentsTab.jsx       # Gateway Transactions (Razorpay, Stripe, UPI)
        ├── App.jsx
        └── main.jsx
```

---

## Verified Master Admin Credentials

| Role | Email | Password |
|---|---|---|
| **Primary Master Admin** | `admin@weechat.io` | `admin1234` |
| **Admin Superuser** | `prashantjha1632@gmail.com` | User Password |
| **Admin Superuser** | `niketjha0108@gmail.com` | User Password |

---

## Key Capabilities

1. **Client Query Resolution & Helpdesk ("client ki querry resolve kreyga")**:
   - Live incoming customer support queries & tickets.
   - Filter by status (`open`, `in_progress`, `resolved`, `closed`), category (`account`, `billing`, `bug`, `feedback`), and priority (`high`, `medium`, `low`).
   - Official Admin Resolution composer with instant client delivery.
   - 1-click jump to inspect the complaining user's device and login history.
   - Safety & abuse report moderation.

2. **Client Management (Full CRUD)**:
   - Instant search across names, @usernames, and emails.
   - Filter by Role, Status (active/banned), and Gender.
   - Create new users, modify profile details, or permanently delete accounts.
   - One-click account ban with instant session revocation across all devices.

3. **User Inspector & Device / Login History Deep-Dive**:
   - Device Type (Desktop, Mobile, Tablet).
   - Operating System (macOS, Windows, iOS, Android, Linux).
   - Browser client (Chrome, Safari, Firefox, Edge).
   - IP address & Geo-location (e.g., Mumbai, India).
   - Session duration, login timestamp, and remote revocation button.
   - Per-user feature usage (calls, minutes streamed, rooms, messages).

4. **Platform Demographics & Feature Analytics**:
   - Active users online right now.
   - Gender demographics (Male %, Female %, Other %).
   - Age group cohorts (18-24, 25-34, 35-44, 45+) dynamically calculated from `dob`.
   - Most used features across the entire platform.

5. **Website Ads Placements Manager**:
   - 5 placements: Top Header Banner, In-Call Floating Video Card, Matchmaking Queue Card, Group Room Lounge Sidebar, and Bottom Dock Banner.
   - Custom Image banners, Google AdSense, Affiliate links, and custom scripts.
   - Live Desktop and Mobile interactive viewport preview.
   - Real-time impression and click tracking.

6. **Payments & Gateway Transaction Audits**:
   - Razorpay, Stripe, and UPI transaction logs with gateway reference IDs.
   - Status updates and manual transaction recording.

---

## How to Run

### 1. Start Admin Backend (Port 4000)
```bash
cd admin/backend
npm run dev
```

### 2. Start Admin Frontend (Port 5174)
```bash
cd admin/frontend
npm run dev
```
Open **`http://localhost:5174`** in your browser and sign in with `admin@weechat.io` / `admin1234`.
