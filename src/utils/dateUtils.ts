/**
 * Date and time utilities for ViDo deadline and chronological validation.
 */

/**
 * Returns today's date formatted as YYYY-MM-DD in local time.
 */
export function getTodayDateString(d: Date = new Date()): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Returns the date exactly 7 calendar days before d as YYYY-MM-DD in local time.
 */
export function getSevenDaysAgoDateString(d: Date = new Date()): string {
  const target = new Date(d.getFullYear(), d.getMonth(), d.getDate() - 7);
  const year = target.getFullYear();
  const month = String(target.getMonth() + 1).padStart(2, '0');
  const day = String(target.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Returns the current time formatted as HH:mm in local time.
 */
export function getCurrentTimeString(d: Date = new Date()): string {
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

/**
 * Returns a sensible default future due time for today.
 * Defaults to 1 hour from now, capped at 23:59 for today.
 */
export function getDefaultDueTime(d: Date = new Date()): string {
  const target = new Date(d.getTime() + 60 * 60 * 1000);
  if (target.getDate() !== d.getDate()) {
    return '23:59';
  }
  const hours = String(target.getHours()).padStart(2, '0');
  const minutes = String(target.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

export interface ChronologicalValidationOptions {
  dueDate: string;
  dueTime?: string;
  isBackdated?: boolean;
  startDate?: string;
  startTime?: string;
  now?: Date;
}

export interface ChronologicalValidationResult {
  isValid: boolean;
  dateError?: string;
  timeError?: string;
  startError?: string;
  generalError?: string;
  effectiveCreatedAt: string;
  effectiveDueDate: string;
  effectiveDueTime: string;
}

/**
 * Validates chronological integrity of task start time and deadline:
 * 1. Default creation time is Date.now() unless explicitly backdated.
 * 2. Backdating is allowed up to 7 calendar days in the past; earlier dates are blocked.
 * 3. Start date/time cannot be in the future.
 * 4. Deadline must occur strictly after start / creation time (deadline > start).
 *    - If deadline date == start date, deadline time must be strictly after start time.
 *    - If no deadline time is entered, it automatically defaults to end-of-day (11:59 PM).
 *    - Future dates after the start date allow any valid time of day.
 * 5. Dates older than 7 days in the past are blocked.
 */
export function validateChronologicalDeadline(
  options: ChronologicalValidationOptions
): ChronologicalValidationResult {
  const now = options.now || new Date();
  const todayStr = getTodayDateString(now);
  const currentTimeStr = getCurrentTimeString(now);
  const sevenDaysAgoStr = getSevenDaysAgoDateString(now);

  let effectiveStartDate = todayStr;
  let effectiveStartTime = currentTimeStr;
  let effectiveCreatedAt = now.toISOString();

  // 1. Validate Start Time / Backdating
  if (options.isBackdated) {
    const rawStartDate = options.startDate?.trim() || todayStr;
    const rawStartTime = options.startTime?.trim() || '00:00';

    if (rawStartDate < sevenDaysAgoStr) {
      return {
        isValid: false,
        startError: 'Date is beyond the 7-day logging window.',
        generalError: 'Date is beyond the 7-day logging window. Work can only be backdated by up to 7 days.',
        effectiveCreatedAt,
        effectiveDueDate: options.dueDate,
        effectiveDueTime: options.dueTime || '23:59',
      };
    }

    if (rawStartDate > todayStr) {
      return {
        isValid: false,
        startError: 'Start date cannot be in the future.',
        generalError: 'Start date cannot be in the future.',
        effectiveCreatedAt,
        effectiveDueDate: options.dueDate,
        effectiveDueTime: options.dueTime || '23:59',
      };
    }

    if (rawStartDate === todayStr && rawStartTime > currentTimeStr) {
      return {
        isValid: false,
        startError: 'Start time cannot be in the future.',
        generalError: 'Start time cannot be in the future.',
        effectiveCreatedAt,
        effectiveDueDate: options.dueDate,
        effectiveDueTime: options.dueTime || '23:59',
      };
    }

    effectiveStartDate = rawStartDate;
    effectiveStartTime = rawStartTime;

    const parsedStart = new Date(`${rawStartDate}T${rawStartTime}:00`);
    effectiveCreatedAt = isNaN(parsedStart.getTime()) ? now.toISOString() : parsedStart.toISOString();
  }

  // 2. Validate Target Due Date
  const rawDueDate = options.dueDate?.trim();
  if (!rawDueDate) {
    return {
      isValid: false,
      dateError: 'Target due date is required.',
      generalError: 'Please provide a target due date.',
      effectiveCreatedAt,
      effectiveDueDate: '',
      effectiveDueTime: '23:59',
    };
  }

  // Check 7-day boundary for deadline
  if (rawDueDate < sevenDaysAgoStr) {
    return {
      isValid: false,
      dateError: 'Date is beyond the 7-day logging window.',
      generalError: 'Date is beyond the 7-day logging window. Deadlines cannot be set earlier than the 7-day window.',
      effectiveCreatedAt,
      effectiveDueDate: rawDueDate,
      effectiveDueTime: '23:59',
    };
  }

  // Default deadline time to 11:59 PM (23:59) if omitted
  const rawDueTime = options.dueTime?.trim();
  const effectiveDueTime = rawDueTime ? rawDueTime : '23:59';
  const effectiveDueDate = rawDueDate;

  // 3. Chronological check: deadline must be strictly after start
  if (effectiveDueDate < effectiveStartDate) {
    return {
      isValid: false,
      dateError: 'Deadline must be later than the start time.',
      generalError: 'Deadline must be later than the start time.',
      effectiveCreatedAt,
      effectiveDueDate,
      effectiveDueTime,
    };
  }

  if (effectiveDueDate === effectiveStartDate) {
    if (effectiveDueTime <= effectiveStartTime) {
      const timeError = options.isBackdated
        ? 'Deadline must be later than the start time.'
        : `Deadline time must be after the start time (current time is ${effectiveStartTime}).`;
      return {
        isValid: false,
        timeError,
        generalError: 'Deadline must be later than the start time.',
        effectiveCreatedAt,
        effectiveDueDate,
        effectiveDueTime,
      };
    }
  }

  return {
    isValid: true,
    effectiveCreatedAt,
    effectiveDueDate,
    effectiveDueTime,
  };
}

/**
 * Legacy / convenience wrapper for simple date + time validation
 */
export function validateDeadline(
  selectedDate: string,
  selectedTime?: string,
  now: Date = new Date()
) {
  return validateChronologicalDeadline({
    dueDate: selectedDate,
    dueTime: selectedTime,
    isBackdated: false,
    now,
  });
}
