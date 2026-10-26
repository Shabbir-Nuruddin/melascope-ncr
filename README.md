# MelaScope NCR 🎪
### Private Delhi NCR Event Discovery, Stall Evaluation & Venue Intelligence Workspace

MelaScope NCR is a private, product-agnostic intelligence web application for discovering, comparing, and evaluating upcoming melas, fairs, flea markets, exhibitions, festive bazaars, and society events across **Delhi, Gurugram, Noida, Greater Noida, Ghaziabad, and Faridabad**.

---

## 🌟 Key Features

1. **Central Interactive Map & Synchronised Opportunity List**
   - Geocoded venue pins with fit score coloration and live selection synchronisation.
   - Dual-mode map architecture:
     - Automatically leverages **Google Maps JavaScript API** when `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` is configured.
     - Automatically falls back to **Leaflet / OpenStreetMap** with custom vector markers when no Google key is supplied.
   - Comprehensive multi-attribute filters: locality, event type, venue context, date horizon, fit score, max stall fee, verified-only, booking link available, and status.

2. **Venue Map & Internal Floor Plan Viewer (Core Feature)**
   - **Geographic Venue Map**: View exact venue coordinates, address, and Google Maps directions link.
   - **Internal Floor Plan / Stall Layout Viewer**:
     - Interactive in-app pan, zoom (50% to 350%), reset, and full-screen viewer for exhibitor blueprints, hall layouts, and booth numbers.
     - Explicit **"Floor plan not found yet"** state when unannounced—never fabricates layouts.
     - Direct **"Upload Floor Plan"** tool (supports PDF and image files up to 15MB).
     - **"Draft Enquiry for Floor Plan"** action.

3. **Multi-Source Event Discovery Engine**
   - **Seeded Primary Directories**:
     - `BookEventStall` (`https://bookeventstall.com/event-stall-booking/delhi`)
     - `Fleamela` (`https://www.fleamela.com/cities/delhi`)
   - **Public Social Discovery**: Public Instagram and Pinterest snippets and flyers.
   - **External Web Search Adapter**: Configurable for Tavily, Serper, or Google Search.
   - **Curated Authentic Delhi NCR Index**: High-fidelity verified events across Dilli Haat, Blind School, Dastkar Nature Bazaar, Select Citywalk, DLF CyberHub, Noida Haat, Epicentre, and Sunder Nursery.

4. **Transparent AI Commercial Fit Scoring (0–100)**
   - Evaluated dynamically against your **custom product profile** (not hard-coded to any brand or POVA).
   - Six criterion breakdown with adjustable weights:
     - **Product/Category Fit (25%)**: Category restriction checks and format alignment.
     - **Audience & Purchase Intent (20%)**: Destination vs residential footfall context and price tolerance.
     - **Location & Logistics Context (15%)**: NCR city accessibility and transit feasibility.
     - **Event Relevance & Evidence (15%)**: Verification level and source corroboration.
     - **Economics (15%)**: Stall fee compared against user's max budget threshold.
     - **Booking Channel Readiness (10%)**: Direct official vendor form vs generic venue homepage.
   - Separates **Fit Score** from **Research Confidence** (high/medium/low) and discloses specific data gaps.

5. **Universal "Add to MelaScope" Importer**
   - Paste URL (event page, Instagram post, Pinterest pin, Google form).
   - Upload Poster / PDF / Brochure / Screenshot (with automatic OCR and image preview).
   - Paste Text / WhatsApp message / organiser email.
   - Manual event entry.
   - Pre-save review step with automatic duplicate detection.

6. **"Request Missing Details" Enquiry Generator**
   - Automatically detects what information is missing for an event (stall fee, dimensions, GST/electricity, floor plan, footfall calculation).
   - Generates a courteous, tailored enquiry message ready for WhatsApp Web or Email dispatch.
   - Ingests organiser replies and attaches them as factual evidence.

7. **Personal Pipeline & CRM**
   - Statuses: `new`, `saved`, `contacted`, `applied`, `booked`, `rejected`, `archived`.
   - Internal notes, next action date, and deadline reminders.
   - Instant CSV export of all filtered opportunities.

8. **Private Single-User Authentication**
   - Protected by workspace password cookie (`APP_PASSWORD`, defaults to `mela2026`).
   - Configurable development bypass mode (`APP_DISABLE_AUTH=true`).

---

## 🚀 Quick Start (Local Setup)

### Prerequisites
- Node.js 18.x, 20.x, or 24.x
- npm 9+ or pnpm

### 1. Installation
```bash
# Navigate to the project directory
cd melascope-ncr

# Install dependencies
npm install
```

### 2. Environment Configuration
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Default configuration in `.env.local`:
```env
APP_PASSWORD=mela2026
APP_DISABLE_AUTH=true
```

*(Optional keys like `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`, `TAVILY_API_KEY`, and `GEMINI_API_KEY` can be added whenever you want live API calls; the app runs with 100% functionality out of the box in fallback/curated mode).*

### 3. Run Tests
```bash
npm test
```
*Runs Vitest automated test suite covering scoring weights, confidence penalties, deduplication, date validation, and URL classification.*

### 4. Start Development Server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

### 5. Production Build
```bash
npm run build
npm start
```

---

## ⚡ "First 15 Minutes" Guide: Running Your First Scan

1. **Launch the Web App**: Run `npm run dev` and navigate to `http://localhost:3000`.
2. **Review Your Product Profile**: Click on the product pill in the navbar (or click the Settings gear icon). Set your product name, category, price range (e.g. ₹400–₹2,500), and budget cap.
3. **Trigger a Live Scout**:
   - On the top dashboard stats bar, click **"Scout Now"**.
   - The engine contacts BookEventStall and Fleamela, scans Delhi NCR indices, deduplicates candidates, and updates the map.
4. **Inspect Venue & Layout**:
   - Click any event card (e.g. *Dilli Haat INA Grand Diwali Utsav*).
   - View the **Internal Venue Floor Plan & Stall Layout** blueprint with zoom and pan.
   - Check the geocoded venue location on the map.
5. **Draft an Enquiry**:
   - Click **"Request Missing Details"**.
   - Notice how the generator specifically identifies any unconfirmed stall dimension or electricity provisions and generates a one-click WhatsApp message for the organiser.
6. **Export Your Shortlist**:
   - Filter by `Verified Only` or `Has Booking Form`.
   - Click **"Export CSV"** to download your spreadsheet.

---

## 🔌 Integration Status & Credentials Reference

| Integration | Current Status | Setup Requirement | Free Tier Available? |
| :--- | :--- | :--- | :--- |
| **Interactive Map** | **Working (Dual Mode)** | Works immediately via Leaflet/OSM. Add `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` for Google Maps JS tiles. | Yes ($200 monthly free Google credit) |
| **BookEventStall Connector** | **Working** | Seeded and enabled; SSRF-safe crawling. | Free |
| **Fleamela Connector** | **Working** | Seeded and enabled; SSRF-safe crawling. | Free |
| **Curated Delhi NCR Index** | **Working** | Built-in verified calendar of genuine Delhi, Gurugram, and Noida venues. | Free |
| **Web Search Provider** | **Ready (Curated Fallback)** | Optional: add `TAVILY_API_KEY` or `SERPER_API_KEY` to `.env.local` for open-web querying. | Yes (Tavily provides 1,000 free searches/mo) |
| **LLM Provider (Gemini)** | **Ready** | Optional: add `GEMINI_API_KEY` to `.env.local`. | Yes (Google AI Studio free tier) |
| **Database & Storage** | **Working (Persistent File DB)** | Works immediately via local persistent JSON DB (`data/melascope_db.json`). For hosted cloud: use Supabase. | Yes (Supabase free tier) |

---

## 🗄️ Database Schema & Supabase Migrations

For hosting on **Supabase PostgreSQL**:
1. Create a project at [supabase.com](https://supabase.com/).
2. Run the SQL migration scripts in order in the Supabase SQL Editor:
   - `supabase/migrations/001_initial_schema.sql` (Creates PostGIS extensions, `events`, `user_profile`, `research_runs`, `event_sources` tables, and indexes).
   - `supabase/migrations/002_seed_demo_data.sql` (Inserts initial verified Delhi NCR demo opportunities).
3. Set `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` in `.env.local`.

---

## 🔒 Security & Provenance Rules

- **SSRF Prevention**: All crawler requests enforce HTTP/HTTPS protocols, timeout bounds, and block loopback/private IP ranges (`127.0.0.1`, `10.*`, `192.168.*`, `localhost`).
- **Prompt Injection Defense**: All fetched external content is treated strictly as untrusted data strings.
- **Truthfulness Standard**:
  - Unannounced stall fees remain `null`—never estimated or guessed.
  - Footfall is explicitly categorized as `confirmed_official`, `organiser_claim`, `historical`, or `unknown`.
  - Floor plans display `Floor plan not found yet` when unannounced—never substituted with generic stock maps.
  - General venue websites are never mislabeled as stall booking links.

---

## ⚖️ Limitations & Platform Access Disclosures

- **Instagram & Pinterest**: In accordance with platform terms and login walls, direct unauthenticated deep-scraping behind logins is restricted. The app indexes public search snippets and provides seamless user-assisted URL and screenshot importing.
- **Event Fragmentation**: Delhi NCR mela recruitment is partially conducted through RWA WhatsApp groups and personal contacts. The app makes data gaps explicit rather than claiming exhaustive coverage.

---

## 📜 License
Private personal research workspace. All rights reserved.
