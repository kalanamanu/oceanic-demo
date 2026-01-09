"use client"

import { useState } from "react"
import type { Inquiry, InquiryStatus } from "@/lib/types"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye } from "lucide-react"

interface InquiryTableProps {
  inquiries: Inquiry[]
  onSelectInquiry: (inquiry: Inquiry) => void
}

const statusColors: Record<InquiryStatus, string> = {
  Pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  "Quotation Submitted": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  Active: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  Confirmed: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  Rejected: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
}

export function InquiryTable({ inquiries, onSelectInquiry }: InquiryTableProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  return (
    <div className="space-y-4">
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted">
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Ref #</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Vessel</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Agent</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Port</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">PIC</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {inquiries.map((inquiry) => (
                <tr key={inquiry.id} className="hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-mono font-medium text-primary">{inquiry.referenceNumber}</td>
                  <td className="px-6 py-4 text-sm text-foreground">{inquiry.vesselName}</td>
                  <td className="px-6 py-4 text-sm text-foreground">{inquiry.agent}</td>
                  <td className="px-6 py-4 text-sm text-foreground">{inquiry.port}</td>
                  <td className="px-6 py-4 text-sm text-foreground">{inquiry.picAssigned || "-"}</td>
                  <td className="px-6 py-4 text-sm">
                    <Badge className={statusColors[inquiry.status]}>{inquiry.status}</Badge>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setExpandedId(expandedId === inquiry.id ? null : inquiry.id)
                        onSelectInquiry(inquiry)
                      }}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
