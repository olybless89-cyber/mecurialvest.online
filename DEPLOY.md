# NexBank — Deployment Guide
## Stack: Netlify (Frontend) · Render (Backend API) · Supabase (PostgreSQL)

---

## Step 1 — Supabase Database Setup

1. Go to [supabase.com](https://supabase.com) → New Project
2. Choose a region, set a strong DB password
3. Once created, go to **Project Settings → Database → Connection string → URI** (use the **Transaction Pooler** URL for Render — port 6543)
4. Copy the connection string — it looks like:
   ```
   postgresql://postgres.xxxx:YOUR_PASSWORD@aws-0-us-east-1.pooler.supabase.com:6543/postgres
   ```
5. Keep this — you'll need it in the next step

---

## Step 2 — Push the Database Schema to Supabase

Once you have your Supabase DATABASE_URL, add it as an environment secret in this Replit project (name it `DATABASE_URL`), then run:

```bash
pnpm --filter @workspace/db run push
```

This creates all the tables in Supabase:
- `users` — accounts & auth
- `accounts` — bank accounts
- `transactions` — full transaction history
- `beneficiaries` — saved recipients
- `notifications` — user notifications
- `audit_logs` — admin actions
- `settings` — app configuration

---

## Step 3 — Resend Email Setup

1. Go to [resend.com](https://resend.com) → Sign up free
2. Add and verify your sending domain (or use `onboarding@resend.dev` for testing)
3. Create an API key → copy it

---

## Step 4 — Deploy Backend to Render

1. Push this repo to GitHub
2. Go to [render.com](https://render.com) → New → Web Service
3. Connect your GitHub repo
4. Settings:
   - **Build Command:** `pnpm install --frozen-lockfile && pnpm --filter @workspace/api-server run build`
   - **Start Command:** `node artifacts/api-server/dist/index.mjs`
   - **Environment:** Node
   - **Region:** Oregon (or closest to your Supabase region)
   - **Plan:** Free
5. Add these **Environment Variables** in Render dashboard:
   ```
   NODE_ENV=production
   PORT=10000
   DATABASE_URL=postgresql://postgres.xxxx:...  (your Supabase URL)
   JWT_SECRET=<generate a random 32+ char string>
   JWT_REFRESH_SECRET=<generate a different random 32+ char string>
   JWT_EXPIRES_IN=7d
   RESEND_API_KEY=re_xxxxxxxxxxxx
   FROM_EMAIL=NexBank <noreply@yourdomain.com>
   FRONTEND_URL=https://your-app.netlify.app  (fill in after Netlify deploy)
   ```
6. Click **Deploy** — wait for it to go live
7. Copy your Render URL: `https://your-api.onrender.com`
8. Test it: `curl https://your-api.onrender.com/api/healthz`

---

## Step 5 — Deploy Frontend to Netlify

1. Go to [netlify.com](https://netlify.com) → New site → Import from Git
2. Connect your GitHub repo
3. Settings:
   - **Base directory:** `artifacts/web`
   - **Build command:** `pnpm run build`
   - **Publish directory:** `artifacts/web/dist/public`
4. Add these **Environment Variables** in Netlify (Site config → Environment variables):
   ```
   VITE_API_URL=https://your-api.onrender.com
   ```
5. Click **Deploy site**
6. Copy your Netlify URL: `https://your-app.netlify.app`

---

## Step 6 — Final Wiring

1. **Update FRONTEND_URL** in Render dashboard to your Netlify URL (for CORS + email links)
2. **Redeploy the Render service** so it picks up the new FRONTEND_URL

---

## Step 7 — Create Your First Admin Account

After deployment, register a normal account via the UI, then run this SQL in Supabase SQL editor to promote it to SUPER_ADMIN:

```sql
UPDATE users SET role = 'SUPER_ADMIN' WHERE email = 'your@email.com';
```

Then log in and go to `/admin` for the admin panel.

---

## Local Development

```bash
# 1. Add DATABASE_URL to Replit secrets
# 2. Start both services
# API: already running via Replit workflow
# Frontend:
pnpm --filter @workspace/web run dev
```

The Vite dev server proxies `/api` → `http://localhost:8080` automatically.

---

## Email Features

| Trigger | Email Sent |
|---------|-----------|
| Register | Welcome email + verification link |
| Verify email | Account activated |
| Forgot password | Password reset link (1hr expiry) |
| Any transaction | Credit/debit alert with amount + new balance |
| Admin fund/debit | Credit/debit alert to user |

---

## API Endpoints Summary

| Category | Base | Key Endpoints |
|----------|------|---------------|
| Auth | `/api/auth` | register, login, refresh, me, verify-email, forgot-password, reset-password |
| Accounts | `/api/accounts` | list, create, get, freeze, unfreeze, transactions |
| Transactions | `/api/transactions` | list (filtered), summary, trend, get |
| Transfers | `/api/transfers` | internal (between own), external (wire) |
| Beneficiaries | `/api/beneficiaries` | CRUD |
| Notifications | `/api/notifications` | list, read, read-all, delete |
| Profile | `/api/profile` | get, update, change-password |
| Admin | `/api/admin` | stats, users, fund, debit, transactions, reverse, audit-logs |
