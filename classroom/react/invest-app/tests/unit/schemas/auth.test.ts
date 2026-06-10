import { describe, it, expect } from 'vitest';
import { loginSchema, registerSchema } from '@/schemas/auth';

describe('loginSchema', () => {
  it('accepts valid credentials', () => {
    expect(() =>
      loginSchema.parse({ email: 'user@example.com', password: '123456' }),
    ).not.toThrow();
  });

  it('rejects invalid email', () => {
    const result = loginSchema.safeParse({ email: 'not-an-email', password: '123' });
    expect(result.success).toBe(false);
  });

  it('rejects empty password', () => {
    const result = loginSchema.safeParse({ email: 'user@example.com', password: '' });
    expect(result.success).toBe(false);
    expect(JSON.stringify(result.error)).toMatch(/Senha é obrigatória/);
  });

  it('rejects missing fields', () => {
    expect(loginSchema.safeParse({}).success).toBe(false);
  });
});

describe('registerSchema', () => {
  const valid = {
    name: 'João Silva',
    email: 'joao@example.com',
    password: 'senha123',
    confirmPassword: 'senha123',
  };

  it('accepts valid registration data', () => {
    expect(() => registerSchema.parse(valid)).not.toThrow();
  });

  it('rejects name shorter than 2 characters', () => {
    const result = registerSchema.safeParse({ ...valid, name: 'J' });
    expect(result.success).toBe(false);
    expect(JSON.stringify(result.error)).toMatch(/2 caracteres/);
  });

  it('rejects password shorter than 6 characters', () => {
    const result = registerSchema.safeParse({
      ...valid,
      password: '123',
      confirmPassword: '123',
    });
    expect(result.success).toBe(false);
    expect(JSON.stringify(result.error)).toMatch(/6 caracteres/);
  });

  it('rejects mismatched passwords', () => {
    const result = registerSchema.safeParse({
      ...valid,
      confirmPassword: 'outrasenha',
    });
    expect(result.success).toBe(false);
    expect(JSON.stringify(result.error)).toMatch(/As senhas não conferem/);
  });

  it('rejects invalid email', () => {
    const result = registerSchema.safeParse({ ...valid, email: 'invalido' });
    expect(result.success).toBe(false);
  });
});
