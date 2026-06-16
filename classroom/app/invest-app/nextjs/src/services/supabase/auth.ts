import 'server-only';

import { supabase } from '@/providers/supabase';

export function getBearerToken(request: Request) {
  return request.headers.get('authorization')?.replace(/^Bearer\s+/i, '') ?? null;
}

export async function getAuthenticatedUser(request: Request) {
  const token = getBearerToken(request);

  if (!token) {
    return null;
  }

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token);

  if (error) {
    return null;
  }

  return user;
}
