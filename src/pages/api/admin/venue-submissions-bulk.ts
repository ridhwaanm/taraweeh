import type { APIRoute } from "astro";
import { getAuth } from "../../../lib/auth";
import { insertVenueSubmission } from "../../../lib/db";

export const prerender = false;

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

    let imported = 0;
    let errors = 0;
    const errorDetails: string[] = [];

    for (let i = 0; i < submissions.length; i++) {
      const sub = submissions[i];
      try {
        // Validate required fields
        if (!sub.venue_name || !sub.address_full || !sub.city) {
          throw new Error(
            "Missing required field (venue_name, address_full, or city)",
          );
        }
        const lat = parseFloat(sub.latitude);
        const lng = parseFloat(sub.longitude);
        if (!isFinite(lat) || !isFinite(lng)) {
          throw new Error("Invalid latitude or longitude");
        }

        await insertVenueSubmission.run({
          venue_name: sub.venue_name,
          sub_venue_name: sub.sub_venue_name || undefined,
          address_full: sub.address_full,
          city: sub.city,
          province: sub.province || undefined,
          country: sub.country || "ZA",
          latitude: lat,
          longitude: lng,
          google_place_id: sub.google_place_id || undefined,
          juz_per_night: sub.juz_per_night
            ? parseFloat(sub.juz_per_night)
            : undefined,
          reader_names: sub.reader_names || undefined,
          whatsapp_number: sub.whatsapp_number || undefined,
        });
        imported++;
      } catch (err: any) {
        errors++;
        errorDetails.push(
          `Row ${i + 1} (${sub.venue_name || "unknown"}): ${err.message}`,
        );
      }
    }

    return new Response(
      JSON.stringify({
        total: submissions.length,
        imported,
        errors,
        errorDetails,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Failed to import submissions" }),
      { status: 500 },
    );
  }
};
