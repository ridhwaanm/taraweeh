import type { APIRoute } from "astro";
import { getAuth } from "../../../lib/auth";
import {
  db,
  getRecordings,
  insertRecording,
  updateRecording,
  deleteRecording,
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
    const recordings = getRecordings.all();
    return new Response(JSON.stringify(recordings), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Failed to fetch recordings" }),
      { status: 500 },
    );
  }
};

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
    const { hafidh_id, venue_id, hijri_year, url, source, title, description } =
      body;

    if (!hafidh_id || !venue_id || !hijri_year || !url || !source) {
      return new Response(
        JSON.stringify({
          error: "Hafidh ID, venue ID, year, URL, and source are required",
        }),
        { status: 400 },
      );
    }

    const result = insertRecording.run(
      hafidh_id,
      venue_id,
      hijri_year,
      url,
      source,
      title || null,
      description || null,
    );
    return new Response(
      JSON.stringify({
        id: result.lastInsertRowid,
        hafidh_id,
        venue_id,
        hijri_year,
        url,
        source,
        title,
        description,
      }),
      {
        status: 201,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error: any) {
    if (error?.message?.includes("UNIQUE")) {
      return new Response(
        JSON.stringify({ error: "Recording URL already exists" }),
        { status: 409 },
      );
    }
    return new Response(
      JSON.stringify({ error: "Failed to create recording" }),
      { status: 500 },
    );
  }
};

export const PUT: APIRoute = async (context) => {
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
    const {
      id,
      hafidh_id,
      venue_id,
      hijri_year,
      url,
      source,
      title,
      description,
    } = body;

    if (!id || !hafidh_id || !venue_id || !hijri_year || !url || !source) {
      return new Response(
        JSON.stringify({
          error: "ID, hafidh ID, venue ID, year, URL, and source are required",
        }),
        { status: 400 },
      );
    }

    updateRecording.run(
      hafidh_id,
      venue_id,
      hijri_year,
      url,
      source,
      title || null,
      description || null,
      id,
    );

    return new Response(
      JSON.stringify({
        id,
        hafidh_id,
        venue_id,
        hijri_year,
        url,
        source,
        title,
        description,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error: any) {
    if (error?.message?.includes("UNIQUE")) {
      return new Response(
        JSON.stringify({ error: "Recording URL already exists" }),
        { status: 409 },
      );
    }
    return new Response(
      JSON.stringify({ error: "Failed to update recording" }),
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

    deleteRecording.run(id);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Failed to delete recording" }),
      { status: 500 },
    );
  }
};
