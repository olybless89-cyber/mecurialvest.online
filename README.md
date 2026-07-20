# NexBank — Modern Digital Banking Platform

A full-stack digital banking web application built with Next.js 15, Express.js, Prisma, and PostgreSQL.

## Features

- 🔐 Authentication (JWT + HttpOnly cookies, email verification, password reset)
- 💰 Dashboard with real-time balance and transaction overview
- 💳 Multiple account types (checking, savings, investment)
- 💸 Internal transfers between accounts and to beneficiaries
- 📊 Transaction history with filters and export
- 👥 Beneficiary management
- 🔔 Notifications (in-app + email via Resend)
- 👤 Profile management with avatar upload
- 🛡️ Admin dashboard with audit logs and role-based permissions
- 🌙 Dark mode support
- 📱 Fully responsive design

## Tech Stack

### Frontend
- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui
- Framer Motion
- React Hook Form + Zod
- TanStack Query

### Backend
- Express.js + TypeScript
- Prisma ORM
- PostgreSQL (Supabase)
- JWT + bcrypt
- Helmet, CORS, Rate Limiter
- Resend (email)
- Multer (file uploads)

## Getting Started

### Prerequisites
- Node.js 20+
- PostgreSQL (or Supabase account)
- Resend account (for email)

### 1. Clone & Install

```bash
git clone https://github.com/yourusername/nexbank.git
cd nexbank

# Install root deps
npm install

# Install backend deps
cd backend && npm install && cd ..

# Install frontend deps
cd frontend && npm install && cd ..
```

### 2. Environment Variables

```bash
# Backend
cp backend/.env.example backend/.env

# Frontend
cp frontend/.env.example frontend/.env.local
```

Fill in all values in both `.env` files.

### 3. Database Setup

```bash
cd backend
npx prisma migrate dev --name init
npx prisma db seed
```

### 4. Run Development Servers

```bash
# From root
npm run dev
```

This starts both frontend (http://localhost:3000) and backend (http://localhost:5000) concurrently.

## Docker

```bash
docker-compose up --build
```

## Deployment

- **Frontend**: Netlify (see `netlify.toml`)
- **Backend**: Render (see `render.yaml`)
- **Database**: Supabase

## Project Structure

```
nexbank/
├── frontend/          # Next.js 15 application
├── backend/           # Express.js API server
├── database/          # SQL migrations & seeds
├── docs/              # API documentation
├── docker-compose.yml
├── .env.example
└── README.md
```

## Admin Access

After seeding, use:
- Email: `admin@nexbank.com`
- Password: `Admin@123456`

## API Documentation

See `docs/api.md` for full API reference.

## License

MIT
