import { describe, it, expect, beforeEach } from 'vitest';
import { useVisibility } from '@/stores/visibility';

describe('useVisibility', () => {
  beforeEach(() => {
    useVisibility.setState({ showValues: true });
  });

  it('starts with showValues = true', () => {
    expect(useVisibility.getState().showValues).toBe(true);
  });

  it('toggles showValues when handleToggleShowValues is called', () => {
    useVisibility.getState().handleToggleShowValues();
    expect(useVisibility.getState().showValues).toBe(false);

    useVisibility.getState().handleToggleShowValues();
    expect(useVisibility.getState().showValues).toBe(true);
  });
});
