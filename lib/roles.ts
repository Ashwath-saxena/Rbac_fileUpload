type Permission = string;

export const ROLE_PERMISSIONS: Record<string, Permission[]> = {
  SUPERADMIN: [
    'all:all',
    'users:manage',
    'roles:manage',
    'files:manage',
    'settings:manage',
  ],
  ADMIN: [
    'users:read',
    'users:create',
    'users:update',
    'files:manage',
    'roles:assign',
  ],
  MANAGER: [
    'users:read',
    'files:manage',
    'files:approve',
  ],
  USER: [
    'files:upload',
    'files:read',
    'files:update',
    'files:delete',
  ],
  GUEST: [
    'files:read',
  ],
};

export type RoleSlug = 'superadmin' | 'admin' | 'manager' | 'user' | 'guest';

export interface RoleDefinition {
  name: string;
  slug: RoleSlug;
  description: string;
  permissions: Permission[];
}

export const ROLES: RoleDefinition[] = [
  {
    name: 'Superadmin',
    slug: 'superadmin',
    description: 'Full system access with all permissions',
    permissions: [...ROLE_PERMISSIONS.SUPERADMIN],
  },
  {
    name: 'Admin',
    slug: 'admin',
    description: 'Administrative access with user management',
    permissions: [...ROLE_PERMISSIONS.ADMIN],
  },
  {
    name: 'Manager',
    slug: 'manager',
    description: 'Can manage users and approve files',
    permissions: [...ROLE_PERMISSIONS.MANAGER],
  },
  {
    name: 'User',
    slug: 'user',
    description: 'Standard user access',
    permissions: [...ROLE_PERMISSIONS.USER],
  },
  {
    name: 'Guest',
    slug: 'guest',
    description: 'Limited read-only access',
    permissions: [...ROLE_PERMISSIONS.GUEST],
  },
];

// Helper function to check if a user has a specific permission
export function hasPermission(userPermissions: string[], permission: Permission): boolean {
  return userPermissions.includes(permission) || userPermissions.includes('all:all');
}

// Helper function to check if a user has any of the required permissions
export function hasAnyPermission(userPermissions: string[], requiredPermissions: Permission[]): boolean {
  return requiredPermissions.some(permission => hasPermission(userPermissions, permission));
}

// Helper function to check if a user has all of the required permissions
export function hasAllPermissions(userPermissions: string[], requiredPermissions: Permission[]): boolean {
  return requiredPermissions.every(permission => hasPermission(userPermissions, permission));
}