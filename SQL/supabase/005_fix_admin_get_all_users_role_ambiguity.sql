-- ─────────────────────────────────────────────────────────────────────────────
-- Fix ambiguous "role" column in admin_get_all_users + admin status toggle.
--
-- This is the authoritative, standalone version of the admin user-management
-- RPCs. It redefines:
--   * admin_get_all_users()  — SECURITY DEFINER, table-qualified `p.role` so
--     there is no PL/pgSQL name clash with a `role` parameter/var (the original
--     "column reference \"role\" is ambiguous" error).
--   * admin_set_user_status(target_id uuid, new_status text) — SECURITY DEFINER
--     so admins can activate/deactivate any user (RLS blocks cross-user writes
--     from the client).
--
-- It also ensures the admin accounts have role='admin'.
--
-- Idempotent (CREATE OR REPLACE). Apply in the Supabase SQL editor or via psql.
-- ─────────────────────────────────────────────────────────────────────────────

-- Fix ambiguous "role" column in admin_get_all_users
create or replace function public.admin_get_all_users()
returns setof public.profiles
language plpgsql
security definer
set search_path = public
as $$
begin
  if not exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  ) then
    raise exception 'Access denied: admins only' using errcode = '42501';
  end if;

  return query
    select p.*
    from public.profiles p
    order by p.created_at desc;
end;
$$;


-- Fix admin status toggle (was blocked by RLS)
create or replace function public.admin_set_user_status(
  target_id uuid,
  new_status text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  ) then
    raise exception 'Access denied: admins only' using errcode = '42501';
  end if;

  if target_id = auth.uid() then
    raise exception 'Cannot change your own status' using errcode = '44000';
  end if;

  update public.profiles p
    set status = new_status, updated_at = now()
    where p.id = target_id;
end;
$$;


-- Make sure admin@mercurialvest.online has admin role
update public.profiles
set role = 'admin'
where email in ('admin@mercurialvest.online', 'admin@gmail.com');


grant execute on function public.admin_get_all_users() to anon, authenticated;
grant execute on function public.admin_set_user_status(uuid, text) to anon, authenticated;

notify pgrst, 'reload schema';
