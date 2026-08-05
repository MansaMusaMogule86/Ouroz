import { createBrowserClient } from '@supabase/ssr';

const fallbackUrl = 'https://placeholder-project.supabase.co';
const fallbackAnon = 'placeholder-anon-key';

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

  return createBrowserClient(
    url || fallbackUrl,
    anonKey || fallbackAnon
  );
}

export const supabaseClient = createClient();
