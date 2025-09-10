-- Create a public.users table linked to auth.users
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  is_admin BOOLEAN DEFAULT FALSE
);

-- Insert your admin user (replace 'ADMIN-USER-ID' with the actual UUID from auth.users for stevekobbi20@gmail.com)
INSERT INTO public.users (id, email, is_admin)
SELECT id, email, TRUE FROM auth.users WHERE email = 'stevekobbi20@gmail.com'
ON CONFLICT (id) DO UPDATE SET is_admin = TRUE;

-- Add scarylatif@gmail.com as an admin
INSERT INTO public.users (id, email, is_admin)
SELECT id, email, TRUE FROM auth.users WHERE email = 'scarylatif@gmail.com'
ON CONFLICT (id) DO UPDATE SET is_admin = TRUE;

-- Set admin status in user_profiles for both admin users using their UUIDs from auth.users
UPDATE public.user_profiles SET is_admin = true WHERE id = (SELECT id FROM auth.users WHERE email = 'stevekobbi20@gmail.com');
UPDATE public.user_profiles SET is_admin = true WHERE id = (SELECT id FROM auth.users WHERE email = 'scarylatif@gmail.com');
