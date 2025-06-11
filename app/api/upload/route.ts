import { NextResponse } from "next/server";
import { getOrCreateUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const user = await getOrCreateUser();
    const data = await req.formData();
    // Extract file from form data
    const uploadedFile = data.get("file") as File;
    if (!uploadedFile) {
      throw new Error("No file uploaded");
    }

    const fileName = uploadedFile.name;
    // You would typically upload the file to a storage service and get the URL
    // For demonstration, we'll use a placeholder URL
    const fileUrl = `/uploads/${fileName}`;

    // Save file with user association
    const file = await prisma.file.create({
      data: {
        name: fileName,
        url: fileUrl,
        size: uploadedFile.size,
        type: uploadedFile.type,
        userId: user.id,
      },
    });

    return NextResponse.json(file);
  } catch (error) {
    console.error("[FILE_UPLOAD]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}