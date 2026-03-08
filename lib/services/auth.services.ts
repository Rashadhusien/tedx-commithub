"use server";
import { eq } from "drizzle-orm";
import { db } from "../db";
import action from "../handlers/action";
import handleError from "../handlers/error";
import { users } from "../schema";
import { loginSchema } from "../validations";
import bcrypt from "bcryptjs";
import { signIn } from "@/auth";

import { signOut } from "@/auth";
import { ErrorResponse, AuthCredentails, ApiResponse } from "@/types";

export const logInWithCredentails = async (
  params: Pick<AuthCredentails, "email" | "password">,
): Promise<ApiResponse> => {
  const validationResult = await action({ params, schema: loginSchema });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { email, password } = validationResult.params!;

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

  return { success: true };
};

export const registerWithCredentails = async (params: AuthCredentails) => {
  // const validationResult = await action({ params, schema: registerSchema });

  // if (validationResult instanceof Error) {
  //   return handleError(validationResult) as ErrorResponse;
  // }
  const { name, email, password, inviteToken } = params;

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
    return { success: true };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
};

export async function signOutAction() {
  await signOut({ redirectTo: "/login" });
}
