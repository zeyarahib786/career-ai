# Solvagence Global AI Academy — MERN Setup Guide

**Stack:** Node.js 20 · Express 4 · MongoDB 7 · React 18 · Vite 5  
**Version:** 1.0.0 · Production Ready · July 2026 Founding Cohort

---

## Contents
1. [Prerequisites](#1-prerequisites)
2. [Project Structure](#2-project-structure)
3. [Quick Start (5 Steps)](#3-quick-start-5-steps)
4. [Backend Setup](#4-backend-setup)
5. [Frontend Setup](#5-frontend-setup)
6. [Database — Seed](#6-database--seed)
7. [Environment Variables Reference](#7-environment-variables-reference)
8. [API Reference](#8-api-reference)
9. [Docker Deployment](#9-docker-deployment)
10. [Production Deployment](#10-production-deployment)
11. [Email Configuration](#11-email-configuration)
12. [Stripe Integration](#12-stripe-integration)
13. [Troubleshooting](#13-troubleshooting)

---

## 1. Prerequisites

| Tool | Minimum | Install |
|---|---|---|
| Node.js | 18.0.0 | https://nodejs.org |
| npm | 9.0.0 | Included with Node |
| MongoDB | 7.0 | https://www.mongodb.com/try/download/community |
| Docker *(optional)* | 24 | https://www.docker.com |

```bash
node --version    # v18.x.x or higher
npm --version     # 9.x.x or higher
mongod --version  # db version v7.x.x
```

---

## 2. Project Structure

```
solvagence-mern/
├── backend/
│   ├── src/
│   │   ├── config/         env.js · database.js
│   │   ├── models/         Certification.js · Track.js · Enrollment.js
│   │   ├── controllers/    4 controllers
│   │   ├── routes/         4 route files
│   │   ├── middleware/     errorHandler · requestId · rateLimiter · validate
│   │   ├── services/       logger · pricingService · emailService
│   │   ├── seed/           index.js (6 certs + 4 tracks, EN+AR)
│   │   ├── utils/          AppError.js
│   │   ├── app.js          Express app (helmet, cors, routes)
│   │   └── server.js       Entry point + graceful shutdown
│   ├── tests/              pricing.test.js · health.test.js · appError.test.js
│   ├── Dockerfile
│   ├── jest.config.js
│   ├── .eslintrc.json
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── navigation/  SiteNav · SiteFooter · ComplianceBadges
│   │   │   ├── landing/     HeroSection
│   │   │   ├── programmes/  CertificationPortfolio · TrackCard · TrackModal · CurriculumDrawer
│   │   │   ├── enrollment/  EnrollmentModal · CallToAction
│   │   │   ├── marketing/   WhySection
│   │   │   ├── support/     FAQSection
│   │   │   └── common/      ErrorBoundary
│   │   ├── pages/           HomePage · NotFoundPage · LegalPages (Privacy/Terms/A11y/Cookies)
│   │   ├── context/         LangContext.jsx (EN/AR global state)
│   │   ├── hooks/           useTranslation · useCertifications
│   │   ├── services/        api.js (Axios + service functions)
│   │   ├── i18n/            index.js (391 EN + 391 AR keys from v11)
│   │   └── styles/          global.css (64KB — exact v11 design system)
│   ├── public/
│   │   ├── robots.txt
│   │   └── .well-known/security.txt
│   ├── index.html
│   ├── vite.config.js · nginx.conf · Dockerfile
│   └── package.json
│
├── docs/          SETUP.md
├── CHANGELOG.md
├── .gitignore
└── docker-compose.yml
```

---

## 3. Quick Start (5 Steps)

```bash
# 1. Install dependencies
cd backend  && npm install && cd ..
cd frontend && npm install && cd ..

# 2. Configure environment
cp backend/.env.example  backend/.env
cp frontend/.env.example frontend/.env
# Edit backend/.env — set MONGODB_URI, JWT_SECRET, SMTP_* at minimum

# 3. Start MongoDB
mongod --dbpath ~/data/db
# macOS:  brew services start mongodb-community
# Linux:  sudo systemctl start mongod

# 4. Seed database
cd backend && npm run seed && cd ..
# Expected: "Seeded 4 tracks" and "Seeded 6 certifications"

# 5. Start both servers (two terminals)
cd backend  && npm run dev   # API  → http://localhost:5000
cd frontend && npm run dev   # App  → http://localhost:3000
```

---

## 4. Backend Setup

```bash
cd backend
npm install

# Scripts
npm run dev        # nodemon auto-restart
npm start          # production start
npm run seed       # upsert 6 certs + 4 tracks (safe to re-run)
npm run seed:reset # clear + re-seed
npm test           # jest (3 test suites)
npm run lint       # eslint src/

# Verify
curl http://localhost:5000/health
curl http://localhost:5000/api/v1/tracks?locale=ar
curl http://localhost:5000/api/v1/certifications/SGA-01
```

---

## 5. Frontend Setup

```bash
cd frontend
npm install
npm run dev     # starts on http://localhost:3000
npm run build   # production build → dist/
npm run preview # preview production build locally
npm run lint    # eslint check
```

The Vite dev server proxies `/api/*` → `http://localhost:5000` automatically.

---

## 6. Database — Seed

```bash
cd backend

npm run seed           # upsert (idempotent — safe to re-run)
npm run seed:reset     # wipe collections then re-seed

# Verify in mongosh
mongosh
use solvagence_academy
db.tracks.countDocuments()          # → 4
db.certifications.countDocuments()  # → 6
db.certifications.findOne({code:'SGA-01'}, {code:1, 'en.title':1, priceUSD:1})
```

### MongoDB Atlas (cloud)

1. Create free cluster at https://cloud.mongodb.com
2. Create DB user with readWrite permissions
3. Whitelist your IP
4. Set connection string:
```env
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/solvagence_academy?retryWrites=true&w=majority
```

---

## 7. Environment Variables Reference

### Backend (`backend/.env`)

| Variable | Required | Default | Notes |
|---|---|---|---|
| `NODE_ENV` | — | `development` | `development` or `production` |
| `PORT` | — | `5000` | API port |
| `MONGODB_URI` | **Yes** | — | Local or Atlas URI |
| `JWT_SECRET` | **Yes** | — | Minimum 32 chars |
| `CORS_ORIGINS` | — | `http://localhost:3000` | Comma-separated |
| `SMTP_HOST` | **Yes** | — | SMTP server |
| `SMTP_PORT` | — | `587` | |
| `SMTP_USER` | **Yes** | — | |
| `SMTP_PASS` | **Yes** | — | API key or password |
| `EMAIL_FROM_ADDRESS` | **Yes** | — | |
| `STRIPE_SECRET_KEY` | — | — | `sk_live_...` |
| `STRIPE_WEBHOOK_SECRET` | — | — | `whsec_...` |
| `VAT_RATE` | — | `0.05` | UAE VAT 5% |
| `VAT_COUNTRY` | — | `AE` | ISO code |
| `LOG_LEVEL` | — | `info` | Winston level |

### Frontend (`frontend/.env`)

| Variable | Default | Notes |
|---|---|---|
| `VITE_API_BASE_URL` | `/api/v1` | Proxied in dev; set to full URL in prod |

---

## 8. API Reference

**Base URL:** `http://localhost:5000/api/v1`

### Health
```
GET /health
Response: { status:"ok", service, version, env, ts }
```

### Certifications
```
GET /api/v1/certifications?locale=en|ar
GET /api/v1/certifications/SGA-01?locale=en
GET /api/v1/certifications/track/t2?locale=en
```

### Tracks
```
GET /api/v1/tracks?locale=en|ar        — returns tracks with nested certifications
GET /api/v1/tracks/t1?locale=en
```

### Pricing
```
GET  /api/v1/pricing/rules
POST /api/v1/pricing/calculate
Body: { certificationCodes:["SGA-01","SGA-02"], seats:1, cohortType:"individual", country:"AE" }
```

### Enrollment *(rate limited: 5 req/15 min)*
```
POST /api/v1/enrollments
Body: { firstName, lastName, email, phone, country, jobTitle, organisation,
        certificationCodes, cohortType, seats, locale, dataConsent:"true" }
Response: { reference:"SGA-XXXX", status, pricing, certifications, confirmedAt }

GET /api/v1/enrollments/:reference
```

### Validation errors (400)
```json
{ "success": false, "error": "Validation failed",
  "details": [{ "field": "email", "message": "Valid email required" }] }
```

---

## 9. Docker Deployment

```bash
# 1. Create backend env file
cp backend/.env.example backend/.env
# Edit backend/.env with production values

# 2. Build and start all services
docker-compose up --build -d

# 3. Seed the database
docker-compose exec api npm run seed

# 4. Verify
curl http://localhost:5000/health
open http://localhost:3000

# 5. View logs
docker-compose logs -f api
docker-compose logs -f client

# Stop
docker-compose down
docker-compose down -v   # also removes MongoDB data
```

Services:
- MongoDB:  `localhost:27017`
- API:      `localhost:5000`
- Frontend: `localhost:3000`

---

## 10. Production Deployment

### Option A — VPS (DigitalOcean, AWS EC2, Hetzner)

```bash
# 1. Install Node 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# 2. Install PM2
npm install -g pm2

# 3. Clone and setup
git clone <repo> /var/www/solvagence && cd /var/www/solvagence
cd backend && npm install --production && cp .env.example .env && nano .env
node src/seed/index.js
pm2 start src/server.js --name sga-api --env production
pm2 save && pm2 startup

# 4. Build frontend
cd ../frontend && npm install && VITE_API_BASE_URL=/api/v1 npm run build

# 5. nginx config (see below)
```

```nginx
# /etc/nginx/sites-available/solvagence
server {
    listen 443 ssl http2;
    server_name academy.solvagence.com;
    ssl_certificate     /path/to/fullchain.pem;
    ssl_certificate_key /path/to/privkey.pem;

    root /var/www/solvagence/frontend/dist;
    index index.html;

    location / { try_files $uri $uri/ /index.html; }

    location /api/ {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Request-ID $request_id;
    }
}
server { listen 80; server_name academy.solvagence.com; return 301 https://$server_name$request_uri; }
```

### Option B — Platform-as-a-Service

**Backend (Render / Railway / Fly.io):**
- Root: `backend/`
- Build: `npm install`
- Start: `node src/server.js`
- Add all env vars from `backend/.env`
- After deploy: run seed via shell

**Frontend (Vercel / Netlify):**
- Root: `frontend/`
- Build: `npm run build`
- Output: `dist`
- Set `VITE_API_BASE_URL=https://your-api.onrender.com/api/v1`

---

## 11. Email Configuration

### Resend (recommended for DIFC/UAE delivery)
```env
SMTP_HOST=smtp.resend.com
SMTP_PORT=587
SMTP_USER=resend
SMTP_PASS=re_xxxx   # Resend API key — https://resend.com (3,000/mo free)
```

### SendGrid
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=SG.xxxx
```

### Gmail (development only)
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your@gmail.com
SMTP_PASS=your_app_password   # Google Account → Security → App Passwords
```

---

## 12. Stripe Integration

```env
# backend/.env
STRIPE_SECRET_KEY=sk_live_xxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxx

# frontend/.env
VITE_STRIPE_PUBLIC_KEY=pk_live_xxxx
```

Test cards:
| Card | Result |
|---|---|
| `4242 4242 4242 4242` | Success |
| `4000 0000 0000 0002` | Decline |
| Any future expiry, any 3-digit CVV | — |

---

## 13. Troubleshooting

**`ECONNREFUSED` on startup**  
MongoDB is not running. `brew services start mongodb-community` (macOS) or `sudo systemctl start mongod` (Linux)

**`Missing required env var: MONGODB_URI`**  
`.env` file missing or empty. `cp backend/.env.example backend/.env` then edit.

**CORS error in browser**  
Add your frontend origin to `CORS_ORIGINS` in `backend/.env`.

**`npm test` fails with `Cannot find module`**  
Run `npm install` in the `backend/` directory first.

**Seed fails with duplicate key**  
Use `npm run seed:reset` to clear and re-seed.

**Arabic text not showing in UI**  
Check browser console for JS errors. The i18n engine auto-detects GCC timezones for Arabic. You can force it: open DevTools → Application → localStorage → set `sga-lang` to `ar`.

**Frontend shows "Unable to load programmes"**  
1. Confirm API is running: `curl http://localhost:5000/health`
2. Confirm seed ran: `curl http://localhost:5000/api/v1/tracks`
3. Check `VITE_API_BASE_URL` in `frontend/.env`

---

*Solvagence Global AI Academy · DIFC, Dubai, UAE · July 2026 Founding Cohort*
