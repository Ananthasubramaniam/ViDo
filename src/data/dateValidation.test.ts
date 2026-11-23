import { describe, expect, it } from 'vitest';
import {
  dateTimeLocalToIso,
  getTimeString,
  getTodayDateString,
  isPastDate,
  isPastDateTime,
  isPastDateTimeLocal,
  isValidDateString,
  isValidTimeString,
  parseDateTimeLocal,
  toDateTimeLocalValue,
} from './dateValidation';

describe('dateValidation', () => {
  describe('getTodayDateString', () => {
    it('formats a date as a local YYYY-MM-DD string', () => {
      expect(getTodayDateString(new Date(2026, 10, 3, 23, 30))).toBe('2026-11-03');
      expect(getTodayDateString(new Date(2026, 0, 1, 0, 30))).toBe('2026-01-01');
    });
  });


  describe('time helpers', () => {
    const now = new Date(2026, 10, 23, 11, 30, 45);

    it('formats local time and datetime-local values', () => {
      expect(getTimeString(now)).toBe('11:30');
      expect(toDateTimeLocalValue(now)).toBe('2026-11-23T11:30');
    });

    it('validates HH:mm values', () => {
      expect(isValidTimeString('00:00')).toBe(true);
      expect(isValidTimeString('23:59')).toBe(true);
      expect(isValidTimeString('24:00')).toBe(false);
      expect(isValidTimeString('9:30')).toBe(false);
    });

    it('converts datetime-local values to UTC timestamps', () => {
      const iso = dateTimeLocalToIso('2026-11-23T11:30');
      expect(iso).not.toBeNull();
      expect(new Date(iso!).getTime()).toBe(new Date(2026, 10, 23, 11, 30).getTime());
      expect(dateTimeLocalToIso('2026-11-23')).toBeNull();
    });

    it('parses datetime-local values into validated parts', () => {
      expect(parseDateTimeLocal('2026-11-23T11:30')).toEqual({
        date: '2026-11-23',
        time: '11:30',
      });
      expect(parseDateTimeLocal('2026-02-30T11:30')).toBeNull();
      expect(parseDateTimeLocal('2026-11-23T24:00')).toBeNull();
      expect(parseDateTimeLocal('2026-11-23')).toBeNull();
    });
  });

  describe('isPastDateTime', () => {
    const now = new Date(2026, 10, 23, 11, 30, 0);

    it('rejects an earlier time today but accepts the current or a later time', () => {
      expect(isPastDateTime('2026-11-23', '11:29', now)).toBe(true);
      expect(isPastDateTime('2026-11-23', '11:30', now)).toBe(false);
      expect(isPastDateTime('2026-11-23', '11:31', now)).toBe(false);
      expect(isPastDateTime('2026-11-24', '00:00', now)).toBe(false);
    });

    it('rejects malformed date/time combinations', () => {
      expect(isPastDateTime('2026-11-23', '24:00', now)).toBe(true);
      expect(isPastDateTimeLocal('2026-11-23', now)).toBe(true);
    });

    it('checks datetime-local values against the current time', () => {
      expect(isPastDateTimeLocal('2026-11-23T11:29', now)).toBe(true);
      expect(isPastDateTimeLocal('2026-11-23T11:30', now)).toBe(false);
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
