import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL:
    import.meta.env.PUBLIC_BETTER_AUTH_URL || typeof window !== "undefined"
      ? window.location.origin
      : "",
});

export const { signIn, signOut, signUp, useSession } = authClient;
