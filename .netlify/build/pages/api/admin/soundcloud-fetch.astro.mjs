import { g as getAuth } from '../../../chunks/auth_DFapIvMi.mjs';
import { e as getOrCreateVenue, f as getOrCreateHafidh, d as db } from '../../../chunks/db_D1q21JI7.mjs';
import puppeteer from 'puppeteer';
export { renderers } from '../../../renderers.mjs';

const prerender = false;
const lastFetchTimes = /* @__PURE__ */ new Map();
const RATE_LIMIT_MS = 5 * 60 * 1e3;
function parseTrackTitle(title, url) {
  let parts;
  if (title.includes("|")) {
    parts = title.split(/\s*\|\s*/).map((p) => p.trim());
  } else {
    parts = title.split(/\s+-\s+(?=\S)/).map((p) => p.trim());
  }
  let hafidh = "Unknown";
  let hijriYear = null;
  let section = null;
  const hafidhParts = [];
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
  if (hafidhParts.length > 0) {
    hafidh = hafidhParts.join(" | ");
  }
  return {
    hafidh,
    hijriYear,
    section,
    title,
    url
  };
}
async function getTracksFromUser(userTracksUrl) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });
  const page = await browser.newPage();
  try {
    await page.goto(userTracksUrl, {
      waitUntil: "domcontentloaded",
      timeout: 12e4
    });
    await new Promise((resolve) => setTimeout(resolve, 5e3));
    let previousHeight = 0;
    let scrollAttempts = 0;
    const maxScrolls = 10;
    while (scrollAttempts < maxScrolls) {
      const currentHeight = await page.evaluate(
        () => document.body.scrollHeight
      );
      if (currentHeight === previousHeight) break;
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await new Promise((resolve) => setTimeout(resolve, 2e3));
      previousHeight = currentHeight;
      scrollAttempts++;
    }
    const tracks = await page.evaluate(() => {
      const tracks2 = [];
      const trackElements = document.querySelectorAll(
        "li.soundList__item, article"
      );
      trackElements.forEach((track) => {
        const linkEl = track.querySelector("a.soundTitle__title");
        if (linkEl) {
          const href = linkEl.getAttribute("href");
          const title = linkEl.textContent?.trim();
          if (href && title) {
            const fullUrl = href.startsWith("http") ? href : `https://soundcloud.com${href}`;
            if (!fullUrl.includes("/sets/") && !tracks2.find((t) => t.url === fullUrl)) {
              tracks2.push({ title, url: fullUrl });
            }
          }
        }
      });
      return tracks2;
    });
    await browser.close();
    return tracks;
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
    const userTracksUrl = "https://soundcloud.com/aswaatulqurraa/tracks";
    const allTracks = await getTracksFromUser(userTracksUrl);
    const tracks = allTracks.filter(
      (track) => track.title.includes("Taraweeh 14")
    );
    console.log(
      `Total tracks found: ${allTracks.length}, Filtered to Taraweeh tracks: ${tracks.length}`
    );
    if (tracks.length === 0) {
      return new Response(
        JSON.stringify({
          error: `No Taraweeh tracks found (looking for "Taraweeh 14" in title)`
        }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" }
        }
      );
    }
    const defaultVenueId = await getOrCreateVenue(
      "Aswaat-ul-Qurraa",
      "Cape Town"
    );
    let imported = 0;
    let updated = 0;
    const errors = [];
    for (const track of tracks) {
      try {
        const parsed = parseTrackTitle(track.title, track.url);
        const hafidhId = await getOrCreateHafidh(parsed.hafidh);
        const year = parsed.hijriYear || 1446;
        const existingResult = await db.execute({
          sql: "SELECT id FROM recordings WHERE url = ?",
          args: [parsed.url]
        });
        const existing = existingResult.rows.length > 0 ? { id: existingResult.rows[0][0] } : void 0;
        if (existing) {
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
              existing.id
            ]
          });
          updated++;
        } else {
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
              parsed.title
            ]
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
        skipped: 0,
        // We no longer skip, we update instead
        errors: errors.length,
        errorDetails: errors.length > 0 ? errors : void 0
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("SoundCloud fetch error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch SoundCloud tracks" }),
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
