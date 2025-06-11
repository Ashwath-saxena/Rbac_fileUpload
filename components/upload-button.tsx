"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { UploadDropzone } from "@/lib/uploadthing";
import { useToast } from "@/components/ui/use-toast";
import type { OurFileRouter } from "@/app/api/uploadthing/core";

export function UploadButton() {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  return (
    <div className="w-full">
      <UploadDropzone<OurFileRouter, "fileUploader">
        endpoint="fileUploader"
        onUploadBegin={() => {
          setIsUploading(true);
        }}
        onClientUploadComplete={(res) => {
          setIsUploading(false);
          toast({
            title: "Success",
            description: "Files uploaded successfully!",
          });
          // Refresh the page to show new files
          window.location.reload();
        }}
        onUploadError={(error: Error) => {
          setIsUploading(false);
          toast({
            title: "Error",
            description: error.message,
            variant: "destructive",
          });
        }}
        config={{
          mode: "auto",
          appendOnPaste: true,
        }}
      />
      {isUploading && (
        <div className="mt-4 text-center text-sm text-gray-600">
          Uploading...
        </div>
      )}
    </div>
  );
}