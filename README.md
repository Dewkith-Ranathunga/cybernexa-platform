# CyberNexa Platform

User authentication platform built with Next.js, PayloadCMS, and MongoDB.

## Tech Stack
- **Frontend:** Next.js 14 (App Router), React
- **Backend/CMS:** PayloadCMS
- **Database:** MongoDB
- **Animations:** GSAP

## Setup Instructions

### 1. Clone and install
git clone <your-repo-url>
cd cybernexa-platform
npm install

### 2. Environment variables
Create a `.env` file in the root:
DATABASE_URI=mongodb://127.0.0.1/cybernexa
PAYLOAD_SECRET=any-random-32-character-string
NEXT_PUBLIC_SERVER_URL=http://localhost:3000

### 3. Run the app
npm run dev

App: http://localhost:3000
Payload Admin: http://localhost:3000/admin

### 4. Create the first admin user
Visit `localhost:3000/admin` on first run.
Payload will prompt you to create the initial admin account.
This user automatically gets admin access to the platform.

## GSAP Animations

1. **Staggered form entrance** — on /register and /login, each field and the CTA button animate in sequentially using `gsap.from()` with a 0.1s stagger. Chosen to give the form a polished, intentional feel.

2. **Timeline-based page transitions** — register/login link clicks and post-submit redirects use `gsap.timeline()` to orchestrate exit sequences before navigation (Register ↔ Login and Login → Dashboard). Chosen to make navigation feel smooth and intentional.

3. **Dashboard card entrance** — on both dashboards, stat cards and the users table animate in from below on mount. Chosen so content doesn't just "pop" into existence.

4. **Button success micro-animation** — on successful registration, the submit button scales briefly to confirm the action before redirecting.