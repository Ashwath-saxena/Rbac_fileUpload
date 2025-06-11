import { Suspense } from "react";
import { getOrCreateUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DashboardCard } from "@/components/dashboard-card";
import { UserInfo } from "@/components/user-info";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  try {
    const user = await getOrCreateUser();

    if (!user) {
      redirect('/auth/sign-in');
    }

    const [fileCount, roleCount, totalUsers] = await Promise.all([
      prisma.file.count({
        where: { userId: user.id }
      }),
      prisma.role.count(),
      prisma.user.count(),
    ]);

    return (
      <div className="space-y-8 p-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Welcome back, {user.name}! Here's an overview of your account.
          </p>
        </div>
        
        <Suspense fallback={
          <div className="p-4 bg-white rounded-lg shadow animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        }>
          <UserInfo />
        </Suspense>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <DashboardCard
            title="Files"
            value={fileCount}
            description="Total files uploaded by you"
          />
          <DashboardCard
            title="Roles"
            value={roleCount}
            description="Total roles created by you"
          />
          <DashboardCard
            title="Total Users"
            value={totalUsers}
            description="Total users in the system"
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Recent Activity</h3>
          <div className="rounded-lg border bg-card p-6">
            <p className="text-sm text-muted-foreground">
              Your recent activities will appear here
            </p>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Dashboard Error:', error);
    redirect('/auth/sign-in');
  }
}