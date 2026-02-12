import type { APIRoute } from "astro";

export const prerender = false;

export const GET: APIRoute = async ({ url, request }) => {
  const placeId = url.searchParams.get("placeId");
  if (!placeId) {
    return new Response(JSON.stringify({ error: "placeId required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const apiKey = import.meta.env.PUBLIC_GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: "Maps API not configured" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  const fields = "formattedAddress,location,addressComponents,displayName";
  const res = await fetch(
    `https://places.googleapis.com/v1/places/${placeId}?fields=${fields}`,
    {
      headers: {
        "X-Goog-Api-Key": apiKey,
        Referer: request.headers.get("referer") || url.origin,
      },
    },
  );

  if (!res.ok) {
    const err = await res.text();
    console.error("Places details error:", err);
    return new Response(JSON.stringify({ error: "Failed to fetch details" }), {
      status: 502,
      headers: { "Content-Type": "application/json" },
    });
  }

  const place = await res.json();
  const components: any[] = place.addressComponents || [];

  const cityComp = components.find(
    (c: any) => c.types.includes("locality") || c.types.includes("sublocality"),
  );
  const provinceComp = components.find((c: any) =>
    c.types.includes("administrative_area_level_1"),
  );

  return new Response(
    JSON.stringify({
      addressFull: place.formattedAddress || "",
      city: cityComp?.longText || "",
      province: provinceComp?.longText || "",
      latitude: place.location?.latitude || null,
      longitude: place.location?.longitude || null,
      placeId,
    }),
    { headers: { "Content-Type": "application/json" } },
  );
};
