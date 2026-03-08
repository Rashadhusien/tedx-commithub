// src/app/api/members/route.ts
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { inviteMemberSchema } from "@/lib/validations";
import {
  created,
  unauthorized,
  forbidden,
  conflict,
  zodError,
} from "@/lib/http-errors";
import { logActivity } from "@/lib/services/activity-log.services";
import { nanoid } from "nanoid";
import bcrypt from "bcryptjs";
import { sendInviteEmail } from "@/lib/services/mail.services";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return unauthorized();
  if (session.user.role !== "admin") return forbidden();

  const body = await req.json();
  const parsed = inviteMemberSchema.safeParse(body);
  if (!parsed.success) return zodError(parsed.error);

  const { email, committeeId, role } = parsed.data;

  // Check if email already exists
  const [existing] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, email))
    .limit(1);
  if (existing) return conflict("A user with this email already exists");

  const inviteToken = nanoid(32);
  const inviteExpiresAt = new Date(Date.now() + 1000 * 60 * 60 * 48); // 48h

  // Create placeholder user — they complete registration via invite link
  const [newUser] = await db
    .insert(users)
    .values({
      name: email.split("@")[0], // temporary name
      email,
      passwordHash: await bcrypt.hash(nanoid(16), 12), // temp hash — overwritten at registration
      role,
      committeeId: committeeId ?? null,
      inviteToken,
      inviteExpiresAt,
      isActive: false, // activated when they complete registration
    })
    .returning({ id: users.id, email: users.email, name: users.name });

  await sendInviteEmail({ email, inviteToken, inviterName: newUser.name });

  await logActivity({
    eventType: "user.invited",
    actorId: session.user.id,
    targetId: newUser.id,
    targetType: "user",
    metadata: { email, role },
  });

  return created({
    message: "Invitation sent",
    inviteLink: `${process.env.NEXT_PUBLIC_APP_URL}/register?token=${inviteToken}`,
  });
}
