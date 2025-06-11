"use client"

import { ColumnDef } from "@tanstack/react-table"
import { File } from "@/types"
import { Button } from "@/components/ui/button"
import { formatBytes, formatDate } from "@/lib/utils"

export const columns: ColumnDef<File>[] = [
  {
    accessorKey: "name",
    header: "File Name",
  },
  {
    accessorKey: "type",
    header: "Type",
  },
  {
    accessorKey: "size",
    header: "Size",
    cell: ({ row }) => formatBytes(row.original.size),
  },
  {
    accessorKey: "uploadedBy",
    header: "Uploaded By",
  },
  {
    accessorKey: "createdAt",
    header: "Upload Date",
    cell: ({ row }) => formatDate(row.original.createdAt),
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.open(row.original.url, "_blank")}
        >
          Download
        </Button>
        <Button 
          variant="destructive" 
          size="sm"
          onClick={async () => {
            if (confirm("Are you sure you want to delete this file?")) {
              try {
                const response = await fetch(`/api/files/${row.original.id}`, {
                  method: "DELETE",
                });
                if (!response.ok) throw new Error("Failed to delete file");
                window.location.reload();
              } catch (error) {
                console.error("Error deleting file:", error);
                alert("Failed to delete file");
              }
            }
          }}
        >
          Delete
        </Button>
      </div>
    ),
  },
]