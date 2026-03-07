// src/lib/utils/api.ts
import { NextResponse } from "next/server";
import type { ApiResponse } from "@/types";
import { ZodError } from "zod";

export function ok<T>(
  data: T,
  meta?: ApiResponse["meta"],
): NextResponse<ApiResponse<T>> {
  return NextResponse.json({ success: true, data, meta });
}

export function created<T>(data: T): NextResponse<ApiResponse<T>> {
  return NextResponse.json({ success: true, data }, { status: 201 });
}

export function badRequest(error: string): NextResponse<ApiResponse> {
  return NextResponse.json({ success: false, error }, { status: 400 });
}

export function unauthorized(
  error = "Unauthorized",
): NextResponse<ApiResponse> {
  return NextResponse.json({ success: false, error }, { status: 401 });
}

export function forbidden(error = "Forbidden"): NextResponse<ApiResponse> {
  return NextResponse.json({ success: false, error }, { status: 403 });
}

export function notFound(error = "Not found"): NextResponse<ApiResponse> {
  return NextResponse.json({ success: false, error }, { status: 404 });
}

export function conflict(error: string): NextResponse<ApiResponse> {
  return NextResponse.json({ success: false, error }, { status: 409 });
}

export function serverError(
  error = "Internal server error",
): NextResponse<ApiResponse> {
  return NextResponse.json({ success: false, error }, { status: 500 });
}

export function zodError(err: ZodError): NextResponse<ApiResponse> {
  const error = err.errors
    .map((e) => `${e.path.join(".")}: ${e.message}`)
    .join("; ");
  return badRequest(error);
}

// Pagination helper
export function paginate(page: number, limit: number, total: number) {
  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  };
}
