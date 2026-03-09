"use client";

import { Committee } from "@/types";
import { CommitteeTable } from "./committee-table";
import { toast } from "sonner";
import { deleteCommittee } from "@/lib/services/committees.services";
import { useRouter } from "next/navigation";

interface CommitteeTableWrapperProps {
  data: Committee[];
  isAdmin?: boolean;
}

export function CommitteeTableWrapper({
  data,
  isAdmin = false,
}: CommitteeTableWrapperProps) {
  const router = useRouter();
  const handleView = (committee: Committee) => {
    console.log("View committee:", committee);
    router.push(`/dashboard/committees/${committee.id}/view`);
  };

  const handleEdit = (committee: Committee) => {
    console.log("Edit committee:", committee);
    router.push(`/dashboard/committees/${committee.id}/edit`);
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
      isAdmin={isAdmin}
      onView={handleView}
      onEdit={handleEdit}
      onDelete={handleDelete}
    />
  );
}
