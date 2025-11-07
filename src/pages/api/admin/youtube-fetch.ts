import type { APIRoute } from "astro";
import { getAuth } from "../../../lib/auth";
import Database from "better-sqlite3";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import puppeteer from "puppeteer";

export const prerender = false;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dbPath = join(__dirname, "../../../../db/taraweeh.db");

// Rate limiting: 5 minutes between fetches per user
const lastFetchTimes = new Map<string, number>();
const RATE_LIMIT_MS = 5 * 60 * 1000; // 5 minutes

interface VideoData {
  title: string;
  url: string;
  hijriYear: number | null;
  hafidh: string | null;
  section: string | null;
}

/**
 * Scrapes Taraweeh videos from Aswatul Qurraa YouTube channel
 * Uses search to pre-filter for "taraweeh" videos for efficiency
 */
async function scrapeYouTubeVideos(): Promise<VideoData[]> {
  const channelUrl =
    "https://www.youtube.com/@aswaatulqurraa/search?query=taraweeh";

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });

    await page.goto(channelUrl, {
      waitUntil: "domcontentloaded",
      timeout: 120000,
    });

    // Wait for initial content to load
    await new Promise((resolve) => setTimeout(resolve, 5000));

    // Scroll to load ALL videos with pagination
    let previousHeight = 0;
    let scrollAttempts = 0;
    const maxScrollAttempts = 50; // Increased to handle more videos
    let noChangeCount = 0;

    console.log("Starting pagination scroll...");

    while (scrollAttempts < maxScrollAttempts) {
      // Scroll to bottom of page
      await page.evaluate(() => {
        window.scrollTo(0, document.documentElement.scrollHeight);
      });

      // Wait for new content to load (YouTube lazy loads)
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const currentHeight = await page.evaluate(
        () => document.documentElement.scrollHeight,
      );

      // Check if page height changed (more videos loaded)
      if (currentHeight === previousHeight) {
        noChangeCount++;
        // If height hasn't changed for 3 attempts, we've reached the end
        if (noChangeCount >= 3) {
          console.log("Reached end of videos list");
          break;
        }
      } else {
        noChangeCount = 0; // Reset counter when new content loads
      }

      previousHeight = currentHeight;
      scrollAttempts++;

      // Log progress every 10 scrolls
      if (scrollAttempts % 10 === 0) {
        const videoCount = await page.evaluate(() => {
          return document.querySelectorAll("ytd-rich-item-renderer").length;
        });
        console.log(
          `Scroll attempt ${scrollAttempts}: Found ${videoCount} videos so far...`,
        );
      }
    }

    // Extract video data
    const videos = await page.evaluate(() => {
      const results: any[] = [];

      // Try different possible selectors
      const selectors = [
        "ytd-rich-item-renderer",
        "ytd-grid-video-renderer",
        "ytd-video-renderer",
      ];

      let videoElements: NodeListOf<Element> | null = null;

      for (const selector of selectors) {
        const elements = document.querySelectorAll(selector);
        if (elements.length > 0) {
          videoElements = elements;
          break;
        }
      }

      if (!videoElements || videoElements.length === 0) {
        // Fallback: find all watch links
        const allLinks = document.querySelectorAll('a[href*="/watch?v="]');

        allLinks.forEach((link) => {
          const href = link.getAttribute("href") || "";
          const title =
            link.getAttribute("title") || link.textContent?.trim() || "";

          if (title && href.includes("/watch?v=")) {
            results.push({
              title,
              url: href.startsWith("http")
                ? href
                : `https://www.youtube.com${href}`,
            });
          }
        });
      } else {
        videoElements.forEach((element) => {
          // Try multiple selectors for title
          let titleElement = element.querySelector("#video-title");
          if (!titleElement) {
            titleElement = element.querySelector("a#video-title-link");
          }
          if (!titleElement) {
            titleElement = element.querySelector("a[title]");
          }

          const title =
            titleElement?.getAttribute("title") ||
            titleElement?.textContent?.trim() ||
            "";
          const videoUrl = titleElement?.getAttribute("href") || "";

          if (title && videoUrl) {
            results.push({
              title,
              url: videoUrl.startsWith("http")
                ? videoUrl
                : `https://www.youtube.com${videoUrl}`,
            });
          }
        });
      }

      // Remove duplicates based on URL
      const uniqueResults = Array.from(
        new Map(results.map((item) => [item.url, item])).values(),
      );

      return uniqueResults;
    });

    await browser.close();

    console.log(`Total videos found on channel: ${videos.length}`);

    // Filter and parse Taraweeh videos ONLY (videos starting with "Taraweeh ")
    const taraweehVideos: VideoData[] = [];

    for (const video of videos) {
      const title = video.title;

      // FILTER: Only process videos starting with "Taraweeh "
      if (!title.startsWith("Taraweeh ")) continue;

      // Parse title format: "Taraweeh HIJRI_YEAR | Hafidh | Section"
      const titleParts = title.split("|").map((p: string) => p.trim());

      let hijriYear: number | null = null;
      let hafidh: string | null = null;
      let section: string | null = null;

      if (titleParts.length >= 1) {
        // Extract Hijri year from "Taraweeh 1446" format
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

      taraweehVideos.push({
        title,
        url: video.url,
        hijriYear,
        hafidh,
        section,
      });
    }

    console.log(
      `Filtered to ${taraweehVideos.length} Taraweeh videos (starting with "Taraweeh ")`,
    );

    return taraweehVideos;
  } catch (error) {
    await browser.close();
    throw error;
  }
}

function getOrCreateHafidh(db: Database.Database, name: string): number {
  const existing = db
    .prepare("SELECT id FROM huffadh WHERE name = ?")
    .get(name) as { id: number } | undefined;

  if (existing) {
    return existing.id;
  }

  const result = db.prepare("INSERT INTO huffadh (name) VALUES (?)").run(name);
  return result.lastInsertRowid as number;
}

function getOrCreateVenue(
  db: Database.Database,
  name: string,
  city: string,
): number {
  const existing = db
    .prepare("SELECT id FROM venues WHERE name = ? AND city = ?")
    .get(name, city) as { id: number } | undefined;

  if (existing) {
    return existing.id;
  }

  const result = db
    .prepare("INSERT INTO venues (name, city) VALUES (?, ?)")
    .run(name, city);
  return result.lastInsertRowid as number;
}

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

  const db = new Database(dbPath);

  try {
    // Scrape YouTube videos
    const videos = await scrapeYouTubeVideos();

    if (videos.length === 0) {
      db.close();
      return new Response(JSON.stringify({ error: "No videos found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Default venue for YouTube videos
    const defaultVenueId = getOrCreateVenue(
      db,
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

        // Get or create hafidh
        const hafidhId = getOrCreateHafidh(db, video.hafidh);

        // Check if recording already exists
        const existing = db
          .prepare("SELECT id FROM recordings WHERE url = ?")
          .get(video.url);

        if (existing) {
          skipped++;
          continue;
        }

        // Insert recording
        db.prepare(
          `
          INSERT INTO recordings (hafidh_id, venue_id, hijri_year, url, source, section, title)
          VALUES (?, ?, ?, ?, 'youtube', ?, ?)
        `,
        ).run(
          hafidhId,
          defaultVenueId,
          video.hijriYear,
          video.url,
          video.section,
          video.title,
        );

        imported++;
      } catch (error) {
        errors.push(`${video.title}: ${error}`);
      }
    }

    db.close();

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
    db.close();
    console.error("YouTube fetch error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch YouTube videos" }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
};
