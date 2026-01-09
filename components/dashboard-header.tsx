import { Ship } from "lucide-react"

export function DashboardHeader() {
  return (
    <div className="border-b border-border bg-card">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <Ship className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Oceanic Inquiry Management</h1>
            <p className="text-sm text-muted-foreground">Maritime Services System</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-muted-foreground">Demo User</p>
          <p className="text-xs text-muted-foreground">Management</p>
        </div>
      </div>
    </div>
  )
}
