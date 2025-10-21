import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbPath = join(__dirname, '../db/taraweeh.db');

interface CSVRow {
  reciterName: string;
  title: string;
  link: string;
  venue: string;
  city: string;
  year: string;
}

/**
 * Parse CSV content (semicolon-separated)
 */
function parseCSV(content: string): CSVRow[] {
  const lines = content.trim().split('\n');
  const rows: CSVRow[] = [];

  // Skip header row
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const parts = line.split(';');
    if (parts.length < 6) continue;

    rows.push({
      reciterName: parts[0].trim(),
      title: parts[1].trim(),
      link: parts[2].trim(),
      venue: parts[3].trim(),
      city: parts[4].trim(),
      year: parts[5].trim()
    });
  }

  return rows;
}

/**
 * Extract section from title
 * Title format: "Taraweeh 1446 | Reciter Name | Night X" or other formats
 */
function extractSectionFromTitle(title: string): string | null {
  // Extract everything after the last pipe
  const parts = title.split('|').map(p => p.trim());

  if (parts.length >= 3) {
    // Last part is likely the section (e.g., "Night 18")
    return parts[parts.length - 1];
  }

  return null;
}

/**
 * Import CSV data into database
 */
async function importCSV(csvPath: string) {
  const db = new Database(dbPath);

  try {
    console.log(`Reading CSV from: ${csvPath}`);
    const csvContent = readFileSync(csvPath, 'utf-8');
    const rows = parseCSV(csvContent);

    console.log(`Found ${rows.length} recordings in CSV`);

    const insertHafidh = db.prepare(`
      INSERT OR IGNORE INTO huffadh (name) VALUES (?)
    `);

    const getHafidhId = db.prepare(`
      SELECT id FROM huffadh WHERE name = ?
    `);

    const insertVenue = db.prepare(`
      INSERT OR IGNORE INTO venues (name, city) VALUES (?, ?)
    `);

    const getVenueId = db.prepare(`
      SELECT id FROM venues WHERE name = ? AND city = ?
    `);

    const insertRecording = db.prepare(`
      INSERT OR IGNORE INTO recordings
      (hafidh_id, venue_id, hijri_year, url, source, section, title)
      VALUES (?, ?, ?, ?, 'youtube', ?, ?)
    `);

    let imported = 0;
    let skipped = 0;

    for (const row of rows) {
      // Insert hafidh
      insertHafidh.run(row.reciterName);
      const hafidhRow = getHafidhId.get(row.reciterName) as any;

      if (!hafidhRow) {
        console.log(`⚠ Could not find hafidh: ${row.reciterName}`);
        skipped++;
        continue;
      }

      // Insert venue
      const venueName = row.venue || 'Unknown';
      const cityName = row.city || 'Unknown';
      insertVenue.run(venueName, cityName);

      const venueRow = getVenueId.get(venueName, cityName) as any;
      if (!venueRow) {
        console.log(`⚠ Could not find venue: ${venueName}, ${cityName}`);
        skipped++;
        continue;
      }

      // Extract section from title
      const section = extractSectionFromTitle(row.title);

      // Insert recording
      try {
        insertRecording.run(
          hafidhRow.id,
          venueRow.id,
          parseInt(row.year),
          row.link,
          section,
          row.title
        );
        imported++;
        console.log(`✓ Imported: ${row.title}`);
      } catch (error: any) {
        if (error.message.includes('UNIQUE constraint failed')) {
          console.log(`→ Already exists: ${row.title}`);
          skipped++;
        } else {
          throw error;
        }
      }
    }

    console.log(`\n✅ Import complete: ${imported} imported, ${skipped} skipped`);

  } finally {
    db.close();
  }
}

// Main execution
async function main() {
  const csvPath = process.argv[2] || '/home/ridhwaanmayet/Downloads/temp downloads/Taraweeh 1446 Recitations New.csv';

  try {
    console.log('📊 Starting CSV import...\n');
    await importCSV(csvPath);
  } catch (error) {
    console.error('❌ Import failed:', error);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { importCSV, parseCSV };
