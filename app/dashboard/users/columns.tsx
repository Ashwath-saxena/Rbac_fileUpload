"use client"

import { ColumnDef } from "@tanstack/react-table"
import { User } from "@/types"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { formatDate } from "@/lib/utils"

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "role.name",
    header: "Role",
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => formatDate(row.original.createdAt),
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <div className="flex gap-2">
        <Link href={`/dashboard/users/${row.original.id}`}>
          <Button variant="outline" size="sm">
            Edit
          </Button>
        </Link>
        <Button 
          variant="destructive" 
          size="sm"
          onClick={() => {
            // TODO: Implement delete logic here
            alert(`Delete user with ID: ${row.original.id}`);
          }}
        >
          Delete
        </Button>
      </div>
    ),
  },
]