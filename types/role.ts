export interface Permission {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  name: string | null;
  email: string;
  clerkId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Role {
  id: string;
  name: string;
  permissions: Permission[];
  users: User[];
  createdAt: Date;
  updatedAt: Date;
  _count?: {
    users: number;
  };
}