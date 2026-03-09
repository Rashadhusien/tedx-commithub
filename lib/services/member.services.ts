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

//get all leaders
export async function getLeaders(): Promise<ApiResponse<Member[]>> {
  try {
    const leaders = await db
      .select({
        ...getTableColumns(users),
        committeeName: committees.name,
      })
      .from(users)
      .leftJoin(committees, eq(users.committeeId, committees.id))
      .where(eq(users.role, "leader"))
      .orderBy(users.name);
    return {
      success: true,
      data: leaders,
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function getActiveMembers(): Promise<ApiResponse<Member[]>> {
  try {
    const activeMembers = await db
      .select({
        ...getTableColumns(users),
        committeeName: committees.name,
      })
      .from(users)
      .leftJoin(committees, eq(users.committeeId, committees.id))
      .where(eq(users.isActive, true))
      .orderBy(users.name);
    return {
      success: true,
      data: activeMembers,
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function updateMember(
  id: string,
  data: {
    name?: string;
    role?: "admin" | "leader" | "member";
    committeeId?: string | null;
  },
): Promise<ApiResponse<Member>> {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return {
        success: false,
        error: "Unauthorized",
      };
    }
    if (session.user.role !== "admin") {
      return {
        success: false,
        error: "Forbidden",
      };
    }

    // Check if member exists
    const [existingMember] = await db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    if (!existingMember) {
      return {
        success: false,
        error: "Member not found",
      };
    }

    // Prevent user from changing their own role to avoid self-privilege escalation
    if (
      existingMember.id === session.user.id &&
      data.role &&
      data.role !== existingMember.role
    ) {
      return {
        success: false,
        error: "Cannot change your own role",
      };
    }

    // Check if user is being changed to 'member' role but is currently leading a committee
    if (data.role === "member" && existingMember.role === "leader") {
      const [leadingCommittee] = await db
        .select({ id: committees.id, name: committees.name })
        .from(committees)
        .where(eq(committees.leaderId, id))
        .limit(1);

      if (leadingCommittee) {
        return {
          success: false,
          error: `Cannot change role to 'member' while leading committee '${leadingCommittee.name}'. Please assign a new leader first.`,
        };
      }
    }

    const [updatedMember] = await db
      .update(users)
      .set({
        name: data.name ?? existingMember.name,
        role: data.role ?? existingMember.role,
        committeeId:
          data.committeeId !== undefined
            ? data.committeeId
            : existingMember.committeeId,
      })
      .where(eq(users.id, id))
      .returning();

    // Get committee name for the updated member
    const [memberWithCommittee] = await db
      .select({
        ...getTableColumns(users),
        committeeName: committees.name,
      })
      .from(users)
      .leftJoin(committees, eq(users.committeeId, committees.id))
      .where(eq(users.id, id))
      .limit(1);

    await logActivity({
      eventType: "user.updated",
      targetId: id,
      targetType: "user",
      actorId: session.user.id,
      metadata: {
        name: updatedMember.name,
        role: updatedMember.role,
        committeeId: updatedMember.committeeId,
      },
    });

    revalidatePath("/dashboard/members");

    return {
      success: true,
      data: memberWithCommittee,
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function getMemberById(id: string): Promise<ApiResponse<Member>> {
  try {
    const [member] = await db
      .select({
        ...getTableColumns(users),
        committeeName: committees.name,
      })
      .from(users)
      .leftJoin(committees, eq(users.committeeId, committees.id))
      .where(eq(users.id, id))
      .limit(1);

    if (!member) {
      return {
        success: false,
        error: "Member not found",
      };
    }

    return {
      success: true,
      data: member,
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
