import type { APIRoute } from "astro";
import { getAuth } from "../../../lib/auth";
import { bulkInsertVenueSubmissions } from "../../../lib/db";

export const prerender = false;

function stripWrappingQuotes(s: string): string {
  if (
    s.length >= 2 &&
    ((s[0] === "'" && s[s.length - 1] === "'") ||
      (s[0] === '"' && s[s.length - 1] === '"'))
  ) {
    return s.slice(1, -1);
  }
  return s;
}

export const POST: APIRoute = async (context) => {
  const auth = getAuth();
  const session = await auth.api.getSession({
    headers: context.request.headers,
  });
  if (!session) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  try {
    const body = await context.request.json();
    const { submissions } = body;

    if (!Array.isArray(submissions) || submissions.length === 0) {
      return new Response(
        JSON.stringify({ error: "submissions array is required" }),
        { status: 400 },
      );
    }

    const rows = submissions.map((sub: Record<string, string>) => ({
      venue_name: (sub.venue_name || "").trim(),
      sub_venue_name: (sub.sub_venue_name || "").trim() || undefined,
      address_full: (sub.address_full || "").trim(),
      city: (sub.city || "").trim(),
      province: (sub.province || "").trim() || undefined,
      country: (sub.country || "").trim() || "ZA",
      latitude: parseFloat(sub.latitude),
      longitude: parseFloat(sub.longitude),
      google_place_id: (sub.google_place_id || "").trim() || undefined,
      juz_per_night: sub.juz_per_night
        ? parseFloat(sub.juz_per_night)
        : undefined,
      reader_names: sub.reader_names
        ? stripWrappingQuotes(sub.reader_names.trim())
        : undefined,
      whatsapp_number: (sub.whatsapp_number || "").trim() || undefined,
    }));

    const result = await bulkInsertVenueSubmissions(rows);

    return new Response(
      JSON.stringify({
        total: submissions.length,
        imported: result.imported,
        duplicates: result.duplicates,
        errors: result.errors,
        errorDetails: result.errorDetails,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.error("Failed to import submissions:", error);
    return new Response(
      JSON.stringify({ error: "Failed to import submissions" }),
      { status: 500 },
    );
  }
};
