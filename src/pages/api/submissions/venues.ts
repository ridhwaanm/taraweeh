import type { APIRoute } from "astro";
import { insertVenueSubmission } from "../../../lib/db";

export const prerender = false;

export const POST: APIRoute = async (context) => {
  try {
    const body = await context.request.json();

    // Honeypot — bots fill hidden fields
    if (body.website) {
      return new Response(JSON.stringify({ success: true }), {
        status: 201,
        headers: { "Content-Type": "application/json" },
      });
    }

    const {
      venue_name,
      sub_venue_name,
      address_full,
      city,
      province,
      country,
      latitude,
      longitude,
      google_place_id,
      juz_per_night,
      reader_names,
      whatsapp_number,
    } = body;

    // Validation
    if (
      !venue_name ||
      typeof venue_name !== "string" ||
      venue_name.trim().length < 2 ||
      venue_name.trim().length > 100
    ) {
      return new Response(
        JSON.stringify({
          error: "Venue name is required (2-100 characters)",
          field: "venue_name",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    if (
      !address_full ||
      typeof address_full !== "string" ||
      !address_full.trim()
    ) {
      return new Response(
        JSON.stringify({ error: "Address is required", field: "address_full" }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    if (!city || typeof city !== "string" || !city.trim()) {
      return new Response(
        JSON.stringify({ error: "City is required", field: "city" }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const lat = Number(latitude);
    const lng = Number(longitude);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      return new Response(
        JSON.stringify({
          error: "Valid latitude and longitude are required",
          field: "latitude",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    // Clean WhatsApp number: strip spaces, hyphens, parens
    const cleanNumber = String(whatsapp_number || "").replace(/[\s\-()]/g, "");
    if (cleanNumber && !/^\+?\d{10,15}$/.test(cleanNumber)) {
      return new Response(
        JSON.stringify({
          error: "WhatsApp number must be 10-15 digits",
          field: "whatsapp_number",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    if (juz_per_night !== undefined && juz_per_night !== null) {
      const juz = Number(juz_per_night);
      if (!Number.isFinite(juz) || juz < 0.25 || juz > 10) {
        return new Response(
          JSON.stringify({
            error: "Juz per night must be between 0.25 and 10",
            field: "juz_per_night",
          }),
          { status: 400, headers: { "Content-Type": "application/json" } },
        );
      }
    }

    if (
      reader_names &&
      typeof reader_names === "string" &&
      reader_names.length > 500
    ) {
      return new Response(
        JSON.stringify({
          error: "Reader names must be under 500 characters",
          field: "reader_names",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    await insertVenueSubmission.run({
      venue_name: venue_name.trim(),
      sub_venue_name: sub_venue_name?.trim() || undefined,
      address_full: address_full.trim(),
      city: city.trim(),
      province: province?.trim() || undefined,
      country: country?.trim() || undefined,
      latitude: lat,
      longitude: lng,
      google_place_id: google_place_id || undefined,
      juz_per_night: juz_per_night ? Number(juz_per_night) : undefined,
      reader_names: reader_names?.trim() || undefined,
      whatsapp_number: cleanNumber || undefined,
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Failed to create venue submission:", error);
    return new Response(JSON.stringify({ error: "Failed to submit venue" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
