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

// export const registerWithCredentails = async (params: AuthCredentails) => {
//   const validationResult = await action({ params, schema: registerSchema });

//   if (validationResult instanceof Error) {
//     return handleError(validationResult) as ErrorResponse;
//   }
//   const { name, email, password } = validationResult.params!;

//   try {
//     // Check if user already exists by email
//     const [existingUser] = await db
//       .select()
//       .from(users)
//       .where(eq(users.email, email));

//     if (existingUser) {
//       return {
//         success: false,
//         error: {
//           message: "User already exists",
//         },
//       };
//     }

//     // Hash the password
//     const hashedPassword = await bcrypt.hash(password, 12);

//     // Create new user in database (without password)
//     const newUser = await db
//       .insert(users)
//       .values({
//         name,
//         email,
//         passwordHash: hashedPassword,
//         role: "member",
//       })
//       .returning();

//     console.log("New user created:", newUser);

//     await signIn("credentials", { email, password, redirect: false });
//     return { success: true };
//   } catch (error) {
//     return handleError(error) as ErrorResponse;
//   }
// };

export async function signOutAction() {
  await signOut({ redirectTo: "/login" });
}
