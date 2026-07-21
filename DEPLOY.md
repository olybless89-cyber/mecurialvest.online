# NexBank — Deployment Guide
## Stack: Vercel (Frontend) · Render (Backend API) · Supabase (PostgreSQL)

---

## Step 1 — Supabase (already done ✅)

Database is live at `ayahekavawomgmtahdzo.supabase.co` (Frankfurt).  
All tables are pushed. No action needed here.

---

## Step 2 — Push Code to GitHub

Vercel and Render both deploy from a GitHub repo.

1. Go to [github.com](https://github.com) → **New repository** → name it `nexbank`
2. In the Replit Shell, run:
   ```bash
   git init
   git add .
   git commit -m "Initial NexBank commit"
   git remote add origin https://github.com/YOUR_USERNAME/nexbank.git
   git push -u origin main
   ```

---

## Step 3 — Deploy Backend to Render

1. Go to [render.com](https://render.com) → **New → Web Service**
2. Connect your GitHub repo (`nexbank`)
3. Settings:
   - **Root Directory:** *(leave blank — use repo root)*
   - **Build Command:** `pnpm install --frozen-lockfile && pnpm --filter @workspace/api-server run build`
   - **Start Command:** `node artifacts/api-server/dist/index.mjs`
   - **Environment:** Node
   - **Region:** Frankfurt (EU Central) — matches Supabase
   - **Plan:** Free
4. Add these **Environment Variables** in Render dashboard:
   ```
   NODE_ENV=production
   PORT=10000
   SUPABASE_DATABASE_URL=<your Supabase connection string>
   JWT_SECRET=<your JWT secret>
   JWT_REFRESH_SECRET=<your JWT refresh secret>
   JWT_EXPIRES_IN=7d
   RESEND_API_KEY=<your Resend API key>
   FROM_EMAIL=NexBank <onboarding@resend.dev>
   FRONTEND_URL=https://your-app.vercel.app   ← fill in after Vercel deploy
   ```
5. Click **Deploy** — wait for green ✅
6. Copy your Render URL: `https://nexbank-api.onrender.com`
7. Test: `curl https://nexbank-api.onrender.com/api/health`

---

## Step 4 — Deploy Frontend to Vercel

1. Go to [vercel.com](https://vercel.com) → **Add New → Project**
2. Import your GitHub repo (`nexbank`)
3. Vercel will auto-detect the `vercel.json` — no manual settings needed
4. Add this **Environment Variable**:
   ```
   VITE_API_URL=https://nexbank-api.onrender.com
   ```
5. Click **Deploy**
6. Copy your Vercel URL: `https://nexbank.vercel.app`

---

## Step 5 — Final Wiring

1. Go back to **Render → nexbank-api → Environment**
2. Update `FRONTEND_URL` to your Vercel URL (e.g. `https://nexbank.vercel.app`)
3. Click **Save Changes** — Render will redeploy automatically

---

## Step 6 — Create Your Admin Account

After deployment, register via the app UI, then run this in the **Supabase SQL Editor**:

```sql
UPDATE users SET role = 'SUPER_ADMIN' WHERE email = 'your@email.com';
```

Then log in and visit `/admin` for the admin panel.

---

## Environment Variables Summary

### Render (Backend)
| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `PORT` | `10000` |
| `SUPABASE_DATABASE_URL` | Your Supabase connection string |
| `JWT_SECRET` | Random 48-byte hex string |
| `JWT_REFRESH_SECRET` | Random 48-byte hex string |
| `JWT_EXPIRES_IN` | `7d` |
| `RESEND_API_KEY` | From resend.com |
| `FROM_EMAIL` | `NexBank <onboarding@resend.dev>` |
| `FRONTEND_URL` | Your Vercel URL |

### Vercel (Frontend)
| Key | Value |
|-----|-------|
| `VITE_API_URL` | Your Render API URL |

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
