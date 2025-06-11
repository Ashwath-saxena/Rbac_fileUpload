"use client";

import { useState } from "react";
import { Role, Permission, User } from "@prisma/client";

type RoleWithRelations = Role & {
  permissions: Permission[];
  users: User[];
  creator: {
    id: string;
    name: string | null;
    email: string;
  };
  _count: {
    users: number;
  };
};

interface RolesListProps {
  roles: RoleWithRelations[];
  currentUserId: string;
}

export function RolesList({ roles, currentUserId }: RolesListProps) {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <ul className="divide-y divide-gray-200">
        {roles.map((role) => (
          <li key={role.id}>
            <div className="px-4 py-4 sm:px-6 hover:bg-gray-50 cursor-pointer"
                 onClick={() => setSelectedRole(selectedRole === role.id ? null : role.id)}>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center">
                    <h3 className="text-lg font-medium text-gray-900">{role.name}</h3>
                    {role.creator.id === currentUserId && (
                      <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        Creator
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-gray-500">{role.description}</p>
                </div>
                <div className="flex-shrink-0 flex">
                  <p className="px-2 inline-flex text-sm leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    {role._count.users} users
                  </p>
                </div>
              </div>

              {selectedRole === role.id && (
                <div className="mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Permissions</h4>
                      <ul className="mt-2 text-sm text-gray-600">
                        {role.permissions.map((permission) => (
                          <li key={permission.id} className="flex items-center">
                            <svg className="h-4 w-4 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            {permission.name}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Users</h4>
                      <ul className="mt-2 text-sm text-gray-600">
                        {role.users.map((user) => (
                          <li key={user.id}>{user.name || user.email}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  {role.creator.id === currentUserId && (
                    <div className="mt-4 flex space-x-2">
                      <button className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                        Edit
                      </button>
                      <button className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700">
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}