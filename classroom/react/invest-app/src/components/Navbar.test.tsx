import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Navbar from './Navbar';

const mockReplace = vi.fn();
const useVisibilityMock = vi.fn();
const useAuthMock = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: mockReplace }),
}));

vi.mock('next/link', () => ({
  default: ({ href, children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

vi.mock('@/contexts/visibility', () => ({
  useVisibility: () => useVisibilityMock(),
}));

vi.mock('@/contexts/auth', () => ({
  useAuth: () => useAuthMock(),
}));

const mockLogout = vi.fn();
const mockToggle = vi.fn();

beforeEach(() => {
  mockReplace.mockReset();
  mockLogout.mockReset();
  mockToggle.mockReset();
  useVisibilityMock.mockReturnValue({ showValues: true, handleToggleShowValues: mockToggle });
  useAuthMock.mockReturnValue({ user: null, logout: mockLogout });
});

describe('Navbar — unauthenticated', () => {
  it('renders login and register links', () => {
    render(<Navbar />);

    expect(screen.getByRole('link', { name: /entrar/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /cadastrar/i })).toBeInTheDocument();
  });

  it('does not render dashboard or investments links', () => {
    render(<Navbar />);

    expect(screen.queryByRole('link', { name: /dashboard/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /investimentos/i })).not.toBeInTheDocument();
  });

  it('does not render the logout button', () => {
    render(<Navbar />);

    expect(screen.queryByRole('button', { name: /sair/i })).not.toBeInTheDocument();
  });
});

describe('Navbar — authenticated', () => {
  const mockUser = {
    email: 'user@example.com',
    user_metadata: { name: 'João Silva' },
  };

  beforeEach(() => {
    useAuthMock.mockReturnValue({ user: mockUser, logout: mockLogout });
  });

  it('renders dashboard and investments links', () => {
    render(<Navbar />);

    expect(screen.getByRole('link', { name: /dashboard/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /investimentos/i })).toBeInTheDocument();
  });

  it('renders the user display name', () => {
    render(<Navbar />);

    expect(screen.getByText('João Silva')).toBeInTheDocument();
  });

  it('falls back to email when user name is not set', () => {
    useAuthMock.mockReturnValue({
      user: { email: 'user@example.com', user_metadata: {} },
      logout: mockLogout,
    });

    render(<Navbar />);

    expect(screen.getByText('user@example.com')).toBeInTheDocument();
  });

  it('calls logout and redirects on logout button click', async () => {
    const user = userEvent.setup();
    mockLogout.mockResolvedValue(undefined);
    render(<Navbar />);

    await user.click(screen.getByRole('button', { name: /sair/i }));

    expect(mockLogout).toHaveBeenCalledOnce();
    expect(mockReplace).toHaveBeenCalledWith('/login');
  });

  it('toggles visibility when the eye button is clicked', async () => {
    const user = userEvent.setup();
    render(<Navbar />);

    await user.click(screen.getByRole('button', { name: /ocultar valores/i }));

    expect(mockToggle).toHaveBeenCalledOnce();
  });

  it('shows Eye icon when showValues is false', () => {
    useVisibilityMock.mockReturnValue({ showValues: false, handleToggleShowValues: mockToggle });
    render(<Navbar />);

    expect(screen.getByRole('button', { name: /exibir valores/i })).toBeInTheDocument();
  });
});
