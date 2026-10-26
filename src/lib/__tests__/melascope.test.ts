import { describe, it, expect } from 'vitest';
import { calculateFitScore, DEFAULT_PRODUCT_PROFILE, DEFAULT_SCORE_WEIGHTS } from '../scoring';
import { sanitizeSafeUrl, classifyBookingUrlType, validateDateRange, isEventWithinHorizon } from '../validation';
import { normalizeTokens, tokenSimilarity, areEventsDuplicates, mergeDuplicateEvents } from '../dedup';
import { MelaEvent } from '@/types';

describe('Scoring Model', () => {
  const sampleEvent: Partial<MelaEvent> = {
    title: 'Blind School Diwali Crafts Mela',
    event_type: 'festive_market',
    description: 'Premier annual Diwali craft bazaar featuring handmade home decor, candles, diyas, and artisanal gifts.',
    venue_context: 'destination',
    venue_context_rationale: 'Iconic heritage venue with high-spending family footfall',
    city: 'Delhi',
    locality: 'Lal Bahadur Shastri Marg',
    geocode_confidence: 'high',
    verification_status: 'verified',
    stall_fee_min: 15000,
    stall_fee_max: 22000,
    booking_url_type: 'official_vendor_form',
    vendor_booking_url: 'https://forms.gle/blind-school-vendor-2026',
    application_deadline: '2026-10-30T18:00:00Z',
    category_restrictions: ['Handmade and artisan goods only'],
    source_urls: [
      {
        url: 'https://blindreliefdelhi.org/mela-2026',
        title: 'Official Blind Relief Association Delhi Announcement',
        source_type: 'official_organizer',
        last_verified_at: '2026-10-25T10:00:00Z',
      },
    ],
  };

  it('calculates high fit score for aligned product profile and verified event', () => {
    const result = calculateFitScore(sampleEvent, DEFAULT_PRODUCT_PROFILE, DEFAULT_SCORE_WEIGHTS);
    expect(result.fit_score).toBeGreaterThanOrEqual(80);
    expect(result.overall_confidence).toBe('high');
    expect(result.fit_breakdown.product_fit.score).toBeGreaterThan(20);
    expect(result.fit_breakdown.booking_readiness.confidence).toBe('high');
    expect(result.recommendation).toContain('High priority');
  });

  it('penalizes score and flags uncertainty when stall fee is undisclosed', () => {
    const eventWithoutFee: Partial<MelaEvent> = {
      ...sampleEvent,
      stall_fee_min: null,
      stall_fee_max: null,
    };
    const result = calculateFitScore(eventWithoutFee, DEFAULT_PRODUCT_PROFILE, DEFAULT_SCORE_WEIGHTS);
    expect(result.fit_breakdown.economics.confidence).toBe('low');
    expect(result.uncertainties.some((u) => u.includes('Stall pricing not publicly disclosed'))).toBe(true);
  });

  it('adjusts score proportionally when weights are modified', () => {
    const customWeights = {
      product_fit: 10,
      audience_intent: 10,
      location_context: 10,
      event_relevance: 10,
      economics: 50,
      booking_readiness: 10,
    };
    const result = calculateFitScore(sampleEvent, DEFAULT_PRODUCT_PROFILE, customWeights);
    expect(result.fit_breakdown.economics.max).toBe(50);
  });

  it('lowers booking readiness score and flags generic venue websites', () => {
    const venueLinkEvent: Partial<MelaEvent> = {
      ...sampleEvent,
      booking_url_type: 'venue_website',
      vendor_booking_url: 'https://selectcitywalk.com/',
    };
    const result = calculateFitScore(venueLinkEvent, DEFAULT_PRODUCT_PROFILE, DEFAULT_SCORE_WEIGHTS);
    expect(result.fit_breakdown.booking_readiness.score).toBeLessThan(5);
    expect(result.uncertainties.some((u) => u.includes('generic venue website'))).toBe(true);
  });
});

describe('URL Validation & Classification', () => {
  it('sanitizes valid http/https URLs and discards unsafe protocols', () => {
    expect(sanitizeSafeUrl('https://dastkar.org/nature-bazaar')).toBe('https://dastkar.org/nature-bazaar');
    expect(sanitizeSafeUrl('http://delhitourism.gov.in')).toBe('http://delhitourism.gov.in/');
    expect(sanitizeSafeUrl('javascript:alert(1)')).toBeNull();
    expect(sanitizeSafeUrl('data:text/html,<script></script>')).toBeNull();
    expect(sanitizeSafeUrl('')).toBeNull();
  });

  it('identifies official forms from common form builders', () => {
    expect(classifyBookingUrlType('https://forms.gle/xyz123')).toBe('official_vendor_form');
    expect(classifyBookingUrlType('https://docs.google.com/forms/d/e/123/viewform')).toBe('official_vendor_form');
    expect(classifyBookingUrlType('https://subdomain.typeform.com/to/abc456')).toBe('official_vendor_form');
  });

  it('distinguishes generic venue homepages from booking pages', () => {
    expect(classifyBookingUrlType('https://selectcitywalk.com/')).toBe('venue_website');
    expect(classifyBookingUrlType('https://dlfcybercity.com')).toBe('venue_website');
    expect(classifyBookingUrlType('https://dastkar.org/events/diwali-mela-2026')).toBe('organizer_booking_page');
  });
});

describe('Date Validation & Filtering', () => {
  it('validates proper date sequence', () => {
    const valid = validateDateRange('2026-11-01T10:00:00Z', '2026-11-05T20:00:00Z');
    expect(valid.isValid).toBe(true);

    const invalid = validateDateRange('2026-11-10T10:00:00Z', '2026-11-05T20:00:00Z');
    expect(valid.isValid).toBe(true);
    expect(invalid.isValid).toBe(false);
    expect(invalid.error).toContain('End date cannot be earlier');
  });

  it('determines if event is within horizon days', () => {
    const now = new Date('2026-10-26T00:00:00Z');
    // Event in 10 days
    expect(isEventWithinHorizon('2026-11-05T00:00:00Z', 30, now)).toBe(true);
    // Event in 60 days with 45 day horizon
    expect(isEventWithinHorizon('2026-12-30T00:00:00Z', 45, now)).toBe(false);
  });
});

describe('Deduplication & Entity Resolution', () => {
  it('normalizes tokens and ignores punctuation & stopwords', () => {
    const tokens = normalizeTokens('The Annual Dastkar Nature Bazaar 2026 at Kisan Haat!');
    expect(tokens.has('the')).toBe(false);
    expect(tokens.has('annual')).toBe(false);
    expect(tokens.has('dastkar')).toBe(true);
    expect(tokens.has('nature')).toBe(true);
    expect(tokens.has('bazaar')).toBe(true);
    expect(tokens.has('kisan')).toBe(true);
  });

  it('detects duplicate events across different titles on the same weekend', () => {
    const eventA: Partial<MelaEvent> = {
      title: 'Dastkar Nature Bazaar Craft Mela',
      venue_name: 'Nature Bazaar Kisan Haat Anuvrat Marg',
      start_at: '2026-11-12T10:00:00Z',
    };
    const eventB: Partial<MelaEvent> = {
      title: 'Nature Bazaar Handloom & Crafts Exhibition',
      venue_name: 'Kisan Haat Andheria Modh',
      start_at: '2026-11-12T10:00:00Z',
    };
    expect(areEventsDuplicates(eventA, eventB)).toBe(true);
  });

  it('merges duplicate events and preserves all unique sources', () => {
    const existing: MelaEvent = {
      id: 'event-1',
      title: 'Dilli Haat INA Diwali Utsav',
      event_type: 'festive_market',
      description: 'Crafts mela at Dilli Haat',
      start_at: '2026-11-01T11:00:00Z',
      end_at: '2026-11-04T21:00:00Z',
      timezone: 'Asia/Kolkata',
      venue_name: 'Dilli Haat INA',
      address: 'Kidwai Nagar West, Opposite INA Market',
      locality: 'INA',
      city: 'Delhi',
      state: 'Delhi',
      latitude: 28.5733,
      longitude: 77.2075,
      geocode_confidence: 'high',
      organizer_name: 'Delhi Tourism DTTDC',
      booking_url_type: 'none',
      pricing_basis: 'per_event',
      currency: 'INR',
      availability_status: 'open',
      included_facilities: ['1 Stall Table'],
      category_restrictions: [],
      venue_context: 'destination',
      venue_context_rationale: 'Established artisan destination',
      verification_status: 'partially_verified',
      attendance_basis: 'inferred',
      has_floor_plan: false,
      fit_score: 75,
      fit_breakdown: {} as any,
      overall_confidence: 'medium',
      uncertainties: [],
      recommendation: 'Viable',
      source_urls: [
        {
          url: 'https://delhitourism.gov.in/dilli-haat-ina',
          title: 'Delhi Tourism Listing',
          source_type: 'official_venue',
          last_verified_at: '2026-10-20T00:00:00Z',
        },
      ],
      last_verified_at: '2026-10-20T00:00:00Z',
      created_at: '2026-10-20T00:00:00Z',
      updated_at: '2026-10-20T00:00:00Z',
      user_status: 'saved',
      user_notes: 'Spoke to RWA secretary',
    };

    const incoming: Partial<MelaEvent> = {
      title: 'Dilli Haat INA Grand Diwali Crafts Utsav 2026',
      stall_fee_min: 18000,
      stall_fee_max: 25000,
      vendor_booking_url: 'https://forms.gle/dillihaat-vendor',
      booking_url_type: 'official_vendor_form',
      source_urls: [
        {
          url: 'https://instagram.com/dillihaatofficial/p/12345',
          title: 'Official Dilli Haat Instagram Vendor Callout',
          source_type: 'social_page',
          last_verified_at: '2026-10-25T00:00:00Z',
        },
      ],
    };

    const merged = mergeDuplicateEvents(existing, incoming);
    expect(merged.source_urls.length).toBe(2);
    expect(merged.stall_fee_min).toBe(18000);
    expect(merged.vendor_booking_url).toBe('https://forms.gle/dillihaat-vendor');
    expect(merged.user_status).toBe('saved');
    expect(merged.user_notes).toBe('Spoke to RWA secretary');
  });
});
