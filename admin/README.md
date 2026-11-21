# weeChat Admin Web Portal

Standalone, production-grade administrative control panel for weeChat, built with React 19, Vite, and Tailwind CSS.

## Features

1. **Overview & Demographics Dashboard**:
   - Total registered users & real-time active users.
   - Gender demographics (Male %, Female %, Other %).
   - Age group cohorts (18-24, 25-34, 35-44, 45+) dynamically calculated from users' `dob`.
   - Feature consumption overview (1-on-1 calls, group rooms, chat messages) and most-used platform feature.

2. **Client Management (CRUD)**:
   - ReDoS-safe instant search by name, @username, or email.
   - Filters by Role (admin, moderator, user), Status (active, banned), and Gender.
   - Create new user accounts or edit existing details.
   - One-click account ban / unban with automated session revocation.
   - User account deletion.

3. **User Inspector & Device History Deep-Dive**:
   - Track every place an account has logged in from:
     - Device type (Desktop, Mobile, Tablet).
     - Operating System (macOS, Windows, iOS, Android, Linux).
     - Browser (Chrome, Safari, Firefox, Edge).
     - Client IP address and geo-location (e.g. Mumbai, India).
     - Login timestamp, last active timestamp, and session duration.
     - Remote session revocation button.
   - Feature usage breakdown per user:
     - 1-on-1 calls count and total streamed minutes.
     - Group room lounges hosted and joined.
     - Live chat messages sent.
     - Primary feature highlight and distribution bar.

4. **Website Ad Placements Manager**:
   - 5 placements: Top Header Banner, In-Call Video Overlay, Matchmaking Queue Card, Group Room Lounge Sidebar, and Bottom Dock Banner.
   - Providers: Custom Banner Image, Google AdSense, Affiliate Link, or Custom HTML/JS Script.
   - Live interactive render preview on Desktop and Mobile viewports.
   - Impression and click counters.

5. **Payments & Gateway Reference ID Inspector**:
   - Track transactions with gateway reference IDs (Razorpay, Stripe, UPI).
   - Customer account details, amounts (₹), currency, and timestamps.
   - Payment status management (Success, Pending, Failed).
   - Record manual offline payments and test invoices.

## Getting Started

```bash
# Navigate to admin folder
cd admin

# Install dependencies
npm install

# Start development server on port 5174
npm run dev

# Build for production
npm run build
```
