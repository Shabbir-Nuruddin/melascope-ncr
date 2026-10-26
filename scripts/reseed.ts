import fs from 'fs';
import path from 'path';
import { getInitialSeedEvents } from '../src/lib/db/seed-data';
import { DEFAULT_PRODUCT_PROFILE, DEFAULT_SCORE_WEIGHTS } from '../src/lib/scoring';
import { DEFAULT_SOURCE_CONNECTORS } from '../src/lib/connectors';

const DB_FILE = path.join(process.cwd(), 'data', 'melascope_db.json');

const events = getInitialSeedEvents();
console.log(`Generating fresh database with ${events.length} events...`);

const db = {
  user_profile: {
    id: 'profile-user-default',
    product_profile: DEFAULT_PRODUCT_PROFILE,
    score_weights: DEFAULT_SCORE_WEIGHTS,
    default_date_horizon_days: 60,
    preferred_localities: ['South Delhi', 'Gurugram', 'Noida', 'Central Delhi', 'West Delhi', 'Ghaziabad', 'Faridabad'],
    source_connectors: DEFAULT_SOURCE_CONNECTORS,
    updated_at: new Date().toISOString(),
  },
  events: events,
  research_runs: [],
};

fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
console.log(`Successfully wrote ${events.length} events to ${DB_FILE}`);
console.log(`Earliest event: ${events[0].title} (${events[0].start_at})`);
console.log(`Latest event: ${events[events.length - 1].title} (${events[events.length - 1].end_at})`);
