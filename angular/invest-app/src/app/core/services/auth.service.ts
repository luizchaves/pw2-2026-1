import { computed, Injectable, inject, signal } from '@angular/core';
import type { Session, User } from '@supabase/supabase-js';
import { SupabaseService } from './supabase.service';

type RegisterInput = {
  name: string;
  email: string;
  password: string;
};

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly supabase = inject(SupabaseService).client;
  private readonly readyPromise: Promise<void>;

  readonly session = signal<Session | null>(null);
  readonly isLoading = signal(true);
  readonly user = computed<User | null>(() => this.session()?.user ?? null);
  readonly displayName = computed(() => {
    const user = this.user();
    const metadata = user?.user_metadata as { name?: unknown } | undefined;
    const name = metadata?.name;
    return typeof name === 'string' && name.trim() ? name : user?.email;
  });

  constructor() {
    this.readyPromise = this.initialize();
  }

  async ready() {
    await this.readyPromise;
  }

  async login(email: string, password: string) {
    const { error } = await this.supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  }

  async register(data: RegisterInput) {
    const { data: authData, error } = await this.supabase.auth.signUp({
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
  }

  async logout() {
    const { error } = await this.supabase.auth.signOut();
    if (error) throw error;
  }

  private async initialize() {
    const {
      data: { session },
    } = await this.supabase.auth.getSession();

    this.session.set(session);
    this.isLoading.set(false);

    this.supabase.auth.onAuthStateChange((_event, nextSession) => {
      this.session.set(nextSession);
      this.isLoading.set(false);
    });
  }
}
