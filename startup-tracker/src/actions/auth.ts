'use server';

import { redirect } from 'next/navigation';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { EmailSchema } from '@/lib/schemas';

const PasswordLoginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha precisa de no mínimo 6 caracteres'),
});

/**
 * Magic-link sign-in. Sends an OTP email. Subject to Supabase free-tier
 * rate limits (3-4 emails/hour by default).
 */
export async function signIn(formData: FormData): Promise<void> {
  const parsed = EmailSchema.safeParse({ email: formData.get('email') });

  if (!parsed.success) {
    redirect('/login?error=invalid_email');
  }

  const supabase = await createClient();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

  const { error } = await supabase.auth.signInWithOtp({
    email: parsed.data.email,
    options: { emailRedirectTo: `${siteUrl}/auth/callback` },
  });

  if (error) {
    console.error('signIn (magic link) failed:', error.message, { email: parsed.data.email });
    redirect('/login?error=send_failed');
  }

  redirect('/login?sent=1');
}

/**
 * Password sign-in fallback — bypasses email rate limits during demos.
 * The user must have been created with a password in Supabase Dashboard
 * (Authentication → Users → Add user → check "Auto Confirm User") OR
 * via the SQL helper documented in README §"Demo login setup".
 */
export async function signInWithPassword(formData: FormData): Promise<void> {
  const parsed = PasswordLoginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!parsed.success) {
    redirect('/login?error=invalid_credentials');
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    console.error('signInWithPassword failed:', error.message, { email: parsed.data.email });
    redirect('/login?error=invalid_credentials');
  }

  redirect('/');
}

export async function signOut(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/login');
}
