"use server";
import { eq } from "drizzle-orm";
import { db } from "../db";
import action from "../handlers/action";
import handleError from "../handlers/error";
import { users } from "../schema";
import { loginSchema, registerSchema } from "../validations";
import bcrypt from "bcryptjs";
import { signIn } from "@/auth";

import { signOut } from "@/auth";
import { ErrorResponse, AuthCredentails, ApiResponse } from "@/types";
import { logActivity } from "./activity-log.services";

export const logInWithCredentails = async (
  params: Pick<AuthCredentails, "email" | "password">,
): Promise<ApiResponse> => {
  const validationResult = await action({
    params,
    schema: loginSchema,
    actionFn: async (validatedParams) => {
      const { email, password } = validatedParams;
      // Your action logic here
      return { email, password };
    },
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  if (!validationResult.success) {
    return handleError(validationResult.error) as ErrorResponse;
  }

  const { email, password } = validationResult.data;

  const [existingUser] = await db
    .select()
    .from(users)
    .where(eq(users.email, email));

  if (!existingUser) {
    return {
      success: false,
      error: "User not found",
    };
  }

  const passwordMatch = await bcrypt.compare(
    password,
    existingUser.passwordHash!,
  );

  if (!passwordMatch) {
    return {
      success: false,
      error: "Invalid Credentials",
    };
  }

  await signIn("credentials", { email, password, redirect: false });

  await logActivity({
    eventType: "user.login",
    actorId: existingUser.id,
    targetId: existingUser.id,
    targetType: "user",
    metadata: {
      email: existingUser.email,
    },
  });

  return { success: true };
};

export const registerWithCredentails = async (params: AuthCredentails) => {
  const validationResult = await action({
    params,
    schema: registerSchema,
    actionFn: async (validatedParams) => {
      const { name, email, password, inviteToken } = validatedParams;
      // Your action logic here
      return { name, email, password, inviteToken };
    },
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  if (!validationResult.success) {
    return handleError(validationResult.error) as ErrorResponse;
  }

  const { name, email, password, inviteToken } = validationResult.data;

  try {
    // Find user by invite token
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.inviteToken, inviteToken));

    if (!existingUser) {
      return {
        success: false,
        error: {
          message: "Invalid or expired invitation token",
        },
      };
    }

    // Check if invitation has expired
    if (
      existingUser.inviteExpiresAt &&
      existingUser.inviteExpiresAt < new Date()
    ) {
      return {
        success: false,
        error: {
          message: "Invitation token has expired",
        },
      };
    }

    // Verify email matches the invited email
    if (existingUser.email !== email) {
      return {
        success: false,
        error: {
          message: "Email does not match the invitation",
        },
      };
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Update user with registration details and activate account
    const [updatedUser] = await db
      .update(users)
      .set({
        name,
        passwordHash: hashedPassword,
        isActive: true,
        inviteToken: null, // Clear the invite token
        inviteExpiresAt: null, // Clear the expiry
        updatedAt: new Date(),
      })
      .where(eq(users.id, existingUser.id))
      .returning();

    console.log("User registered and activated:", updatedUser);

    await signIn("credentials", { email, password, redirect: false });

    await logActivity({
      eventType: "user.activated",
      actorId: updatedUser.id,
      targetId: updatedUser.id,
      targetType: "user",
      metadata: {
        name: updatedUser.name,
        email: updatedUser.email,
      },
    });
    return { success: true };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
};

export async function signOutAction() {
  await signOut({ redirectTo: "/login" });
}
