import { getOrCreateUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { FileUpload } from "@/components/file-upload";
import { FileList } from "@/components/file-list";
import { Suspense } from "react";

export default async function FilesPage() {
  const user = await getOrCreateUser();
  
  const files = await prisma.file.findMany({
    where: {
      userId: user.id
    },
    orderBy: {
      createdAt: 'desc'
    },
    select: {
      id: true,
      name: true,
      url: true,
      createdAt: true
    }
  });

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Files</h1>
        <p className="text-gray-600">Upload and manage your files</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">Upload New File</h2>
        <Suspense fallback={
          <div className="animate-pulse">
            <div className="h-32 bg-gray-200 rounded-lg"></div>
          </div>
        }>
          <FileUpload />
        </Suspense>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">Your Files</h2>
        <Suspense fallback={
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-16 bg-gray-200 rounded-lg"></div>
              </div>
            ))}
          </div>
        }>
          <FileList files={files} />
        </Suspense>
      </div>
    </div>
  );
}