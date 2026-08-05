import { createClient as createRuntimeClient, supabaseClient } from '@/lib/supabase/client';

export function createClient() {
  return createRuntimeClient();
}

/**
 * Singleton browser client — used by client components only.
 */
export const supabase = supabaseClient;
