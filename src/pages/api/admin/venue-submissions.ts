import type { APIRoute } from "astro";
import { getAuth } from "../../../lib/auth";
import {
  getVenueSubmissions,
  approveVenueSubmission,
  rejectVenueSubmission,
  db,
} from "../../../lib/db";

export const prerender = false;

export const GET: APIRoute = async (context) => {
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
    const url = new URL(context.request.url);
    const status = url.searchParams.get("status") || undefined;
    const submissions = await getVenueSubmissions.all(status);
    return new Response(JSON.stringify(submissions), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Failed to fetch submissions" }),
      { status: 500 },
    );
  }
};

export const PATCH: APIRoute = async (context) => {
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
    const { id, action } = body;

    if (!id || !action) {
      return new Response(
        JSON.stringify({ error: "ID and action are required" }),
        { status: 400 },
      );
    }

    if (action === "approve") {
      const { final_name, city } = body;
      if (!final_name || !city) {
        return new Response(
          JSON.stringify({
            error: "Venue name and city are required for approval",
          }),
          { status: 400 },
        );
      }
      const venueId = await approveVenueSubmission(id, final_name, city);
      return new Response(
        JSON.stringify({ success: true, venue_id: venueId }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      );
    }

    if (action === "reject") {
      await rejectVenueSubmission(id, body.admin_notes);
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({ error: "Invalid action. Use 'approve' or 'reject'" }),
      { status: 400 },
    );
  } catch (error) {
    console.error("Failed to update submission:", error);
    return new Response(
      JSON.stringify({ error: "Failed to update submission" }),
      { status: 500 },
    );
  }
};

export const DELETE: APIRoute = async (context) => {
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
    const { id } = body;

    if (!id) {
      return new Response(JSON.stringify({ error: "ID is required" }), {
        status: 400,
      });
    }

    await db.execute({
      sql: "DELETE FROM venue_submissions WHERE id = ?",
      args: [id],
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Failed to delete submission" }),
      { status: 500 },
    );
  }
};
