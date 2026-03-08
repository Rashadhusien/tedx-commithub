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
import { inviteMemberSchema } from "@/lib/validations";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

import { Committee } from "@/types";
import { useState, useEffect } from "react";
import { fetchHandler } from "@/lib/handlers/fetch";

type InviteMemberFormData = z.infer<typeof inviteMemberSchema>;

const InviteMemberForm = () => {
  const router = useRouter();

  const [committees, setCommittees] = useState<
    Pick<Committee, "id" | "name">[]
  >([]);

  const form = useForm<InviteMemberFormData>({
    resolver: zodResolver(inviteMemberSchema) as Resolver<InviteMemberFormData>,
    defaultValues: {
      email: "",
      role: "member",
      committeeId: "",
    },
  });

  useEffect(() => {
    const fetchCommittees = async () => {
      try {
        const committeesData = await fetch("/api/committees");
        const committees = await committeesData.json();
        setCommittees(committees);
      } catch (error) {
        console.error("Error fetching committees:", error);
      }
    };
    fetchCommittees();
  }, []);

  const handleSubmit = async (data: InviteMemberFormData) => {
    try {
      console.log("Inviting member:", data);

      // Call the create category action
      const result = await fetchHandler("/api/members/invite", {
        method: "POST",
        body: JSON.stringify(data),
      });

      console.log("Result:", result);

      const resultData = result.data;

      if (resultData) {
        toast.success("Success", {
          description: "Invitation sent successfully",
        });

        // Reset form
        form.reset();

        router.push("/dashboard/members");
      } else {
        toast.error("Error", {
          description:
            result.error || "Failed to invite member. Please try again.",
        });
      }
    } catch (error) {
      console.error("Error inviting member:", error);
      toast.error("Error", {
        description: "Failed to send invitation. Please try again.",
      });
    }
  };

  return (
    <Card className="w-full sm:max-w-xl">
      <CardHeader>
        <CardTitle>Invite Member</CardTitle>
        <CardDescription>
          Fill in the details to invite a new member
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          id="invite-member-form"
          className="space-y-4"
          onSubmit={form.handleSubmit(handleSubmit)}
        >
          <Controller
            name={"email" as const}
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={`invite-member-${field}`}>
                  Email <span className="text-orange-600">*</span>
                </FieldLabel>
                <InputGroup>
                  <Input
                    {...field}
                    id={`invite-member-${field}`}
                    type={"text"}
                    placeholder={"Email"}
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
            name="role"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="invite-member-role">Role</FieldLabel>
                <Select
                  value={field.value}
                  onValueChange={(value) => field.onChange(value)}
                >
                  <SelectTrigger id="invite-member-role">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="member">Member</SelectItem>
                    <SelectItem value="leader">Leader</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="committeeId"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="invite-member-committee">
                  Committee
                </FieldLabel>

                <Select
                  value={field.value}
                  onValueChange={(value) => field.onChange(value)}
                >
                  <SelectTrigger id="invite-member-committee">
                    <SelectValue placeholder="Select committee" />
                  </SelectTrigger>
                  <SelectContent>
                    {committees.map((committee) => (
                      <SelectItem key={committee.id} value={committee.id}>
                        {committee.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </form>
      </CardContent>
      <CardFooter>
        <div className="w-full space-y-4">
          <Button
            type="submit"
            form="invite-member-form"
            disabled={form.formState.isSubmitting}
            className="w-full"
          >
            {form.formState.isSubmitting ? "Inviting..." : "Invite Member"}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default InviteMemberForm;
