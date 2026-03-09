import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  BadgeCheckIcon,
  BellIcon,
  BookOpenIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  CreditCardIcon,
  FolderIcon,
  LayoutDashboardIcon,
  LogOutIcon,
  TrophyIcon,
} from "lucide-react";
import UserAvatar from "./user-avatar";
import { auth } from "@/auth";
import { signOutAction } from "@/lib/services/auth.services";
import Link from "next/link";
import { cn } from "@/lib/utils";

export async function UserDropdown({
  isMobile = false,
}: {
  isMobile?: boolean;
}) {
  const session = await auth();
  if (!session) return null;
  const role = session?.user?.role;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            "rounded-full bg-background py-6 justify-start",
            isMobile && "py-7",
          )}
        >
          <UserAvatar
            id={session?.user?.id || ""}
            name={session?.user?.name || ""}
          />
          <h2>{session?.user?.name}</h2>
          {isMobile ? <ChevronRightIcon /> : <ChevronDownIcon />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuGroup>
          {/* {role === "admin" && (
            <DropdownMenuItem asChild>
              <Link href={ROUTES.ADMIN} className="flex items-center gap-2">
                <LayoutDashboardIcon className="h-4 w-4" />
                Admin Panel
              </Link>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem asChild>
            <Link href={ROUTES.PROFILE} className="flex items-center gap-2">
              <BadgeCheckIcon className="h-4 w-4" />
              Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link
              href={ROUTES.PROFILE_COURSES}
              className="flex items-center gap-2"
            >
              <BookOpenIcon className="h-4 w-4" />
              My Courses
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link
              href={ROUTES.PROFILE_PROJECTS}
              className="flex items-center gap-2"
            >
              <FolderIcon className="h-4 w-4" />
              My Projects
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link
              href={ROUTES.PROFILE_ACHIEVEMENTS}
              className="flex items-center gap-2"
            >
              <TrophyIcon className="h-4 w-4" />
              My Achievements
            </Link>
          </DropdownMenuItem> */}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <form action={signOutAction} className="w-full">
            <button type="submit" className="flex items-center gap-2 w-full">
              <LogOutIcon className="h-4 w-4" />
              Sign Out
            </button>
          </form>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
