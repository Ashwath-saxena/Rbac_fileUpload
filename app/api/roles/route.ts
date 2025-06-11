import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { ROLES } from "@/lib/roles";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { roleSlug, targetUserId } = await req.json();

    // Validate role
    const roleConfig = ROLES.find(r => r.slug === roleSlug);
    if (!roleConfig) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    // First, ensure all permissions exist in the database
    const permissionPromises = roleConfig.permissions.map(permName =>
      prisma.permission.upsert({
        where: { name: permName },
        update: {},
        create: {
          name: permName,
          description: `Permission for ${permName}`,
        },
      })
    );

    const permissions = await Promise.all(permissionPromises);

    // Get or create role with permissions
    const role = await prisma.role.upsert({
      where: { name: roleConfig.name },
      update: {
        permissions: {
          set: permissions.map(p => ({ id: p.id })),
        },
      },
      create: {
        name: roleConfig.name,
        slug: roleConfig.slug,
        description: roleConfig.description,
        creator: { connect: { clerkId: userId } },
        permissions: {
          connect: permissions.map(p => ({ id: p.id })),
        },
      },
      include: {
        permissions: true,
      },
    });

    // Update user's role
    const updatedUser = await prisma.user.update({
      where: { clerkId: targetUserId || userId },
      data: {
        role: {
          connect: { id: role.id },
        },
      },
      include: {
        role: {
          include: {
            permissions: true,
          },
        },
      },
    });

    return NextResponse.json({
      message: "Role assigned successfully",
      user: updatedUser,
    });

  } catch (error) {
    console.error("Role assignment error:", error);
    return NextResponse.json(
      { error: "Failed to assign role" },
      { status: 500 }
    );
  }
}