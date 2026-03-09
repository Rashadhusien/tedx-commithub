"use server";
import { ApiResponse, Committee, ErrorResponse } from "@/types";
import { db } from "../db";
import { committees, users } from "../schema";
import { eq, getTableColumns, count, sql } from "drizzle-orm";
import handleError from "../handlers/error";
import { logActivity } from "./activity-log.services";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function getAllCommittes(): Promise<ApiResponse<Committee[]>> {
  try {
    const allCommittes = await db
      .select({
        ...getTableColumns(committees),
        memberCount: count(users.id),
        leaderName: sql<string>`leader_user.name`.as("leaderName"),
      })
      .from(committees)
      .leftJoin(users, eq(users.committeeId, committees.id))
      .leftJoin(
        sql`users as leader_user`,
        eq(sql`leader_user.id`, committees.leaderId),
      )
      .groupBy(committees.id, sql`leader_user.name`)
      .orderBy(committees.name);

    return {
      success: true,
      data: allCommittes,
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function createCommittee(data: {
  name: string;
  description?: string;
  leaderId?: string;
}): Promise<ApiResponse<Committee>> {
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

    let leaderName = null;

    // Fetch leader name if leaderId is provided and validate they have leader role
    if (data.leaderId) {
      const [leader] = await db
        .select({ name: users.name, role: users.role })
        .from(users)
        .where(eq(users.id, data.leaderId))
        .limit(1);

      if (!leader) {
        return {
          success: false,
          error: "Selected leader not found",
        };
      }

      if (leader.role !== "leader" && leader.role !== "admin") {
        return {
          success: false,
          error:
            "Only users with 'leader' or 'admin' role can be assigned as committee leaders",
        };
      }

      leaderName = leader?.name || null;
    }

    const [createdCommittee] = await db
      .insert(committees)
      .values({
        name: data.name,
        description: data.description,
        leaderId: data.leaderId,
      })
      .returning();

    // Add leaderName to the returned committee
    const committeeWithLeaderName: Committee = {
      ...createdCommittee,
      leaderName,
      memberCount: 0, // New committee starts with 0 members
    };

    await logActivity({
      eventType: "committee.created",
      targetId: createdCommittee.id,
      targetType: "committee",
      actorId: session.user.id,
      metadata: {
        committeeName: createdCommittee.name,
        leaderId: createdCommittee.leaderId,
      },
    });

    return {
      success: true,
      data: committeeWithLeaderName,
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function updateCommittee(
  id: string,
  data: {
    name?: string;
    description?: string;
    leaderId?: string;
  },
): Promise<ApiResponse<Committee>> {
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

    // Check if committee exists
    const [existingCommittee] = await db
      .select()
      .from(committees)
      .where(eq(committees.id, id))
      .limit(1);

    if (!existingCommittee) {
      return {
        success: false,
        error: "Committee not found",
      };
    }

    let leaderName = null;

    // Fetch leader name if leaderId is provided and validate they have leader role
    if (data.leaderId) {
      const [leader] = await db
        .select({ name: users.name, role: users.role })
        .from(users)
        .where(eq(users.id, data.leaderId))
        .limit(1);

      if (!leader) {
        return {
          success: false,
          error: "Selected leader not found",
        };
      }

      if (leader.role !== "leader" && leader.role !== "admin") {
        return {
          success: false,
          error:
            "Only users with 'leader' or 'admin' role can be assigned as committee leaders",
        };
      }

      leaderName = leader?.name || null;
    } else if (existingCommittee.leaderId) {
      // Keep existing leader name if no new leader is provided
      const [existingLeader] = await db
        .select({ name: users.name })
        .from(users)
        .where(eq(users.id, existingCommittee.leaderId))
        .limit(1);

      leaderName = existingLeader?.name || null;
    }

    const [updatedCommittee] = await db
      .update(committees)
      .set({
        name: data.name ?? existingCommittee.name,
        description: data.description ?? existingCommittee.description,
        leaderId: data.leaderId ?? existingCommittee.leaderId,
      })
      .where(eq(committees.id, id))
      .returning();

    // Get member count for the updated committee
    const [memberCountResult] = await db
      .select({ count: count(users.id) })
      .from(users)
      .where(eq(users.committeeId, id));

    // Add leaderName and memberCount to the returned committee
    const committeeWithDetails: Committee = {
      ...updatedCommittee,
      leaderName,
      memberCount: memberCountResult?.count || 0,
    };

    await logActivity({
      eventType: "committee.updated",
      targetId: id,
      targetType: "committee",
      actorId: session.user.id,
      metadata: {
        committeeName: updatedCommittee.name,
        leaderId: updatedCommittee.leaderId,
      },
    });

    revalidatePath("/dashboard/committees");

    return {
      success: true,
      data: committeeWithDetails,
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function getCommitteeById(
  id: string,
): Promise<ApiResponse<Committee>> {
  try {
    const [committee] = await db
      .select({
        ...getTableColumns(committees),
        memberCount: count(users.id),
        leaderName: sql<string>`leader_user.name`.as("leaderName"),
      })
      .from(committees)
      .leftJoin(users, eq(users.committeeId, committees.id))
      .leftJoin(
        sql`users as leader_user`,
        eq(sql`leader_user.id`, committees.leaderId),
      )
      .where(eq(committees.id, id))
      .groupBy(committees.id, sql`leader_user.name`)
      .limit(1);

    if (!committee) {
      return {
        success: false,
        error: "Committee not found",
      };
    }

    return {
      success: true,
      data: committee,
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function deleteCommittee(id: string): Promise<ApiResponse<void>> {
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

    await db.delete(committees).where(eq(committees.id, id));

    await logActivity({
      eventType: "committee.deleted",
      targetId: id,
      targetType: "committee",
      actorId: session.user.id,
    });

    revalidatePath("/dashboard/committees");

    return {
      success: true,
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
