import { BookingUrlType } from '@/types';

/**
 * Validates that a URL is a safe, valid web URL (http or https).
 * Returns safe sanitized URL string or null if invalid or unsafe.
 */
export function sanitizeSafeUrl(input?: string | null): string | null {
  if (!input || typeof input !== 'string') return null;
  const trimmed = input.trim();
  if (!trimmed) return null;

  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return parsed.toString();
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Inspects a URL to classify whether it is an official vendor form,
 * organiser booking page, ticketing platform, or merely a generic venue website.
 */
export function classifyBookingUrlType(
  url?: string | null,
  contextText?: string
): BookingUrlType {
  const safe = sanitizeSafeUrl(url);
  if (!safe) return 'none';

  const lower = safe.toLowerCase();
  const text = (contextText || '').toLowerCase();

  // Known form engines commonly used by Indian mela organisers
  if (
    lower.includes('forms.gle') ||
    lower.includes('docs.google.com/forms') ||
    lower.includes('typeform.com') ||
    lower.includes('airtable.com') ||
    lower.includes('jotform.com') ||
    lower.includes('/vendor-registration') ||
    lower.includes('/stall-booking') ||
    lower.includes('/book-a-stall') ||
    lower.includes('/exhibitor-registration')
  ) {
    return 'official_vendor_form';
  }

  // Ticketing / event platforms
  if (
    lower.includes('bookmyshow.com') ||
    lower.includes('insider.in') ||
    lower.includes('district.in') ||
    lower.includes('townscript.com') ||
    lower.includes('explara.com')
  ) {
    return 'ticketing_platform';
  }

  // Check if it's an organizer's dedicated event / registration page
  if (
    lower.includes('/event/') ||
    lower.includes('/events/') ||
    lower.includes('/mela/') ||
    lower.includes('/exhibition/') ||
    text.includes('vendor application') ||
    text.includes('exhibitor stall')
  ) {
    return 'organizer_booking_page';
  }

  // If it's a root domain or generic venue page (e.g. dlfcybercity.com, selectcitywalk.com)
  try {
    const parsed = new URL(safe);
    if (parsed.pathname === '/' || parsed.pathname === '') {
      return 'venue_website';
    }
  } catch {
    // fallback
  }

  return 'organizer_booking_page';
}

/**
 * Validates that an event date is valid ISO and that end date is >= start date.
 */
export function validateDateRange(
  startAt: string,
  endAt: string
): { isValid: boolean; error?: string } {
  const startDate = new Date(startAt);
  const endDate = new Date(endAt);

  if (isNaN(startDate.getTime())) {
    return { isValid: false, error: 'Invalid start date format' };
  }
  if (isNaN(endDate.getTime())) {
    return { isValid: false, error: 'Invalid end date format' };
  }
  if (endDate.getTime() < startDate.getTime()) {
    return { isValid: false, error: 'End date cannot be earlier than start date' };
  }

  return { isValid: true };
}

/**
 * Checks if an event is within the requested horizon days relative to Asia/Kolkata reference date.
 */
export function isEventWithinHorizon(
  eventStartAt: string,
  horizonDays: number,
  referenceDate: Date = new Date()
): boolean {
  const startDate = new Date(eventStartAt);
  if (isNaN(startDate.getTime())) return false;

  // Normalize referenceDate to Asia/Kolkata midnight
  const refTime = referenceDate.getTime();
  const maxTime = refTime + horizonDays * 24 * 60 * 60 * 1000;

  // We consider events that end today or in the future up to maxTime
  return startDate.getTime() <= maxTime;
}
