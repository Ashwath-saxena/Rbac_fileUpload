"use client";

import { formatDistanceToNow } from "date-fns";
import { Download, Trash2, File as FileIcon } from "lucide-react";

interface FileType {
  id: string;
  name: string;
  url: string;
  createdAt: Date;
}

interface FileListProps {
  files: FileType[];
}

export function FileList({ files }: FileListProps) {
  if (!files?.length) {
    return (
      <div className="text-center py-8 text-gray-500">
        No files uploaded yet
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {files.map((file) => (
        <div 
          key={file.id}
          className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm hover:shadow transition-shadow"
        >
          <div className="flex items-center space-x-4">
            <FileIcon className="h-8 w-8 text-blue-500" />
            <div>
              <p className="font-medium text-gray-900">{file.name}</p>
              <p className="text-sm text-gray-500">
                {formatDistanceToNow(new Date(file.createdAt), { addSuffix: true })}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <a
              href={file.url}
              download
              className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
              title="Download file"
            >
              <Download className="h-5 w-5" />
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}