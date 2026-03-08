"use server";

import { ApiResponse, ErrorResponse, Member } from "@/types";
import { db } from "../db";
import { users, committees } from "../schema";
import { eq, getTableColumns } from "drizzle-orm";
import handleError from "../handlers/error";

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
