export type EventType =
  | 'mela'
  | 'flea_market'
  | 'exhibition'
  | 'festive_market'
  | 'craft_market'
  | 'food_festival'
  | 'society_event'
  | 'lifestyle_expo'
  | 'other';

export type VenueContext = 'residential' | 'office' | 'destination' | 'mixed' | 'unknown';

export type VerificationStatus =
  | 'verified'
  | 'partially_verified'
  | 'unverified'
  | 'expired'
  | 'cancelled'
  | 'stale';

export type UserStatus = 'new' | 'saved' | 'contacted' | 'applied' | 'booked' | 'rejected' | 'archived';

export type BookingUrlType =
  | 'official_vendor_form'
  | 'organizer_booking_page'
  | 'ticketing_platform'
  | 'venue_website'
  | 'none';

export type PricingBasis = 'per_event' | 'per_day' | 'per_sqft' | 'unknown';

export type AttendanceBasis = 'confirmed_official' | 'organiser_claim' | 'historical' | 'inferred' | 'unknown';

export type ConfidenceLevel = 'high' | 'medium' | 'low';

export interface CriterionScore {
  score: number;
  max: number;
  rationale: string;
  confidence: ConfidenceLevel;
  gaps?: string[];
  evidence_citations?: string[];
}

export interface FitBreakdown {
  product_fit: CriterionScore;
  audience_intent: CriterionScore;
  location_context: CriterionScore;
  event_relevance: CriterionScore;
  economics: CriterionScore;
  booking_readiness: CriterionScore;
}

export interface EventSource {
  url: string;
  title: string;
  source_type:
    | 'official_organizer'
    | 'official_venue'
    | 'booking_form'
    | 'social_page'
    | 'instagram'
    | 'pinterest'
    | 'bookeventstall'
    | 'fleamela'
    | 'news_listing'
    | 'secondary_directory'
    | 'user_import';
  last_verified_at: string;
  excerpt?: string;
  supports_fields?: string[];
}

export interface FloorPlan {
  id: string;
  file_url: string;
  file_type: 'image' | 'pdf';
  title: string;
  source_url?: string;
  is_official: boolean;
  version?: string;
  uploaded_at: string;
}

export interface MelaEvent {
  id: string;
  title: string;
  event_type: EventType;
  description: string;
  start_at: string; // ISO 8601
  end_at: string;   // ISO 8601
  timezone: string; // 'Asia/Kolkata'
  opening_hours?: string;
  venue_name: string;
  address: string;
  locality: string;
  city: 'Delhi' | 'Gurugram' | 'Noida' | 'Greater Noida' | 'Ghaziabad' | 'Faridabad' | string;
  state: string;
  latitude: number;
  longitude: number;
  geocode_confidence: 'high' | 'medium' | 'low' | 'approximate';
  organizer_name: string;
  organizer_email?: string;
  organizer_phone?: string;
  official_event_url?: string;
  vendor_booking_url?: string;
  booking_url_type: BookingUrlType;
  
  // Stall pricing and dimensions
  stall_fee_min?: number | null;
  stall_fee_max?: number | null;
  pricing_basis: PricingBasis;
  currency: 'INR';
  stall_width_ft?: number | null;
  stall_depth_ft?: number | null;
  stall_area_sqft?: number | null;
  security_deposit?: number | null;
  electricity_charges_included?: boolean | null;
  gst_included?: boolean | null;

  application_deadline?: string | null;
  availability_status: 'open' | 'waitlist' | 'closing_soon' | 'sold_out' | 'closed' | 'unknown';
  included_facilities: string[];
  category_restrictions: string[];
  venue_context: VenueContext;
  venue_context_rationale: string;
  verification_status: VerificationStatus;

  // Footfall intelligence
  expected_footfall_text?: string;
  expected_attendance_stated?: number | null;
  historical_attendance_info?: string;
  attendance_basis: AttendanceBasis;
  target_audience_demographics?: string;

  // Floor plan & internal layout
  floor_plan?: FloorPlan | null;
  has_floor_plan: boolean;

  // AI intelligence
  fit_score: number; // 0 - 100
  fit_breakdown: FitBreakdown;
  overall_confidence: ConfidenceLevel;
  uncertainties: string[];
  recommendation: string;

  // Provenance & demo flag
  source_urls: EventSource[];
  last_verified_at: string;
  created_at: string;
  updated_at: string;
  user_status: UserStatus;
  user_notes?: string;
  next_action_at?: string | null;
  is_demo?: boolean;
}

export interface ProductProfile {
  product_name: string;
  category: string;
  description: string;
  price_range_min: number;
  price_range_max: number;
  target_audience: string;
  stall_footprint: string;
  staffing_count: number;
  transport_mode: string;
  max_budget_per_event: number;
  inventory_capacity: string;
  business_objectives: string[];
}

export interface ScoreWeights {
  product_fit: number;      // default 25
  audience_intent: number;  // default 20
  location_context: number; // default 15
  event_relevance: number;  // default 15
  economics: number;        // default 15
  booking_readiness: number;// default 10
}

export interface SourceConnectorConfig {
  id: string;
  name: string;
  url: string;
  type: 'directory' | 'social_instagram' | 'social_pinterest' | 'web_search' | 'rss';
  enabled: boolean;
  status: 'working' | 'needs_credentials' | 'restricted' | 'error';
  last_checked_at?: string;
  last_success_at?: string;
  last_error?: string;
  events_found_count: number;
}

export interface UserProfile {
  id: string;
  product_profile: ProductProfile;
  score_weights: ScoreWeights;
  default_date_horizon_days: number;
  preferred_localities: string[];
  source_connectors: SourceConnectorConfig[];
  updated_at: string;
}

export interface ResearchLogEntry {
  timestamp: string;
  level: 'info' | 'warn' | 'success' | 'error';
  message: string;
}

export interface ResearchRun {
  id: string;
  started_at: string;
  completed_at?: string;
  query: string;
  date_from: string;
  date_to: string;
  status: 'running' | 'completed' | 'failed';
  summary: string;
  source_count: number;
  events_found: number;
  logs: ResearchLogEntry[];
  error?: string;
  source_breakdown?: Record<string, { attempted: number; succeeded: number; error?: string }>;
}

export interface EventFilters {
  searchQuery?: string;
  locality?: string;
  city?: string;
  eventType?: string;
  venueContext?: string;
  dateHorizonDays?: number;
  startDate?: string;
  endDate?: string;
  minScore?: number;
  minFitScore?: number;
  maxStallFee?: number;
  verifiedOnly?: boolean;
  bookingLinkOnly?: boolean;
  hasBookingLink?: boolean;
  hasFloorPlanOnly?: boolean;
  userStatus?: string;
  sortBy?: 'fit_score' | 'date' | 'start_at' | 'stall_fee' | 'fee_asc' | 'fee_desc' | 'confidence';
}
