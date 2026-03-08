"use server";

import { ApiResponse, ErrorResponse, Member } from "@/types";
import { db } from "../db";
import { users, committees } from "../schema";
import { eq, getTableColumns } from "drizzle-orm";
import handleError from "../handlers/error";
import { deleteMemberSchema } from "../validations";
import { revalidatePath } from "next/cache";
import { logActivity } from "./activity-log.services";
import { auth } from "@/auth";

export async function getAllMembers(): Promise<ApiResponse<Member[]>> {
  try {
    const allMembers = await db
      .select({
        ...getTableColumns(users),
        committeeName: committees.name,
      })
      .from(users)
      .leftJoin(committees, eq(users.committeeId, committees.id))
      .orderBy(users.name);
    return {
      success: true,
      data: allMembers,
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function memberActivate(params: {
  id: string;
}): Promise<ApiResponse<void>> {
  try {
    const session = await auth();
    // Validate UUID format
    const validationResult = deleteMemberSchema.safeParse(params);
    if (!validationResult.success) {
      return {
        success: false,
        error: "Invalid member ID format",
      };
    }

    const { id } = validationResult.data;

    // Check if member exists
    const existingMember = await db
      .select({
        id: users.id,
        role: users.role,
        isActive: users.isActive,
        name: users.name,
      })
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    if (existingMember.length === 0) {
      return {
        success: false,
        error: "Member not found",
      };
    }

    if (existingMember[0].role === "admin") {
      return {
        success: false,
        error: "Cannot deactivate admin user",
      };
    }

    await db
      .update(users)
      .set({ isActive: !existingMember[0].isActive })
      .where(eq(users.id, id));

    await logActivity({
      eventType: existingMember[0].isActive
        ? "user.deactivated"
        : "user.activated",
      actorId: session?.user.id || "",
      targetId: id,
      targetType: "user",
      metadata: {
        name: existingMember[0].name,
        isActive: !existingMember[0].isActive,
      },
    });

    revalidatePath("/dashboard/members");
    return {
      success: true,
      data: undefined,
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
