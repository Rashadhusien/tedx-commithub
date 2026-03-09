import Link from "next/link";

import { cn } from "@/lib/utils";

import { Avatar, AvatarFallback } from "../ui/avatar";
import Image from "next/image";

interface Props {
  id?: string;
  name: string;
  imageUrl?: string | null;
  className?: string;
  fallbackClassName?: string;
}

const UserAvatar = ({
  id,
  name,
  imageUrl,
  className = "h-9 w-9",
  fallbackClassName,
}: Props) => {
  const initials = name
    .split(" ")
    .map((word: string) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <Link href="/" className="w-fit overflow-hidden rounded-full">
      <Avatar className={cn("relative", className)}>
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={name}
            className="object-cover"
            fill
            quality={70}
          />
        ) : (
          <AvatarFallback
            className={cn(
              " font-space-grotesk font-bold tracking-wider text-white",
              fallbackClassName,
            )}
          >
            {initials}
          </AvatarFallback>
        )}
      </Avatar>
    </Link>
  );
};

export default UserAvatar;
