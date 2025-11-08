import type { APIRoute } from "astro";
import { getAuth } from "../../../lib/auth";
import { db, getOrCreateHafidh, getOrCreateVenue } from "../../../lib/db";
import puppeteer from "puppeteer";

export const prerender = false;

// Rate limiting: 5 minutes between fetches per user
const lastFetchTimes = new Map<string, number>();
const RATE_LIMIT_MS = 5 * 60 * 1000; // 5 minutes

interface Track {
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
 * Format 4: "Hafidh Name | Section Info | Taraweeh YYYY"
 *
 * Rules:
 * - Prefer pipe (|) as separator if present in title
 * - Only use dash (-) as separator if no pipes exist in title
 * - If part starts with "Surah" or "Night" -> section
 * - If part is "Taraweeh YYYY" -> extract year
 * - Remaining parts -> hafidh name
 */
function parseTrackTitle(title: string, url: string): ParsedTrack {
  // Determine separator: use pipe if present, otherwise use dash
  let parts: string[];
  if (title.includes("|")) {
    // Split by pipe separator only
    parts = title.split(/\s*\|\s*/).map((p) => p.trim());
  } else {
    // Split by standalone dash (with spaces around it) only if no pipes
    parts = title.split(/\s+-\s+(?=\S)/).map((p) => p.trim());
  }

  let hafidh = "Unknown";
  let hijriYear: number | null = null;
  let section: string | null = null;
  const hafidhParts: string[] = [];

  for (const part of parts) {
    const partLower = part.toLowerCase();

    // Check if this part contains Hijri year (Taraweeh 1446)
    const yearMatch = part.match(/Taraweeh\s+(\d{4})/i);
    if (yearMatch) {
      hijriYear = parseInt(yearMatch[1]);
      continue;
    }

    // Check if this part is section info (starts with "Surah" or "Night")
    if (partLower.startsWith("surah ") || partLower.startsWith("night ")) {
      section = part;
      continue;
    }

    // Otherwise, it's part of the hafidh name
    hafidhParts.push(part);
  }

  // Join all hafidh parts
  if (hafidhParts.length > 0) {
    hafidh = hafidhParts.join(" | ");
  }

  return {
    hafidh,
    hijriYear,
    section,
    title,
    url,
  };
}

async function getTracksFromUser(userTracksUrl: string): Promise<Track[]> {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();

  try {
    await page.goto(userTracksUrl, {
      waitUntil: "domcontentloaded",
      timeout: 120000,
    });
    await new Promise((resolve) => setTimeout(resolve, 5000));

    // Scroll to load more tracks
    let previousHeight = 0;
    let scrollAttempts = 0;
    const maxScrolls = 10;

    while (scrollAttempts < maxScrolls) {
      const currentHeight = await page.evaluate(
        () => document.body.scrollHeight,
      );
      if (currentHeight === previousHeight) break;

      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await new Promise((resolve) => setTimeout(resolve, 2000));

      previousHeight = currentHeight;
      scrollAttempts++;
    }

    const tracks = await page.evaluate(() => {
      const tracks: { title: string; url: string }[] = [];
      const trackElements = document.querySelectorAll(
        "li.soundList__item, article",
      );

      trackElements.forEach((track) => {
        const linkEl = track.querySelector("a.soundTitle__title");

        if (linkEl) {
          const href = linkEl.getAttribute("href");
          const title = linkEl.textContent?.trim();

          if (href && title) {
            const fullUrl = href.startsWith("http")
              ? href
              : `https://soundcloud.com${href}`;

            if (
              !fullUrl.includes("/sets/") &&
              !tracks.find((t) => t.url === fullUrl)
            ) {
              tracks.push({ title, url: fullUrl });
            }
          }
        }
      });

      return tracks;
    });

    await browser.close();
    return tracks;
  } catch (error) {
    await browser.close();
    throw error;
  }
}

// Removed: Now using getOrCreateHafidh and getOrCreateVenue from db.ts

export const POST: APIRoute = async (context) => {
  // Check authentication
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

  // Rate limiting check
  const userId = session.user.id;
  const lastFetch = lastFetchTimes.get(userId);
  const now = Date.now();

  if (lastFetch && now - lastFetch < RATE_LIMIT_MS) {
    const remainingTime = Math.ceil((RATE_LIMIT_MS - (now - lastFetch)) / 1000);
    return new Response(
      JSON.stringify({
        error: `Please wait ${remainingTime} seconds before fetching again`,
      }),
      { status: 429, headers: { "Content-Type": "application/json" } },
    );
  }

  lastFetchTimes.set(userId, now);

  try {
    const userTracksUrl = "https://soundcloud.com/aswaatulqurraa/tracks";

    // Fetch all tracks
    const allTracks = await getTracksFromUser(userTracksUrl);

    // STRICT FILTER: Only include tracks with "Taraweeh 14" in the title
    const tracks = allTracks.filter((track) =>
      track.title.includes("Taraweeh 14"),
    );

    console.log(
      `Total tracks found: ${allTracks.length}, Filtered to Taraweeh tracks: ${tracks.length}`,
    );

    if (tracks.length === 0) {
      return new Response(
        JSON.stringify({
          error: `No Taraweeh tracks found (looking for "Taraweeh 14" in title)`,
        }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    // Default venue for SoundCloud tracks
    const defaultVenueId = await getOrCreateVenue(
      "Aswaat-ul-Qurraa",
      "Cape Town",
    );

    let imported = 0;
    let updated = 0;
    const errors: string[] = [];

    for (const track of tracks) {
      try {
        const parsed = parseTrackTitle(track.title, track.url);

        // Get or create hafidh
        const hafidhId = await getOrCreateHafidh(parsed.hafidh);

        // Use default year if not found
        const year = parsed.hijriYear || 1446;

        // Check if recording already exists (using URL as unique key)
        const existingResult = await db.execute({
          sql: "SELECT id FROM recordings WHERE url = ?",
          args: [parsed.url],
        });

        const existing =
          existingResult.rows.length > 0
            ? { id: existingResult.rows[0][0] as number }
            : undefined;

        if (existing) {
          // Update existing record with latest data from SoundCloud
          await db.execute({
            sql: `
              UPDATE recordings
              SET hafidh_id = ?, venue_id = ?, hijri_year = ?, section = ?, title = ?, source = 'soundcloud'
              WHERE id = ?
            `,
            args: [
              hafidhId,
              defaultVenueId,
              year,
              parsed.section,
              parsed.title,
              existing.id,
            ],
          });
          updated++;
        } else {
          // Insert new recording
          await db.execute({
            sql: `
              INSERT INTO recordings (hafidh_id, venue_id, hijri_year, url, source, section, title)
              VALUES (?, ?, ?, ?, 'soundcloud', ?, ?)
            `,
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
        }
      } catch (error) {
        errors.push(`${track.title}: ${error}`);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        total: tracks.length,
        imported,
        updated,
        skipped: 0, // We no longer skip, we update instead
        errors: errors.length,
        errorDetails: errors.length > 0 ? errors : undefined,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  } catch (error) {
    // Log error server-side, but don't expose details to client
    console.error("SoundCloud fetch error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch SoundCloud tracks" }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
};
