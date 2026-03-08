// src/app/(auth)/register/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { users } from "@/lib/schema/users";
import { eq, and, gt } from "drizzle-orm";
import RegisterForm from "@/components/auth/register-form";

export const metadata: Metadata = { title: "Complete Registration" };

interface Props {
  searchParams: Promise<{ token?: string }>;
}

export default async function RegisterPage({ searchParams }: Props) {
  const { token } = await searchParams;
  if (!token) notFound();

  // Validate invite token
  const [invitedUser] = await db
    .select({ id: users.id, email: users.email })
    .from(users)
    .where(
      and(eq(users.inviteToken, token), gt(users.inviteExpiresAt, new Date())),
    )
    .limit(1);

  if (!invitedUser) notFound();

  return (
    <div className="w-full max-w-sm space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold tracking-tight">
          Complete your account
        </h1>
        <p className="text-muted-foreground text-sm">
          You&apos;ve been invited to join CommitHub as{" "}
          <span className="font-medium text-foreground">
            {invitedUser.email}
          </span>
        </p>
      </div>
      <RegisterForm token={token} email={invitedUser.email} />
    </div>
  );
}
