import { FormControl, FormGroup } from '@angular/forms';
import { describe, expect, it } from 'vitest';
import { optionalYieldValidator, passwordMatchValidator, yieldRegex } from './validators';

describe('yield validation', () => {
  it.each(['15%', 'IPCA + 5%', '110% CDI', '100% Selic'])('accepts valid format "%s"', (value) => {
    expect(yieldRegex.test(value)).toBe(true);
    expect(optionalYieldValidator(new FormControl(value))).toBeNull();
  });

  it.each(['CDI', '15 %', 'SELIC', 'abc'])('rejects invalid format "%s"', (value) => {
    expect(optionalYieldValidator(new FormControl(value))).toEqual({ yieldFormat: true });
  });

  it('accepts empty yield because the field is optional', () => {
    expect(optionalYieldValidator(new FormControl(''))).toBeNull();
  });
});

describe('passwordMatchValidator', () => {
  it('accepts matching passwords', () => {
    const form = new FormGroup({
      password: new FormControl('segredo123'),
      confirmPassword: new FormControl('segredo123'),
    });

    expect(passwordMatchValidator(form)).toBeNull();
  });

  it('rejects mismatched passwords', () => {
    const form = new FormGroup({
      password: new FormControl('segredo123'),
      confirmPassword: new FormControl('diferente123'),
    });

    expect(passwordMatchValidator(form)).toEqual({ passwordMismatch: true });
  });
});
