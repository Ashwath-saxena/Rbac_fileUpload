import { NextResponse } from "next/server";
import { getOrCreateUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const user = await getOrCreateUser();

    const files = await prisma.file.findMany({
      where: {
        user: { id: user.id },
      },
      select: {
        id: true,
        name: true,
        size: true,
        type: true,
        url: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(files);
  } catch (error) {
    console.error("[FILES_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getOrCreateUser();
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return new NextResponse("No file provided", { status: 400 });
    }

    // Your file upload logic here
    // Example using storage service like AWS S3 or similar
    // const uploadResult = await uploadToStorage(file);
    
    // For demonstration, we'll just create a mock URL
    const fileRecord = await prisma.file.create({
      data: {
        name: file.name,
        size: file.size,
        type: file.type,
        url: `https://storage.example.com/${file.name}`, // Replace with actual upload URL
        user: { connect: { id: user.id } },
      },
    });

    return NextResponse.json(fileRecord);
  } catch (error) {
    console.error("[FILES_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}