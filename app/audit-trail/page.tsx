"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface AuditEntry {
  id: string;
  action: string;
  user: string;
  timestamp: string;
  details: string;
}

interface AuditLogProps {
  entries: AuditEntry[];
}

const actionColors: Record<string, string> = {
  Created: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  Updated:
    "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  "Status Changed":
    "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  Assigned:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
};

export default function AuditLog({ entries }: AuditLogProps) {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-bold text-foreground mb-4">Audit Trail</h3>
      <div className="space-y-3">
        {entries.map((entry) => (
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
