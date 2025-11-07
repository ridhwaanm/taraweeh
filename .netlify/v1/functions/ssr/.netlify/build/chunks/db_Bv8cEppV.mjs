import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';

const __filename$1 = fileURLToPath(import.meta.url);
const __dirname$1 = dirname(__filename$1);
const dbPath = join(__dirname$1, "../../db/taraweeh.db");
const db = new Database(dbPath);
db.pragma("foreign_keys = ON");
const schemaPath = join(__dirname$1, "../../db/schema.sql");
const schema = readFileSync(schemaPath, "utf-8");
db.exec(schema);
const getHuffadh = db.prepare("SELECT * FROM huffadh ORDER BY name");
db.prepare("SELECT * FROM huffadh WHERE id = ?");
const insertHafidh = db.prepare("INSERT INTO huffadh (name) VALUES (?)");
const getVenues = db.prepare("SELECT * FROM venues ORDER BY city, name");
db.prepare("SELECT * FROM venues WHERE id = ?");
const insertVenue = db.prepare("INSERT INTO venues (name, city) VALUES (?, ?)");
const getRecordings = db.prepare(`
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
db.prepare(`
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
db.prepare(`
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
db.prepare(`
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
const insertRecording = db.prepare(`
  INSERT INTO recordings (hafidh_id, venue_id, hijri_year, url, source, title, description)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`);
const updateRecording = db.prepare(`
  UPDATE recordings
  SET hafidh_id = ?, venue_id = ?, hijri_year = ?, url = ?, source = ?, title = ?, description = ?, updated_at = CURRENT_TIMESTAMP
  WHERE id = ?
`);
const deleteRecording = db.prepare("DELETE FROM recordings WHERE id = ?");

export { getRecordings as a, insertRecording as b, deleteRecording as c, db as d, getVenues as e, insertVenue as f, getHuffadh as g, insertHafidh as i, updateRecording as u };
