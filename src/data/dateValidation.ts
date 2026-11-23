const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Formats a Date as a YYYY-MM-DD string using local calendar dates.
 * Date-only inputs use this format, so lexicographic comparison is safe.
 */
export function getTodayDateString(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/** Returns true when the value is a real calendar date in YYYY-MM-DD form. */
export function isValidDateString(value: string): boolean {
  if (!DATE_PATTERN.test(value)) return false;

  const [year, month, day] = value.split('-').map(Number);
  const parsed = new Date(year, month - 1, day);

  return (
    parsed.getFullYear() === year &&
    parsed.getMonth() === month - 1 &&
    parsed.getDate() === day
  );
}

/**
 * Returns true for any invalid or past date. `today` is injectable so tests
 * and the deterministic demo can use a fixed reference date.
 */
export function isPastDate(
  value: string,
  today: string = getTodayDateString()
): boolean {
  if (!isValidDateString(value)) return true;
  return value < today;
}
