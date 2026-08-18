-- ─────────────────────────────────────────────────────────────────────────────
-- Migration 005: Admin fix for new Supabase project pvpoedxkoyatenqayzyt
--
-- This project uses a different schema from the original (uatnxwvkpuvxvgngxxez):
--   - Table: public.users  (not public.profiles)
--   - Table: public.orders (not deposit_requests / transfer_requests etc.)
--
-- Root cause of "ambiguous role column":
--   admin_get_all_users() joined auth.users (has "role") with public.users
--   (also has "role") without qualifying which table, so Postgres threw:
--     ERROR: column reference "role" is ambiguous
--
-- Fix: query ONLY public.users with explicit u.role — no join with auth.users.
-- ─────────────────────────────────────────────────────────────────────────────

-- ── 1. Enable RLS ────────────────────────────────────────────────────────────
ALTER TABLE public.users  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- ── 2. Helper: get caller role without RLS self-loop ─────────────────────────
CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS text LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT u.role FROM public.users u WHERE u.id = auth.uid()::text;
$$;

-- ── 3. Admin guard ───────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.assert_admin()
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF (SELECT u.role FROM public.users u WHERE u.id = auth.uid()::text) <> 'admin' THEN
    RAISE EXCEPTION 'Access denied: admin only';
  END IF;
END;
$$;

-- ── 4. RLS policies ──────────────────────────────────────────────────────────
DROP POLICY IF EXISTS users_select_own ON public.users;
DROP POLICY IF EXISTS users_update_own ON public.users;
DROP POLICY IF EXISTS users_admin_all  ON public.users;
CREATE POLICY users_select_own ON public.users FOR SELECT TO authenticated USING (id = auth.uid()::text);
CREATE POLICY users_update_own ON public.users FOR UPDATE TO authenticated USING (id = auth.uid()::text) WITH CHECK (id = auth.uid()::text);
CREATE POLICY users_admin_all  ON public.users FOR ALL    TO authenticated USING (public.get_my_role() = 'admin');

DROP POLICY IF EXISTS orders_select_own ON public.orders;
DROP POLICY IF EXISTS orders_insert_own ON public.orders;
DROP POLICY IF EXISTS orders_admin_all  ON public.orders;
CREATE POLICY orders_select_own ON public.orders FOR SELECT TO authenticated USING (user_id = auth.uid()::text);
CREATE POLICY orders_insert_own ON public.orders FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid()::text);
CREATE POLICY orders_admin_all  ON public.orders FOR ALL    TO authenticated USING (public.get_my_role() = 'admin');

-- ── 5. admin_get_all_users — THE FIX ─────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.admin_get_all_users()
RETURNS TABLE (
  id                   text,
  email                text,
  first_name           text,
  last_name            text,
  role                 text,
  status               text,
  balance              real,
  reward_points        int,
  referral_count       int,
  phone                text,
  member_code          text,
  must_change_password boolean,
  created_at           timestamptz,
  updated_at           timestamptz
)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  PERFORM public.assert_admin();
  RETURN QUERY
    SELECT
      u.id,
      u.email,
      u.first_name,
      u.last_name,
      u.role,           -- explicit u.role — zero ambiguity
      u.status,
      u.balance,
      u.reward_points,
      u.referral_count,
      u.phone,
      u.member_code,
      u.must_change_password,
      u.created_at,
      u.updated_at
    FROM public.users u
    ORDER BY u.created_at DESC;
END;
$$;

-- ── 6. admin_get_stats ───────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.admin_get_stats()
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_result jsonb;
BEGIN
  PERFORM public.assert_admin();
  SELECT jsonb_build_object(
    'total_users',          COUNT(*),
    'active_users',         COUNT(*) FILTER (WHERE u.status = 'active'),
    'total_balance',        COALESCE(SUM(u.balance), 0),
    'total_pending_orders', (SELECT COUNT(*) FROM public.orders o WHERE o.status = 'pending')
  ) INTO v_result FROM public.users u;
  RETURN v_result;
END;
$$;

-- ── 7. admin_set_user_status ─────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.admin_set_user_status(target_id text, new_status text)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  PERFORM public.assert_admin();
  UPDATE public.users u SET u.status = new_status, u.updated_at = now() WHERE u.id = target_id;
END;
$$;

-- ── 8. admin_set_user_role ───────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.admin_set_user_role(target_id text, new_role text)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  PERFORM public.assert_admin();
  UPDATE public.users u SET u.role = new_role, u.updated_at = now() WHERE u.id = target_id;
END;
$$;

-- ── 9. admin_credit_user ─────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.admin_credit_user(target_id text, amount real, reason text DEFAULT NULL)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  PERFORM public.assert_admin();
  IF amount <= 0 THEN RAISE EXCEPTION 'Amount must be positive'; END IF;
  UPDATE public.users u SET u.balance = u.balance + amount, u.updated_at = now() WHERE u.id = target_id;
  INSERT INTO public.orders (id, user_id, user_email, user_name, type, description, amount, status)
  SELECT gen_random_uuid()::text, u.id, u.email,
         u.first_name || ' ' || u.last_name,
         'credit', COALESCE(reason, 'Admin credit'), amount, 'completed'
  FROM public.users u WHERE u.id = target_id;
END;
$$;

-- ── 10. admin_review_order ───────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.admin_review_order(order_id text, new_status text, v_note text DEFAULT NULL)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_user_id text; v_amount real; v_type text;
BEGIN
  PERFORM public.assert_admin();
  SELECT o.user_id, o.amount, o.type INTO v_user_id, v_amount, v_type
  FROM public.orders o WHERE o.id = order_id AND o.status = 'pending';
  IF NOT FOUND THEN RAISE EXCEPTION 'Order not found or already reviewed'; END IF;
  UPDATE public.orders o
  SET o.status = new_status,
      o.description = CASE WHEN v_note IS NOT NULL THEN o.description || ' | Note: ' || v_note ELSE o.description END,
      o.updated_at = now()
  WHERE o.id = order_id;
  IF new_status = 'approved' AND v_type = 'deposit' THEN
    UPDATE public.users u SET u.balance = u.balance + v_amount, u.updated_at = now() WHERE u.id = v_user_id;
  END IF;
END;
$$;

-- ── 11. GRANT EXECUTE ────────────────────────────────────────────────────────
GRANT EXECUTE ON FUNCTION public.admin_get_all_users()                TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_get_stats()                    TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_set_user_status(text, text)    TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_set_user_role(text, text)      TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_credit_user(text, real, text)  TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_review_order(text, text, text) TO authenticated;

-- ── 12. Set admin role ───────────────────────────────────────────────────────
UPDATE public.users SET role = 'admin', updated_at = now()
WHERE email IN ('admin@mercurialvest.online', 'admin@gmail.com');
