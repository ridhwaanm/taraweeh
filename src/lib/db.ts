import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize database
const dbPath = join(__dirname, '../../db/taraweeh.db');
export const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Initialize schema
const schemaPath = join(__dirname, '../../db/schema.sql');
const schema = readFileSync(schemaPath, 'utf-8');
db.exec(schema);

// Types
export interface Hafidh {
  id: number;
  name: string;
  created_at: string;
}

export interface Venue {
  id: number;
  name: string;
  city: string;
  created_at: string;
}

export interface Recording {
  id: number;
  hafidh_id: number;
  venue_id: number;
  hijri_year: number;
  url: string;
  source: 'youtube' | 'soundcloud';
  title?: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface RecordingWithDetails extends Recording {
  hafidh_name: string;
  venue_name: string;
  city: string;
}

// Prepared statements for huffadh
export const getHuffadh = db.prepare('SELECT * FROM huffadh ORDER BY name');
export const getHafidhById = db.prepare('SELECT * FROM huffadh WHERE id = ?');
export const insertHafidh = db.prepare('INSERT INTO huffadh (name) VALUES (?)');

// Prepared statements for venues
export const getVenues = db.prepare('SELECT * FROM venues ORDER BY city, name');
export const getVenueById = db.prepare('SELECT * FROM venues WHERE id = ?');
export const insertVenue = db.prepare('INSERT INTO venues (name, city) VALUES (?, ?)');

// Prepared statements for recordings
export const getRecordings = db.prepare(`
  SELECT
    r.*,
    h.name as hafidh_name,
    v.name as venue_name,
    v.city
  FROM recordings r
  JOIN huffadh h ON r.hafidh_id = h.id
  JOIN venues v ON r.venue_id = v.id
  ORDER BY r.hijri_year DESC, h.name
`);

export const getRecordingById = db.prepare(`
  SELECT
    r.*,
    h.name as hafidh_name,
    v.name as venue_name,
    v.city
  FROM recordings r
  JOIN huffadh h ON r.hafidh_id = h.id
  JOIN venues v ON r.venue_id = v.id
  WHERE r.id = ?
`);

export const getRecordingsByHafidh = db.prepare(`
  SELECT
    r.*,
    h.name as hafidh_name,
    v.name as venue_name,
    v.city
  FROM recordings r
  JOIN huffadh h ON r.hafidh_id = h.id
  JOIN venues v ON r.venue_id = v.id
  WHERE r.hafidh_id = ?
  ORDER BY r.hijri_year DESC
`);

export const getRecordingsByYear = db.prepare(`
  SELECT
    r.*,
    h.name as hafidh_name,
    v.name as venue_name,
    v.city
  FROM recordings r
  JOIN huffadh h ON r.hafidh_id = h.id
  JOIN venues v ON r.venue_id = v.id
  WHERE r.hijri_year = ?
  ORDER BY h.name
`);

export const insertRecording = db.prepare(`
  INSERT INTO recordings (hafidh_id, venue_id, hijri_year, url, source, title, description)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`);

export const updateRecording = db.prepare(`
  UPDATE recordings
  SET hafidh_id = ?, venue_id = ?, hijri_year = ?, url = ?, source = ?, title = ?, description = ?, updated_at = CURRENT_TIMESTAMP
  WHERE id = ?
`);

export const deleteRecording = db.prepare('DELETE FROM recordings WHERE id = ?');

// Helper function to get or create hafidh
export function getOrCreateHafidh(name: string): number {
  const existing = db.prepare('SELECT id FROM huffadh WHERE name = ?').get(name) as { id: number } | undefined;
  if (existing) return existing.id;

  const result = insertHafidh.run(name);
  return result.lastInsertRowid as number;
}

// Helper function to get or create venue
export function getOrCreateVenue(name: string, city: string): number {
  const existing = db.prepare('SELECT id FROM venues WHERE name = ? AND city = ?').get(name, city) as { id: number } | undefined;
  if (existing) return existing.id;

  const result = insertVenue.run(name, city);
  return result.lastInsertRowid as number;
}

export default db;
