import { MelaEvent, EventSource } from '@/types';

/**
 * Normalizes text for matching by removing punctuation, extra spaces,
 * common stop words, stemming simple plurals, and converting to lowercase.
 */
export function normalizeTokens(text: string): Set<string> {
  const stopWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'in', 'at', 'on', 'of', 'for', 'with', 'by',
    'annual', 'edition', 'pvt', 'ltd', 'delhi', 'ncr', '2025', '2026', '2027',
  ]);

  const rawWords = text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter((word) => word.length > 2 && !stopWords.has(word));

  const stemmed = rawWords.map((w) => {
    // Basic singularization
    if (w.endsWith('ies')) return w.slice(0, -3) + 'y';
    if (w.endsWith('es') && !w.endsWith('ses')) return w.slice(0, -2);
    if (w.endsWith('s') && !w.endsWith('ss')) return w.slice(0, -1);
    return w;
  });

  return new Set(stemmed);
}

/**
 * Calculates Jaccard similarity index between two token sets (0 to 1).
 */
export function tokenSimilarity(setA: Set<string>, setB: Set<string>): number {
  if (setA.size === 0 && setB.size === 0) return 1;
  if (setA.size === 0 || setB.size === 0) return 0;

  let intersectionCount = 0;
  for (const item of setA) {
    if (setB.has(item)) {
      intersectionCount++;
    }
  }

  const unionCount = setA.size + setB.size - intersectionCount;
  return intersectionCount / unionCount;
}

/**
 * Checks whether two events are likely duplicates based on:
 * 1. Date overlap (same start date or overlapping date span within 4 days)
 * 2. High title similarity OR venue similarity OR strong combined title+venue token overlap
 */
export function areEventsDuplicates(a: Partial<MelaEvent>, b: Partial<MelaEvent>): boolean {
  if (!a.start_at || !b.start_at) return false;

  const dateA = new Date(a.start_at).getTime();
  const dateB = new Date(b.start_at).getTime();

  if (isNaN(dateA) || isNaN(dateB)) return false;

  const diffDays = Math.abs(dateA - dateB) / (1000 * 60 * 60 * 24);
  if (diffDays > 4) {
    return false; // Dates are too far apart to be the same event instance
  }

  // Token sets
  const titleA = normalizeTokens(a.title || '');
  const titleB = normalizeTokens(b.title || '');
  const venueA = normalizeTokens(a.venue_name || '');
  const venueB = normalizeTokens(b.venue_name || '');

  const titleSim = tokenSimilarity(titleA, titleB);
  const venueSim = tokenSimilarity(venueA, venueB);

  // Exact or very high title match on same weekend
  if (titleSim >= 0.5) return true;

  // Moderate title match with strong venue match
  if (titleSim >= 0.25 && venueSim >= 0.25) return true;

  // Combined title + venue check (counts shared distinctive anchor tokens)
  const combinedA = new Set([...titleA, ...venueA]);
  const combinedB = new Set([...titleB, ...venueB]);
  let sharedCount = 0;
  for (const item of combinedA) {
    if (combinedB.has(item)) sharedCount++;
  }

  if (sharedCount >= 3) return true;

  return false;
}

/**
 * Merges two duplicate event records, retaining the richest metadata,
 * latest verification timestamps, and all unique source references.
 */
export function mergeDuplicateEvents(
  existing: MelaEvent,
  incoming: Partial<MelaEvent>
): MelaEvent {
  const existingUrls = new Set(existing.source_urls.map((s) => s.url));
  const mergedSources: EventSource[] = [...existing.source_urls];

  if (incoming.source_urls) {
    for (const src of incoming.source_urls) {
      if (!existingUrls.has(src.url)) {
        mergedSources.push(src);
        existingUrls.add(src.url);
      }
    }
  }

  const merged: MelaEvent = {
    ...existing,
    title: existing.title.length >= (incoming.title?.length || 0) ? existing.title : incoming.title || existing.title,
    description: (incoming.description && incoming.description.length > existing.description.length)
      ? incoming.description
      : existing.description,
    venue_name: existing.venue_name || incoming.venue_name || '',
    address: existing.address || incoming.address || '',
    locality: existing.locality || incoming.locality || '',
    city: existing.city || incoming.city || 'Delhi',
    latitude: existing.latitude || incoming.latitude || 28.6139,
    longitude: existing.longitude || incoming.longitude || 77.2090,
    organizer_name: existing.organizer_name || incoming.organizer_name || 'Organising Committee',
    organizer_email: existing.organizer_email || incoming.organizer_email,
    organizer_phone: existing.organizer_phone || incoming.organizer_phone,
    official_event_url: existing.official_event_url || incoming.official_event_url,
    vendor_booking_url: incoming.vendor_booking_url || existing.vendor_booking_url,
    booking_url_type: (incoming.booking_url_type && incoming.booking_url_type !== 'none' && incoming.booking_url_type !== 'venue_website')
      ? incoming.booking_url_type
      : existing.booking_url_type,
    stall_fee_min: existing.stall_fee_min ?? incoming.stall_fee_min,
    stall_fee_max: existing.stall_fee_max ?? incoming.stall_fee_max,
    application_deadline: existing.application_deadline ?? incoming.application_deadline,
    availability_status: (incoming.availability_status && incoming.availability_status !== 'unknown')
      ? incoming.availability_status
      : existing.availability_status,
    included_facilities: Array.from(new Set([...(existing.included_facilities || []), ...(incoming.included_facilities || [])])),
    category_restrictions: Array.from(new Set([...(existing.category_restrictions || []), ...(incoming.category_restrictions || [])])),
    source_urls: mergedSources,
    last_verified_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  return merged;
}
