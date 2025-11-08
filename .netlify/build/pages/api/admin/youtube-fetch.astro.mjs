import { g as getAuth } from '../../../chunks/auth_BTFUhMOl.mjs';
import { e as getOrCreateVenue, f as getOrCreateHafidh, d as db } from '../../../chunks/db_D1q21JI7.mjs';
import puppeteer from 'puppeteer';
export { renderers } from '../../../renderers.mjs';

const prerender = false;
const lastFetchTimes = /* @__PURE__ */ new Map();
const RATE_LIMIT_MS = 5 * 60 * 1e3;
async function scrapeYouTubeVideos() {
  const channelUrl = "https://www.youtube.com/@aswaatulqurraa/search?query=taraweeh";
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    await page.goto(channelUrl, {
      waitUntil: "domcontentloaded",
      timeout: 12e4
    });
    await new Promise((resolve) => setTimeout(resolve, 5e3));
    let previousHeight = 0;
    let scrollAttempts = 0;
    const maxScrollAttempts = 50;
    let noChangeCount = 0;
    console.log("Starting pagination scroll...");
    while (scrollAttempts < maxScrollAttempts) {
      await page.evaluate(() => {
        window.scrollTo(0, document.documentElement.scrollHeight);
      });
      await new Promise((resolve) => setTimeout(resolve, 2e3));
      const currentHeight = await page.evaluate(
        () => document.documentElement.scrollHeight
      );
      if (currentHeight === previousHeight) {
        noChangeCount++;
        if (noChangeCount >= 3) {
          console.log("Reached end of videos list");
          break;
        }
      } else {
        noChangeCount = 0;
      }
      previousHeight = currentHeight;
      scrollAttempts++;
      if (scrollAttempts % 10 === 0) {
        const videoCount = await page.evaluate(() => {
          return document.querySelectorAll("ytd-rich-item-renderer").length;
        });
        console.log(
          `Scroll attempt ${scrollAttempts}: Found ${videoCount} videos so far...`
        );
      }
    }
    const videos = await page.evaluate(() => {
      const results = [];
      const selectors = [
        "ytd-rich-item-renderer",
        "ytd-grid-video-renderer",
        "ytd-video-renderer"
      ];
      let videoElements = null;
      for (const selector of selectors) {
        const elements = document.querySelectorAll(selector);
        if (elements.length > 0) {
          videoElements = elements;
          break;
        }
      }
      if (!videoElements || videoElements.length === 0) {
        const allLinks = document.querySelectorAll('a[href*="/watch?v="]');
        allLinks.forEach((link) => {
          const href = link.getAttribute("href") || "";
          const title = link.getAttribute("title") || link.textContent?.trim() || "";
          if (title && href.includes("/watch?v=")) {
            results.push({
              title,
              url: href.startsWith("http") ? href : `https://www.youtube.com${href}`
            });
          }
        });
      } else {
        videoElements.forEach((element) => {
          let titleElement = element.querySelector("#video-title");
          if (!titleElement) {
            titleElement = element.querySelector("a#video-title-link");
          }
          if (!titleElement) {
            titleElement = element.querySelector("a[title]");
          }
          const title = titleElement?.getAttribute("title") || titleElement?.textContent?.trim() || "";
          const videoUrl = titleElement?.getAttribute("href") || "";
          if (title && videoUrl) {
            results.push({
              title,
              url: videoUrl.startsWith("http") ? videoUrl : `https://www.youtube.com${videoUrl}`
            });
          }
        });
      }
      const uniqueResults = Array.from(
        new Map(results.map((item) => [item.url, item])).values()
      );
      return uniqueResults;
    });
    await browser.close();
    console.log(`Total videos found on channel: ${videos.length}`);
    const taraweehVideos = [];
    for (const video of videos) {
      const title = video.title;
      if (!title.startsWith("Taraweeh ")) continue;
      const titleParts = title.split("|").map((p) => p.trim());
      let hijriYear = null;
      let hafidh = null;
      let section = null;
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
      taraweehVideos.push({
        title,
        url: video.url,
        hijriYear,
        hafidh,
        section
      });
    }
    console.log(
      `Filtered to ${taraweehVideos.length} Taraweeh videos (starting with "Taraweeh ")`
    );
    return taraweehVideos;
  } catch (error) {
    await browser.close();
    throw error;
  }
}
const POST = async (context) => {
  const auth = getAuth();
  const session = await auth.api.getSession({
    headers: context.request.headers
  });
  if (!session) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" }
    });
  }
  const userId = session.user.id;
  const lastFetch = lastFetchTimes.get(userId);
  const now = Date.now();
  if (lastFetch && now - lastFetch < RATE_LIMIT_MS) {
    const remainingTime = Math.ceil((RATE_LIMIT_MS - (now - lastFetch)) / 1e3);
    return new Response(
      JSON.stringify({
        error: `Please wait ${remainingTime} seconds before fetching again`
      }),
      { status: 429, headers: { "Content-Type": "application/json" } }
    );
  }
  lastFetchTimes.set(userId, now);
  try {
    const videos = await scrapeYouTubeVideos();
    if (videos.length === 0) {
      return new Response(JSON.stringify({ error: "No videos found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }
    const defaultVenueId = await getOrCreateVenue(
      "Aswaat-ul-Qurraa",
      "Cape Town"
    );
    let imported = 0;
    let skipped = 0;
    const errors = [];
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
          args: [video.url]
        });
        if (existingResult.rows.length > 0) {
          skipped++;
          continue;
        }
        await db.execute({
          sql: `
            INSERT INTO recordings (hafidh_id, venue_id, hijri_year, url, source, section, title)
            VALUES (?, ?, ?, ?, 'youtube', ?, ?)
          `,
          args: [
            hafidhId,
            defaultVenueId,
            video.hijriYear,
            video.url,
            video.section,
            video.title
          ]
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
        errorDetails: errors.length > 0 ? errors : void 0
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("YouTube fetch error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch YouTube videos" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
