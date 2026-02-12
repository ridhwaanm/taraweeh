import type { APIRoute } from "astro";
import { getAuth } from "../../../lib/auth";
import { db, getOrCreateHafidh, getOrCreateVenue } from "../../../lib/db";

export const prerender = false;

interface TrackInput {
  title: string;
  url: string;
}

interface ParsedTrack {
  hafidh: string;
  hijriYear: number | null;
  section: string | null;
  title: string;
  url: string;
}

/**
 * Parse SoundCloud track titles in various formats:
 * Format 1: "Surah Tawbah 43 - 93 | Mufti Muhammad Hamza Farooqui | Taraweeh 1446"
 * Format 2: "Qari Abdul Basit Kazi | Night 16 | Taraweeh 1446"
 * Format 3: "Qari Abdul Basit Kazi - Night 16 - Taraweeh 1446"
 *
 * Rules:
 * - Prefer pipe (|) as separator if present in title
 * - Only use dash (-) as separator if no pipes exist
 * - "Surah" or "Night" prefix -> section
 * - "Taraweeh YYYY" -> extract year
 * - Remaining parts -> hafidh name
 */
function parseTrackTitle(title: string, url: string): ParsedTrack {
  let parts: string[];
  if (title.includes("|")) {
    parts = title.split(/\s*\|\s*/).map((p) => p.trim());
  } else {
    parts = title.split(/\s+-\s+(?=\S)/).map((p) => p.trim());
  }

  let hijriYear: number | null = null;
  let section: string | null = null;
  const hafidhParts: string[] = [];

  for (const part of parts) {
    const partLower = part.toLowerCase();

    const yearMatch = part.match(/Taraweeh\s+(\d{4})/i);
    if (yearMatch) {
      hijriYear = parseInt(yearMatch[1]);
      continue;
    }

    if (partLower.startsWith("surah ") || partLower.startsWith("night ")) {
      section = part;
      continue;
    }

    hafidhParts.push(part);
  }

  const hafidh = hafidhParts.length > 0 ? hafidhParts.join(" | ") : "Unknown";

  return { hafidh, hijriYear, section, title, url };
}

export const POST: APIRoute = async (context) => {
  const auth = getAuth();
  const session = await auth.api.getSession({
    headers: context.request.headers,
  });

  if (!session) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const body = await context.request.json();
    const tracks: TrackInput[] = body.tracks;

    if (!Array.isArray(tracks) || tracks.length === 0) {
      return new Response(JSON.stringify({ error: "No tracks provided" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Validate each track has title and url
    for (const track of tracks) {
      if (!track.title || !track.url) {
        return new Response(
          JSON.stringify({ error: "Each track must have a title and url" }),
          { status: 400, headers: { "Content-Type": "application/json" } },
        );
      }
    }

    const defaultVenueId = await getOrCreateVenue(
      "Aswaat-ul-Qurraa",
      "Cape Town",
    );

    let imported = 0;
    let skipped = 0;
    const errors: string[] = [];

    for (const track of tracks) {
      try {
        const parsed = parseTrackTitle(track.title, track.url);

        // Skip duplicates — don't update existing records
        const existingResult = await db.execute({
          sql: "SELECT id FROM recordings WHERE url = ?",
          args: [parsed.url],
        });

        if (existingResult.rows.length > 0) {
          skipped++;
          continue;
        }

        const hafidhId = await getOrCreateHafidh(parsed.hafidh);
        const year = parsed.hijriYear || 1446;

        await db.execute({
          sql: `INSERT INTO recordings (hafidh_id, venue_id, hijri_year, url, source, section, title)
                VALUES (?, ?, ?, ?, 'soundcloud', ?, ?)`,
          args: [
            hafidhId,
            defaultVenueId,
            year,
            parsed.url,
            parsed.section,
            parsed.title,
          ],
        });
        imported++;
      } catch (error) {
        errors.push(`${track.title}: ${error}`);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        total: tracks.length,
        imported,
        skipped,
        errors: errors.length,
        errorDetails: errors.length > 0 ? errors : undefined,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.error("SoundCloud import error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to import SoundCloud tracks" }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
};
