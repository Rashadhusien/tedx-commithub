"use client";

import { Committee } from "@/types";
import { CommitteeTable } from "./committee-table";
import { toast } from "sonner";
import { deleteCommittee } from "@/lib/services/committees.services";

interface CommitteeTableWrapperProps {
  data: Committee[];
}

export function CommitteeTableWrapper({ data }: CommitteeTableWrapperProps) {
  const handleView = (committee: Committee) => {
    console.log("View committee:", committee);
  };

  const handleEdit = (committee: Committee) => {
    console.log("Edit committee:", committee);
  };

  const handleDelete = async (committee: Committee) => {
    console.log("Delete committee:", committee);

    try {
      const response = await deleteCommittee(committee.id);
      if (response.success) {
        toast.success("Success", {
          description: "Committee deleted successfully.",
        });
      } else {
        toast.error("Error", {
          description:
            response.error || "Failed to delete committee. Please try again.",
        });
      }
    } catch (error) {
      console.error("Error deleting committee:", error);
      toast.error("Error", {
        description: "Failed to delete committee. Please try again.",
      });
    }
  };

  return (
    <CommitteeTable
      data={data}
      onView={handleView}
      onEdit={handleEdit}
      onDelete={handleDelete}
    />
  );
}
