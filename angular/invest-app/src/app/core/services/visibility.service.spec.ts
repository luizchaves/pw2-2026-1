import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { VisibilityService } from './visibility.service';

describe('VisibilityService', () => {
  it('starts with visible values', () => {
    const service = TestBed.inject(VisibilityService);

    expect(service.showValues()).toBe(true);
  });

  it('toggles visible values', () => {
    const service = TestBed.inject(VisibilityService);

    service.toggleValues();
    expect(service.showValues()).toBe(false);

    service.toggleValues();
    expect(service.showValues()).toBe(true);
  });
});
