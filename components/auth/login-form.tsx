"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import type { Resolver } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { InputGroup } from "@/components/ui/input-group";
import { TogglePassword } from "@/components/ui/toggle-password";
import { loginSchema } from "@/lib/validations";
import { logInWithCredentails } from "@/lib/services/auth.services";

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const router = useRouter();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema) as Resolver<LoginFormData>,
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSubmit = async (data: LoginFormData) => {
    try {
      console.log("Attempting login:", data.email);

      const result = await logInWithCredentails({
        email: data.email,
        password: data.password,
      });

      console.log("SignIn result:", result);

      if (result?.error) {
        console.error("SignIn error:", result.error);
        toast.error("Login Failed", {
          description: "Invalid email or password",
        });
      } else {
        toast.success("Success", {
          description: "Logged in successfully",
        });
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Error", {
        description: "An error occurred. Please try again.",
      });
    }
  };

  return (
    <Card className="w-full sm:max-w-md">
      <CardHeader>
        <CardTitle>Sign In</CardTitle>
        <CardDescription>
          Enter your credentials to access your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          id="login-form"
          className="space-y-4"
          onSubmit={form.handleSubmit(handleSubmit)}
        >
          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="login-email">
                  Email <span className="text-orange-600">*</span>
                </FieldLabel>
                <InputGroup>
                  <Input
                    {...field}
                    id="login-email"
                    type="email"
                    placeholder="Enter your email"
                    aria-invalid={fieldState.invalid}
                  />
                </InputGroup>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="password"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="login-password">
                  Password <span className="text-orange-600">*</span>
                </FieldLabel>
                <TogglePassword
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Enter your password"
                  id="login-password"
                  disabled={form.formState.isSubmitting}
                  ariaInvalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </form>
      </CardContent>
      <CardFooter>
        <Button
          type="submit"
          form="login-form"
          disabled={form.formState.isSubmitting}
          className="w-full"
        >
          {form.formState.isSubmitting ? "Signing in..." : "Sign In"}
        </Button>
      </CardFooter>
    </Card>
  );
}
