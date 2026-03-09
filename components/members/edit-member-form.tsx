"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import type { Resolver } from "react-hook-form";
import { useEffect } from "react";

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
import { updateMemberSchema } from "@/lib/validations";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

import { Committee } from "@/types";
import { useState } from "react";
import { getMemberById, updateMember } from "@/lib/services/member.services";
import { getAllCommittes } from "@/lib/services/committees.services";

type EditMemberFormData = z.infer<typeof updateMemberSchema>;

interface EditMemberFormProps {
  memberId: string;
}

const EditMemberForm = ({ memberId }: EditMemberFormProps) => {
  const router = useRouter();
  const [committees, setCommittees] = useState<
    Pick<Committee, "id" | "name">[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm<EditMemberFormData>({
    resolver: zodResolver(updateMemberSchema) as Resolver<EditMemberFormData>,
    defaultValues: {
      name: "",
      role: "member",
      committeeId: null,
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch committee data
        const memberResult = await getMemberById(memberId);
        if (memberResult.success && memberResult.data) {
          const member = memberResult.data;
          form.reset({
            name: member.name || "",
            role: member.role || "member",
            committeeId: member.committeeId || null,
          });
        } else {
          toast.error("Error", {
            description: "Member not found",
          });
          router.push("/dashboard/members");
          return;
        }

        // Fetch committees
        const committeesResult = await getAllCommittes();
        if (committeesResult.success && committeesResult.data) {
          setCommittees(committeesResult.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Error", {
          description: "Failed to load member data",
        });
        router.push("/dashboard/members");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [memberId, form, router]);

  const handleSubmit = async (data: EditMemberFormData) => {
    try {
      console.log("Updating member:", data);

      // Call the update member action
      const result = await updateMember(memberId, data);

      console.log("Result:", result);

      if (result.success) {
        toast.success("Success", {
          description: "Member updated successfully",
        });

        router.push("/dashboard/members");
      } else {
        toast.error("Error", {
          description:
            result.error || "Failed to update member. Please try again.",
        });
      }
    } catch (error) {
      console.error("Error updating member:", error);
      toast.error("Error", {
        description: "Failed to update member. Please try again.",
      });
    }
  };

  if (isLoading) {
    return (
      <Card className="w-full sm:max-w-xl">
        <CardHeader>
          <CardTitle>Edit Member</CardTitle>
          <CardDescription>Loading member data...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full sm:max-w-xl">
      <CardHeader>
        <CardTitle>Edit Member</CardTitle>
        <CardDescription>Update the member details</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          id="edit-member-form"
          className="space-y-4"
          onSubmit={form.handleSubmit(handleSubmit)}
        >
          <Controller
            name={"name" as const}
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={`edit-member-${field}`}>
                  Member Name <span className="text-orange-600">*</span>
                </FieldLabel>
                <InputGroup>
                  <Input
                    {...field}
                    id={`edit-member-${field}`}
                    type={"text"}
                    placeholder={"Member Name"}
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
                <FieldLabel htmlFor="edit-member-role">Role</FieldLabel>
                <Select
                  value={field.value}
                  onValueChange={(value) => field.onChange(value)}
                >
                  <SelectTrigger id="edit-member-role">
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
                <FieldLabel htmlFor="edit-member-committee">
                  Committee
                </FieldLabel>

                <Select
                  value={field.value || "none"}
                  onValueChange={(value) =>
                    field.onChange(value === "none" ? null : value)
                  }
                >
                  <SelectTrigger id="edit-member-committee">
                    <SelectValue placeholder="Select committee" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Committee</SelectItem>
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
            form="edit-member-form"
            disabled={form.formState.isSubmitting}
            className="w-full"
          >
            {form.formState.isSubmitting ? "Updating..." : "Update Member"}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default EditMemberForm;
