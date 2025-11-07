import { betterAuth } from 'better-auth';
import Database from 'better-sqlite3';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename$1 = fileURLToPath(import.meta.url);
const __dirname$1 = dirname(__filename$1);
const dbPath = join(__dirname$1, "../../db/taraweeh.db");
function getAuth() {
  if (!process.env.BETTER_AUTH_SECRET) {
    throw new Error(
      "BETTER_AUTH_SECRET environment variable is required. Generate one with: openssl rand -base64 48"
    );
  }
  return betterAuth({
    database: new Database(dbPath),
    emailAndPassword: {
      enabled: true,
      // Require strong passwords
      requireEmailVerification: false,
      // Set to true if you implement email verification
      // Limit failed login attempts
      maxPasswordLength: 128
    },
    secret: process.env.BETTER_AUTH_SECRET,
    baseURL: process.env.BETTER_AUTH_URL,
    // Security: Advanced session configuration
    session: {
      expiresIn: 60 * 60 * 24 * 7,
      // 7 days
      updateAge: 60 * 60 * 24,
      // Update session every 24 hours
      cookieCache: {
        enabled: true,
        maxAge: 5 * 60
        // Cache for 5 minutes
      }
    },
    // Security: Enable rate limiting
    rateLimit: {
      enabled: true,
      window: 60,
      // 60 seconds
      max: 10
      // 10 requests per window
    },
    // Security: Advanced options
    advanced: {
      // Generate cryptographically secure session tokens
      generateId: void 0,
      // Uses default secure generator
      // Use secure cookies
      useSecureCookies: process.env.NODE_ENV === "production",
      // CSRF protection
      crossSubDomainCookies: {
        enabled: false
      }
    },
    // Security: Trusted origins (update for production)
    trustedOrigins: process.env.BETTER_AUTH_URL ? [process.env.BETTER_AUTH_URL] : []
  });
}

export { getAuth as g };
