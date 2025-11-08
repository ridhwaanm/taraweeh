import { g as getAuth } from '../../../chunks/auth_BXYO-Ari.mjs';
import { g as getHuffadh, i as insertHafidh, d as db } from '../../../chunks/db_D1q21JI7.mjs';
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
    const huffadh = await getHuffadh.all();
    return new Response(JSON.stringify(huffadh), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to fetch huffadh" }), {
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
    const { name } = body;
    if (!name) {
      return new Response(JSON.stringify({ error: "Name is required" }), {
        status: 400
      });
    }
    const result = await insertHafidh.run(name);
    return new Response(
      JSON.stringify({ id: Number(result.lastInsertRowid), name }),
      {
        status: 201,
        headers: { "Content-Type": "application/json" }
      }
    );
  } catch (error) {
    if (error?.message?.includes("UNIQUE")) {
      return new Response(JSON.stringify({ error: "Hafidh already exists" }), {
        status: 409
      });
    }
    return new Response(JSON.stringify({ error: "Failed to create hafidh" }), {
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
    const { id, name } = body;
    if (!id || !name) {
      return new Response(
        JSON.stringify({ error: "ID and name are required" }),
        { status: 400 }
      );
    }
    await db.execute({
      sql: "UPDATE huffadh SET name = ? WHERE id = ?",
      args: [name, id]
    });
    return new Response(JSON.stringify({ id, name }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    if (error?.message?.includes("UNIQUE")) {
      return new Response(
        JSON.stringify({ error: "Hafidh name already exists" }),
        { status: 409 }
      );
    }
    return new Response(JSON.stringify({ error: "Failed to update hafidh" }), {
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
      sql: "DELETE FROM huffadh WHERE id = ?",
      args: [id]
    });
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to delete hafidh" }), {
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
