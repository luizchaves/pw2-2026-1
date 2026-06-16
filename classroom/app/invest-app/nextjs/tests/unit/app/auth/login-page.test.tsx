import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import LoginPage from '@/app/(auth)/login/page';

const replace = vi.fn();
const login = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace }),
}));

vi.mock('@/stores/auth', () => ({
  useAuth: () => ({ login }),
}));

describe('LoginPage', () => {
  beforeEach(() => {
    replace.mockReset();
    login.mockReset();
  });

  it('renderiza o formulário de login', () => {
    render(<LoginPage />);

    expect(screen.getByRole('heading', { level: 1, name: 'Entrar' })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('voce@email.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Sua senha')).toBeInTheDocument();
  });

  it('exibe erros de validação quando os campos estão vazios', async () => {
    const user = userEvent.setup();
    render(<LoginPage />);

    await user.click(screen.getByRole('button', { name: /entrar/i }));

    expect(await screen.findByText('Informe um email válido')).toBeInTheDocument();
    expect(screen.getByText('Senha é obrigatória')).toBeInTheDocument();
    expect(login).not.toHaveBeenCalled();
  });

  it('autentica e redireciona para a home quando o login é bem-sucedido', async () => {
    const user = userEvent.setup();
    login.mockResolvedValue(undefined);
    render(<LoginPage />);

    await user.type(screen.getByPlaceholderText('voce@email.com'), 'investidor@email.com');
    await user.type(screen.getByPlaceholderText('Sua senha'), 'segredo123');
    await user.click(screen.getByRole('button', { name: /entrar/i }));

    await waitFor(() => expect(login).toHaveBeenCalledWith('investidor@email.com', 'segredo123'));
    expect(replace).toHaveBeenCalledWith('/');
  });

  it('mostra a mensagem de erro quando o login falha', async () => {
    const user = userEvent.setup();
    login.mockRejectedValue(new Error('Credenciais inválidas'));
    render(<LoginPage />);

    await user.type(screen.getByPlaceholderText('voce@email.com'), 'investidor@email.com');
    await user.type(screen.getByPlaceholderText('Sua senha'), 'senhaerrada');
    await user.click(screen.getByRole('button', { name: /entrar/i }));

    expect(await screen.findByText('Credenciais inválidas')).toBeInTheDocument();
    expect(replace).not.toHaveBeenCalled();
  });
});
