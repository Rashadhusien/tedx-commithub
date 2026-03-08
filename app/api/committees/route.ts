import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { committees } from "@/lib/schema";

export async function GET() {
  try {
    const committeesData = await db.select().from(committees);
    return NextResponse.json(committeesData);
  } catch (error) {
    console.error("Error fetching committees:", error);
    return NextResponse.json(
      { error: "Failed to fetch committees" },
      { status: 500 },
    );
  }
}
