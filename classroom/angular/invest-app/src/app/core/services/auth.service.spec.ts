import { TestBed } from '@angular/core/testing';
import { describe, expect, it, vi } from 'vitest';
import { AuthService } from './auth.service';
import { SupabaseService } from './supabase.service';

const createAuthClient = () => ({
  auth: {
    getSession: vi.fn().mockResolvedValue({ data: { session: null } }),
    onAuthStateChange: vi.fn(),
    signInWithPassword: vi.fn().mockResolvedValue({ error: null }),
    signUp: vi
      .fn()
      .mockResolvedValue({ data: { session: { user: { id: 'user-1' } } }, error: null }),
    signOut: vi.fn().mockResolvedValue({ error: null }),
  },
});

describe('AuthService', () => {
  it('logs in with email and password', async () => {
    const client = createAuthClient();
    TestBed.configureTestingModule({
      providers: [AuthService, { provide: SupabaseService, useValue: { client } }],
    });

    const service = TestBed.inject(AuthService);
    await service.login('user@example.com', 'segredo123');

    expect(client.auth.signInWithPassword).toHaveBeenCalledWith({
      email: 'user@example.com',
      password: 'segredo123',
    });
  });

  it('registers with name metadata', async () => {
    const client = createAuthClient();
    TestBed.configureTestingModule({
      providers: [AuthService, { provide: SupabaseService, useValue: { client } }],
    });

    const service = TestBed.inject(AuthService);
    const result = await service.register({
      name: 'Maria Investidora',
      email: 'maria@example.com',
      password: 'segredo123',
    });

    expect(result).toEqual({ signedIn: true });
    expect(client.auth.signUp).toHaveBeenCalledWith({
      email: 'maria@example.com',
      password: 'segredo123',
      options: { data: { name: 'Maria Investidora' } },
    });
  });

  it('throws Supabase errors', async () => {
    const client = createAuthClient();
    client.auth.signInWithPassword.mockResolvedValueOnce({ error: new Error('Invalid login') });
    TestBed.configureTestingModule({
      providers: [AuthService, { provide: SupabaseService, useValue: { client } }],
    });

    const service = TestBed.inject(AuthService);

    await expect(service.login('user@example.com', 'wrong')).rejects.toThrow('Invalid login');
  });
});
