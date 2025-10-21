import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbPath = join(__dirname, '../db/taraweeh.db');
const db = new Database(dbPath);

// Migration to add section and audio_url columns
try {
  console.log('Starting migration to add section and audio_url columns...');

  // Add audio_url column
  db.exec(`
    ALTER TABLE recordings ADD COLUMN audio_url TEXT;
  `);
  console.log('✓ Added audio_url column');

  // Add section column
  db.exec(`
    ALTER TABLE recordings ADD COLUMN section TEXT;
  `);
  console.log('✓ Added section column');

  // Update source CHECK constraint to include 'direct'
  // SQLite doesn't support modifying CHECK constraints directly,
  // so we need to create a new table and migrate data
  db.exec(`
    BEGIN TRANSACTION;

    -- Create new table with updated schema
    CREATE TABLE recordings_new (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      hafidh_id INTEGER NOT NULL,
      venue_id INTEGER NOT NULL,
      hijri_year INTEGER NOT NULL,
      url TEXT NOT NULL UNIQUE,
      source TEXT NOT NULL CHECK(source IN ('youtube', 'soundcloud', 'direct')),
      audio_url TEXT,
      section TEXT,
      title TEXT,
      description TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (hafidh_id) REFERENCES huffadh(id) ON DELETE CASCADE,
      FOREIGN KEY (venue_id) REFERENCES venues(id) ON DELETE CASCADE
    );

    -- Copy data from old table
    INSERT INTO recordings_new (id, hafidh_id, venue_id, hijri_year, url, source, audio_url, section, title, description, created_at, updated_at)
    SELECT id, hafidh_id, venue_id, hijri_year, url, source, audio_url, section, title, description, created_at, updated_at
    FROM recordings;

    -- Drop old table
    DROP TABLE recordings;

    -- Rename new table
    ALTER TABLE recordings_new RENAME TO recordings;

    -- Recreate indexes
    CREATE INDEX idx_recordings_hafidh ON recordings(hafidh_id);
    CREATE INDEX idx_recordings_venue ON recordings(venue_id);
    CREATE INDEX idx_recordings_year ON recordings(hijri_year);
    CREATE INDEX idx_recordings_source ON recordings(source);
    CREATE INDEX idx_recordings_section ON recordings(section);

    COMMIT;
  `);
  console.log('✓ Updated source CHECK constraint to include "direct"');
  console.log('✓ Created index on section column');

  console.log('\n✅ Migration completed successfully!');
} catch (error) {
  console.error('❌ Migration failed:', error);
  process.exit(1);
} finally {
  db.close();
}
