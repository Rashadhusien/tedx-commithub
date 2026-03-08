"use server";

import { Session } from "next-auth";
import { ZodError, ZodSchema } from "zod";
import { revalidatePath } from "next/cache";

import { auth } from "@/auth";

import { UnauthorizedError, ValidationError } from "../http-errors";

type ActionOptions<T> = {
  params?: T;
  schema?: ZodSchema<T>;
  authorize?: boolean;
  admin?: boolean;
  revalidatePath?: string;
};

type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: ValidationError | UnauthorizedError | Error };

async function action<T, R>({
  params,
  schema,
  authorize = false,
  admin = false,
  revalidatePath: revalidatePathStr,
  actionFn,
}: ActionOptions<T> & {
  actionFn: (validatedParams: T, session: Session | null) => Promise<R>;
}): Promise<ActionResult<R>> {
  try {
    // Validate parameters if schema is provided
    let validatedParams: T | undefined;
    if (schema && params) {
      try {
        validatedParams = schema.parse(params);
      } catch (error) {
        if (error instanceof ZodError) {
          return {
            success: false,
            error: new ValidationError(
              error.flatten().fieldErrors as Record<string, string[]>,
            ),
          };
        }
        return {
          success: false,
          error: new Error(
            `Schema validation failed: ${(error as Error).message}`,
          ),
        };
      }
    }

    // Check authorization if required
    let session: Session | null = null;
    if (authorize || admin) {
      session = await auth();
      if (!session) {
        return {
          success: false,
          error: new UnauthorizedError(),
        };
      }

      // Check admin role if required
      if (admin && session.user.role !== "admin") {
        return {
          success: false,
          error: new UnauthorizedError("Admin access required"),
        };
      }
    }

    // Execute the main action function
    const result = await actionFn(validatedParams as T, session);

    // Revalidate cache if path is provided
    if (revalidatePathStr) {
      revalidatePath(revalidatePathStr);
    }

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    console.error("Action error:", error);

    if (
      error instanceof ValidationError ||
      error instanceof UnauthorizedError
    ) {
      return {
        success: false,
        error,
      };
    }

    return {
      success: false,
      error:
        error instanceof Error ? error : new Error("Unknown error occurred"),
    };
  }
}

export default action;
