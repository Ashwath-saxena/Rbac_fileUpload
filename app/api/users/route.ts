import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const { userId } = await auth()
  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  const users = await prisma.user.findMany({
    include: {
      role: true,
    },
  })

  return NextResponse.json(users)
}

export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  const body = await req.json()
  const { email, name, roleId } = body

  const user = await prisma.user.create({
    data: {
      email,
      name,
      clerkId: userId,
      role: {
        connect: { id: roleId },
      },
    },
    include: {
      role: true,
    },
  })

  return NextResponse.json(user)
}