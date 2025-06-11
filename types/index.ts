export type Permission = {
  id: string;
  name: string;
  roles?: Role[];
  createdAt: Date;
  updatedAt: Date;
};

export type Role = {
  id: string;
  name: string;
  permissions: Permission[];
  users?: User[];
  _count?: {
    users: number;
  };
  createdAt: Date;
  updatedAt: Date;
};

export type User = {
  id: string;
  name: string | null;
  email: string;
  clerkId: string;
  roleId: string;
  role?: Role;
  createdAt: Date;
  updatedAt: Date;
};

export interface File {
  id: string;
  name: string;
  url: string;
  size: number;
  type: string;
  uploadedBy: string;
  createdAt: Date;
  updatedAt: Date;
}