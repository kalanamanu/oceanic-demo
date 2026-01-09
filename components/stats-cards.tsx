"use client"

import { Card } from "@/components/ui/card"
import type { DashboardStats } from "@/lib/types"

interface StatsCardsProps {
  stats: DashboardStats
}

export function StatsCards({ stats }: StatsCardsProps) {
  const statItems = [
    { label: "Total Inquiries", value: stats.totalInquiries, color: "bg-primary" },
    { label: "Pending", value: stats.pendingCount, color: "bg-secondary" },
    { label: "Active", value: stats.activeCount, color: "bg-accent" },
    { label: "Confirmed", value: stats.confirmedCount, color: "bg-green-500" },
    { label: "Rejected", value: stats.rejectedCount, color: "bg-destructive" },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
      {statItems.map((stat) => (
        <Card key={stat.label} className="p-4">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
            <p className="text-3xl font-bold text-foreground">{stat.value}</p>
            <div className={`h-1 w-full rounded-full ${stat.color}`} />
          </div>
        </Card>
      ))}
    </div>
  )
}
