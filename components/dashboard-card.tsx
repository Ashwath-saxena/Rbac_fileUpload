interface DashboardCardProps {
  title: string;
  value: number;
  description: string;
}

export function DashboardCard({ title, value, description }: DashboardCardProps) {
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="p-6 flex flex-col space-y-2">
        <h3 className="tracking-tight text-sm font-medium text-muted-foreground">
          {title}
        </h3>
        <div className="flex items-center space-x-2">
          <p className="text-3xl font-bold">{value}</p>
        </div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </div>
  )
}