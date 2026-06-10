'use client';

import { useEffect } from 'react';
import { supabase } from '@/providers/supabase';
import { useAuth } from '@/stores/auth';

export function AuthSessionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const setUser = useAuth((state) => state.setUser);
  const setIsLoading = useAuth((state) => state.setIsLoading);

  useEffect(() => {
    let isMounted = true;
    const loadingFallback = window.setTimeout(() => {
      if (!isMounted) return;
      setIsLoading(false);
    }, 3000);

    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (!isMounted) return;
        setUser(data.session?.user ?? null);
      })
      .catch(() => {
        if (!isMounted) return;
        setUser(null);
      })
      .finally(() => {
        if (!isMounted) return;
        window.clearTimeout(loadingFallback);
        setIsLoading(false);
      });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => {
      isMounted = false;
      window.clearTimeout(loadingFallback);
      subscription.unsubscribe();
    };
  }, [setIsLoading, setUser]);

  return children;
}
