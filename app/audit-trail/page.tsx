"use client";

import { Sidebar } from "@/components/sidebar";
import { DashboardHeader } from "@/components/dashboard-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Interfaces and mock data defined locally
interface AuditEntry {
  id: string;
  action: string;
  user: string;
  timestamp: string;
  details: string;
}

const auditEntries: AuditEntry[] = [
  {
    id: "1",
    action: "Created",
    user: "Admin User",
    timestamp: "2026-01-10T09:00:00Z",
    details: "New inquiry OMS-2026-001 created for MV Pacific Star",
  },
  {
    id: "2",
    action: "Assigned",
    user: "Purchasing Head",
    timestamp: "2026-01-10T09:15:00Z",
    details: "OMS-2026-001 assigned to John Silva",
  },
  {
    id: "3",
    action: "Updated",
    user: "Maria Santos",
    timestamp: "2026-01-11T15:20:00Z",
    details: "OMS-2026-002 quotation submitted",
  },
  {
    id: "4",
    action: "Status Changed",
    user: "Maria Santos",
    timestamp: "2026-01-11T15:30:00Z",
    details: "OMS-2026-002 status changed to Active",
  },
  {
    id: "5",
    action: "Status Changed",
    user: "Ahmed Hassan",
    timestamp: "2026-01-09T16:30:00Z",
    details: "OMS-2026-003 confirmed by client",
  },
  {
    id: "6",
    action: "Assigned",
    user: "Purchasing Head",
    timestamp: "2026-01-12T09:35:00Z",
    details: "OMS-2026-004 assigned to Ann Daly",
  },
  {
    id: "7",
    action: "Updated",
    user: "Ann Daly",
    timestamp: "2026-01-12T10:12:00Z",
    details: "OMS-2026-004 vendor quotation uploaded",
  },
];

// Component logic in the same file
const actionColors: Record<string, string> = {
  Created: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  Updated:
    "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  "Status Changed":
    "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  Assigned:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
};

function AuditLog({ entries }: { entries?: AuditEntry[] }) {
  const safeEntries = Array.isArray(entries) ? entries : [];
  return (
    <Card className="p-6">
      <h3 className="text-lg font-bold text-foreground mb-4">Audit Trail</h3>
      <div className="space-y-3">
        {safeEntries.length === 0 && (
          <div className="text-muted-foreground text-center py-8">
            No activity found.
          </div>
        )}
        {safeEntries.map((entry) => (
          <div
            key={entry.id}
            className="flex items-start justify-between border-l-2 border-primary pl-4 py-2"
          >
            <div className="space-y-1 flex-1">
              <div className="flex items-center gap-2">
                <Badge
                  className={
                    actionColors[entry.action] || "bg-gray-100 text-gray-800"
                  }
                >
                  {entry.action}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {entry.user}
                </span>
              </div>
              <p className="text-sm text-foreground">{entry.details}</p>
            </div>
            <p className="text-xs text-muted-foreground whitespace-nowrap ml-4">
              {new Date(entry.timestamp).toLocaleDateString()}{" "}
              {new Date(entry.timestamp).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
}

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
