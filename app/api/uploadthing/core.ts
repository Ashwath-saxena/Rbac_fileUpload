import { createUploadthing, type FileRouter } from "uploadthing/next";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateUser, formatUTCTime } from "@/lib/auth";

const f = createUploadthing();

const handleAuth = async () => {
  try {
    const authResult = await auth();
    const clerkId = authResult.userId;
    
    if (!clerkId) throw new Error("Unauthorized");

    // This will create the user if they don't exist
    const user = await getOrCreateUser();

    return { userId: user.id, clerkId };
  } catch (error) {
    console.error("Auth Error:", error);
    throw error instanceof Error ? error : new Error("Authentication failed");
  }
};

export const ourFileRouter = {
  fileUploader: f({
    image: { maxFileSize: "4MB", maxFileCount: 10 },
    pdf: { maxFileSize: "4MB", maxFileCount: 1 },
    text: { maxFileSize: "1MB", maxFileCount: 1 },
  })
    .middleware(handleAuth)
    .onUploadComplete(async ({ metadata, file }) => {
      try {
        const createdFile = await prisma.file.create({
          data: {
            name: file.name,
            url: file.url,
            size: file.size,
            type: file.type,
            userId: metadata.userId,
          },
        });

        console.log(`File uploaded successfully by ${metadata.userId} at ${formatUTCTime()}`);

        return { fileId: createdFile.id };
      } catch (error) {
        console.error("Database Error:", error);
        if (error instanceof Error) {
          console.error("Error details:", {
            message: error.message,
            metadata,
            file,
            timestamp: formatUTCTime(),
          });
        }
        throw error;
      }
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;