import fs from 'fs';
import path from 'path';
import { MelaEvent, UserProfile, ResearchRun, EventFilters } from '@/types';
import { DEFAULT_PRODUCT_PROFILE, DEFAULT_SCORE_WEIGHTS, calculateFitScore } from '../scoring';
import { getInitialSeedEvents } from './seed-data';
import { DEFAULT_SOURCE_CONNECTORS } from '../connectors';

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'melascope_db.json');

interface LocalDatabase {
  user_profile: UserProfile;
  events: MelaEvent[];
  research_runs: ResearchRun[];
}

function ensureDbFile(): LocalDatabase {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(DB_FILE)) {
    const initialEvents = getInitialSeedEvents();
    const initialProfile: UserProfile = {
      id: 'profile-user-default',
      product_profile: DEFAULT_PRODUCT_PROFILE,
      score_weights: DEFAULT_SCORE_WEIGHTS,
      default_date_horizon_days: 45,
      preferred_localities: ['South Delhi', 'Gurugram', 'Noida', 'Central Delhi'],
      source_connectors: DEFAULT_SOURCE_CONNECTORS,
      updated_at: new Date().toISOString(),
    };

    const initialDb: LocalDatabase = {
      user_profile: initialProfile,
      events: initialEvents,
      research_runs: [],
    };

    fs.writeFileSync(DB_FILE, JSON.stringify(initialDb, null, 2), 'utf-8');
    return initialDb;
  }

  try {
    const content = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(content) as LocalDatabase;
  } catch (error) {
    console.error('Failed reading database file, reinitializing', error);
    const initialEvents = getInitialSeedEvents();
    const initialDb: LocalDatabase = {
      user_profile: {
        id: 'profile-user-default',
        product_profile: DEFAULT_PRODUCT_PROFILE,
        score_weights: DEFAULT_SCORE_WEIGHTS,
        default_date_horizon_days: 45,
        preferred_localities: ['South Delhi', 'Gurugram', 'Noida', 'Central Delhi'],
        source_connectors: DEFAULT_SOURCE_CONNECTORS,
        updated_at: new Date().toISOString(),
      },
      events: initialEvents,
      research_runs: [],
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialDb, null, 2), 'utf-8');
    return initialDb;
  }
}

function writeDbFile(db: LocalDatabase): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
}

export async function getUserProfile(): Promise<UserProfile> {
  const db = ensureDbFile();
  return db.user_profile;
}

export async function updateUserProfile(updates: Partial<UserProfile>): Promise<UserProfile> {
  const db = ensureDbFile();
  const updated: UserProfile = {
    ...db.user_profile,
    ...updates,
    product_profile: {
      ...db.user_profile.product_profile,
      ...(updates.product_profile || {}),
    },
    score_weights: {
      ...db.user_profile.score_weights,
      ...(updates.score_weights || {}),
    },
    updated_at: new Date().toISOString(),
  };

  // When profile or weights update, re-score all events
  db.user_profile = updated;
  db.events = db.events.map((ev) => {
    const scored = calculateFitScore(ev, updated.product_profile, updated.score_weights);
    return {
      ...ev,
      ...scored,
    };
  });

  writeDbFile(db);
  return updated;
}

export async function getEvents(filters: EventFilters = {}): Promise<MelaEvent[]> {
  const db = ensureDbFile();
  let list = [...db.events];

  // 1. Text Search
  if (filters.searchQuery && filters.searchQuery.trim().length > 0) {
    const q = filters.searchQuery.toLowerCase().trim();
    list = list.filter((e) => {
      return (
        e.title.toLowerCase().includes(q) ||
        e.venue_name.toLowerCase().includes(q) ||
        e.locality.toLowerCase().includes(q) ||
        e.city.toLowerCase().includes(q) ||
        e.organizer_name.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q)
      );
    });
  }

  // 2. Locality / City Filter
  if (filters.locality && filters.locality !== 'all') {
    const loc = filters.locality.toLowerCase();
    list = list.filter((e) => {
      return (
        e.city.toLowerCase().includes(loc) ||
        e.locality.toLowerCase().includes(loc)
      );
    });
  }

  // 3. Event Type Filter
  if (filters.eventType && filters.eventType !== 'all') {
    list = list.filter((e) => e.event_type === filters.eventType);
  }

  // 4. Venue Context Filter
  if (filters.venueContext && filters.venueContext !== 'all') {
    list = list.filter((e) => e.venue_context === filters.venueContext);
  }

  // 5. Date Horizon / Date Window
  if (filters.dateHorizonDays) {
    const now = new Date();
    const maxTime = now.getTime() + filters.dateHorizonDays * 24 * 60 * 60 * 1000;
    list = list.filter((e) => {
      const start = new Date(e.start_at).getTime();
      return !isNaN(start) && start <= maxTime;
    });
  } else if (filters.startDate || filters.endDate) {
    if (filters.startDate) {
      const startLimit = new Date(filters.startDate).getTime();
      list = list.filter((e) => new Date(e.start_at).getTime() >= startLimit);
    }
    if (filters.endDate) {
      const endLimit = new Date(filters.endDate).getTime();
      list = list.filter((e) => new Date(e.end_at).getTime() <= endLimit);
    }
  }

  // 6. Min Fit Score
  if (typeof filters.minScore === 'number' && filters.minScore > 0) {
    list = list.filter((e) => e.fit_score >= (filters.minScore || 0));
  }

  // 7. Max Stall Fee
  if (typeof filters.maxStallFee === 'number' && filters.maxStallFee > 0) {
    list = list.filter((e) => {
      const fee = e.stall_fee_max ?? e.stall_fee_min;
      if (fee === null || fee === undefined) return false;
      return fee <= (filters.maxStallFee || 0);
    });
  }

  // 8. Verified Only Filter (Strict: excludes unverified leads)
  if (filters.verifiedOnly) {
    list = list.filter((e) => e.verification_status === 'verified');
  }

  // 9. Booking Link Available Only
  if (filters.bookingLinkOnly) {
    list = list.filter(
      (e) =>
        e.vendor_booking_url &&
        e.vendor_booking_url.trim().length > 0 &&
        e.booking_url_type !== 'none' &&
        e.booking_url_type !== 'venue_website'
    );
  }

  // 10. User Pipeline Status Filter
  if (filters.userStatus && filters.userStatus !== 'all') {
    list = list.filter((e) => e.user_status === filters.userStatus);
  }

  // 11. Sorting
  const sortBy = filters.sortBy || 'fit_score';
  list.sort((a, b) => {
    if (sortBy === 'fit_score') {
      return b.fit_score - a.fit_score;
    }
    if (sortBy === 'date') {
      return new Date(a.start_at).getTime() - new Date(b.start_at).getTime();
    }
    if (sortBy === 'fee_asc') {
      const feeA = a.stall_fee_min ?? a.stall_fee_max ?? 999999;
      const feeB = b.stall_fee_min ?? b.stall_fee_max ?? 999999;
      return feeA - feeB;
    }
    if (sortBy === 'fee_desc') {
      const feeA = a.stall_fee_max ?? a.stall_fee_min ?? 0;
      const feeB = b.stall_fee_max ?? b.stall_fee_min ?? 0;
      return feeB - feeA;
    }
    if (sortBy === 'confidence') {
      const rank = { high: 3, medium: 2, low: 1 };
      return rank[b.overall_confidence] - rank[a.overall_confidence];
    }
    return 0;
  });

  return list;
}

export async function getEventById(id: string): Promise<MelaEvent | null> {
  const db = ensureDbFile();
  const event = db.events.find((e) => e.id === id);
  return event || null;
}

export async function createEvent(eventInput: Partial<MelaEvent>): Promise<MelaEvent> {
  const db = ensureDbFile();
  const profile = db.user_profile;

  const now = new Date().toISOString();
  const id = eventInput.id || `mela-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

  const scored = calculateFitScore(eventInput, profile.product_profile, profile.score_weights);

  const fullEvent: MelaEvent = {
    id,
    title: eventInput.title || 'Untitled Opportunity',
    event_type: eventInput.event_type || 'mela',
    description: eventInput.description || '',
    start_at: eventInput.start_at || now,
    end_at: eventInput.end_at || now,
    timezone: 'Asia/Kolkata',
    opening_hours: eventInput.opening_hours,
    venue_name: eventInput.venue_name || 'Delhi NCR Venue',
    address: eventInput.address || 'Delhi NCR',
    locality: eventInput.locality || 'NCR',
    city: eventInput.city || 'Delhi',
    state: eventInput.state || 'Delhi',
    latitude: eventInput.latitude || 28.6139,
    longitude: eventInput.longitude || 77.2090,
    geocode_confidence: eventInput.geocode_confidence || 'approximate',
    organizer_name: eventInput.organizer_name || 'Organising Committee',
    organizer_email: eventInput.organizer_email,
    organizer_phone: eventInput.organizer_phone,
    official_event_url: eventInput.official_event_url,
    vendor_booking_url: eventInput.vendor_booking_url,
    booking_url_type: eventInput.booking_url_type || 'none',
    stall_fee_min: eventInput.stall_fee_min ?? null,
    stall_fee_max: eventInput.stall_fee_max ?? null,
    pricing_basis: eventInput.pricing_basis || 'per_event',
    currency: 'INR',
    stall_width_ft: eventInput.stall_width_ft ?? null,
    stall_depth_ft: eventInput.stall_depth_ft ?? null,
    stall_area_sqft: eventInput.stall_area_sqft ?? null,
    security_deposit: eventInput.security_deposit ?? null,
    electricity_charges_included: eventInput.electricity_charges_included ?? null,
    gst_included: eventInput.gst_included ?? null,
    application_deadline: eventInput.application_deadline ?? null,
    availability_status: eventInput.availability_status || 'open',
    included_facilities: eventInput.included_facilities || [],
    category_restrictions: eventInput.category_restrictions || [],
    venue_context: eventInput.venue_context || 'destination',
    venue_context_rationale: eventInput.venue_context_rationale || 'User-entered venue classification.',
    verification_status: eventInput.verification_status || 'verified',
    attendance_basis: eventInput.attendance_basis || 'unknown',
    expected_footfall_text: eventInput.expected_footfall_text || '',
    expected_attendance_stated: eventInput.expected_attendance_stated ?? null,
    historical_attendance_info: eventInput.historical_attendance_info,
    target_audience_demographics: eventInput.target_audience_demographics,
    has_floor_plan: eventInput.has_floor_plan ?? Boolean(eventInput.floor_plan),
    floor_plan: eventInput.floor_plan ?? null,
    is_demo: eventInput.is_demo ?? false,
    source_urls: eventInput.source_urls || [],
    last_verified_at: eventInput.last_verified_at || now,
    created_at: now,
    updated_at: now,
    user_status: eventInput.user_status || 'new',
    user_notes: eventInput.user_notes || '',
    next_action_at: eventInput.next_action_at ?? null,
    ...scored,
  };

  db.events.unshift(fullEvent);
  writeDbFile(db);
  return fullEvent;
}

export async function updateEvent(id: string, updates: Partial<MelaEvent>): Promise<MelaEvent | null> {
  const db = ensureDbFile();
  const idx = db.events.findIndex((e) => e.id === id);
  if (idx === -1) return null;

  const existing = db.events[idx];
  const merged: MelaEvent = {
    ...existing,
    ...updates,
    updated_at: new Date().toISOString(),
  };

  // Recalculate fit score if relevant fields changed
  if (
    updates.event_type ||
    updates.category_restrictions ||
    updates.stall_fee_min !== undefined ||
    updates.stall_fee_max !== undefined ||
    updates.venue_context ||
    updates.booking_url_type ||
    updates.verification_status
  ) {
    const scored = calculateFitScore(merged, db.user_profile.product_profile, db.user_profile.score_weights);
    Object.assign(merged, scored);
  }

  db.events[idx] = merged;
  writeDbFile(db);
  return merged;
}

export async function deleteEvent(id: string): Promise<boolean> {
  const db = ensureDbFile();
  const initialLen = db.events.length;
  db.events = db.events.filter((e) => e.id !== id);
  if (db.events.length === initialLen) return false;
  writeDbFile(db);
  return true;
}

export async function createResearchRun(run: ResearchRun): Promise<ResearchRun> {
  const db = ensureDbFile();
  db.research_runs.unshift(run);
  writeDbFile(db);
  return run;
}

export async function updateResearchRun(id: string, updates: Partial<ResearchRun>): Promise<ResearchRun | null> {
  const db = ensureDbFile();
  const idx = db.research_runs.findIndex((r) => r.id === id);
  if (idx === -1) return null;

  db.research_runs[idx] = {
    ...db.research_runs[idx],
    ...updates,
  };
  writeDbFile(db);
  return db.research_runs[idx];
}

export async function getResearchRuns(): Promise<ResearchRun[]> {
  const db = ensureDbFile();
  return db.research_runs;
}
