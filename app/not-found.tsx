import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex h-screen items-center justify-center flex-col">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="text-muted-foreground mt-2">Page not found</p>
      <Button asChild>
        <Link href="/">Go back to home</Link>
      </Button>
    </div>
  );
}
