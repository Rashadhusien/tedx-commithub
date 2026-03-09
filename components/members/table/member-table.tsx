"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import UserAvatar from "@/components/layout/user-avatar";
import { Member } from "@/types";
import { DataTable } from "@/components/ui/data-table";
import {
  createActionsColumn,
  createDeleteAction,
  createEditAction,
  createToggleActiveAction,
  createViewAction,
} from "@/components/ui/table-columns";

export function MemberTable({
  data,
  onView,
  onEdit,
  onToggleActive,
  onDelete,
  isAdmin = false,
}: {
  data: Member[];
  onView?: (member: Member) => void;
  onEdit?: (member: Member) => void;
  onToggleActive?: (member: Member) => void;
  onDelete?: (member: Member) => void;
  isAdmin: boolean;
}) {
  const columns: ColumnDef<Member>[] = [
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
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => {
        return <div className="max-w-xs truncate">{row.getValue("email")}</div>;
      },
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => {
        return (
          <Badge
            variant={row.getValue("role") === "admin" ? "default" : "secondary"}
          >
            {row.getValue("role")}
          </Badge>
        );
      },
    },
    {
      accessorKey: "isActive",
      header: "Status",
      cell: ({ row }) => {
        const isActive = row.getValue("isActive") as boolean;
        return isActive ? (
          <Badge variant="default">Active</Badge>
        ) : (
          <Badge variant="destructive">Inactive</Badge>
        );
      },
    },
    {
      accessorKey: "points",
      header: "Points",
      cell: ({ row }) => {
        const points = row.getValue("points") as number;
        return <Badge variant="secondary">{points}</Badge>;
      },
    },
    {
      accessorKey: "committeeName",
      header: "Committee",
      cell: ({ row }) => {
        const committeeName = row.getValue("committeeName") as string;
        return committeeName ? (
          <Badge variant="outline">{committeeName}</Badge>
        ) : (
          <Badge variant="ghost">No Committee</Badge>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Created",
      cell: ({ row }) => {
        const date = row.getValue("createdAt") as Date;
        return date.toLocaleDateString();
      },
    },

    createActionsColumn(
      [
        ...(onView ? [createViewAction(onView)] : []),
        ...(onEdit ? [createEditAction(onEdit)] : []),
        ...(onDelete ? [createDeleteAction(onDelete)] : []),
        ...(onToggleActive ? [createToggleActiveAction(onToggleActive)] : []),
      ],
      isAdmin,
    ),
  ];

  return (
    <DataTable
      columns={columns}
      data={data}
      searchKey="name"
      searchPlaceholder="Search members..."
      emptyMessage="No members found."
    />
  );
}
