-- MelaScope NCR - Initial Database Schema
-- Compatible with Supabase Postgres and PostGIS

-- Enable UUID and PostGIS extensions if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- 1. User Profile Table
CREATE TABLE IF NOT EXISTS user_profile (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_profile JSONB NOT NULL DEFAULT '{
    "product_name": "Handcrafted Soy Candles & Festive Aromatics",
    "category": "Home Fragrance & Artisan Decor",
    "description": "Hand-poured beeswax and soy candles, ceramic diffusers, and festive holiday gift hampers.",
    "price_range_min": 450,
    "price_range_max": 2200,
    "target_audience": "Urban professionals, home decor enthusiasts, festive gift buyers, families seeking premium artisan crafts.",
    "stall_footprint": "Standard 6x6 ft canopy or 1 single 6ft table display",
    "staffing_count": 2,
    "transport_mode": "Personal hatchback or sedan car",
    "max_budget_per_event": 25000,
    "inventory_capacity": "150 - 300 units per weekend",
    "business_objectives": ["Direct retail sales", "Brand awareness in Delhi NCR", "Collecting B2B corporate gifting leads"]
  }'::jsonb,
  score_weights JSONB NOT NULL DEFAULT '{
    "product_fit": 25,
    "audience_intent": 20,
    "location_context": 15,
    "event_relevance": 15,
    "economics": 15,
    "booking_readiness": 10
  }'::jsonb,
  default_date_horizon_days INTEGER NOT NULL DEFAULT 45,
  preferred_localities TEXT[] DEFAULT ARRAY['South Delhi', 'Gurugram', 'Noida', 'Central Delhi'],
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. Events Table
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  event_type TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  start_at TIMESTAMPTZ NOT NULL,
  end_at TIMESTAMPTZ NOT NULL,
  timezone TEXT NOT NULL DEFAULT 'Asia/Kolkata',
  opening_hours TEXT,
  venue_name TEXT NOT NULL,
  address TEXT NOT NULL,
  locality TEXT NOT NULL,
  city TEXT NOT NULL DEFAULT 'Delhi',
  state TEXT NOT NULL DEFAULT 'Delhi',
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  geocode_confidence TEXT NOT NULL DEFAULT 'high',
  organizer_name TEXT NOT NULL,
  organizer_email TEXT,
  organizer_phone TEXT,
  official_event_url TEXT,
  vendor_booking_url TEXT,
  booking_url_type TEXT NOT NULL DEFAULT 'none',
  stall_fee_min NUMERIC,
  stall_fee_max NUMERIC,
  currency TEXT NOT NULL DEFAULT 'INR',
  application_deadline TIMESTAMPTZ,
  availability_status TEXT NOT NULL DEFAULT 'open',
  included_facilities TEXT[] DEFAULT ARRAY[]::TEXT[],
  category_restrictions TEXT[] DEFAULT ARRAY[]::TEXT[],
  venue_context TEXT NOT NULL DEFAULT 'destination',
  venue_context_rationale TEXT NOT NULL DEFAULT '',
  verification_status TEXT NOT NULL DEFAULT 'verified',
  fit_score INTEGER NOT NULL DEFAULT 70,
  fit_breakdown JSONB NOT NULL DEFAULT '{}'::jsonb,
  overall_confidence TEXT NOT NULL DEFAULT 'medium',
  uncertainties TEXT[] DEFAULT ARRAY[]::TEXT[],
  recommendation TEXT NOT NULL DEFAULT '',
  source_urls JSONB NOT NULL DEFAULT '[]'::jsonb,
  last_verified_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  user_status TEXT NOT NULL DEFAULT 'new',
  user_notes TEXT,
  next_action_at TIMESTAMPTZ
);

-- Indexes for lightning-fast querying across filters
CREATE INDEX IF NOT EXISTS idx_events_start_at ON events (start_at);
CREATE INDEX IF NOT EXISTS idx_events_city ON events (city);
CREATE INDEX IF NOT EXISTS idx_events_locality ON events (locality);
CREATE INDEX IF NOT EXISTS idx_events_event_type ON events (event_type);
CREATE INDEX IF NOT EXISTS idx_events_venue_context ON events (venue_context);
CREATE INDEX IF NOT EXISTS idx_events_verification_status ON events (verification_status);
CREATE INDEX IF NOT EXISTS idx_events_user_status ON events (user_status);
CREATE INDEX IF NOT EXISTS idx_events_fit_score ON events (fit_score DESC);

-- 3. Research Runs Table
CREATE TABLE IF NOT EXISTS research_runs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  started_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  completed_at TIMESTAMPTZ,
  query TEXT NOT NULL,
  date_from TIMESTAMPTZ NOT NULL,
  date_to TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'running',
  summary TEXT NOT NULL DEFAULT '',
  source_count INTEGER NOT NULL DEFAULT 0,
  events_found INTEGER NOT NULL DEFAULT 0,
  logs JSONB NOT NULL DEFAULT '[]'::jsonb,
  error TEXT
);

-- 4. Event Sources (Normalized audit trail)
CREATE TABLE IF NOT EXISTS event_sources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  source_type TEXT NOT NULL,
  source_title TEXT NOT NULL,
  published_at TIMESTAMPTZ,
  checked_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  evidence_excerpt TEXT,
  supports_fields JSONB DEFAULT '[]'::jsonb
);

-- Security: Row Level Security (RLS)
ALTER TABLE user_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE research_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_sources ENABLE ROW LEVEL SECURITY;

-- Single owner policies
CREATE POLICY "Allow single owner full access on user_profile" ON user_profile FOR ALL USING (true);
CREATE POLICY "Allow single owner full access on events" ON events FOR ALL USING (true);
CREATE POLICY "Allow single owner full access on research_runs" ON research_runs FOR ALL USING (true);
CREATE POLICY "Allow single owner full access on event_sources" ON event_sources FOR ALL USING (true);
