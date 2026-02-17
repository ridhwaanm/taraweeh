import type { APIRoute } from "astro";
import { getAuth } from "../../../lib/auth";
import {
  getVenueSubmissions,
  getVenueSubmissionById,
  approveVenueSubmission,
  bulkApproveVenueSubmissions,
  rejectVenueSubmission,
  updateVenueSubmission,
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
    const { action } = body;

    if (!action) {
      return new Response(JSON.stringify({ error: "Action is required" }), {
        status: 400,
      });
    }

    // Bulk operations use `ids`, single operations use `id`
    const ids: number[] = body.ids || (body.id ? [body.id] : []);
    if (ids.length === 0) {
      return new Response(JSON.stringify({ error: "ID or IDs are required" }), {
        status: 400,
      });
    }

    if (action === "approve") {
      // Single approve with custom name/city
      if (!body.ids && body.final_name && body.city) {
        const venueId = await approveVenueSubmission(
          ids[0],
          body.final_name,
          body.city,
        );
        return new Response(
          JSON.stringify({ success: true, venue_id: venueId }),
          { status: 200, headers: { "Content-Type": "application/json" } },
        );
      }
      // Bulk approve — batch operation
      const count = await bulkApproveVenueSubmissions(ids);
      return new Response(JSON.stringify({ success: true, count }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (action === "reject") {
      let count = 0;
      for (const id of ids) {
        await rejectVenueSubmission(id, body.admin_notes);
        count++;
      }
      return new Response(JSON.stringify({ success: true, count }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (action === "edit") {
      if (ids.length !== 1) {
        return new Response(
          JSON.stringify({ error: "Edit requires exactly one ID" }),
          { status: 400 },
        );
      }
      const { venue_name, address_full, city, latitude, longitude } = body;
      if (
        !venue_name ||
        !address_full ||
        !city ||
        latitude == null ||
        longitude == null
      ) {
        return new Response(
          JSON.stringify({
            error:
              "venue_name, address_full, city, latitude, and longitude are required",
          }),
          { status: 400 },
        );
      }
      await updateVenueSubmission(ids[0], {
        venue_name,
        sub_venue_name: body.sub_venue_name,
        address_full,
        city,
        province: body.province,
        latitude,
        longitude,
        juz_per_night: body.juz_per_night,
        reader_names: body.reader_names,
        whatsapp_number: body.whatsapp_number,
      });
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({
        error: "Invalid action. Use 'approve', 'reject', or 'edit'",
      }),
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
    const ids: number[] = body.ids || (body.id ? [body.id] : []);

    if (ids.length === 0) {
      return new Response(JSON.stringify({ error: "ID or IDs are required" }), {
        status: 400,
      });
    }

    const placeholders = ids.map(() => "?").join(", ");
    await db.execute({
      sql: `DELETE FROM venue_submissions WHERE id IN (${placeholders})`,
      args: ids,
    });

    return new Response(JSON.stringify({ success: true, count: ids.length }), {
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
