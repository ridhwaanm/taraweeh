import Database from "better-sqlite3";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import puppeteer from "puppeteer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbPath = join(__dirname, "../db/taraweeh.db");
const db = new Database(dbPath);

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

function parseTrackTitle(title: string, url: string): ParsedTrack {
  // Examples:
  // "Qari Huzaifa Essack - Night 25 - Taraweeh 1446"
  // "Qari Ahmed Khatri - Taraweeh 1446 - Night 1"
  // Extract hafidh name (before first " - " or " | ")
  // Extract hijri year (look for 4-digit number after "Taraweeh" or standalone)
  // Extract section/night number

  const parts = title.split(/\s*[-|]\s*/);

  let hafidh = parts[0]?.trim() || "Unknown";
  let hijriYear: number | null = null;
  let section: string | null = null;

  // Look for hijri year (1400-1500 range)
  const yearMatch = title.match(/\b(14\d{2})\b/);
  if (yearMatch) {
    hijriYear = parseInt(yearMatch[1]);
  }

  // Look for night/section number
  const nightMatch = title.match(/Night\s+(\d+)/i);
  if (nightMatch) {
    section = `Night ${nightMatch[1]}`;
  }

  // Clean up hafidh name - remove common prefixes
  hafidh = hafidh.replace(/^(Qari|Shaykh|Sheikh|Hafidh|Hafiz)\s+/i, "").trim();

  return {
    hafidh,
    hijriYear,
    section,
    title,
    url,
  };
}

async function getTracksFromUser(userTracksUrl: string): Promise<Track[]> {
  console.log(`Fetching tracks from: ${userTracksUrl}`);

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();

  try {
    console.log("Loading page...");
    await page.goto(userTracksUrl, {
      waitUntil: "domcontentloaded",
      timeout: 120000,
    });
    await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait for page to render

    // Scroll to load more tracks
    console.log("Scrolling to load all tracks...");
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

    console.log("Extracting track data...");

    // Extract track information
    const tracks = await page.evaluate(() => {
      const tracks: { title: string; url: string }[] = [];

      // Find all track items
      const trackElements = document.querySelectorAll(
        "li.soundList__item, article",
      );

      trackElements.forEach((track) => {
        // Get the track link
        const linkEl = track.querySelector("a.soundTitle__title");

        if (linkEl) {
          const href = linkEl.getAttribute("href");
          const title = linkEl.textContent?.trim();

          if (href && title) {
            const fullUrl = href.startsWith("http")
              ? href
              : `https://soundcloud.com${href}`;

            // Avoid duplicates and skip sets/playlists
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

    console.log(`Found ${tracks.length} tracks\n`);
    return tracks;
  } catch (error) {
    await browser.close();
    console.error(`Error fetching tracks: ${error}`);
    return [];
  }
}

async function getOrCreateHafidh(name: string): Promise<number> {
  // Try to find existing hafidh
  const existing = db
    .prepare("SELECT id FROM huffadh WHERE name = ?")
    .get(name) as { id: number } | undefined;

  if (existing) {
    return existing.id;
  }

  // Create new hafidh
  const result = db.prepare("INSERT INTO huffadh (name) VALUES (?)").run(name);
  return result.lastInsertRowid as number;
}

async function getOrCreateVenue(name: string, city: string): Promise<number> {
  // Try to find existing venue
  const existing = db
    .prepare("SELECT id FROM venues WHERE name = ? AND city = ?")
    .get(name, city) as { id: number } | undefined;

  if (existing) {
    return existing.id;
  }

  // Create new venue
  const result = db
    .prepare("INSERT INTO venues (name, city) VALUES (?, ?)")
    .run(name, city);
  return result.lastInsertRowid as number;
}

async function scrapeSoundCloudTracks() {
  const userTracksUrl = "https://soundcloud.com/aswaatulqurraa/tracks";

  // Fetch all tracks from the user
  const tracks = await getTracksFromUser(userTracksUrl);

  if (tracks.length === 0) {
    console.log("No tracks found");
    db.close();
    return;
  }

  console.log("\n=== Parsing and importing tracks ===\n");

  // Default venue for SoundCloud tracks (can be updated later via admin)
  const defaultVenueId = await getOrCreateVenue(
    "Aswaat-ul-Qurraa",
    "Cape Town",
  );

  let imported = 0;
  let skipped = 0;
  let errors = 0;

  for (const track of tracks) {
    try {
      const parsed = parseTrackTitle(track.title, track.url);

      console.log(`Processing: ${parsed.title}`);
      console.log(`  Hafidh: ${parsed.hafidh}`);
      console.log(`  Year: ${parsed.hijriYear || "N/A"}`);
      console.log(`  Section: ${parsed.section || "N/A"}`);

      // Get or create hafidh
      const hafidhId = await getOrCreateHafidh(parsed.hafidh);

      // Use default year if not found
      const year = parsed.hijriYear || 1446;

      // Check if recording already exists
      const existing = db
        .prepare("SELECT id FROM recordings WHERE url = ?")
        .get(parsed.url);

      if (existing) {
        console.log(`  ⏭️  Skipped (already exists)\n`);
        skipped++;
        continue;
      }

      // Insert recording
      db.prepare(
        `
        INSERT INTO recordings (hafidh_id, venue_id, hijri_year, url, source, section, title)
        VALUES (?, ?, ?, ?, 'soundcloud', ?, ?)
      `,
      ).run(
        hafidhId,
        defaultVenueId,
        year,
        parsed.url,
        parsed.section,
        parsed.title,
      );

      console.log(`  ✅ Imported\n`);
      imported++;
    } catch (error) {
      console.log(`  ❌ Error: ${error}\n`);
      errors++;
    }
  }

  console.log("\n=== Import Summary ===");
  console.log(`Total tracks found: ${tracks.length}`);
  console.log(`✅ Imported: ${imported}`);
  console.log(`⏭️  Skipped: ${skipped}`);
  console.log(`❌ Errors: ${errors}`);

  db.close();
}

scrapeSoundCloudTracks().catch(console.error);
