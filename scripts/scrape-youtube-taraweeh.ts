import Database from "better-sqlite3";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import puppeteer from "puppeteer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbPath = join(__dirname, "../db/taraweeh.db");

interface VideoData {
  title: string;
  url: string;
  year: number | null;
  hafidh: string | null;
  section: string | null;
}

/**
 * Scrapes Taraweeh videos from Aswatul Qurraa YouTube channel
 * Videos should match format: "Taraweeh YYYY | Hafidh Name | Section"
 */
async function scrapeYouTubeVideos(): Promise<VideoData[]> {
  const channelUrl =
    "https://www.youtube.com/@aswaatulqurraa/search?query=taraweeh";

  console.log(`Fetching videos from: ${channelUrl}`);
  console.log("Launching browser...");

  const browser = await puppeteer.launch({
    headless: false, // Set to false to see what's happening
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const page = await browser.newPage();

    // Set viewport for consistent rendering
    await page.setViewport({ width: 1280, height: 800 });

    console.log("Navigating to channel...");
    await page.goto(channelUrl, { waitUntil: "networkidle2" });

    // Wait for page to load
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Check what selectors are available
    const pageContent = await page.evaluate(() => {
      return {
        hasYtdRichItem: document.querySelectorAll("ytd-rich-item-renderer")
          .length,
        hasYtdGridVideo: document.querySelectorAll("ytd-grid-video-renderer")
          .length,
        hasYtdVideoRenderer:
          document.querySelectorAll("ytd-video-renderer").length,
        bodyText: document.body.innerText.substring(0, 500),
      };
    });

    console.log("Page analysis:", pageContent);

    console.log("Scrolling to load all videos...");

    let previousHeight = 0;
    let scrollAttempts = 0;
    const maxScrollAttempts = 50; // Prevent infinite loops

    while (scrollAttempts < maxScrollAttempts) {
      // Scroll to bottom
      await page.evaluate(() => {
        window.scrollTo(0, document.documentElement.scrollHeight);
      });

      // Wait for new content to load
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Get current scroll height
      const currentHeight = await page.evaluate(
        () => document.documentElement.scrollHeight,
      );

      // If height hasn't changed, we've reached the end
      if (currentHeight === previousHeight) {
        console.log("Reached end of videos list");
        break;
      }

      previousHeight = currentHeight;
      scrollAttempts++;

      // Log progress every 5 scrolls
      if (scrollAttempts % 5 === 0) {
        const videoCount = await page.evaluate(() => {
          return document.querySelectorAll("ytd-rich-item-renderer").length;
        });
        console.log(
          `Scroll ${scrollAttempts}: Found ${videoCount} videos so far...`,
        );
      }
    }

    console.log("Extracting video data...");

    // Try multiple selectors to find videos
    const videos = await page.evaluate(() => {
      const results: any[] = [];

      // Try different possible selectors
      const selectors = [
        "ytd-rich-item-renderer",
        "ytd-grid-video-renderer",
        "ytd-video-renderer",
      ];

      let videoElements: NodeListOf<Element> | null = null;
      let usedSelector = "";

      for (const selector of selectors) {
        const elements = document.querySelectorAll(selector);
        if (elements.length > 0) {
          videoElements = elements;
          usedSelector = selector;
          break;
        }
      }

      console.log(
        `Using selector: ${usedSelector}, found ${videoElements?.length || 0} elements`,
      );

      if (!videoElements || videoElements.length === 0) {
        // Debug: log all possible video-related elements
        const allLinks = document.querySelectorAll('a[href*="/watch?v="]');
        console.log(`Found ${allLinks.length} watch links`);

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

    console.log(`Found ${videos.length} total videos on channel`);

    // Filter and parse Taraweeh videos
    const taraweehVideos: VideoData[] = [];

    for (const video of videos) {
      const title = video.title;

      // Only process videos starting with "Taraweeh "
      if (!title.startsWith("Taraweeh ")) continue;

      // Parse title format: "Taraweeh YYYY | Hafidh | Section"
      const titleParts = title.split("|").map((p: string) => p.trim());

      let year: number | null = null;
      let hafidh: string | null = null;
      let section: string | null = null;

      if (titleParts.length >= 1) {
        // Extract year from "Taraweeh YYYY"
        const yearMatch = titleParts[0].match(/Taraweeh (\d{4})/);
        if (yearMatch) {
          year = parseInt(yearMatch[1]);
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
        year,
        hafidh,
        section,
      });
    }

    return taraweehVideos;
  } catch (error) {
    console.error("Error scraping YouTube:", error);
    throw error;
  } finally {
    await browser.close();
    console.log("Browser closed");
  }
}

/**
 * Converts Gregorian year to approximate Hijri year
 */
function gregorianToHijri(gregorianYear: number): number {
  // Simple approximation: Hijri = Gregorian - 579 (rough conversion)
  // For Taraweeh during Ramadan, this should be fairly accurate
  return gregorianYear - 579;
}

/**
 * Inserts scraped videos into database
 */
async function importVideosToDatabase(videos: VideoData[]) {
  const db = new Database(dbPath);

  try {
    console.log(`\nImporting ${videos.length} videos to database...`);

    const insertHafidh = db.prepare(`
      INSERT OR IGNORE INTO huffadh (name) VALUES (?)
    `);

    const getHafidhId = db.prepare(`
      SELECT id FROM huffadh WHERE name = ?
    `);

    const getDefaultVenue = db.prepare(`
      SELECT id FROM venues LIMIT 1
    `);

    const insertRecording = db.prepare(`
      INSERT OR IGNORE INTO recordings
      (hafidh_id, venue_id, hijri_year, url, source, section, title)
      VALUES (?, ?, ?, ?, 'youtube', ?, ?)
    `);

    let imported = 0;
    let skipped = 0;

    // Get or create default venue
    let defaultVenueRow = getDefaultVenue.get() as { id: number } | undefined;
    let defaultVenueId = defaultVenueRow?.id;
    if (!defaultVenueId) {
      db.prepare(
        `
        INSERT INTO venues (name, city) VALUES ('Unknown', 'Unknown')
      `,
      ).run();
      defaultVenueRow = getDefaultVenue.get() as { id: number } | undefined;
      defaultVenueId = defaultVenueRow?.id;
    }

    for (const video of videos) {
      if (!video.hafidh || !video.year) {
        console.log(`⚠ Skipping "${video.title}" - missing hafidh or year`);
        skipped++;
        continue;
      }

      // Insert hafidh if not exists
      insertHafidh.run(video.hafidh);

      // Get hafidh ID
      const hafidhRow = getHafidhId.get(video.hafidh) as
        | { id: number }
        | undefined;
      if (!hafidhRow) {
        console.log(`⚠ Could not find hafidh: ${video.hafidh}`);
        skipped++;
        continue;
      }

      const hafidhId = hafidhRow.id;
      const hijriYear = gregorianToHijri(video.year);

      // Insert recording
      try {
        insertRecording.run(
          hafidhId,
          defaultVenueId,
          hijriYear,
          video.url,
          video.section,
          video.title,
        );
        imported++;
        console.log(`✓ Imported: ${video.title}`);
      } catch (error: any) {
        if (error.message.includes("UNIQUE constraint failed")) {
          console.log(`→ Already exists: ${video.title}`);
          skipped++;
        } else {
          throw error;
        }
      }
    }

    console.log(
      `\n✅ Import complete: ${imported} imported, ${skipped} skipped`,
    );
  } finally {
    db.close();
  }
}

// Main execution
async function main() {
  try {
    console.log("🎬 Starting YouTube Taraweeh scraper...\n");

    const videos = await scrapeYouTubeVideos();
    console.log(`\n✓ Found ${videos.length} Taraweeh videos`);

    // Display sample of parsed videos
    console.log("\nSample of parsed videos:");
    videos.slice(0, 5).forEach((v) => {
      console.log(`  - ${v.title}`);
      console.log(
        `    Year: ${v.year}, Hafidh: ${v.hafidh}, Section: ${v.section}`,
      );
    });

    // Import to database
    await importVideosToDatabase(videos);
  } catch (error) {
    console.error("❌ Scraper failed:", error);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { scrapeYouTubeVideos, importVideosToDatabase };
