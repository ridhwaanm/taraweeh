import { g as getAuth } from '../../../chunks/auth_DIpvoUV_.mjs';
import { a as getRecordings, b as insertRecording, u as updateRecording, c as deleteRecording } from '../../../chunks/db_D1q21JI7.mjs';
export { renderers } from '../../../renderers.mjs';

const prerender = false;
const GET = async (context) => {
  const auth = getAuth();
  const session = await auth.api.getSession({
    headers: context.request.headers
  });
  if (!session) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401
    });
  }
  try {
    const recordings = await getRecordings.all();
    return new Response(JSON.stringify(recordings), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Failed to fetch recordings" }),
      { status: 500 }
    );
  }
};
const POST = async (context) => {
  const auth = getAuth();
  const session = await auth.api.getSession({
    headers: context.request.headers
  });
  if (!session) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401
    });
  }
  try {
    const body = await context.request.json();
    const { hafidh_id, venue_id, hijri_year, url, source, title, description } = body;
    if (!hafidh_id || !venue_id || !hijri_year || !url || !source) {
      return new Response(
        JSON.stringify({
          error: "Hafidh ID, venue ID, year, URL, and source are required"
        }),
        { status: 400 }
      );
    }
    const result = await insertRecording.run(
      hafidh_id,
      venue_id,
      hijri_year,
      url,
      source,
      title || null,
      description || null
    );
    return new Response(
      JSON.stringify({
        id: Number(result.lastInsertRowid),
        hafidh_id,
        venue_id,
        hijri_year,
        url,
        source,
        title,
        description
      }),
      {
        status: 201,
        headers: { "Content-Type": "application/json" }
      }
    );
  } catch (error) {
    if (error?.message?.includes("UNIQUE")) {
      return new Response(
        JSON.stringify({ error: "Recording URL already exists" }),
        { status: 409 }
      );
    }
    return new Response(
      JSON.stringify({ error: "Failed to create recording" }),
      { status: 500 }
    );
  }
};
const PUT = async (context) => {
  const auth = getAuth();
  const session = await auth.api.getSession({
    headers: context.request.headers
  });
  if (!session) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401
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
      description
    } = body;
    if (!id || !hafidh_id || !venue_id || !hijri_year || !url || !source) {
      return new Response(
        JSON.stringify({
          error: "ID, hafidh ID, venue ID, year, URL, and source are required"
        }),
        { status: 400 }
      );
    }
    await updateRecording.run(
      hafidh_id,
      venue_id,
      hijri_year,
      url,
      source,
      title || null,
      description || null,
      id
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
        description
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" }
      }
    );
  } catch (error) {
    if (error?.message?.includes("UNIQUE")) {
      return new Response(
        JSON.stringify({ error: "Recording URL already exists" }),
        { status: 409 }
      );
    }
    return new Response(
      JSON.stringify({ error: "Failed to update recording" }),
      { status: 500 }
    );
  }
};
const DELETE = async (context) => {
  const auth = getAuth();
  const session = await auth.api.getSession({
    headers: context.request.headers
  });
  if (!session) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401
    });
  }
  try {
    const body = await context.request.json();
    const { id } = body;
    if (!id) {
      return new Response(JSON.stringify({ error: "ID is required" }), {
        status: 400
      });
    }
    await deleteRecording.run(id);
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Failed to delete recording" }),
      { status: 500 }
    );
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  DELETE,
  GET,
  POST,
  PUT,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
