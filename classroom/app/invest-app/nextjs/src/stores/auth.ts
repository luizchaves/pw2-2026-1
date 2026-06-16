'use client';

import type { User } from '@supabase/supabase-js';
import { create } from 'zustand';
import { supabase } from '@/providers/supabase';

type RegisterInput = {
  name: string;
  email: string;
  password: string;
};

type AuthStore = {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setIsLoading: (isLoading: boolean) => void;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterInput) => Promise<{ signedIn: boolean }>;
  logout: () => Promise<void>;
};

export const useAuth = create<AuthStore>((set) => ({
  user: null,
  isLoading: true,
  setUser: (user) => set({ user }),
  setIsLoading: (isLoading) => set({ isLoading }),
  login: async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
  },
  register: async ({ name, email, password }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    });

    if (error) throw error;

    return { signedIn: Boolean(data.session) };
  },
  logout: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },
}));
