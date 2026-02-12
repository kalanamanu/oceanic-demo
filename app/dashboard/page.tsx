"use client";

import { Button } from "@/components/ui/button";
import StatCards from "@/components/dashboard/dashboard-statcards";
import { VesselInquiryDialog } from "@/components/inquiry/AddVesselInquiryDialog";
import { FileText, Clock, CheckCircle, Building2, Package } from "lucide-react";

export default function Dashboard() {
  const name = "Jane Doe";
  const department = "Operations";

  const stats = [
    {
      label: "Total Inquiries",
      value: 120,
      color: "blue" as const,
      icon: FileText,
    },
    {
      label: "Pending Inquiries",
      value: 24,
      color: "orange" as const,
      icon: Clock,
    },
    {
      label: "Confirmed Inquiries",
      value: 52,
      color: "green" as const,
      icon: CheckCircle,
    },
    {
      label: "Active Vendors",
      value: 12,
      color: "cyan" as const,
      icon: Building2,
    },
    {
      label: "Active Products",
      value: 47,
      color: "violet" as const,
      icon: Package,
    },
  ];

  const activities = [
    {
      id: "1",
      activity: "Inquiry OMS-2026-005 created",
      by: "Maria Santos",
      time: "2 hours ago",
    },
    {
      id: "2",
      activity: "OMS-2026-003 confirmed by vendor",
      by: "John Silva",
      time: "4 hours ago",
    },
    {
      id: "3",
      activity: "New vendor 'Pacific Supplies' activated",
      by: "Purchasing Head",
      time: "Yesterday",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8 max-w-7xl space-y-8">
        {/* Welcome Card - Clean Design */}
        <section>
          <div className="bg-gradient-to-br from-slate-50 to-slate-100/80 dark:from-slate-900 dark:to-slate-800/80 rounded-2xl p-8 shadow-sm border border-slate-200 dark:border-slate-800">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
                Welcome, {name}! 👋
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-400">
                <span className="font-medium">Department:</span> {department}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-500 mt-4 max-w-2xl">
                Here's what's happening with your inquiries today.
              </p>
            </div>
          </div>
        </section>

        {/* Stat Cards with Better Spacing */}
        <section className="pt-2">
          <StatCards stats={stats} />
        </section>

        {/* Recent Activities Section */}
        <section className="pt-4">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
                Recent Activities
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Track the latest updates and changes
              </p>
            </div>
            <VesselInquiryDialog>
              <Button size="lg" className="shadow-sm">
                Create Inquiry
              </Button>
            </VesselInquiryDialog>
          </div>

          {/* Enhanced Table Card */}
          <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50 border-b">
                  <tr>
                    <th className="py-4 px-6 text-left font-semibold text-sm text-muted-foreground uppercase tracking-wider">
                      Activity
                    </th>
                    <th className="py-4 px-6 text-left font-semibold text-sm text-muted-foreground uppercase tracking-wider">
                      By
                    </th>
                    <th className="py-4 px-6 text-left font-semibold text-sm text-muted-foreground uppercase tracking-wider">
                      Time
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {activities.map((a) => (
                    <tr
                      key={a.id}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      <td className="py-4 px-6 text-sm font-medium text-foreground">
                        {a.activity}
                      </td>
                      <td className="py-4 px-6 text-sm text-foreground">
                        {a.by}
                      </td>
                      <td className="py-4 px-6 text-sm text-muted-foreground">
                        {a.time}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Bottom Spacing */}
        <div className="h-8" />
      </div>
    </div>
  );
}
