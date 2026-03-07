// src/lib/auth/helpers.ts
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import type { UserRole } from "@/types";

/**
 * Returns the current session user or redirects to login.
 * Use in Server Components and Route Handlers.
 */
export async function requireAuth() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  return session.user;
}

/**
 * Returns the current session user, requires a specific role minimum.
 * Role hierarchy: admin > leader > member
 */
export async function requireRole(minimumRole: UserRole) {
  const user = await requireAuth();
  const hierarchy: Record<UserRole, number> = {
    admin: 3,
    leader: 2,
    member: 1,
  };

  if (hierarchy[user.role as UserRole] < hierarchy[minimumRole]) {
    redirect("/dashboard");
  }
  return user;
}

/**
 * Returns the current session user, requires admin role.
 */
export async function requireAdmin() {
  return requireRole("admin");
}

/**
 * Returns true if the user has at least the given role.
 */
export function hasRole(userRole: UserRole, minimumRole: UserRole): boolean {
  const hierarchy: Record<UserRole, number> = {
    admin: 3,
    leader: 2,
    member: 1,
  };
  return hierarchy[userRole] >= hierarchy[minimumRole];
}

/**
 * Returns true if user can manage tasks in a given committee.
 * Admins can manage all. Leaders can only manage their own committee.
 */
export function canManageTasks(
  userRole: UserRole,
  userCommitteeId: string | null,
  targetCommitteeId: string,
): boolean {
  if (userRole === "admin") return true;
  if (userRole === "leader" && userCommitteeId === targetCommitteeId)
    return true;
  return false;
}
