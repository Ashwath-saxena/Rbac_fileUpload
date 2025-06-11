import { UploadButton } from "@/components/upload-button";
import { prisma } from "@/lib/prisma";
import { formatBytes, formatDate } from "@/lib/utils";

type File = {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  createdAt: Date;
};

export default async function UploadsPage() {
  const files: File[] = await prisma.file.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">File Uploads</h2>
      </div>
      
      <div className="grid gap-6">
        <div className="w-full max-w-xl mx-auto">
          <UploadButton />
        </div>

        <div className="border rounded-lg">
          <table className="w-full">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Size</th>
                <th className="px-4 py-2 text-left">Type</th>
                <th className="px-4 py-2 text-left">Uploaded</th>
              </tr>
            </thead>
            <tbody>
              {files.map((file) => (
                <tr key={file.id} className="border-b">
                  <td className="px-4 py-2">
                    <a 
                      href={file.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      {file.name}
                    </a>
                  </td>
                  <td className="px-4 py-2">{formatBytes(file.size)}</td>
                  <td className="px-4 py-2">{file.type}</td>
                  <td className="px-4 py-2">{formatDate(file.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}