import type { User } from '@supabase/supabase-js';
import { defineStore } from 'pinia';
import { isSupabaseConfigured, requireSupabaseConfig, supabase } from '@/services/supabase/client';

type RegisterInput = {
  name: string;
  email: string;
  password: string;
};

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    isLoading: true,
  }),
  actions: {
    setUser(user: User | null) {
      this.user = user;
    },
    setIsLoading(isLoading: boolean) {
      this.isLoading = isLoading;
    },
    async hydrate() {
      this.isLoading = true;
      if (!isSupabaseConfigured) {
        this.user = null;
        this.isLoading = false;
        return;
      }

      const {
        data: { session },
      } = await supabase.auth.getSession();
      this.user = session?.user ?? null;
      this.isLoading = false;

      supabase.auth.onAuthStateChange((_event, session) => {
        this.user = session?.user ?? null;
      });
    },
    async login(email: string, password: string) {
      requireSupabaseConfig();
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
    },
    async register(data: RegisterInput) {
      requireSupabaseConfig();
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            name: data.name,
          },
        },
      });

      if (error) throw error;

      return { signedIn: Boolean(authData.session) };
    },
    async logout() {
      requireSupabaseConfig();
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    },
  },
});
