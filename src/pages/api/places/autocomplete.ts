import type { APIRoute } from "astro";

export const prerender = false;

export const GET: APIRoute = async ({ url, request }) => {
  const input = url.searchParams.get("input");
  if (!input || input.trim().length < 2) {
    return new Response(JSON.stringify({ suggestions: [] }), {
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

  const res = await fetch(
    "https://places.googleapis.com/v1/places:autocomplete",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
        Referer: request.headers.get("referer") || url.origin,
      },
      body: JSON.stringify({
        input: input.trim(),
        includedRegionCodes: ["ZA"],
      }),
    },
  );

  if (!res.ok) {
    const err = await res.text();
    console.error("Places autocomplete error:", err);
    return new Response(JSON.stringify({ suggestions: [] }), {
      headers: { "Content-Type": "application/json" },
    });
  }

  const data = await res.json();
  const suggestions = (data.suggestions || [])
    .filter((s: any) => s.placePrediction)
    .map((s: any) => ({
      placeId: s.placePrediction.placeId,
      text: s.placePrediction.text?.text || "",
      description: s.placePrediction.structuredFormat?.mainText?.text || "",
      secondaryText:
        s.placePrediction.structuredFormat?.secondaryText?.text || "",
    }));

  return new Response(JSON.stringify({ suggestions }), {
    headers: { "Content-Type": "application/json" },
  });
};
