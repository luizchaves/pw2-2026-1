import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it } from 'vitest';
import { useVisibilityStore } from '@/stores/visibility';

describe('visibility store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('toggles monetary value visibility', () => {
    const store = useVisibilityStore();

    expect(store.showValues).toBe(true);
    store.toggleShowValues();
    expect(store.showValues).toBe(false);
  });
});
