import { getOrCreateUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { RolesList } from "./roles-list";
// Formats the current UTC time as 'YYYY-MM-DD HH:MM:SS'
function formatUTCTime() {
  const now = new Date();
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${now.getUTCFullYear()}-${pad(now.getUTCMonth() + 1)}-${pad(now.getUTCDate())} ${pad(now.getUTCHours())}:${pad(now.getUTCMinutes())}:${pad(now.getUTCSeconds())}`;
}

export default async function RolesPage() {
  const user = await getOrCreateUser();

  const roles = await prisma.role.findMany({
    include: {
      permissions: {
        select: {
          id: true,
          name: true,
          description: true,
          createdAt: true,
          updatedAt: true
        }
      },
      users: {
        select: {
          id: true,
          name: true,
          email: true,
          clerkId: true,
          roleId: true,
          createdAt: true,
          updatedAt: true
        }
      },
      creator: {
        select: {
          id: true,
          name: true,
          email: true
        }
      },
      _count: {
        select: {
          users: true
        }
      }
    }
  });

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Roles Management</h1>
        <div className="space-x-2">
          <a
            href="/dashboard/roles/new"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Create New Role
          </a>
        </div>
      </div>

      {roles.length > 0 ? (
        <RolesList roles={roles} currentUserId={user.id} />
      ) : (
        <div className="text-center py-12">
          <h3 className="mt-2 text-sm font-semibold text-gray-900">No roles found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by creating a new role.
          </p>
          <div className="mt-6">
            <a
              href="/dashboard/roles/new"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              Create New Role
            </a>
          </div>
        </div>
      )}

      {/* Current Time and User Info */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <div className="text-sm text-gray-600">
          <p className="flex justify-between">
            <span>Current Date and Time (UTC - YYYY-MM-DD HH:MM:SS formatted):</span>
            <span className="font-mono">{formatUTCTime()}</span>
          </p>
          <p className="flex justify-between">
            <span>Current User's Login:</span>
            <span className="font-mono">{user.name || user.email}</span>
          </p>
        </div>
      </div>
    </div>
  );
}