import { createClient } from '@libsql/client';

const db = createClient({
  url: process.env.TURSO_DATABASE_URL || "file:db/taraweeh.db",
  authToken: process.env.TURSO_AUTH_TOKEN
});
function resultToArray(result) {
  return result.rows.map((row) => {
    const obj = {};
    result.columns.forEach((col, i) => {
      obj[col] = row[i];
    });
    return obj;
  });
}
const getHuffadh = {
  all: async () => {
    const result = await db.execute("SELECT * FROM huffadh ORDER BY name");
    return resultToArray(result);
  }
};
const insertHafidh = {
  run: async (name) => {
    return await db.execute({
      sql: "INSERT INTO huffadh (name) VALUES (?)",
      args: [name]
    });
  }
};
const getVenues = {
  all: async () => {
    const result = await db.execute("SELECT * FROM venues ORDER BY city, name");
    return resultToArray(result);
  }
};
const insertVenue = {
  run: async (name, city) => {
    return await db.execute({
      sql: "INSERT INTO venues (name, city) VALUES (?, ?)",
      args: [name, city]
    });
  }
};
const getRecordings = {
  all: async () => {
    const result = await db.execute(`
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
    return resultToArray(result);
  }
};
const insertRecording = {
  run: async (hafidhId, venueId, hijriYear, url, source, title, description) => {
    return await db.execute({
      sql: `
        INSERT INTO recordings (hafidh_id, venue_id, hijri_year, url, source, title, description)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      args: [hafidhId, venueId, hijriYear, url, source, title, description]
    });
  }
};
const updateRecording = {
  run: async (hafidhId, venueId, hijriYear, url, source, title, description, id) => {
    return await db.execute({
      sql: `
        UPDATE recordings
        SET hafidh_id = ?, venue_id = ?, hijri_year = ?, url = ?, source = ?, title = ?, description = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `,
      args: [hafidhId, venueId, hijriYear, url, source, title, description, id]
    });
  }
};
const deleteRecording = {
  run: async (id) => {
    return await db.execute({
      sql: "DELETE FROM recordings WHERE id = ?",
      args: [id]
    });
  }
};
async function getOrCreateHafidh(name) {
  const result = await db.execute({
    sql: "SELECT id FROM huffadh WHERE name = ?",
    args: [name]
  });
  const existing = resultToArray(result)[0];
  if (existing) return existing.id;
  const insertResult = await insertHafidh.run(name);
  return Number(insertResult.lastInsertRowid);
}
async function getOrCreateVenue(name, city) {
  const result = await db.execute({
    sql: "SELECT id FROM venues WHERE name = ? AND city = ?",
    args: [name, city]
  });
  const existing = resultToArray(result)[0];
  if (existing) return existing.id;
  const insertResult = await insertVenue.run(name, city);
  return Number(insertResult.lastInsertRowid);
}

export { getRecordings as a, insertRecording as b, deleteRecording as c, db as d, getOrCreateVenue as e, getOrCreateHafidh as f, getHuffadh as g, getVenues as h, insertHafidh as i, insertVenue as j, updateRecording as u };
