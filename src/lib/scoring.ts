import { MelaEvent, ProductProfile, ScoreWeights, FitBreakdown, ConfidenceLevel } from '@/types';

export const DEFAULT_SCORE_WEIGHTS: ScoreWeights = {
  product_fit: 25,
  audience_intent: 20,
  location_context: 15,
  event_relevance: 15,
  economics: 15,
  booking_readiness: 10,
};

export const DEFAULT_PRODUCT_PROFILE: ProductProfile = {
  product_name: 'Handcrafted Soy Candles & Festive Aromatics',
  category: 'Home Fragrance & Artisan Decor',
  description: 'Hand-poured beeswax and soy candles, ceramic diffusers, and festive holiday gift hampers.',
  price_range_min: 450,
  price_range_max: 2200,
  target_audience: 'Urban professionals, home decor enthusiasts, festive gift buyers, families seeking premium artisan crafts.',
  stall_footprint: 'Standard 6x6 ft canopy or 1 single 6ft table display',
  staffing_count: 2,
  transport_mode: 'Personal hatchback or sedan car',
  max_budget_per_event: 25000,
  inventory_capacity: '150 - 300 units per weekend',
  business_objectives: ['Direct retail sales', 'Brand awareness in Delhi NCR', 'Collecting B2B corporate gifting leads'],
};

export function calculateFitScore(
  event: Partial<MelaEvent>,
  profile: ProductProfile = DEFAULT_PRODUCT_PROFILE,
  weights: ScoreWeights = DEFAULT_SCORE_WEIGHTS
): {
  fit_score: number;
  fit_breakdown: FitBreakdown;
  overall_confidence: ConfidenceLevel;
  uncertainties: string[];
  recommendation: string;
} {
  const uncertainties: string[] = [];
  const normalizedWeights = normalizeWeights(weights);

  // 1. Product & Category Fit (Weight: 25)
  const productFit = evaluateProductFit(event, profile, normalizedWeights.product_fit);
  if (productFit.gaps && productFit.gaps.length > 0) {
    uncertainties.push(...productFit.gaps);
  }

  // 2. Audience & Purchase-Intent Evidence (Weight: 20)
  const audienceIntent = evaluateAudienceIntent(event, profile, normalizedWeights.audience_intent);
  if (audienceIntent.gaps && audienceIntent.gaps.length > 0) {
    uncertainties.push(...audienceIntent.gaps);
  }

  // 3. Location & Context Fit (Weight: 15)
  const locationContext = evaluateLocationContext(event, profile, normalizedWeights.location_context);
  if (locationContext.gaps && locationContext.gaps.length > 0) {
    uncertainties.push(...locationContext.gaps);
  }

  // 4. Event Relevance & Evidence Quality (Weight: 15)
  const eventRelevance = evaluateEventRelevance(event, normalizedWeights.event_relevance);
  if (eventRelevance.gaps && eventRelevance.gaps.length > 0) {
    uncertainties.push(...eventRelevance.gaps);
  }

  // 5. Economics (Weight: 15)
  const economics = evaluateEconomics(event, profile, normalizedWeights.economics);
  if (economics.gaps && economics.gaps.length > 0) {
    uncertainties.push(...economics.gaps);
  }

  // 6. Booking Readiness (Weight: 10)
  const bookingReadiness = evaluateBookingReadiness(event, normalizedWeights.booking_readiness);
  if (bookingReadiness.gaps && bookingReadiness.gaps.length > 0) {
    uncertainties.push(...bookingReadiness.gaps);
  }

  const rawTotal =
    productFit.score +
    audienceIntent.score +
    locationContext.score +
    eventRelevance.score +
    economics.score +
    bookingReadiness.score;

  const totalScore = Math.min(100, Math.max(0, Math.round(rawTotal)));

  // Determine overall confidence
  const confidenceLevels = [
    productFit.confidence,
    audienceIntent.confidence,
    locationContext.confidence,
    eventRelevance.confidence,
    economics.confidence,
    bookingReadiness.confidence,
  ];

  const lowCount = confidenceLevels.filter((c) => c === 'low').length;
  const highCount = confidenceLevels.filter((c) => c === 'high').length;

  let overallConfidence: ConfidenceLevel = 'medium';
  if (lowCount >= 3 || event.verification_status === 'unverified') {
    overallConfidence = 'low';
  } else if (highCount >= 4 && lowCount === 0) {
    overallConfidence = 'high';
  }

  // Generate actionable recommendation
  let recommendation = '';
  if (totalScore >= 80) {
    recommendation = `High priority opportunity: Strong commercial fit for ${profile.product_name}. Check booking deadline and prepare application materials immediately.`;
  } else if (totalScore >= 65) {
    recommendation = `Viable opportunity: Good potential, but review specific gaps (${uncertainties.slice(0, 2).join('; ') || 'check organiser terms'}) before committing stall fee.`;
  } else if (totalScore >= 50) {
    recommendation = `Moderate fit: Proceed with caution. Marginal economic margin or unclear category demand for ${profile.category}.`;
  } else {
    recommendation = `Low fit: Not recommended for current product profile. Mismatch in audience intent, prohibitive fees, or lack of verified booking channel.`;
  }

  return {
    fit_score: totalScore,
    fit_breakdown: {
      product_fit: productFit,
      audience_intent: audienceIntent,
      location_context: locationContext,
      event_relevance: eventRelevance,
      economics: economics,
      booking_readiness: bookingReadiness,
    },
    overall_confidence: overallConfidence,
    uncertainties,
    recommendation,
  };
}

function normalizeWeights(weights: ScoreWeights): ScoreWeights {
  const sum =
    weights.product_fit +
    weights.audience_intent +
    weights.location_context +
    weights.event_relevance +
    weights.economics +
    weights.booking_readiness;

  if (sum === 100 || sum === 0) return weights;

  // Scale proportionally to sum to 100
  const ratio = 100 / sum;
  return {
    product_fit: +(weights.product_fit * ratio).toFixed(1),
    audience_intent: +(weights.audience_intent * ratio).toFixed(1),
    location_context: +(weights.location_context * ratio).toFixed(1),
    event_relevance: +(weights.event_relevance * ratio).toFixed(1),
    economics: +(weights.economics * ratio).toFixed(1),
    booking_readiness: +(weights.booking_readiness * ratio).toFixed(1),
  };
}

function evaluateProductFit(
  event: Partial<MelaEvent>,
  profile: ProductProfile,
  maxWeight: number
) {
  const gaps: string[] = [];
  let scoreFraction = 0.7; // default base
  let confidence: ConfidenceLevel = 'medium';

  const type = event.event_type || 'other';
  const desc = (event.description || '').toLowerCase();
  const cat = (profile.category || '').toLowerCase();

  // Check category restrictions
  if (event.category_restrictions && event.category_restrictions.length > 0) {
    const restrictions = event.category_restrictions.join(' ').toLowerCase();
    if (restrictions.includes('no ') && restrictions.includes(cat)) {
      scoreFraction = 0.1;
      gaps.push(`Category restriction flagged: event excludes certain items matching ${profile.category}`);
      confidence = 'high';
    } else if (restrictions.includes('handmade') && (desc.includes('craft') || cat.includes('artisan') || cat.includes('handcrafted'))) {
      scoreFraction = 0.95;
      confidence = 'high';
    }
  }

  if (type === 'festive_market' || type === 'mela' || type === 'craft_market' || type === 'flea_market') {
    scoreFraction = Math.max(scoreFraction, 0.88);
  } else if (type === 'food_festival') {
    if (cat.includes('food') || cat.includes('beverage') || cat.includes('snack') || cat.includes('bakery')) {
      scoreFraction = 0.95;
      confidence = 'high';
    } else {
      scoreFraction = 0.35;
      gaps.push(`Event is a food-centric festival; non-food products (${profile.product_name}) typically see low conversion.`);
    }
  }

  const score = +(scoreFraction * maxWeight).toFixed(1);
  const rationale = `Event format (${type.replace('_', ' ')}) evaluated against product category "${profile.category}".`;

  return {
    score,
    max: maxWeight,
    rationale,
    confidence,
    gaps,
  };
}

function evaluateAudienceIntent(
  event: Partial<MelaEvent>,
  profile: ProductProfile,
  maxWeight: number
) {
  const gaps: string[] = [];
  let scoreFraction = 0.65;
  let confidence: ConfidenceLevel = 'medium';

  const context = event.venue_context || 'unknown';
  const type = event.event_type || 'other';

  if (context === 'destination') {
    // High footfall destination with intentional visitors (e.g. Dilli Haat, Sunder Nursery, Major Malls)
    scoreFraction = 0.9;
    confidence = 'high';
  } else if (context === 'residential') {
    // High density residential society or RWA event
    if (profile.price_range_max <= 2500) {
      scoreFraction = 0.85;
      confidence = 'medium';
    } else {
      scoreFraction = 0.6;
      gaps.push('Residential context may favor essential or everyday impulse buys rather than luxury ticket items.');
    }
  } else if (context === 'office') {
    if (type === 'flea_market' || type === 'festive_market') {
      scoreFraction = 0.75;
    } else {
      scoreFraction = 0.55;
      gaps.push('Corporate campus context has restricted visitor access and tight lunch-hour shopping windows.');
    }
  } else {
    scoreFraction = 0.5;
    confidence = 'low';
    gaps.push('Venue catchment context is unconfirmed; visitor purchase intent is an estimate.');
  }

  const score = +(scoreFraction * maxWeight).toFixed(1);
  const rationale = `Audience intent estimated from venue context (${context}) and price tolerance (₹${profile.price_range_min}-₹${profile.price_range_max}).`;

  return {
    score,
    max: maxWeight,
    rationale,
    confidence,
    gaps,
  };
}

function evaluateLocationContext(
  event: Partial<MelaEvent>,
  profile: ProductProfile,
  maxWeight: number
) {
  const gaps: string[] = [];
  let scoreFraction = 0.75;
  let confidence: ConfidenceLevel = 'medium';

  if (event.geocode_confidence === 'high') {
    confidence = 'high';
  } else if (event.geocode_confidence === 'low' || event.geocode_confidence === 'approximate') {
    confidence = 'low';
    gaps.push('Exact venue coordinates approximate; check physical access.');
  }

  // Delhi NCR hub check
  const city = (event.city || '').toLowerCase();
  const locality = (event.locality || '').toLowerCase();

  if (city.includes('delhi') || city.includes('gurugram') || city.includes('noida')) {
    scoreFraction = 0.9;
  } else if (city.includes('ghaziabad') || city.includes('faridabad') || city.includes('greater noida')) {
    scoreFraction = 0.8;
  } else {
    scoreFraction = 0.6;
    gaps.push(`Venue in peripheral NCR (${city}); travel logistics using ${profile.transport_mode} must be factored.`);
  }

  const score = +(scoreFraction * maxWeight).toFixed(1);
  const rationale = `Accessibility, parking, and logistics for ${event.locality || event.venue_name || 'NCR venue'} via ${profile.transport_mode}.`;

  return {
    score,
    max: maxWeight,
    rationale,
    confidence,
    gaps,
  };
}

function evaluateEventRelevance(
  event: Partial<MelaEvent>,
  maxWeight: number
) {
  const gaps: string[] = [];
  let scoreFraction = 0.7;
  let confidence: ConfidenceLevel = 'medium';

  if (event.verification_status === 'verified') {
    scoreFraction = 0.95;
    confidence = 'high';
  } else if (event.verification_status === 'partially_verified') {
    scoreFraction = 0.75;
    confidence = 'medium';
    gaps.push('Listing partially corroborated; official organiser confirmation pending.');
  } else if (event.verification_status === 'unverified') {
    scoreFraction = 0.45;
    confidence = 'low';
    gaps.push('Unverified discovery lead from secondary directory or social mention.');
  } else if (event.verification_status === 'expired') {
    scoreFraction = 0.1;
    confidence = 'high';
    gaps.push('Event date has passed or booking window has elapsed.');
  }

  const score = +(scoreFraction * maxWeight).toFixed(1);
  const rationale = `Verification status: ${event.verification_status || 'unverified'} backed by ${(event.source_urls || []).length} source(s).`;

  return {
    score,
    max: maxWeight,
    rationale,
    confidence,
    gaps,
  };
}

function evaluateEconomics(
  event: Partial<MelaEvent>,
  profile: ProductProfile,
  maxWeight: number
) {
  const gaps: string[] = [];
  let scoreFraction = 0.65;
  let confidence: ConfidenceLevel = 'medium';

  const feeMax = event.stall_fee_max ?? event.stall_fee_min;

  if (feeMax === null || feeMax === undefined) {
    scoreFraction = 0.5;
    confidence = 'low';
    gaps.push('Stall pricing not publicly disclosed by organiser; economics cannot be verified.');
  } else {
    confidence = 'high';
    const budget = profile.max_budget_per_event || 30000;
    if (feeMax <= budget * 0.5) {
      scoreFraction = 0.95; // very affordable
    } else if (feeMax <= budget) {
      scoreFraction = 0.8;  // comfortable within budget
    } else if (feeMax <= budget * 1.25) {
      scoreFraction = 0.55; // slightly stretches budget
      gaps.push(`Stall fee (₹${feeMax}) exceeds preferred budget cap (₹${budget}).`);
    } else {
      scoreFraction = 0.2;  // significantly over budget
      gaps.push(`Stall fee (₹${feeMax}) substantially exceeds budget threshold (₹${budget}).`);
    }
  }

  const score = +(scoreFraction * maxWeight).toFixed(1);
  const rationale = feeMax !== null && feeMax !== undefined
    ? `Stall fee of ₹${feeMax.toLocaleString('en-IN')} assessed against budget cap of ₹${(profile.max_budget_per_event || 0).toLocaleString('en-IN')}.`
    : 'Stall fee unannounced; contact organiser for quotation.';

  return {
    score,
    max: maxWeight,
    rationale,
    confidence,
    gaps,
  };
}

function evaluateBookingReadiness(
  event: Partial<MelaEvent>,
  maxWeight: number
) {
  const gaps: string[] = [];
  let scoreFraction = 0.5;
  let confidence: ConfidenceLevel = 'medium';

  const urlType = event.booking_url_type || 'none';
  const hasVendorUrl = Boolean(event.vendor_booking_url && event.vendor_booking_url.trim().length > 0);
  const hasContact = Boolean(event.organizer_phone || event.organizer_email);
  const hasDeadline = Boolean(event.application_deadline);

  if (urlType === 'official_vendor_form' && hasVendorUrl) {
    scoreFraction = 0.95;
    confidence = 'high';
  } else if (urlType === 'organizer_booking_page' && hasVendorUrl) {
    scoreFraction = 0.85;
    confidence = 'high';
  } else if (urlType === 'venue_website') {
    scoreFraction = 0.35;
    confidence = 'medium';
    gaps.push('Provided link is a generic venue website, NOT a verified vendor application form.');
  } else if (hasContact) {
    scoreFraction = 0.6;
    confidence = 'medium';
    gaps.push('Vendor applications handled manually via direct phone/email contact.');
  } else {
    scoreFraction = 0.2;
    confidence = 'low';
    gaps.push('No direct booking form, booking link, or organiser contact details published.');
  }

  if (hasDeadline) {
    // Bonus confidence
    confidence = 'high';
  } else {
    gaps.push('Application deadline not specified; stalls may allocate on rolling first-come basis.');
  }

  const score = +(scoreFraction * maxWeight).toFixed(1);
  const rationale = `Booking channel: ${urlType.replace(/_/g, ' ')}. Direct vendor link: ${hasVendorUrl ? 'Available' : 'Missing'}.`;

  return {
    score,
    max: maxWeight,
    rationale,
    confidence,
    gaps,
  };
}
