"use client";

import { useState } from "react";
import { UploadDropzone } from "@uploadthing/react";
import { toast } from "sonner";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";

export function FileUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  
  const formatUTCTime = (): string => {
    const date = new Date();
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    const seconds = String(date.getUTCSeconds()).padStart(2, '0');
    
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  return (
    <div className="w-full space-y-4">
      {/* Upload Status Indicator */}
      {uploadStatus !== 'idle' && (
        <div className={`p-4 rounded-lg ${
          uploadStatus === 'success' ? 'bg-green-50' : 
          uploadStatus === 'error' ? 'bg-red-50' : 
          'bg-blue-50'
        }`}>
          <div className="flex items-center">
            {uploadStatus === 'uploading' && <Loader2 className="h-5 w-5 animate-spin text-blue-500 mr-2" />}
            {uploadStatus === 'success' && <CheckCircle className="h-5 w-5 text-green-500 mr-2" />}
            {uploadStatus === 'error' && <XCircle className="h-5 w-5 text-red-500 mr-2" />}
            <span className={`text-sm ${
              uploadStatus === 'success' ? 'text-green-700' : 
              uploadStatus === 'error' ? 'text-red-700' : 
              'text-blue-700'
            }`}>
              {uploadStatus === 'uploading' && `Uploading... ${uploadProgress}%`}
              {uploadStatus === 'success' && 'Upload complete!'}
              {uploadStatus === 'error' && 'Upload failed'}
            </span>
          </div>
          {uploadStatus === 'uploading' && (
            <div className="mt-2 w-full bg-blue-100 rounded-full h-1.5">
              <div 
                className="bg-blue-500 h-1.5 rounded-full transition-all duration-300" 
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          )}
        </div>
      )}

      <UploadDropzone<OurFileRouter, "fileUploader">
        endpoint="fileUploader"
        onUploadBegin={() => {
          setIsUploading(true);
          setUploadStatus('uploading');
          setUploadProgress(0);
          toast.info("Starting upload...");
        }}
        onUploadProgress={(progress: number) => {
          setUploadProgress(progress);
        }}
        onUploadError={(error: Error) => {
          setIsUploading(false);
          setUploadStatus('error');
          toast.error(`Upload failed: ${error.message}`);
        }}
        onClientUploadComplete={(res) => {
          setIsUploading(false);
          setUploadStatus('success');
          if (res && res.length > 0) {
            const currentTime = formatUTCTime();
            toast.success(`Successfully uploaded ${res.length} file(s)!`, {
              description: `Upload completed at ${currentTime} UTC`,
            });
            
            // Refresh the page after a successful upload
            setTimeout(() => {
              window.location.reload();
            }, 1500);
          }
        }}
        config={{
          mode: "auto",
          appendOnPaste: true
        }}
      />

      {/* Current Time and User Info */}
      <div className="text-sm text-gray-600 mt-4 p-4 bg-gray-50 rounded-lg">
        <div className="space-y-2">
          <p className="flex justify-between">
            <span>Current Date and Time (UTC - YYYY-MM-DD HH:MM:SS formatted):</span>
            <span className="font-mono">{formatUTCTime()}</span>
          </p>
          <p className="flex justify-between">
            <span>Current User's Login:</span>
            <span className="font-mono">Ashwath-saxena</span>
          </p>
        </div>
      </div>

      {/* Instructions */}
      <div className="text-sm text-gray-500 mt-2">
        <p>Supported files:</p>
        <ul className="list-disc list-inside">
          <li>Images (up to 4MB, max 10 files)</li>
          <li>PDFs (up to 4MB, max 1 file)</li>
          <li>Text files (up to 1MB, max 1 file)</li>
        </ul>
      </div>
    </div>
  );
}