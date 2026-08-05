import { createServerClient as createRuntimeServerClient } from '@/lib/supabase/server';

export async function createServerClient() {
  return createRuntimeServerClient();
}
