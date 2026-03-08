// src/app/api/members/route.ts
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/schema";
import { ok, unauthorized, forbidden } from "@/lib/http-errors";

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user) return unauthorized();
  if (session.user.role !== "admin") return forbidden();

  const allMembers = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      points: users.points,
      isActive: users.isActive,
      committeeId: users.committeeId,
      createdAt: users.createdAt,
    })
    .from(users);

  return ok(allMembers);
}
