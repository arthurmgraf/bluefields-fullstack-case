-- ============================================================================
-- Demo user + password setup (run in Supabase SQL Editor)
-- ============================================================================
-- Why this exists:
-- The Supabase free tier rate-limits magic-link emails (~3-4/hour). For demos
-- and the case evaluation, this script creates a demo user with a known
-- password so anyone can log in instantly without waiting for an email.
--
-- HOW TO USE:
-- 1. Open Supabase Dashboard → SQL Editor → New Query
-- 2. Paste this entire file
-- 3. Click "Run"
-- 4. Test login at /login with:
--      Email:    demo@startuptracker.app
--      Password: Demo123!
-- ============================================================================

-- Create the demo user with a bcrypt-hashed password.
-- crypt() with gen_salt('bf') = bcrypt hash. Supabase Auth understands this.
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  is_sso_user,
  is_anonymous,
  confirmation_token,
  recovery_token,
  email_change_token_new,
  email_change
)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'demo@startuptracker.app',
  crypt('Demo123!', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"Demo User"}',
  false,
  false,
  false,
  '',
  '',
  '',
  ''
)
ON CONFLICT (email) DO UPDATE
  SET encrypted_password = crypt('Demo123!', gen_salt('bf')),
      email_confirmed_at = now(),
      updated_at         = now();

-- Make sure the auth.identities row exists too (Supabase 2.x requirement)
INSERT INTO auth.identities (
  id,
  user_id,
  identity_data,
  provider,
  provider_id,
  last_sign_in_at,
  created_at,
  updated_at
)
SELECT
  gen_random_uuid(),
  u.id,
  jsonb_build_object('sub', u.id::text, 'email', u.email),
  'email',
  u.id::text,
  now(),
  now(),
  now()
FROM auth.users u
WHERE u.email = 'demo@startuptracker.app'
ON CONFLICT (provider, provider_id) DO NOTHING;

-- The handle_new_user trigger should auto-create the public.profiles row.
-- If for some reason it didn't (e.g., trigger fired before the user row was
-- fully visible), the line below ensures the profile exists.
INSERT INTO public.profiles (id, full_name)
SELECT u.id, 'Demo User'
FROM auth.users u
WHERE u.email = 'demo@startuptracker.app'
ON CONFLICT (id) DO NOTHING;

-- Quick verification:
SELECT u.email, p.full_name, u.email_confirmed_at IS NOT NULL AS confirmed
FROM auth.users u
LEFT JOIN public.profiles p ON p.id = u.id
WHERE u.email = 'demo@startuptracker.app';

-- ============================================================================
-- Reset the password later if needed:
-- UPDATE auth.users
-- SET encrypted_password = crypt('NewPassword123!', gen_salt('bf')),
--     updated_at = now()
-- WHERE email = 'demo@startuptracker.app';
-- ============================================================================

-- Reset for YOUR OWN account (so you can use password login with your real email):
-- 1. Sign up via magic link first (so the auth.users row exists)
-- 2. Then run:
-- UPDATE auth.users
-- SET encrypted_password = crypt('senha123', gen_salt('bf')),
--     email_confirmed_at = COALESCE(email_confirmed_at, now()),
--     updated_at = now()
-- WHERE email = 'YOUR_EMAIL@example.com';
