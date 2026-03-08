"use client";

import { toast } from "sonner";
import { Member } from "@/types";
import { MemberTable } from "./member-table";
import { memberActivate } from "@/lib/services/member.services";

interface MemberTableWrapperProps {
  data: Member[];
}

export function MemberTableWrapper({ data }: MemberTableWrapperProps) {
  const handleToggleActive = async (member: Member) => {
    console.log("Toggle active member:", member);

    try {
      const result = await memberActivate({
        id: member.id,
      });
      if (result.success) {
        toast.success("Success", {
          description: "Member activated successfully",
        });
      } else {
        toast.error("Error", {
          description: result.error || "Failed to activate member",
        });
      }
    } catch (error) {
      console.error("Error toggling active member:", error);
      toast.error("Error", {
        description: "Failed to toggle active member",
      });
    }
  };

  return <MemberTable data={data} onToggleActive={handleToggleActive} />;
}
