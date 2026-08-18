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

## Supabase schema (NOT in this repo)
The live schema (tables, RLS policies, RPC functions) lives in the Supabase
project `uatnxwvkpuvxvgngxxez` — it is NOT the legacy `SQL/database.sql` (that
is a MySQL phpMyAdmin dump from the old PHP app and is dead code). Migrations
that touch the live Supabase schema live in `SQL/supabase/` and must be applied
manually in the Supabase Dashboard SQL editor (the repo has no service_role key
or DB password, so they cannot be auto-applied from the deploy).

## Admin user management — known bug + fix (2026-08)
Symptom: created users did not show on the admin dashboard and could not be
managed. Root cause (verified against live project):
- The `admin_get_all_users` RPC threw `column reference "role" is ambiguous`
  (a PL/pgSQL var/param named `role` clashed with `profiles.role`), so the user
  list RPC errored for everyone.
- The client fallback read `profiles` directly, but RLS on `profiles` is
  `auth.uid() = id` (own row only) with NO admin bypass — so a client read can
  never return other users (returns the admin's own row or `[]`).
- `toggleUserStatus()` wrote to `profiles` directly from the client, which RLS
  silently blocked for any non-self user (deactivate/activate did nothing).
Fix (in repo):
- `SQL/supabase/001_fix_admin_user_management.sql` redefines
  `admin_get_all_users` as SECURITY DEFINER (bypasses RLS) with table-qualified
  columns (`p.role`) and adds `admin_set_user_status(target_id, new_status)`
  (SECURITY DEFINER, admin-guarded). **Must be applied in the Supabase SQL
  editor once; idempotent.**
- `admin.html` (+ `public/admin.html`) `loadUsers()` surfaces a clear, actionable
  banner (instead of a silent empty table) when the RPC is still broken or RLS
  limits reads to self; `toggleUserStatus()` now calls the
  `admin_set_user_status` RPC instead of the RLS-blocked direct update.
Other admin management RPCs already work via SECURITY DEFINER:
`admin_update_kyc`, `admin_credit_user`, `admin_hold_funds`, `admin_release_hold`,
`admin_reply_ticket`, `admin_get_stats`. Cross-user-readable tables (no RLS
own-row restriction): `support_tickets`, `transactions`, `deposit_requests`,
`transfer_requests`, `loan_applications`.

## Admin review RPCs — `note` ambiguity bug + fix (2026-08)
The three admin review RPCs (`admin_review_deposit`, `admin_review_transfer`,
`admin_review_loan`) had the SAME class of PL/pgSQL name-clash bug as the
`role` issue: each took a `note text` parameter and did `set ..., note = note`
in the UPDATE. Postgres raised `column reference "note" is ambiguous`
(code 42702) because it could not decide between the `note` parameter and the
`*.note` table column on the RHS — so approving/rejecting any deposit, transfer,
or loan silently failed for everyone.
Fix (in repo):
- `SQL/supabase/003_fix_review_rpc_note_ambiguity_and_digit_free_account.sql`
  redefines all three as SECURITY DEFINER with a local `v_note text := note`
  variable (breaks the param/column collision) and uses `set ..., note = v_note`
  in the UPDATE. Same signatures the client expects, idempotent. **Must be
  applied in the Supabase SQL editor once.**
- Verified end-to-end against a local self-hosted Supabase stack: deposit
  approve credits balance + logs a `deposit` transaction + saves note; loan
  approve credits balance; transfer reject saves note without debiting.

## Digit-free account number (2026-08)
The signup trigger `handle_new_user()` used to mint `MV` + 8 random digits
(e.g. `MV71484459`). The UI already surfaces the shared `WALLET_ADDRESS`
constant (`bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh`) on the ATM card, the
balance card, the "Your Wallet Address" deposit box, and the admin user
"Wallet" column — no numeric account number is shown anywhere in the HTML.
The trigger now generates a **letters-only (digits-free)** `account_number`
(`MV` + 8 random `a-z`), so no digits-only account number is generated either.
Old users keep their legacy numeric value; only new signups get the digit-free
form. Also redefined in `003_...sql` above.

## Full schema reference
`SQL/supabase/002_full_app_schema.sql` is the complete, current schema
(tables, RLS, signup trigger, all 11 RPCs) as a single idempotent file. It is a
reference/integration-testing artifact — the live project is NOT migrated from
it wholesale. Incremental migrations (`001`, `003`) are what get applied to the
live Supabase project via the SQL editor.
