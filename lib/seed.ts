// src/lib/db/seed.ts
// Run: npm run db:seed
import { db } from "@/lib/db";
import { committees, users } from "@/lib/schema";
import bcrypt from "bcryptjs";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function seed() {
  console.log("🌱 Seeding CommitHub database...");

  // ── Committees ─────────────────────────────────────────────────────────────
  const committeeData = [
    {
      name: "Marketing",
      description: "Handles all marketing campaigns and outreach",
    },
    {
      name: "Design",
      description: "UI/UX design, brand identity, and visual assets",
    },
    {
      name: "Media",
      description: "Video production, photography, and content creation",
    },
    {
      name: "Logistics",
      description: "Operations, events, and resource coordination",
    },
    {
      name: "PR",
      description: "Public relations, partnerships, and communications",
    },
    {
      name: "Tech",
      description: "Software development and technical infrastructure",
    },
  ];

  const insertedCommittees = await db
    .insert(committees)
    .values(committeeData)
    .onConflictDoNothing()
    .returning();

  console.log(`  ✓ ${insertedCommittees.length} committees seeded`);

  // ── Bootstrap Admin ────────────────────────────────────────────────────────
  const adminEmail = process.env.SEED_ADMIN_EMAIL ?? "admin@commithub.local";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? "Admin123!";
  const adminName = process.env.SEED_ADMIN_NAME ?? "System Administrator";

  const passwordHash = await bcrypt.hash(adminPassword, 12);

  const [admin] = await db
    .insert(users)
    .values({
      name: adminName,
      email: adminEmail,
      passwordHash,
      role: "admin",
    })
    .onConflictDoNothing()
    .returning();

  if (admin) {
    console.log(`  ✓ Admin account created: ${adminEmail}`);
  } else {
    console.log(`  ℹ Admin already exists: ${adminEmail}`);
  }

  console.log("✅ Seed complete!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
