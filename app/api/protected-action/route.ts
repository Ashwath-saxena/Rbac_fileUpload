import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return new Response("Unauthorized", { status: 401 });

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    include: {
      role: { include: { permissions: true } }
    }
  });

  // Example: Only allow users with "role:create" permission
  const userPermissions = user?.role?.permissions.map(p => p.name) || [];
  if (!userPermissions.includes("role:create")) {
    return new Response("Forbidden", { status: 403 });
  }

  // ... your business logic here ...
  return new Response("Success");
}