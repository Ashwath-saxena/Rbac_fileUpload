import { DataTable } from "@/components/ui/data-table";
import { prisma } from "@/lib/prisma";
import type { User } from "@/types";
import { columns } from "./columns";

export default async function UsersPage() {
  const users = await prisma.user.findMany({
    include: {
      role: {
        include: {
          permissions: {
            select: {
              id: true,
              name: true,
              createdAt: true,
              updatedAt: true,
            },
          },
        },
      },
    },
  });

  // Transform the data to match the expected type
  const formattedUsers: User[] = users.map(user => ({
    id: user.id,
    name: user.name,
    email: user.email,
    clerkId: user.clerkId,
    roleId: user.role ? user.role.id : "",
    role: user.role ? {
      id: user.role.id,
      name: user.role.name,
      permissions: user.role.permissions.map(perm => ({
        id: perm.id,
        name: perm.name,
        createdAt: perm.createdAt,
        updatedAt: perm.updatedAt,
      })),
      createdAt: user.role.createdAt,
      updatedAt: user.role.updatedAt,
    } : undefined,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  }));

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={formattedUsers} />
    </div>
  );
}