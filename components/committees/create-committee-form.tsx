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
import { createCommitteeSchema } from "@/lib/validations";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

import { Committee } from "@/types";
import { useState, useEffect } from "react";
import { getLeaders } from "@/lib/services/member.services";
import { createCommittee } from "@/lib/services/committees.services";
import { Textarea } from "../ui/textarea";

type CreateCommitteeFormData = z.infer<typeof createCommitteeSchema>;

const CreateCommitteeForm = () => {
  const router = useRouter();

  const [leaders, setLeaders] = useState<Pick<Committee, "id" | "name">[]>([]);

  const form = useForm<CreateCommitteeFormData>({
    resolver: zodResolver(
      createCommitteeSchema,
    ) as Resolver<CreateCommitteeFormData>,
    defaultValues: {
      name: "",
      description: "",
      leaderId: "",
    },
  });

  useEffect(() => {
    const fetchLeaders = async () => {
      try {
        const leadersData = await getLeaders();
        const leaders = leadersData.data;
        if (leaders) {
          setLeaders(leaders);
        }
      } catch (error) {
        console.error("Error fetching leaders:", error);
      }
    };
    fetchLeaders();
  }, []);

  const handleSubmit = async (data: CreateCommitteeFormData) => {
    try {
      console.log("Creating committee:", data);

      // Call the create category action
      const result = await createCommittee(data);

      console.log("Result:", result);

      const resultData = result.data;

      if (resultData) {
        toast.success("Success", {
          description: "Committee created successfully",
        });

        // Reset form
        form.reset();

        router.push("/dashboard/committees");
      } else {
        toast.error("Error", {
          description:
            result.error || "Failed to create committee. Please try again.",
        });
      }
    } catch (error) {
      console.error("Error creating committee:", error);
      toast.error("Error", {
        description: "Failed to send invitation. Please try again.",
      });
    }
  };

  return (
    <Card className="w-full sm:max-w-xl">
      <CardHeader>
        <CardTitle>Create Committee</CardTitle>
        <CardDescription>
          Fill in the details to create a new committee
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          id="invite-member-form"
          className="space-y-4"
          onSubmit={form.handleSubmit(handleSubmit)}
        >
          <Controller
            name={"name" as const}
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={`invite-member-${field}`}>
                  Committee Name <span className="text-orange-600">*</span>
                </FieldLabel>
                <InputGroup>
                  <Input
                    {...field}
                    id={`invite-member-${field}`}
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
                <FieldLabel htmlFor="invite-member-description">
                  Description
                </FieldLabel>
                <Textarea
                  {...field}
                  id="invite-member-description"
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
                <FieldLabel htmlFor="invite-member-leader">Leader</FieldLabel>

                <Select
                  value={field.value}
                  onValueChange={(value) => field.onChange(value)}
                >
                  <SelectTrigger id="invite-member-leader">
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
            form="invite-member-form"
            disabled={form.formState.isSubmitting}
            className="w-full"
          >
            {form.formState.isSubmitting ? "Creating..." : "Create Committee"}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default CreateCommitteeForm;
