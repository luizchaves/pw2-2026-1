import { describe, expect, it } from 'vitest';
import { loginSchema, registerSchema } from '@/schemas/auth';

describe('auth schemas', () => {
  it('accepts valid login data', () => {
    expect(loginSchema.safeParse({ email: 'ana@example.com', password: 'secret' }).success).toBe(
      true,
    );
  });

  it('rejects invalid email and mismatched passwords', () => {
    expect(loginSchema.safeParse({ email: 'invalid', password: '' }).success).toBe(false);
    expect(
      registerSchema.safeParse({
        name: 'Ana',
        email: 'ana@example.com',
        password: 'secret1',
        confirmPassword: 'secret2',
      }).success,
    ).toBe(false);
  });
});
