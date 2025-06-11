# Install dependencies one by one to avoid path issues
npm install @clerk/nextjs
npm install @prisma/client prisma
npm install @uploadthing/react uploadthing
npm install zod
npm install react-hook-form
npm install @hookform/resolvers
npm install @tanstack/react-table
npm install @radix-ui/react-dropdown-menu
npm install @radix-ui/react-slot
npm install @radix-ui/react-toast
npm install lucide-react
npm install clsx
npm install tailwind-merge
npm install class-variance-authority
npm install @radix-ui/react-checkbox
npm install @radix-ui/react-label
npm install @radix-ui/react-select

# Create project structure
mkdir -p app/api/users
mkdir -p app/api/roles
mkdir -p app/api/files
mkdir -p app/api/upload
mkdir -p app/dashboard/users
mkdir -p app/dashboard/roles
mkdir -p app/dashboard/files
mkdir -p components/ui
mkdir -p components/forms
mkdir -p lib
mkdir -p types
mkdir -p prisma

# Create auth routes for Clerk
mkdir -p "app/sign-in/[[...sign-in]]"
mkdir -p "app/sign-up/[[...sign-up]]"

# Initialize Prisma
echo 'generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  clerkId   String   @unique
  role      Role     @relation(fields: [roleId], references: [id])
  roleId    String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Role {
  id          String       @id @default(cuid())
  name        String       @unique
  permissions Permission[]
  users       User[]
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt
}

model Permission {
  id        String   @id @default(cuid())
  name      String   @unique
  roles     Role[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model File {
  id         String   @id @default(cuid())
  name       String
  url        String
  size       Int
  type       String
  uploadedBy String
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
}' > prisma/schema.prisma

# Create middleware for Clerk authentication
echo 'import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  publicRoutes: ["/", "/api/uploadthing"],
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};' > middleware.ts

# Create environment file
echo 'DATABASE_URL="postgresql://postgres:postgres@localhost:5432/rbac_upload_db?schema=public"
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_publishable_key_here
CLERK_SECRET_KEY=your_secret_key_here
UPLOADTHING_SECRET=your_uploadthing_secret_here
UPLOADTHING_APP_ID=your_uploadthing_app_id_here' > .env

# Create layout file
echo 'import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>{children}</body>
      </html>
    </ClerkProvider>
  );
}' > app/layout.tsx

# Create dashboard layout
echo 'import { UserButton } from "@clerk/nextjs";
import Link from "next/link";

const navigation = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Users", href: "/dashboard/users" },
  { name: "Roles", href: "/dashboard/roles" },
  { name: "Files", href: "/dashboard/files" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between">
            <div className="flex">
              <div className="flex flex-shrink-0 items-center">
                <Link href="/dashboard" className="text-xl font-bold">
                  RBAC App
                </Link>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
            <div className="flex items-center">
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>
        </div>
      </nav>
      <main className="py-10">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">{children}</div>
      </main>
    </div>
  );
}' > app/dashboard/layout.tsx

# Create utility functions
echo 'import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatBytes(bytes: number, decimals = 2) {
  if (bytes === 0) return "0 Bytes"

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"]

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}' > lib/utils.ts

# Create Prisma client
echo 'import { PrismaClient } from "@prisma/client"

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma = globalForPrisma.prisma || new PrismaClient()

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma' > lib/prisma.ts

# Create types
echo 'export interface User {
  id: string;
  email: string;
  name?: string;
  roleId: string;
  role: Role;
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
}

export interface Permission {
  id: string;
  name: string;
  roles: Role[];
  createdAt: Date;
  updatedAt: Date;
}

export interface File {
  id: string;
  name: string;
  url: string;
  size: number;
  type: string;
  uploadedBy: string;
  createdAt: Date;
  updatedAt: Date;
}' > types/index.ts