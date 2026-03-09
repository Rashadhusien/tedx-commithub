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
import { createCommitteeSchema } from "@/lib/validations";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

import { Committee } from "@/types";
import { useState } from "react";
import { getLeaders } from "@/lib/services/member.services";
import { updateCommittee, getCommitteeById } from "@/lib/services/committees.services";
import { Textarea } from "../ui/textarea";

type EditCommitteeFormData = z.infer<typeof createCommitteeSchema>;

interface EditCommitteeFormProps {
  committeeId: string;
}

const EditCommitteeForm = ({ committeeId }: EditCommitteeFormProps) => {
  const router = useRouter();
  const [leaders, setLeaders] = useState<Pick<Committee, "id" | "name">[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm<EditCommitteeFormData>({
    resolver: zodResolver(
      createCommitteeSchema,
    ) as Resolver<EditCommitteeFormData>,
    defaultValues: {
      name: "",
      description: "",
      leaderId: "",
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch committee data
        const committeeResult = await getCommitteeById(committeeId);
        if (committeeResult.success && committeeResult.data) {
          const committee = committeeResult.data;
          form.reset({
            name: committee.name || "",
            description: committee.description || "",
            leaderId: committee.leaderId || "",
          });
        } else {
          toast.error("Error", {
            description: "Committee not found",
          });
          router.push("/dashboard/committees");
          return;
        }

        // Fetch leaders
        const leadersData = await getLeaders();
        if (leadersData.data) {
          setLeaders(leadersData.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Error", {
          description: "Failed to load committee data",
        });
        router.push("/dashboard/committees");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [committeeId, form, router]);

  const handleSubmit = async (data: EditCommitteeFormData) => {
    try {
      console.log("Updating committee:", data);

      // Call the update committee action
      const result = await updateCommittee(committeeId, data);

      console.log("Result:", result);

      if (result.success) {
        toast.success("Success", {
          description: "Committee updated successfully",
        });

        router.push("/dashboard/committees");
      } else {
        toast.error("Error", {
          description:
            result.error || "Failed to update committee. Please try again.",
        });
      }
    } catch (error) {
      console.error("Error updating committee:", error);
      toast.error("Error", {
        description: "Failed to update committee. Please try again.",
      });
    }
  };

  if (isLoading) {
    return (
      <Card className="w-full sm:max-w-xl">
        <CardHeader>
          <CardTitle>Edit Committee</CardTitle>
          <CardDescription>Loading committee data...</CardDescription>
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
        <CardTitle>Edit Committee</CardTitle>
        <CardDescription>
          Update the committee details
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          id="edit-committee-form"
          className="space-y-4"
          onSubmit={form.handleSubmit(handleSubmit)}
        >
          <Controller
            name={"name" as const}
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={`edit-committee-${field}`}>
                  Committee Name <span className="text-orange-600">*</span>
                </FieldLabel>
                <InputGroup>
                  <Input
                    {...field}
                    id={`edit-committee-${field}`}
                    type={"text"}
                    placeholder={"Committee Name"}
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
            name="description"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="edit-committee-description">
                  Description
                </FieldLabel>
                <Textarea
                  {...field}
                  id="edit-committee-description"
                  placeholder="Description"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="leaderId"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="edit-committee-leader">Leader</FieldLabel>

                <Select
                  value={field.value}
                  onValueChange={(value) => field.onChange(value)}
                >
                  <SelectTrigger id="edit-committee-leader">
                    <SelectValue placeholder="Select leader" />
                  </SelectTrigger>
                  <SelectContent>
                    {leaders.map((leader) => (
                      <SelectItem key={leader.id} value={leader.id}>
                        {leader.name}
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
            form="edit-committee-form"
            disabled={form.formState.isSubmitting}
            className="w-full"
          >
            {form.formState.isSubmitting ? "Updating..." : "Update Committee"}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default EditCommitteeForm;
