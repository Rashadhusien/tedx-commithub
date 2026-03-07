// src/app/(auth)/login/page.tsx
import type { Metadata } from "next";
import LoginForm from "@/components/auth/login-form";

export const metadata: Metadata = { title: "Sign In" };

export default function LoginPage() {
  return (
    <div className="w-full max-w-sm space-y-6">
      <div className="space-y-2 text-center">
        <div className="flex items-center justify-center gap-2 lg:hidden mb-6">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">
              CH
            </span>
          </div>
          <span className="font-semibold text-lg">CommitHub</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
        <p className="text-muted-foreground text-sm">
          Sign in to your CommitHub account
        </p>
      </div>
      <LoginForm />
    </div>
  );
}
