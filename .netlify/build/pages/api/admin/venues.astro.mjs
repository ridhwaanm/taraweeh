import { g as getAuth } from '../../../chunks/auth_BTFUhMOl.mjs';
import { h as getVenues, j as insertVenue, d as db } from '../../../chunks/db_D1q21JI7.mjs';
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
    const venues = await getVenues.all();
    return new Response(JSON.stringify(venues), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to fetch venues" }), {
      status: 500
    });
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
    const { name, city } = body;
    if (!name || !city) {
      return new Response(
        JSON.stringify({ error: "Name and city are required" }),
        { status: 400 }
      );
    }
    const result = await insertVenue.run(name, city);
    return new Response(
      JSON.stringify({ id: Number(result.lastInsertRowid), name, city }),
      {
        status: 201,
        headers: { "Content-Type": "application/json" }
      }
    );
  } catch (error) {
    if (error?.message?.includes("UNIQUE")) {
      return new Response(JSON.stringify({ error: "Venue already exists" }), {
        status: 409
      });
    }
    return new Response(JSON.stringify({ error: "Failed to create venue" }), {
      status: 500
    });
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
    const { id, name, city } = body;
    if (!id || !name || !city) {
      return new Response(
        JSON.stringify({ error: "ID, name, and city are required" }),
        { status: 400 }
      );
    }
    await db.execute({
      sql: "UPDATE venues SET name = ?, city = ? WHERE id = ?",
      args: [name, city, id]
    });
    return new Response(JSON.stringify({ id, name, city }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    if (error?.message?.includes("UNIQUE")) {
      return new Response(JSON.stringify({ error: "Venue already exists" }), {
        status: 409
      });
    }
    return new Response(JSON.stringify({ error: "Failed to update venue" }), {
      status: 500
    });
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
    await db.execute({
      sql: "DELETE FROM venues WHERE id = ?",
      args: [id]
    });
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to delete venue" }), {
      status: 500
    });
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
