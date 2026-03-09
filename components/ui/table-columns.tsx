import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Trash2, Eye } from "lucide-react";
import { IconSquareToggle } from "@tabler/icons-react";

// Action column type
export interface ActionColumn<T = unknown> {
  label: string | ((row: T) => string);
  icon?: React.ReactNode;
  onClick: (row: T) => void;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | ((
        row: T,
      ) =>
        | "default"
        | "destructive"
        | "outline"
        | "secondary"
        | "ghost"
        | "link");
  disabled?: (row: T) => boolean;
}

// Generic action column
export function createActionsColumn<T>(
  actions: ActionColumn<T>[],
  isAdmin: boolean = false,
): ColumnDef<T> {
  return {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const rowData = row.original;

      if (!isAdmin) return null;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {actions.map((action, index) => {
              const isDisabled = action.disabled?.(rowData);
              const labelText =
                typeof action.label === "function"
                  ? action.label(rowData)
                  : action.label;
              const variant =
                typeof action.variant === "function"
                  ? action.variant(rowData)
                  : action.variant;

              return (
                <DropdownMenuItem
                  key={index}
                  onClick={() => action.onClick(rowData)}
                  disabled={isDisabled}
                  className={variant === "destructive" ? "text-red-600" : ""}
                >
                  {action.icon}
                  {labelText}
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  };
}

// Common action creators
export const createEditAction = <T,>(
  onEdit: (row: T) => void,
): ActionColumn<T> => ({
  label: "Edit",
  icon: <Edit className="mr-2 h-4 w-4" />,
  onClick: onEdit,
});

export const createDeleteAction = <T,>(
  onDelete: (row: T) => void,
): ActionColumn<T> => ({
  label: "Delete",
  icon: <Trash2 className="mr-2 h-4 w-4" />,
  onClick: onDelete,
  variant: "destructive",
});

export const createViewAction = <T,>(
  onView: (row: T) => void,
): ActionColumn<T> => ({
  label: "View",
  icon: <Eye className="mr-2 h-4 w-4" />,
  onClick: onView,
});

// Status column helper
export function createStatusColumn<T>(
  accessorKey: keyof T,
  getStatusConfig: (value: unknown) => { label: string; className: string },
): ColumnDef<T> {
  return {
    accessorKey: accessorKey as string,
    header: "Status",
    cell: ({ row }) => {
      const value = row.getValue(accessorKey as string);
      const config = getStatusConfig(value);

      return (
        <div
          className={`px-2 py-1 rounded-full text-xs font-medium ${config.className}`}
        >
          {config.label}
        </div>
      );
    },
  };
}

// Date column helper
export function createDateColumn<T>(
  accessorKey: keyof T,
  header: string = "Date",
): ColumnDef<T> {
  return {
    accessorKey: accessorKey as string,
    header,
    cell: ({ row }) => {
      const value = row.getValue(accessorKey as string) as string | Date;

      if (!value) return "-";

      const date = typeof value === "string" ? new Date(value) : value;
      return date.toLocaleDateString();
    },
  };
}

// Currency column helper
export function createCurrencyColumn<T>(
  accessorKey: keyof T,
  header: string = "Price",
): ColumnDef<T> {
  return {
    accessorKey: accessorKey as string,
    header,
    cell: ({ row }) => {
      const value = row.getValue(accessorKey as string) as number;

      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(value);
    },
  };
}

export function createToggleActiveAction<T>(
  onToggleActive: (row: T) => void,
): ActionColumn<T> {
  return {
    label: (row: T) =>
      ((row as any).isActive ? "Deactivate" : "Activate") as string,
    icon: <IconSquareToggle className="mr-2 h-4 w-4" />,
    onClick: onToggleActive,
    variant: (row: T) => ((row as any).isActive ? "destructive" : "default"),
  };
}
