import { UploadButton, UploadDropzone, Uploader } from "@uploadthing/react";
import { generateReactHelpers } from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";

export { UploadButton, UploadDropzone, Uploader };

export const { useUploadThing, uploadFiles } =
  generateReactHelpers<OurFileRouter>();