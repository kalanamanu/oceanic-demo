"use client";

import { useState } from "react";
import type { Inquiry } from "@/types/inquiry.types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye } from "lucide-react";

interface InquiryTableProps {
  inquiries: Inquiry[];
  onSelectInquiry: (inquiry: Inquiry) => void;
}

const statusColors: Record<string, string> = {
  Pending:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  "Quotation Submitted":
    "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  Active:
    "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  Confirmed:
    "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  Rejected: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
};

// ✅ SAFE STATUS NORMALIZER (fixes object crash)
const getStatus = (status: any): string => {
  if (!status) return "Pending";
  if (typeof status === "string") return status;
  if (typeof status === "object") return status.name || "Pending";
  return "Pending";
};

// ✅ SAFE TEXT RENDERER (prevents object rendering crash)
const safeText = (value: any) => {
  if (value === null || value === undefined) return "-";
  if (typeof value === "string" || typeof value === "number") return value;
  if (typeof value === "object") {
    return value.name || value.label || "-";
  }
  return "-";
};

export function InquiryTable({
  inquiries,
  onSelectInquiry,
}: InquiryTableProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted">
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                  Ref #
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                  Vessel
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                  Agent
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                  Port
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                  PIC
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border">
              {inquiries.map((inquiry, index) => {
                const idToUse = inquiry.inq_id || inquiry.id;
                const status = getStatus(inquiry.status);

                return (
                  <tr
                    key={idToUse || index}
                    className="hover:bg-muted/50 transition-colors"
                  >
                    {/* Ref # */}
                    <td className="px-6 py-4 text-sm font-mono font-medium text-primary">
                      {idToUse
                        ? `INQ-${idToUse
                            .replace("inq_", "")
                            .substring(0, 6)
                            .toUpperCase()}`
                        : "-"}
                    </td>

                    {/* Vessel */}
                    <td className="px-6 py-4 text-sm text-foreground">
                      {safeText(inquiry.vessel_name)}
                    </td>

                    {/* Agent */}
                    <td className="px-6 py-4 text-sm text-foreground">
                      {safeText(inquiry.agent)}
                    </td>

                    {/* Port */}
                    <td className="px-6 py-4 text-sm text-foreground">
                      {safeText(inquiry.port)}
                    </td>

                    {/* PIC (SAFE for your backend: other_pics [{id,name}]) */}
                    <td className="px-6 py-4 text-sm text-foreground">
                      {inquiry.other_pics?.length
                        ? inquiry.other_pics
                            .map((p) => p?.name)
                            .filter(Boolean)
                            .join(", ")
                        : "-"}
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4 text-sm">
                      <Badge
                        className={statusColors[status] || statusColors.Pending}
                      >
                        {status}
                      </Badge>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-sm">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setExpandedId(
                            expandedId === idToUse ? null : idToUse || null,
                          );
                          onSelectInquiry(inquiry);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
