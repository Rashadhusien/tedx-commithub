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
import { registerSchema } from "@/lib/validations";
import { registerWithCredentails } from "@/lib/services/auth.services";

interface Props {
  token: string;
  email: string;
}

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterForm({ token, email }: Props) {
  const router = useRouter();

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema) as Resolver<RegisterFormData>,
    defaultValues: {
      name: "",
      password: "",
      email,
      confirmPassword: "",
      inviteToken: token,
    },
  });

  const handleSubmit = async (data: RegisterFormData) => {
    try {
      console.log("Attempting registration:", data.name);

      const result = await registerWithCredentails({
        inviteToken: data.inviteToken,
        name: data.name,
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
      });

      console.log("Registration result:", result);

      if (result?.success) {
        toast.success("Success", {
          description: "Registration completed successfully",
        });
        router.push("/login?message=Registration successful");
      } else {
        toast.error("Registration Failed", {
          description:
            typeof result?.error === "string"
              ? result.error
              : "Registration failed",
        });
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Error", {
        description: "An error occurred. Please try again.",
      });
    }
  };

  return (
    <Card className="w-full sm:max-w-md">
      <CardHeader>
        <CardTitle>Complete Registration</CardTitle>
        <CardDescription>
          Create your account to join TEDx CommitHub
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          id="register-form"
          className="space-y-4"
          onSubmit={form.handleSubmit(handleSubmit)}
        >
          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="register-name">
                  Name <span className="text-orange-600">*</span>
                </FieldLabel>
                <InputGroup>
                  <Input
                    {...field}
                    id="register-name"
                    type="text"
                    placeholder="Enter your full name"
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
            name="email"
            control={form.control}
            render={({ field }) => (
              <Field>
                <FieldLabel htmlFor="register-email">Email</FieldLabel>
                <InputGroup>
                  <Input
                    {...field}
                    id="register-email"
                    type="email"
                    value={email}
                    disabled
                    className="bg-muted"
                  />
                </InputGroup>
              </Field>
            )}
          />

          <Controller
            name="password"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="register-password">
                  Password <span className="text-orange-600">*</span>
                </FieldLabel>
                <TogglePassword
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Create a password"
                  id="register-password"
                  disabled={form.formState.isSubmitting}
                  ariaInvalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="confirmPassword"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="register-confirm-password">
                  Confirm Password <span className="text-orange-600">*</span>
                </FieldLabel>
                <TogglePassword
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Confirm your password"
                  id="register-confirm-password"
                  disabled={form.formState.isSubmitting}
                  ariaInvalid={fieldState.invalid}
                />
                {fieldState.error && (
                  <FieldError>{fieldState.error.message}</FieldError>
                )}
              </Field>
            )}
          />
        </form>
      </CardContent>
      <CardFooter>
        <Button
          type="submit"
          form="register-form"
          disabled={form.formState.isSubmitting}
          className="w-full"
        >
          {form.formState.isSubmitting
            ? "Creating account..."
            : "Complete Registration"}
        </Button>
      </CardFooter>
    </Card>
  );
}
