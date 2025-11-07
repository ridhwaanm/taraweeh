import Database from "better-sqlite3";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { randomBytes } from "crypto";
import { hashPassword } from "better-auth/crypto";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbPath = join(__dirname, "../db/taraweeh.db");
const db = new Database(dbPath);

// Get email and password from command line arguments
const email = process.argv[2];
const password = process.argv[3];

if (!email || !password) {
  console.error("Usage: npm run create-admin <email> <password>");
  process.exit(1);
}

const userId = randomBytes(16).toString("hex");
const accountId = randomBytes(16).toString("hex");
const now = Date.now();

async function createAdmin() {
  try {
    // Check if user already exists
    const existingUser = db
      .prepare("SELECT * FROM user WHERE email = ?")
      .get(email);

    if (existingUser) {
      console.log("⚠️  User with this email already exists");
      process.exit(1);
    }

    // Hash password using Better Auth's crypto
    const hashedPassword = await hashPassword(password);

    // Create user
    db.prepare(
      `INSERT INTO user (id, email, emailVerified, name, createdAt, updatedAt)
       VALUES (?, ?, 1, ?, ?, ?)`,
    ).run(userId, email, email.split("@")[0], now, now);

    // Create account with password
    db.prepare(
      `INSERT INTO account (id, userId, accountId, providerId, password, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
    ).run(accountId, userId, email, "credential", hashedPassword, now, now);

    console.log("✅ Admin user created successfully");
    console.log(`   Email: ${email}`);
    console.log("   You can now log in at /admin/login");
  } catch (error: any) {
    console.error("❌ Error creating admin user:", error.message);
    process.exit(1);
  } finally {
    db.close();
  }
}

createAdmin();
