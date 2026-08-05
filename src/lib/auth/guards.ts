import 'server-only';

import { createServerClient } from '@/lib/supabase/server';

export type AppRole = 'customer' | 'supplier' | 'business' | 'admin';

export async function requireUser() {
  const supabase = await createServerClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    throw new Error('Unauthorized');
  }

  return data.user;
}

export async function requireRole(role: AppRole) {
  const user = await requireUser();
  const supabase = await createServerClient();

  const { data: profile, error } = await supabase
    .from('user_profiles')
    .select('role')
    .eq('user_id', user.id)
    .single();

  if (error || !profile || profile.role !== role) {
    throw new Error('Forbidden');
  }

  return user;
}

export async function requireAdmin() {
  return requireRole('admin');
}

export async function requireSupplier() {
  return requireRole('supplier');
}

export async function requireResourceOwner(resourceUserId: string) {
  const user = await requireUser();
  if (user.id !== resourceUserId) {
    throw new Error('Forbidden');
  }
  return user;
}
