import 'server-only';

import { supabase } from '@/lib/supabase';

export async function getAuthenticatedUser(request: Request) {
  const authorization = request.headers.get('authorization');
  const token = authorization?.replace(/^Bearer\s+/i, '');

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
