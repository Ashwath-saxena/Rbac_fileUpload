import { Skeleton } from "@/components/ui/skeleton"

export default function DashboardLoading() {
  return (
    <div className="space-y-8">
      <div>
        <Skeleton className="h-8 w-[200px]" />
        <Skeleton className="h-4 w-[300px] mt-2" />
      </div>

      {/* User Info Skeleton */}
      <div className="p-4 bg-white rounded-lg shadow">
        <Skeleton className="h-4 w-[250px] mb-2" />
        <Skeleton className="h-4 w-[200px] mb-2" />
        <Skeleton className="h-4 w-[150px]" />
      </div>

      {/* Stats Grid Skeleton */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="rounded-lg border p-6">
            <Skeleton className="h-4 w-[100px] mb-2" />
            <Skeleton className="h-8 w-[60px] mb-2" />
            <Skeleton className="h-4 w-[140px]" />
          </div>
        ))}
      </div>

      {/* Recent Activity Skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-6 w-[150px]" />
        <div className="rounded-lg border p-6">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-[80%] mt-2" />
          <Skeleton className="h-4 w-[60%] mt-2" />
        </div>
      </div>
    </div>
  )
}