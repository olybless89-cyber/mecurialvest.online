# AGENTS.md — MercurialVest (mecurialvest.online)

## What this project actually is
A **static HTML/JS** banking demo site. Despite shipping Laravel-style scaffolding
(`app/Http/Controllers/...`, `composer.json`, `SQL/database.sql`), there is **no PHP
runtime app**: no `artisan`, no `vendor/`, no `routes/`, no `index.php`, no `.env`.
The `app/` controllers are dead code. All real functionality lives client-side in
the `.html` files, which talk to **Supabase** directly via the embedded anon key.

## Auth / data backend
- Supabase project: `uatnxwvkpuvxvgngxxez.supabase.co` (anon key embedded in
  `login.html`, `register.html`, `dashboard.html`, `admin.html`, `admin-login.html`).
- Auth: `supabase.auth.signUp` / `signInWithPassword` / `getSession` / `signOut`.
- A `profiles` table is auto-populated by a DB trigger on user signup with
  `role=user`, `status=active`, an `account_number` (MVnnnnnnnn), `balance=0`, etc.
- Sessions persist in `localStorage` under `sb-<ref>-auth-token`.
- Email confirmation is **disabled** — signUp returns a usable session immediately.

## How the site is served (important)
The deploy config runs: `php -S 0.0.0.0:$PORT -t public public/router.php`
(see `Procfile`, `railway.json`, `nixpacks.toml`). `public/router.php` **must
exist** or the server fails to start and the site returns 502 Bad Gateway.
`public/router.php` serves the static files and applies the clean-URL rewrites
from `vercel.json` (`/login` -> `/login.html`, `/admin/*` -> `/admin.html`, etc.).

## File layout gotcha
Most HTML pages exist in **two copies**: repo root and `public/`. The deploy
serves from `public/`, so **always sync edits to both**:
`cp <page>.html public/<page>.html`. Auth pages (`login.html`, `register.html`)
and `dashboard.html`/`admin.html` are the ones that matter for auth flows.

## Verified auth flows
- Register: `register.html` -> `signUp` -> upsert `profiles` row -> redirect to `/login`
  (then auto-redirects to `/dashboard` because a session is already present).
- Login: `login.html` -> `signInWithPassword` -> read `profiles` -> route by role
  (`admin` -> `/admin`, else `/dashboard`). Missing profile row is auto-created.
- Logout: `dashboard.html` / `admin.html` `doLogout()` -> `signOut` -> `/login`.

## Local run
`php -S 0.0.0.0:12000 -t public public/router.php` (PHP CLI required).
Without PHP, a trivial static server with the vercel.json rewrites also works
(the pages are static + remote Supabase JS).
