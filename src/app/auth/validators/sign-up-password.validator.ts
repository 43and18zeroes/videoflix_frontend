import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const passwordComplexityValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const password = control.value;

  if (!password) return null;

  const errors: any = {};

  if (password.length < 8) {
    errors.minLength = true;
  }

  if (!/[A-Z]/.test(password)) {
    errors.uppercase = true;
  }

  if (!/[a-z]/.test(password)) {
    errors.lowercase = true;
  }

  if (!/[^A-Za-z0-9]/.test(password)) {
    errors.specialChar = true;
  }

  return Object.keys(errors).length > 0 ? errors : null;
};

export const passwordMatchValidator: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
  const password = group.get('password')?.value;
  const confirmPassword = group.get('confirmPassword')?.value;

  return password === confirmPassword ? null : { passwordMismatch: true };
};
