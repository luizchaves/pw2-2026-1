import type { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const yieldRegex =
  /^\d+(\.\d+)?%$|^IPCA \+ \d+(\.\d+)?%$|^\d+(\.\d+)?% CDI$|^\d+(\.\d+)?% Selic$/i;

export const optionalYieldValidator: ValidatorFn = (
  control: AbstractControl<string | null>,
): ValidationErrors | null => {
  const value = control.value?.trim();
  return !value || yieldRegex.test(value) ? null : { yieldFormat: true };
};

export const passwordMatchValidator: ValidatorFn = (
  control: AbstractControl,
): ValidationErrors | null => {
  const password = control.get('password')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;

  return password === confirmPassword ? null : { passwordMismatch: true };
};
