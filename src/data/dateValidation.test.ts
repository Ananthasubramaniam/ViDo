import { describe, expect, it } from 'vitest';
import { getTodayDateString, isPastDate, isValidDateString } from './dateValidation';

describe('dateValidation', () => {
  describe('getTodayDateString', () => {
    it('formats a date as a local YYYY-MM-DD string', () => {
      expect(getTodayDateString(new Date(2026, 10, 3, 23, 30))).toBe('2026-11-03');
      expect(getTodayDateString(new Date(2026, 0, 1, 0, 30))).toBe('2026-01-01');
    });
  });

  describe('isValidDateString', () => {
    it('accepts real calendar dates only', () => {
      expect(isValidDateString('2026-11-17')).toBe(true);
      expect(isValidDateString('2024-02-29')).toBe(true);
      expect(isValidDateString('2026-02-30')).toBe(false);
      expect(isValidDateString('2026-1-5')).toBe(false);
      expect(isValidDateString('')).toBe(false);
    });
  });

  describe('isPastDate', () => {
    const today = '2026-11-17';

    it('rejects dates before today', () => {
      expect(isPastDate('2026-11-16', today)).toBe(true);
      expect(isPastDate('2025-12-31', today)).toBe(true);
    });

    it('accepts today and future dates', () => {
      expect(isPastDate(today, today)).toBe(false);
      expect(isPastDate('2026-11-18', today)).toBe(false);
    });

    it('rejects empty or malformed dates', () => {
      expect(isPastDate('', today)).toBe(true);
      expect(isPastDate('17/11/2026', today)).toBe(true);
    });
  });
});
