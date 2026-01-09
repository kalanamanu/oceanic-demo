"use client";

import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { Sidebar } from "@/components/sidebar";

export default function ReportsPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <DashboardHeader />

      <main className="flex flex-1">
        {/* Sidebar */}
        <Sidebar />

        {/* Reports Content */}
        <div className="flex-1 p-6">
          <h1 className="text-2xl font-bold mb-6">Reports</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Inquiry Performance Report */}
            <div className="rounded-lg border border-border p-6 bg-card">
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Inquiry Performance Report
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                View metrics on inquiry processing times and PIC performance
              </p>
              <button className="text-sm text-primary hover:underline font-medium">
                Generate Report →
              </button>
            </div>
            {/* Status Summary Report */}
            <div className="rounded-lg border border-border p-6 bg-card">
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Status Summary Report
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Export inquiry status distribution by date range, port, or agent
              </p>
              <button className="text-sm text-primary hover:underline font-medium">
                Generate Report →
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
