import type { APIRoute } from "astro";
import { getAuth } from "../../../lib/auth";
import { db, getOrCreateHafidh, getOrCreateVenue } from "../../../lib/db";

export const prerender = false;

const CHANNEL_ID = "UCtlkzWO08AwTMlX95SZeetw"; // @aswaatulqurraa
const RSS_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;

interface VideoData {
  title: string;
  url: string;
  hijriYear: number | null;
  hafidh: string | null;
  section: string | null;
}

/**
 * Fetches and parses the YouTube RSS feed for the channel.
 * Returns the most recent 15 videos (YouTube RSS limit).
 */
async function fetchYouTubeVideos(): Promise<VideoData[]> {
  const res = await fetch(RSS_URL);
  if (!res.ok) {
    throw new Error(`YouTube RSS feed returned ${res.status}`);
  }

  const xml = await res.text();

  // Parse entries from the XML feed
  const entries: VideoData[] = [];
  const entryRegex = /<entry>([\s\S]*?)<\/entry>/g;
  let match;

  while ((match = entryRegex.exec(xml)) !== null) {
    const entry = match[1];

    const titleMatch = entry.match(/<media:title>([\s\S]*?)<\/media:title>/);
    const videoIdMatch = entry.match(/<yt:videoId>([\s\S]*?)<\/yt:videoId>/);

    if (!titleMatch || !videoIdMatch) continue;

    const title = titleMatch[1].trim();
    const videoId = videoIdMatch[1].trim();
    const url = `https://www.youtube.com/watch?v=${videoId}`;

    // Only process videos starting with "Taraweeh "
    if (!title.startsWith("Taraweeh ")) continue;

    // Parse title format: "Taraweeh YYYY | Hafidh | Section"
    const titleParts = title.split("|").map((p) => p.trim());

    let hijriYear: number | null = null;
    let hafidh: string | null = null;
    let section: string | null = null;

    if (titleParts.length >= 1) {
      const yearMatch = titleParts[0].match(/Taraweeh\s+(\d{4})/);
      if (yearMatch) {
        hijriYear = parseInt(yearMatch[1]);
      }
    }

    if (titleParts.length >= 2) {
      hafidh = titleParts[1].trim();
    }

    if (titleParts.length >= 3) {
      section = titleParts[2].trim();
    }

    entries.push({ title, url, hijriYear, hafidh, section });
  }

  return entries;
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
    const videos = await fetchYouTubeVideos();

    if (videos.length === 0) {
      return new Response(
        JSON.stringify({
          error: "No Taraweeh videos found in recent uploads",
        }),
        { status: 404, headers: { "Content-Type": "application/json" } },
      );
    }

    const defaultVenueId = await getOrCreateVenue(
      "Aswaat-ul-Qurraa",
      "Cape Town",
    );

    let imported = 0;
    let skipped = 0;
    const errors: string[] = [];

    for (const video of videos) {
      try {
        if (!video.hafidh || !video.hijriYear) {
          errors.push(`${video.title}: Missing hafidh or Hijri year`);
          skipped++;
          continue;
        }

        const hafidhId = await getOrCreateHafidh(video.hafidh);

        const existingResult = await db.execute({
          sql: "SELECT id FROM recordings WHERE url = ?",
          args: [video.url],
        });

        if (existingResult.rows.length > 0) {
          skipped++;
          continue;
        }

        await db.execute({
          sql: `INSERT INTO recordings (hafidh_id, venue_id, hijri_year, url, source, section, title)
                VALUES (?, ?, ?, ?, 'youtube', ?, ?)`,
          args: [
            hafidhId,
            defaultVenueId,
            video.hijriYear,
            video.url,
            video.section,
            video.title,
          ],
        });

        imported++;
      } catch (error) {
        errors.push(`${video.title}: ${error}`);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        total: videos.length,
        imported,
        skipped,
        errors: errors.length,
        errorDetails: errors.length > 0 ? errors : undefined,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.error("YouTube fetch error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch YouTube videos" }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
};
