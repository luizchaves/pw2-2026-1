import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Modal from './Modal';

describe('Modal', () => {
  const onClose = vi.fn();

  it('renders the title and children', () => {
    render(
      <Modal title="Meu Modal" onClose={onClose}>
        <p>Conteúdo do modal</p>
      </Modal>,
    );

    expect(screen.getByRole('heading', { name: 'Meu Modal' })).toBeInTheDocument();
    expect(screen.getByText('Conteúdo do modal')).toBeInTheDocument();
  });

  it('calls onClose when the close button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <Modal title="Fechar" onClose={onClose}>
        <span />
      </Modal>,
    );

    await user.click(screen.getByRole('button'));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('calls onClose when the backdrop is clicked', async () => {
    const user = userEvent.setup();
    onClose.mockReset();
    render(
      <Modal title="Backdrop" onClose={onClose}>
        <span />
      </Modal>,
    );

    // Click the outermost overlay (first div)
    const backdrop = screen
      .getByRole('heading', { name: 'Backdrop' })
      .closest('[class*="fixed"]');
    await user.click(backdrop!);
    expect(onClose).toHaveBeenCalled();
  });

  it('does not call onClose when the inner panel is clicked', async () => {
    const user = userEvent.setup();
    onClose.mockReset();
    render(
      <Modal title="Panel" onClose={onClose}>
        <p>inner</p>
      </Modal>,
    );

    await user.click(screen.getByText('inner'));
    expect(onClose).not.toHaveBeenCalled();
  });
});
