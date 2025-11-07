import { getAuth } from "../../../lib/auth";
import type { APIRoute } from "astro";

export const prerender = false;

export const ALL: APIRoute = async (context) => {
  const auth = getAuth();

  // Use auth.handler to handle all authentication requests
  return auth.handler(context.request);
};
