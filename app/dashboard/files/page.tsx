import { prisma } from "@/lib/prisma"
import { DataTable } from "@/components/ui/data-table"
import { columns } from "./columns"
import { UploadButton } from "@/components/upload-button"

export default async function FilesPage() {
  const files = (await prisma.file.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  })).map(file => ({
    ...file,
    uploadedBy: file.userId,
  }))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Files</h2>
        <UploadButton />
      </div>
      <DataTable columns={columns} data={files} />
    </div>
  )
}