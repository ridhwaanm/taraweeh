import { createClient } from "@libsql/client";
import type { Client } from "@libsql/client";

// Initialize Turso client
const db: Client = createClient({
  url: process.env.TURSO_DATABASE_URL || "file:db/taraweeh.db",
  authToken: process.env.TURSO_AUTH_TOKEN,
});

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
  source: "youtube" | "soundcloud";
  audio_url?: string;
  section?: string;
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

// Helper to convert LibSQL result to array
function resultToArray<T>(result: any): T[] {
  return result.rows.map((row: any) => {
    const obj: any = {};
    result.columns.forEach((col: string, i: number) => {
      obj[col] = row[i];
    });
    return obj as T;
  });
}

// Prepared statements for huffadh
export const getHuffadh = {
  all: async () => {
    const result = await db.execute("SELECT * FROM huffadh ORDER BY name");
    return resultToArray<Hafidh>(result);
  },
};

export const getHafidhById = {
  get: async (id: number) => {
    const result = await db.execute({
      sql: "SELECT * FROM huffadh WHERE id = ?",
      args: [id],
    });
    return resultToArray<Hafidh>(result)[0];
  },
};

export const insertHafidh = {
  run: async (name: string) => {
    return await db.execute({
      sql: "INSERT INTO huffadh (name) VALUES (?)",
      args: [name],
    });
  },
};

// Prepared statements for venues
export const getVenues = {
  all: async () => {
    const result = await db.execute("SELECT * FROM venues ORDER BY city, name");
    return resultToArray<Venue>(result);
  },
};

export const getVenueById = {
  get: async (id: number) => {
    const result = await db.execute({
      sql: "SELECT * FROM venues WHERE id = ?",
      args: [id],
    });
    return resultToArray<Venue>(result)[0];
  },
};

export const insertVenue = {
  run: async (name: string, city: string) => {
    return await db.execute({
      sql: "INSERT INTO venues (name, city) VALUES (?, ?)",
      args: [name, city],
    });
  },
};

// Prepared statements for recordings
export const getRecordings = {
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
    return resultToArray<RecordingWithDetails>(result);
  },
};

export const getRecordingById = {
  get: async (id: number) => {
    const result = await db.execute({
      sql: `
        SELECT
          r.*,
          h.name as hafidh_name,
          v.name as venue_name,
          v.city
        FROM recordings r
        JOIN huffadh h ON r.hafidh_id = h.id
        JOIN venues v ON r.venue_id = v.id
        WHERE r.id = ?
      `,
      args: [id],
    });
    return resultToArray<RecordingWithDetails>(result)[0];
  },
};

export const getRecordingsByHafidh = {
  all: async (hafidhId: number) => {
    const result = await db.execute({
      sql: `
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
      `,
      args: [hafidhId],
    });
    return resultToArray<RecordingWithDetails>(result);
  },
};

export const getRecordingsByYear = {
  all: async (year: number) => {
    const result = await db.execute({
      sql: `
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
      `,
      args: [year],
    });
    return resultToArray<RecordingWithDetails>(result);
  },
};

export const insertRecording = {
  run: async (
    hafidhId: number,
    venueId: number,
    hijriYear: number,
    url: string,
    source: string,
    title: string | null,
    description: string | null,
  ) => {
    return await db.execute({
      sql: `
        INSERT INTO recordings (hafidh_id, venue_id, hijri_year, url, source, title, description)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      args: [hafidhId, venueId, hijriYear, url, source, title, description],
    });
  },
};

export const updateRecording = {
  run: async (
    hafidhId: number,
    venueId: number,
    hijriYear: number,
    url: string,
    source: string,
    title: string | null,
    description: string | null,
    id: number,
  ) => {
    return await db.execute({
      sql: `
        UPDATE recordings
        SET hafidh_id = ?, venue_id = ?, hijri_year = ?, url = ?, source = ?, title = ?, description = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `,
      args: [hafidhId, venueId, hijriYear, url, source, title, description, id],
    });
  },
};

export const deleteRecording = {
  run: async (id: number) => {
    return await db.execute({
      sql: "DELETE FROM recordings WHERE id = ?",
      args: [id],
    });
  },
};

// Helper function to get or create hafidh
export async function getOrCreateHafidh(name: string): Promise<number> {
  const result = await db.execute({
    sql: "SELECT id FROM huffadh WHERE name = ?",
    args: [name],
  });

  const existing = resultToArray<{ id: number }>(result)[0];
  if (existing) return existing.id;

  const insertResult = await insertHafidh.run(name);
  return Number(insertResult.lastInsertRowid);
}

// Helper function to get or create venue
export async function getOrCreateVenue(
  name: string,
  city: string,
): Promise<number> {
  const result = await db.execute({
    sql: "SELECT id FROM venues WHERE name = ? AND city = ?",
    args: [name, city],
  });

  const existing = resultToArray<{ id: number }>(result)[0];
  if (existing) return existing.id;

  const insertResult = await insertVenue.run(name, city);
  return Number(insertResult.lastInsertRowid);
}

// Venue Submissions
export interface VenueSubmission {
  id: number;
  venue_name: string;
  sub_venue_name: string | null;
  address_full: string;
  city: string;
  province: string | null;
  country: string;
  latitude: number;
  longitude: number;
  google_place_id: string | null;
  juz_per_night: number | null;
  reader_names: string | null;
  whatsapp_number: string | null;
  status: "pending" | "approved" | "rejected";
  admin_notes: string | null;
  approved_venue_id: number | null;
  submitted_at: string;
  reviewed_at: string | null;
}

export const insertVenueSubmission = {
  run: async (data: {
    venue_name: string;
    sub_venue_name?: string;
    address_full: string;
    city: string;
    province?: string;
    country?: string;
    latitude: number;
    longitude: number;
    google_place_id?: string;
    juz_per_night?: number;
    reader_names?: string;
    whatsapp_number?: string;
  }) => {
    return await db.execute({
      sql: `INSERT INTO venue_submissions
        (venue_name, sub_venue_name, address_full, city, province, country, latitude, longitude, google_place_id, juz_per_night, reader_names, whatsapp_number)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        data.venue_name,
        data.sub_venue_name || null,
        data.address_full,
        data.city,
        data.province || null,
        data.country || "ZA",
        data.latitude,
        data.longitude,
        data.google_place_id || null,
        data.juz_per_night || null,
        data.reader_names || null,
        data.whatsapp_number || null,
      ],
    });
  },
};

export const getVenueSubmissions = {
  all: async (status?: string) => {
    if (status) {
      const result = await db.execute({
        sql: "SELECT * FROM venue_submissions WHERE status = ? ORDER BY submitted_at DESC",
        args: [status],
      });
      return resultToArray<VenueSubmission>(result);
    }
    const result = await db.execute(
      "SELECT * FROM venue_submissions ORDER BY submitted_at DESC",
    );
    return resultToArray<VenueSubmission>(result);
  },
};

export const getVenueSubmissionById = {
  get: async (id: number) => {
    const result = await db.execute({
      sql: "SELECT * FROM venue_submissions WHERE id = ?",
      args: [id],
    });
    return resultToArray<VenueSubmission>(result)[0];
  },
};

export async function updateVenueSubmission(
  id: number,
  data: {
    venue_name: string;
    sub_venue_name?: string | null;
    address_full: string;
    city: string;
    province?: string | null;
    latitude: number;
    longitude: number;
    juz_per_night?: number | null;
    reader_names?: string | null;
    whatsapp_number?: string | null;
  },
): Promise<void> {
  await db.execute({
    sql: `UPDATE venue_submissions
      SET venue_name = ?, sub_venue_name = ?, address_full = ?, city = ?, province = ?,
          latitude = ?, longitude = ?, juz_per_night = ?, reader_names = ?, whatsapp_number = ?
      WHERE id = ?`,
    args: [
      data.venue_name,
      data.sub_venue_name || null,
      data.address_full,
      data.city,
      data.province || null,
      data.latitude,
      data.longitude,
      data.juz_per_night || null,
      data.reader_names || null,
      data.whatsapp_number || null,
      id,
    ],
  });
}

export async function approveVenueSubmission(id: number): Promise<void> {
  await db.execute({
    sql: `UPDATE venue_submissions
      SET status = 'approved', reviewed_at = CURRENT_TIMESTAMP
      WHERE id = ?`,
    args: [id],
  });
}

export async function rejectVenueSubmission(
  id: number,
  notes?: string,
): Promise<void> {
  await db.execute({
    sql: `UPDATE venue_submissions
      SET status = 'rejected', admin_notes = ?, reviewed_at = CURRENT_TIMESTAMP
      WHERE id = ?`,
    args: [notes || null, id],
  });
}

export async function bulkApproveVenueSubmissions(
  ids: number[],
): Promise<number> {
  if (ids.length === 0) return 0;

  // Fetch all pending submissions
  const placeholders = ids.map(() => "?").join(", ");
  const result = await db.execute({
    sql: `SELECT id FROM venue_submissions WHERE id IN (${placeholders}) AND status = 'pending'`,
    args: ids,
  });
  const subs = resultToArray<{ id: number }>(result);
  if (subs.length === 0) return 0;

  // Batch-update all submissions to approved
  const updateStmts = subs.map((s) => ({
    sql: "UPDATE venue_submissions SET status = 'approved', reviewed_at = CURRENT_TIMESTAMP WHERE id = ?",
    args: [s.id] as (string | number | null)[],
  }));
  for (let i = 0; i < updateStmts.length; i += 100) {
    await db.batch(updateStmts.slice(i, i + 100), "write");
  }

  return subs.length;
}

interface BulkImportRow {
  venue_name: string;
  sub_venue_name?: string;
  address_full: string;
  city: string;
  province?: string;
  country?: string;
  latitude: number;
  longitude: number;
  google_place_id?: string;
  juz_per_night?: number;
  reader_names?: string;
  whatsapp_number?: string;
}

export async function bulkInsertVenueSubmissions(
  submissions: BulkImportRow[],
): Promise<{
  imported: number;
  duplicates: number;
  errors: number;
  errorDetails: string[];
}> {
  let imported = 0;
  let duplicates = 0;
  let errors = 0;
  const errorDetails: string[] = [];

  // Validate all rows first
  const valid: { row: BulkImportRow; index: number }[] = [];
  for (let i = 0; i < submissions.length; i++) {
    const sub = submissions[i];
    if (!sub.venue_name || !sub.address_full || !sub.city) {
      errors++;
      errorDetails.push(
        `Row ${i + 1} (${sub.venue_name || "unknown"}): Missing required field`,
      );
      continue;
    }
    if (!isFinite(sub.latitude) || !isFinite(sub.longitude)) {
      errors++;
      errorDetails.push(
        `Row ${i + 1} (${sub.venue_name}): Invalid latitude or longitude`,
      );
      continue;
    }
    valid.push({ row: sub, index: i });
  }

  // Fetch existing submissions for dedup (match on venue_name + city + latitude + longitude)
  const existing = await db.execute(
    "SELECT venue_name, city, latitude, longitude FROM venue_submissions",
  );
  const existingKeys = new Set(
    resultToArray<{
      venue_name: string;
      city: string;
      latitude: number;
      longitude: number;
    }>(existing).map(
      (r) => `${r.venue_name}|||${r.city}|||${r.latitude}|||${r.longitude}`,
    ),
  );

  // Deduplicate within the import itself and against DB
  const seenInBatch = new Set<string>();
  const toInsert: { row: BulkImportRow; index: number }[] = [];
  for (const entry of valid) {
    const key = `${entry.row.venue_name}|||${entry.row.city}|||${entry.row.latitude}|||${entry.row.longitude}`;
    if (existingKeys.has(key) || seenInBatch.has(key)) {
      duplicates++;
      continue;
    }
    seenInBatch.add(key);
    toInsert.push(entry);
  }

  // Batch insert in chunks of 100
  for (let i = 0; i < toInsert.length; i += 100) {
    const chunk = toInsert.slice(i, i + 100);
    const stmts = chunk.map(({ row: sub }) => ({
      sql: `INSERT INTO venue_submissions
        (venue_name, sub_venue_name, address_full, city, province, country, latitude, longitude, google_place_id, juz_per_night, reader_names, whatsapp_number)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        sub.venue_name,
        sub.sub_venue_name || null,
        sub.address_full,
        sub.city,
        sub.province || null,
        sub.country || "ZA",
        sub.latitude,
        sub.longitude,
        sub.google_place_id || null,
        sub.juz_per_night || null,
        sub.reader_names || null,
        sub.whatsapp_number || null,
      ] as (string | number | null)[],
    }));
    try {
      await db.batch(stmts, "write");
      imported += chunk.length;
    } catch (err: any) {
      for (let j = 0; j < chunk.length; j++) {
        try {
          await db.execute(stmts[j]);
          imported++;
        } catch (innerErr: any) {
          errors++;
          errorDetails.push(
            `Row ${chunk[j].index + 1} (${chunk[j].row.venue_name}): ${innerErr.message}`,
          );
        }
      }
    }
  }

  return { imported, duplicates, errors, errorDetails };
}

// Public venue data (no sensitive fields)
export interface PublicVenue {
  id: number;
  venue_name: string;
  sub_venue_name: string | null;
  address_full: string;
  city: string;
  province: string | null;
  latitude: number;
  longitude: number;
  juz_per_night: number | null;
  reader_names: string | null;
}

export const getApprovedVenueSubmissions = {
  all: async (): Promise<PublicVenue[]> => {
    const result = await db.execute(
      `SELECT id, venue_name, sub_venue_name, address_full, city, province,
              latitude, longitude, juz_per_night, reader_names
       FROM venue_submissions
       WHERE status = 'approved'
       ORDER BY province, city, venue_name`,
    );
    return resultToArray<PublicVenue>(result);
  },
};

export { db };
export default db;
