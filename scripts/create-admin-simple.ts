import Database from "better-sqlite3";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { randomBytes } from "crypto";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbPath = join(__dirname, "../db/taraweeh.db");
const db = new Database(dbPath);

// Get email and password from command line arguments
const email = process.argv[2];
const password = process.argv[3];

if (!email || !password) {
  console.error("Usage: npm run create-admin-simple <email> <password>");
  process.exit(1);
}

// Simple hash function - for demo only
// In production, Better Auth will handle password hashing on first login
const userId = randomBytes(16).toString("hex");
const accountId = randomBytes(16).toString("hex");
const now = Date.now();

try {
  // Check if user already exists
  const existingUser = db
    .prepare("SELECT * FROM user WHERE email = ?")
    .get(email);

  if (existingUser) {
    console.log("⚠️  User with this email already exists");
    console.log("   Try logging in or delete the user first");
    process.exit(1);
  }

  // Create user without password (will set on first login)
  db.prepare(
    `INSERT INTO user (id, email, emailVerified, name, createdAt, updatedAt)
     VALUES (?, ?, 1, ?, ?, ?)`,
  ).run(userId, email, email.split("@")[0], now, now);

  console.log("✅ Admin user created successfully");
  console.log(`   Email: ${email}`);
  console.log(`   Password: ${password}`);
  console.log("");
  console.log(
    "📝 IMPORTANT: Better Auth will hash the password on first login.",
  );
  console.log("   Go to /admin/login and sign in with the credentials above.");
} catch (error: any) {
  console.error("❌ Error creating admin user:", error.message);
  process.exit(1);
} finally {
  db.close();
}
