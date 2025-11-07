import { createAuthClient } from 'better-auth/react';

const authClient = createAuthClient({
  baseURL: typeof window !== "undefined" ? window.location.origin : ""
});
const { signIn, signOut, signUp, useSession } = authClient;

export { signOut as a, signIn as s, useSession as u };
