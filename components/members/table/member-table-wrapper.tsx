"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Member } from "@/types";
import { MemberTable } from "./member-table";

interface MemberTableWrapperProps {
  data: Member[];
}

export function MemberTableWrapper({ data }: MemberTableWrapperProps) {
  const router = useRouter();

  const handleEdit = (member: Member) => {
    console.log("Edit member:", member);
    // Navigate to edit page
    router.push(`/admin/members/${member.id}/edit`);
  };

  const handleDelete = async (member: Member) => {
    // console.log("Delete member:", member);
    // if (confirm(`Are you sure you want to delete "${member.name}"?`)) {
    //   try {
    //     const result = await deleteStudent(student.id);
    //     if (result.success) {
    //       toast.success("Success", {
    //         description: "Student deleted successfully",
    //       });
    //       // Refresh the page to show updated data
    //       router.refresh();
    //     } else {
    //       toast.error("Error", {
    //         description: result.error || "Failed to delete student",
    //       });
    //     }
    //   } catch (error) {
    //     console.error("Error deleting student:", error);
    //     toast.error("Error", {
    //       description: "Failed to delete student",
    //     });
    //   }
    // }
  };

  return (
    <MemberTable data={data} onEdit={handleEdit} onDelete={handleDelete} />
  );
}
