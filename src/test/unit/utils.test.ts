import { describe, it, expect } from 'vitest';
import { getFriendlyErrorMessage } from '../../utils/firebaseErrors';
import { formatDate, isOverdue } from '../../utils/dateFormatter';

describe('Firebase Error Translator Unit Tests', () => {
  it('should translate auth/wrong-password to Spanish friendly message', () => {
    const message = getFriendlyErrorMessage({ code: 'auth/wrong-password' });
    expect(message).toBe('La contraseña ingresada es incorrecta.');
  });

  it('should translate auth/user-not-found to Spanish message', () => {
    const message = getFriendlyErrorMessage({ code: 'auth/user-not-found' });
    expect(message).toBe('No existe ninguna cuenta registrada con este correo.');
  });

  it('should return fallback message for unknown error code', () => {
    const message = getFriendlyErrorMessage({ message: 'Custom unknown error' });
    expect(message).toBe('Custom unknown error');
  });
});

describe('Date Formatter Unit Tests', () => {
  it('should return "Sin fecha" when date is undefined', () => {
    expect(formatDate(undefined)).toBe('Sin fecha');
  });

  it('should correctly identify overdue pending tasks', () => {
    const pastDate = '2020-01-01';
    expect(isOverdue(pastDate, false)).toBe(true);
    expect(isOverdue(pastDate, true)).toBe(false); // Completed tasks are never overdue
  });
});
