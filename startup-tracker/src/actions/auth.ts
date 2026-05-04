'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { EmailSchema } from '@/lib/schemas';

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
    console.error('signIn failed:', error.message, { email: parsed.data.email });
    redirect('/login?error=send_failed');
  }

  redirect('/login?sent=1');
}

export async function signOut(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/login');
}
