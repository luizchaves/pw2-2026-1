import { describe, it, expect } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { VisibilityProvider, useVisibility } from './visibility';

function TestConsumer() {
  const { showValues, handleToggleShowValues } = useVisibility();
  return (
    <>
      <span data-testid="value">{showValues ? 'visible' : 'hidden'}</span>
      <button onClick={handleToggleShowValues}>toggle</button>
    </>
  );
}

describe('VisibilityProvider', () => {
  it('starts with showValues = true', () => {
    render(
      <VisibilityProvider>
        <TestConsumer />
      </VisibilityProvider>,
    );

    expect(screen.getByTestId('value').textContent).toBe('visible');
  });

  it('toggles showValues when handleToggleShowValues is called', async () => {
    const user = userEvent.setup();
    render(
      <VisibilityProvider>
        <TestConsumer />
      </VisibilityProvider>,
    );

    await user.click(screen.getByRole('button', { name: 'toggle' }));
    expect(screen.getByTestId('value').textContent).toBe('hidden');

    await user.click(screen.getByRole('button', { name: 'toggle' }));
    expect(screen.getByTestId('value').textContent).toBe('visible');
  });
});

describe('useVisibility', () => {
  it('throws when used outside of VisibilityProvider', () => {
    function BadConsumer() {
      useVisibility();
      return null;
    }

    expect(() => render(<BadConsumer />)).toThrow(
      'useVisibility must be used within VisibilityProvider',
    );
  });
});
