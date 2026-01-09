"use client";

import { Sidebar } from "@/components/sidebar";
import { DashboardHeader } from "@/components/dashboard-header";
import AuditLog, { AuditEntry } from "@/components/audit-log";

const auditEntries: AuditEntry[] = [
  {
    id: "1",
    action: "Created",
    user: "Admin User",
    timestamp: "2026-01-10T09:00:00Z",
    details: "New inquiry OMS-2026-001 created for MV Pacific Star",
  },
  // ... more entries ...
];

export default function AuditTrailPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <DashboardHeader />
      <main className="flex flex-1">
        <Sidebar />
        <div className="flex-1 p-6">
          <AuditLog entries={auditEntries} />
        </div>
      </main>
    </div>
  );
}
