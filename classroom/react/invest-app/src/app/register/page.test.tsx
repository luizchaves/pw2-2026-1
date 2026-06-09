import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RegisterPage from './page';

const replace = vi.fn();
const register = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace }),
}));

vi.mock('@/contexts/auth', () => ({
  useAuth: () => ({ register }),
}));

const fillForm = async (
  user: ReturnType<typeof userEvent.setup>,
  overrides: Partial<Record<'password' | 'confirmPassword', string>> = {},
) => {
  await user.type(screen.getByPlaceholderText('Seu nome'), 'Maria Investidora');
  await user.type(
    screen.getByPlaceholderText('voce@email.com'),
    'maria@email.com',
  );
  await user.type(
    screen.getByPlaceholderText('Minimo de 6 caracteres'),
    overrides.password ?? 'segredo123',
  );
  await user.type(
    screen.getByPlaceholderText('Repita sua senha'),
    overrides.confirmPassword ?? 'segredo123',
  );
};

describe('RegisterPage', () => {
  beforeEach(() => {
    replace.mockReset();
    register.mockReset();
  });

  it('renderiza todos os campos do cadastro', () => {
    render(<RegisterPage />);

    expect(
      screen.getByRole('heading', { level: 1, name: 'Criar conta' }),
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Seu nome')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('voce@email.com')).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText('Minimo de 6 caracteres'),
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Repita sua senha')).toBeInTheDocument();
  });

  it('valida quando as senhas não conferem', async () => {
    const user = userEvent.setup();
    render(<RegisterPage />);

    await fillForm(user, { confirmPassword: 'diferente123' });
    await user.click(screen.getByRole('button', { name: /criar conta/i }));

    expect(
      await screen.findByText('As senhas não conferem'),
    ).toBeInTheDocument();
    expect(register).not.toHaveBeenCalled();
  });

  it('cria a conta e redireciona quando já vem autenticado', async () => {
    const user = userEvent.setup();
    register.mockResolvedValue({ signedIn: true });
    render(<RegisterPage />);

    await fillForm(user);
    await user.click(screen.getByRole('button', { name: /criar conta/i }));

    await waitFor(() =>
      expect(register).toHaveBeenCalledWith({
        name: 'Maria Investidora',
        email: 'maria@email.com',
        password: 'segredo123',
      }),
    );
    expect(replace).toHaveBeenCalledWith('/');
  });

  it('mostra aviso de confirmação de email quando não há sessão', async () => {
    const user = userEvent.setup();
    register.mockResolvedValue({ signedIn: false });
    render(<RegisterPage />);

    await fillForm(user);
    await user.click(screen.getByRole('button', { name: /criar conta/i }));

    expect(
      await screen.findByText(
        'Cadastro criado. Verifique seu email para confirmar a conta.',
      ),
    ).toBeInTheDocument();
    expect(replace).not.toHaveBeenCalled();
  });

  it('mostra a mensagem de erro quando o cadastro falha', async () => {
    const user = userEvent.setup();
    register.mockRejectedValue(new Error('Email já cadastrado'));
    render(<RegisterPage />);

    await fillForm(user);
    await user.click(screen.getByRole('button', { name: /criar conta/i }));

    expect(await screen.findByText('Email já cadastrado')).toBeInTheDocument();
    expect(replace).not.toHaveBeenCalled();
  });
});
