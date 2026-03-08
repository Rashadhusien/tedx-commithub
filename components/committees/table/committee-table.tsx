"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import UserAvatar from "@/components/User-avatar";
import { Committee } from "@/types";
import { DataTable } from "@/components/ui/data-table";
import {
  createActionsColumn,
  createDeleteAction,
  createEditAction,
  createViewAction,
} from "@/components/ui/table-columns";

export function CommitteeTable({
  data,
  onView,
  onEdit,
  onDelete,
}: {
  data: Committee[];
  onView?: (committee: Committee) => void;
  onEdit?: (committee: Committee) => void;
  onDelete?: (committee: Committee) => void;
}) {
  const columns: ColumnDef<Committee>[] = [
    {
      id: "avatar",
      header: "Image",
      cell: ({ row }) => {
        return (
          <div className="max-w-xs">
            <UserAvatar
              name={row.getValue("name")}
              fallbackClassName="bg-secondary"
            />
          </div>
        );
      },
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => {
        return (
          <div className="max-w-xs">
            <span className="font-medium">{row.getValue("name")}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => {
        const description = row.getValue("description") as string;
        return (
          <div className="max-w-xs truncate">
            <span className="text-sm text-muted-foreground ">
              {description || "No description"}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "memberCount",
      header: "Members",
      cell: ({ row }) => {
        const memberCount = row.getValue("memberCount") as number;
        return memberCount > 0 ? (
          <div className="flex justify-center">
            <Badge variant="default">{memberCount}</Badge>
          </div>
        ) : (
          <Badge variant="ghost">No members</Badge>
        );
      },
    },
    {
      accessorKey: "leaderName",
      header: "Leader",
      cell: ({ row }) => {
        const leaderName = row.getValue("leaderName") as string;
        return leaderName ? (
          <Badge variant="outline">{leaderName}</Badge>
        ) : (
          <Badge variant="ghost">No Leader</Badge>
        );
      },
    },

    createActionsColumn([
      ...(onView ? [createViewAction(onView)] : []),
      ...(onEdit ? [createEditAction(onEdit)] : []),
      ...(onDelete ? [createDeleteAction(onDelete)] : []),
    ]),
  ];

  return (
    <DataTable
      columns={columns}
      data={data}
      searchKey="name"
      searchPlaceholder="Search committees..."
      emptyMessage="No committees found."
    />
  );
}
