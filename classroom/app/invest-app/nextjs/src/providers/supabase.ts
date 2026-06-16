import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase environment variables are not configured');
}

const validatedSupabaseUrl = supabaseUrl;
const validatedSupabaseKey = supabaseKey;

export function createSupabaseServerClient(accessToken: string) {
  return createClient(validatedSupabaseUrl, validatedSupabaseKey, {
    auth: {
      autoRefreshToken: false,
      detectSessionInUrl: false,
      persistSession: false,
    },
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  });
}

export const supabase = createClient(validatedSupabaseUrl, validatedSupabaseKey);
