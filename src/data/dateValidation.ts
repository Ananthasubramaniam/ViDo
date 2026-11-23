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

/** Returns true for a 24-hour HH:mm value. */
export function isValidTimeString(value: string): boolean {
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(value);
}

/** Formats a Date as local HH:mm for time inputs. */
export function getTimeString(date: Date = new Date()): string {
  return `${String(date.getHours()).padStart(2, '0')}:${String(
    date.getMinutes()
  ).padStart(2, '0')}`;
}

/** Formats a Date for a datetime-local input using local calendar time. */
export function toDateTimeLocalValue(date: Date = new Date()): string {
  return `${getTodayDateString(date)}T${getTimeString(date)}`;
}

/** Splits a datetime-local value into validated local date and time parts. */
export function parseDateTimeLocal(value: string): { date: string; time: string } | null {
  const match = /^(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2})/.exec(value);
  if (!match) return null;

  const [, date, time] = match;
  if (!isValidDateString(date) || !isValidTimeString(time)) return null;

  return { date, time };
}

/** Converts a datetime-local value to a UTC ISO timestamp. */
export function dateTimeLocalToIso(value: string): string | null {
  const parsed = parseDateTimeLocal(value);
  if (!parsed) return null;

  const [year, month, day] = parsed.date.split('-').map(Number);
  const [hours, minutes] = parsed.time.split(':').map(Number);
  return new Date(year, month - 1, day, hours, minutes, 0, 0).toISOString();
}

/** Returns true when a date/time combination is invalid or already past. */
export function isPastDateTime(
  date: string,
  time: string,
  now: Date = new Date()
): boolean {
  const timestamp = dateTimeLocalToIso(`${date}T${time}`);
  return timestamp === null || new Date(timestamp).getTime() < now.getTime();
}

/** Returns true when a datetime-local value is invalid or already past. */
export function isPastDateTimeLocal(value: string, now: Date = new Date()): boolean {
  const timestamp = dateTimeLocalToIso(value);
  return timestamp === null || new Date(timestamp).getTime() < now.getTime();
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
