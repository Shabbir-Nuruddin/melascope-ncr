export interface MelaMailer {
  id: string;
  eventId?: string;
  eventTitle: string;
  organizerName: string;
  organizerEmail: string;
  organizerPhone?: string;
  circularTitle: string;
  circularDate: string;
  deadlineDate: string;
  locality: string;
  city: string;
  stallFeeRange: string;
  stallDimensions: string;
  powerAndFacilities: string[];
  productCategoriesAllowed: string[];
  productCategoriesProhibited: string[];
  officialCircularText: string;
  bookingFormUrl?: string;
  bookingUrlType: 'official_vendor_form' | 'contact_organizer' | 'whatsapp' | 'email';
  mailerStatus: 'active_callout' | 'closing_soon' | 'waitlist_only';
}

export const NCR_ORGANISER_MAILERS: MelaMailer[] = [
  {
    id: 'mailer-blind-relief-2026',
    eventId: 'mela-blind-relief-2026',
    eventTitle: 'The Blind Relief Association Diwali Bazaar 2026',
    organizerName: 'The Blind Relief Association, Delhi (Bazaar Secretariat)',
    organizerEmail: 'bazaar@blindrelief.org',
    organizerPhone: '+91-11-65650969',
    circularTitle: 'Official Circular: Exhibitor Application Guidelines & Stall Booking (50th Edition)',
    circularDate: '2026-09-15',
    deadlineDate: '2026-10-25',
    locality: 'Lodhi Road',
    city: 'Delhi',
    stallFeeRange: '₹35,000 – ₹60,000 (7-day festive run)',
    stallDimensions: '8 ft × 6 ft and 10 ft × 10 ft waterproof canopies',
    powerAndFacilities: [
      'Pre-fabricated waterproof German hangar booth',
      '2 Standard wooden tables (6x2 ft) with white frilled draping',
      '2 Metal folding chairs',
      'Single 5A/15A socket (max 500W load for LED spotlighting)',
      'Overnight secure perimeter patrol by Delhi Police & private security',
    ],
    productCategoriesAllowed: [
      'Artisanal handcrafted candles & home fragrances',
      'Diwali festive lifestyle, brass lamps, and torans',
      'Apparel, handloom stoles, and festive gifting hampers',
      'Handmade terracotta, ceramic tableware, and wellness items',
    ],
    productCategoriesProhibited: [
      'Firecrackers or hazardous flammable chemical goods',
      'Unbranded mass-imported plastic toys and gadgets',
      'Single-use plastic packaging (strict zero-plastic compliance)',
    ],
    officialCircularText: `RESPECTED EXHIBITORS & CRAFT PRACTITIONERS,

The Blind Relief Association cordially invites applications for stall allotment at our 50th Annual Diwali Bazaar. Stall allotment is governed by a juried screening process prioritizing authentic craftwork, high ethical production standards, and quality presentation.

All proceeds from stall rentals directly fund educational, vocational, and rehabilitation services for visually impaired students. 

PROCEDURE:
1. Complete the verified online form or visit our Lodhi Road office with 3 physical product samples.
2. Shortlisted applicants will receive allotment letters and fee payment vouchers via registered email.
3. Full advance payment and ₹5,000 refundable security deposit must be cleared within 72 hours of approval.`,
    bookingFormUrl: 'https://forms.gle/blind-relief-diwali-vendor-portal-2026',
    bookingUrlType: 'official_vendor_form',
    mailerStatus: 'closing_soon',
  },
  {
    id: 'mailer-dastkar-lights-2026',
    eventId: 'mela-dastkar-festival-lights-2026',
    eventTitle: 'Dastkar Festival of Lights 2026',
    organizerName: 'Dastkar Society for Crafts & Craftspeople',
    organizerEmail: 'delhi.bazaar@dastkar.org',
    organizerPhone: '+91-11-26808610',
    circularTitle: 'Vendor Prospectus & Craft Participation Callout: Diwali Edition',
    circularDate: '2026-09-20',
    deadlineDate: '2026-10-22',
    locality: 'Andheria Mor / Chattarpur',
    city: 'Delhi',
    stallFeeRange: '₹22,000 – ₹38,000 (12-day run)',
    stallDimensions: '3m × 3m open-front craft pavilion',
    powerAndFacilities: [
      'Bamboo-framed thatched nature pavilion',
      '3 Display tables & 2 woven stools',
      'Spotlighting kit (2 LED focus fixtures)',
      'Common artisan rest lounge and sanitised water points',
      'Central billing / POS terminal support for craftspeople',
    ],
    productCategoriesAllowed: [
      'Handwoven textiles, ikat, ajrakh, chanderi garments',
      'Festive copperware, bell metal, and kansa utensils',
      'Organic cold-pressed oils, natural incense, and beeswax candles',
      'Pottery, blue pottery, and studio ceramics',
    ],
    productCategoriesProhibited: [
      'Machine-made powerloom textiles masquerading as handloom',
      'Synthetic chemical fragrances and aerosols',
      'Non-craft commercial reseller items without artisan credentials',
    ],
    officialCircularText: `DEAR ARTISANS, SELF-HELP GROUPS & DESIGN ENTREPRENEURS,

Dastkar Nature Bazaar, Kisan Haat, Andheria Mor invites craft communities and sustainable designers to apply for the Festival of Lights 2026. This 12-day celebration connects conscious urban consumers with traditional craft excellence.

STALL INCLUSIONS:
Each standard 3m x 3m booth includes overhead weatherproof awning, tables, signage banner, and listing in our daily visitor directory brochure.

SELECTION CRITERIA:
Authenticity, environmental footprint of packaging, and festival-season gifting readiness. Early applications are strongly recommended as spaces in the central pavilion are limited.`,
    bookingFormUrl: 'https://dastkar.org/exhibitor-portal-diwali-2026',
    bookingUrlType: 'official_vendor_form',
    mailerStatus: 'active_callout',
  },
  {
    id: 'mailer-earth-collective-2026',
    eventId: 'mela-sunder-nursery-earth-collective-2026',
    eventTitle: 'The Earth Collective Festive Market @ Sunder Nursery',
    organizerName: 'The Earth Collective & Aga Khan Trust for Culture',
    organizerEmail: 'collaborate@theearthcollective.in',
    organizerPhone: '+91-98112-45452',
    circularTitle: 'Weekly & Festive Artisan Callout: Sunder Nursery Heritage Grounds',
    circularDate: '2026-10-01',
    deadlineDate: '2026-11-05',
    locality: 'Nizamuddin / Heritage Park',
    city: 'Delhi',
    stallFeeRange: '₹4,500 – ₹7,500 per weekend / ₹15,000 4-day festive pass',
    stallDimensions: '6 ft wooden harvest table with canvas parasol',
    powerAndFacilities: [
      'Wooden garden table (6x2.5 ft) with burlap table runner',
      '2 Director wooden chairs',
      'Canvas sun parasol',
      'Eco-friendly compost collection bins at every stall cluster',
      'Heritage garden park location with affluent footfall',
    ],
    productCategoriesAllowed: [
      'Farm-to-table natural food preserves, artisanal honeys, herbal teas',
      'Clean beauty, handcrafted cold process soaps, aromatherapy',
      'Botanical ceramics, recycled paper stationery, and studio crafts',
      'Handmade festive decor made from wood, clay, or natural fibers',
    ],
    productCategoriesProhibited: [
      'Single-use plastic bottles, cling wrap, or plastic bags',
      'Petrochemical waxes (paraffin candles not permitted)',
      'Ultra-processed snacks with artificial preservatives',
    ],
    officialCircularText: `CALL FOR CONSCIOUS BRANDS & NATURE-FIRST MAKERS:

The Earth Collective invites lifestyle and wellness brands to join our weekend festival editions nestled amongst the 16th-century Mughal monuments of Sunder Nursery.

AUDIENCE PROFILE:
Over 6,000 discerning weekend visitors per day—families, cultural enthusiasts, diplomats, and conscious consumers seeking pure, authentic products.

To maintain our organic integrity, all prospective brands undergo ingredient review. Bring your own reusable packaging and solar/battery display lighting.`,
    bookingFormUrl: 'https://forms.gle/earth-collective-vendor-callout',
    bookingUrlType: 'official_vendor_form',
    mailerStatus: 'active_callout',
  },
  {
    id: 'mailer-german-christmas-2026',
    eventId: 'mela-german-christmas-market-2026',
    eventTitle: 'German Christmas Market 2026 (28th Edition)',
    organizerName: 'Indo-German Chamber of Commerce (IGCC)',
    organizerEmail: 'delhi.christmasmarket@indo-german.com',
    organizerPhone: '+91-11-45021100',
    circularTitle: 'Exhibitor Prospectus & Early-Bird Vendor Registration: German Christmas Market',
    circularDate: '2026-10-05',
    deadlineDate: '2026-11-15',
    locality: 'Chanakyapuri / Central Delhi',
    city: 'Delhi',
    stallFeeRange: '₹42,000 – ₹75,000 (Weekend Extravaganza)',
    stallDimensions: 'Chalet-style 2.5m × 2m wooden pavilion',
    powerAndFacilities: [
      'Authentic Bavarian wooden chalet façade with decorative fairy lights',
      '2 Heavy-duty display tables and 2 chairs',
      'Dedicated 16A power connection for decorative lighting',
      'Listing in the official German Embassy & IGCC festive brochure',
      'VIP lounge access for registered exhibitors',
    ],
    productCategoriesAllowed: [
      'European festive confectioneries, gingerbread, stollen, chocolates',
      'Handcrafted Christmas tree ornaments, glass baubles, nativity sets',
      'Designer winter lifestyle, cashmere, leather goods, luxury gifting',
      'Specialty coffee, artisanal bakery, and gourmet festive provisions',
    ],
    productCategoriesProhibited: [
      'Non-festive generic electronic surplus',
      'Open-flame cooking inside standard wooden chalets',
      'Sub-letting of allocated booth space to unvetted third parties',
    ],
    officialCircularText: `INDO-GERMAN CHAMBER OF COMMERCE OFFICIAL INVITATION:

The 28th Annual German Christmas Market will take place in the lush open grounds of Central Delhi. Attracting over 15,000 high-net-worth visitors, ambassadors, corporate executives, and expatriate families over two festive days.

EARLY-BIRD DETAILS:
Applications received prior to November 10 qualify for preferential chalet positioning near the main cultural stage and Christmas tree carousel.

Strict curated allocation ensures non-competing product categories within each chalet quadrant.`,
    bookingFormUrl: 'https://indo-german.com/events/german-christmas-market-delhi-2026/exhibitors',
    bookingUrlType: 'official_vendor_form',
    mailerStatus: 'active_callout',
  },
  {
    id: 'mailer-dlf-cyberhub-2026',
    eventId: 'mela-dlf-cyberhub-winter-flea-2026',
    eventTitle: 'DLF CyberHub Festive Flea & Pop-Up Boulevard 2026',
    organizerName: 'DLF Retail & HighStreet Events Division',
    organizerEmail: 'retail.popups@dlf.in',
    organizerPhone: '+91-124-4334000',
    circularTitle: 'Vendor Expression of Interest: CyberHub Winter Weekend Pop-Ups',
    circularDate: '2026-10-10',
    deadlineDate: '2026-11-12',
    locality: 'DLF Phase 2 / Cyber City',
    city: 'Gurugram',
    stallFeeRange: '₹18,000 – ₹28,000 per 3-day weekend (Fri-Sun)',
    stallDimensions: '6 ft × 4 ft illuminated kiosk counter or canopy',
    powerAndFacilities: [
      'Architectural canopy booth with track LED downlighting',
      '1 Front display counter + 1 back inventory table',
      'Direct mall-grade Wi-Fi and UPI payment terminal stability',
      'Access to CyberHub evening corporate and weekend dining footfall',
    ],
    productCategoriesAllowed: [
      'Contemporary D2C apparel, designer eyewear, accessories',
      'Gourmet artisanal chocolates, festive hamper collections',
      'Premium home fragrances, scented candles, and ceramics',
      'High-end pet accessories and quirky designer lifestyle goods',
    ],
    productCategoriesProhibited: [
      'Categories clashing directly with anchor tenant brick-and-mortar stores',
      'Raw unhygienic unpackaged food items',
    ],
    officialCircularText: `CALL FOR D2C & BOUTIQUE LIFESTYLE POP-UPS:

DLF CyberHub presents the Winter Pop-Up Boulevard. Positioned in the bustling central open amphitheater promenade connecting Fortune 500 tech campuses with premium dining destinations.

FOOTFALL METRICS:
Average weekend footfall exceeds 35,000 corporate professionals, expat residents, and high-income Gurugram millennial shoppers.

Vendors must provide high-aesthetic product displays adhering to DLF retail visual merchandising guidelines.`,
    bookingFormUrl: 'https://forms.gle/dlf-cyberhub-winter-popup-2026',
    bookingUrlType: 'official_vendor_form',
    mailerStatus: 'active_callout',
  },
  {
    id: 'mailer-select-citywalk-2026',
    eventId: 'mela-select-citywalk-diwali-bazaar-2026',
    eventTitle: 'Select Citywalk Grand Diwali Courtyard Flea 2026',
    organizerName: 'Select Citywalk Management & Flea India Events',
    organizerEmail: 'flea@selectcitywalk.com',
    organizerPhone: '+91-11-42114200',
    circularTitle: 'Vendor Allotment Circular: Outdoor Courtyard Festive Bazaar',
    circularDate: '2026-09-28',
    deadlineDate: '2026-10-24',
    locality: 'Saket District Centre',
    city: 'Delhi',
    stallFeeRange: '₹40,000 – ₹65,000 (4-day festive weekend run)',
    stallDimensions: '8 ft × 6 ft luxury fairy-lit gazebo canopy',
    powerAndFacilities: [
      'White pagoda canopy with warm fairy-light canopy ceiling',
      '2 Standard wooden display tables with tablecloths',
      '2 Padded banquet chairs',
      'High footfall courtyard location right opposite Zara and H&M entrance',
      '24/7 security with mall CCTV coverage',
    ],
    productCategoriesAllowed: [
      'Designer ethnic wear, fusion festive jewelry, silver ornaments',
      'Luxury diwali hampers, dry fruit gifting boxes, artisanal sweets',
      'Hand-poured soy wax candles, brass diffusers, festive table runners',
      'Curated lifestyle and bespoke festive gifting accessories',
    ],
    productCategoriesProhibited: [
      'Bargain bin discounted surplus clothing',
      'Cheap plastic festival toys',
      'Any fireworks, matches, or combustible products',
    ],
    officialCircularText: `ATTENTION VENDORS & FESTIVE BRANDS:

The outdoor central plaza of Select CITYWALK, Saket transforms into Delhi's most sought-after festive bazaar. Reach over 80,000 shoppers during peak Diwali gifting week.

ELIGIBILITY:
Brands must demonstrate strong visual brand identity, social media presence, and gift packaging capability. Spaces are allotted strictly on product distinctiveness and aesthetic compliance.`,
    bookingFormUrl: 'https://forms.gle/select-citywalk-diwali-2026',
    bookingUrlType: 'official_vendor_form',
    mailerStatus: 'closing_soon',
  },
  {
    id: 'mailer-jaypee-greens-2026',
    eventId: 'mela-jaypee-greens-diwali-utsav-2026',
    eventTitle: 'Jaypee Greens Wish Town Diwali Carnival & Flea 2026',
    organizerName: 'Wish Town Residents Welfare Federation & Noida Events Hub',
    organizerEmail: 'rwa.events@jaypeegreens.org',
    organizerPhone: '+91-98711-88992',
    circularTitle: 'Society Resident & Guest Vendor Notice: 2026 Annual Diwali Mela',
    circularDate: '2026-10-02',
    deadlineDate: '2026-10-28',
    locality: 'Sector 128 / Noida Expressway',
    city: 'Noida',
    stallFeeRange: '₹12,000 – ₹18,000 (Weekend run)',
    stallDimensions: '8 ft × 8 ft canopy with table display',
    powerAndFacilities: [
      '8x8 ft Waterproof canopy',
      '2 Tables and 2 chairs',
      '1 Light point & 1 5A charging point',
      'Direct captive residential audience of 8,500+ resident families',
    ],
    productCategoriesAllowed: [
      'Home decor, festive lighting, bed linens, cushion covers',
      'Festive ethnic wear, suits, kurtis, kids festive wear',
      'Bakery, chocolates, healthy snacking, diwali sweets',
      'Eco-friendly clay diyas, rangoli stencils, organic colors',
    ],
    productCategoriesProhibited: [
      'Loud external audio speakers at individual stalls',
      'Commercial plastic disposable dinnerware',
    ],
    officialCircularText: `RESIDENTS & COMMERCIAL VENDORS:

Jaypee Greens Wish Town cordially announces the 2026 Annual Diwali Carnival. Held at the central sports and clubhouse complex, this carnival draws over 10,000 residents across Klassic, Pavilion, Aman, and Imperial sectors.

Ideal for boutique home entrepreneurs, festive lifestyle creators, and kids apparel brands. Resident discounts apply upon submitting flat ownership or tenant registration proof.`,
    bookingFormUrl: 'https://forms.gle/jaypee-greens-utsav-vendor',
    bookingUrlType: 'official_vendor_form',
    mailerStatus: 'active_callout',
  },
  {
    id: 'mailer-club-patio-2026',
    eventId: 'mela-club-patio-gurugram-utsav-2026',
    eventTitle: 'Club Patio Annual Diwali & Winter Flea Utsav 2026',
    organizerName: 'Patio Clubs Management & Nirvana Lifestyle Group',
    organizerEmail: 'events@clubpatio.com',
    organizerPhone: '+91-124-4585100',
    circularTitle: 'Official Exhibitor Circular: Club Patio Lawns Diwali Flea',
    circularDate: '2026-09-25',
    deadlineDate: '2026-10-26',
    locality: 'South City 1',
    city: 'Gurugram',
    stallFeeRange: '₹14,000 – ₹22,000 (2-day weekend event)',
    stallDimensions: '8 ft × 6 ft lawn canopy',
    powerAndFacilities: [
      'Canopy structure over manicured lawn turf',
      '2 Display tables with green skirting',
      '2 Chairs and 1 overhead warm LED bulb',
      'Valet parking pass for 1 vendor vehicle',
      'Access to exclusive Club Patio members and Millennium City residents',
    ],
    productCategoriesAllowed: [
      'Designer jewellery, silver trinkets, semi-precious stone ornaments',
      'Festive apparel, embroidered jackets, shawls, and pashminas',
      'Organic wellness, bath salts, scented candles, essential oils',
      'Festive crockery, wooden platters, and Diwali gift hampers',
    ],
    productCategoriesProhibited: [
      'Food stalls cooking without prior commercial kitchen NOC',
      'Unlicensed counterfeit designer dupes',
    ],
    officialCircularText: `EXHIBITOR CIRCULAR: CLUB PATIO GURUGRAM

Club Patio invites select vendors to participate in our annual Diwali & Pre-Winter Utsav. Set in the lush outdoor amphitheatre and pool lawns of South City 1, Gurugram.

Targeting our exclusive membership base of senior corporate executives, entrepreneurs, and South City residents looking for premium festive lifestyle additions.`,
    bookingFormUrl: 'https://clubpatio.com/events/diwali-flea-2026',
    bookingUrlType: 'contact_organizer',
    mailerStatus: 'active_callout',
  },
];
