"use client"

import type { Inquiry, Remark } from "@/lib/types"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { X, Edit2, MessageSquare } from "lucide-react"

interface InquiryDetailPanelProps {
  inquiry: Inquiry | null
  remarks: Remark[]
  onClose: () => void
}

export function InquiryDetailPanel({ inquiry, remarks, onClose }: InquiryDetailPanelProps) {
  if (!inquiry) return null

  const inquiryRemarks = remarks.filter((r) => r.inquiryId === inquiry.id)

  return (
    <div className="fixed inset-0 z-50 bg-black/50">
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-md overflow-y-auto bg-background shadow-lg">
        <div className="flex items-center justify-between border-b border-border p-6">
          <h2 className="text-xl font-bold text-foreground">{inquiry.referenceNumber}</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-6 p-6">
          {/* Vessel Info */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground">Vessel Information</h3>
            <div className="space-y-2 text-sm">
              <div>
                <p className="text-muted-foreground">Vessel Name</p>
                <p className="font-medium text-foreground">{inquiry.vesselName}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Agent</p>
                <p className="font-medium text-foreground">{inquiry.agent}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Port</p>
                <p className="font-medium text-foreground">{inquiry.port}</p>
              </div>
              <div>
                <p className="text-muted-foreground">ETA</p>
                <p className="font-medium text-foreground">
                  {new Date(inquiry.eta).toLocaleDateString()} {new Date(inquiry.eta).toLocaleTimeString()}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Categories */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground">Categories</h3>
            <div className="flex flex-wrap gap-2">
              {inquiry.categories.map((cat) => (
                <Badge key={cat} variant="outline">
                  {cat}
                </Badge>
              ))}
            </div>
          </div>

          <Separator />

          {/* Status & Assignment */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground">Status & Assignment</h3>
            <div className="space-y-2 text-sm">
              <div>
                <p className="text-muted-foreground">Current Status</p>
                <p className="font-medium text-foreground">{inquiry.status}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Person in Charge</p>
                <p className="font-medium text-foreground">{inquiry.picAssigned || "Unassigned"}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Remarks */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-semibold text-foreground">Remarks History</h3>
            </div>
            <div className="space-y-3">
              {inquiryRemarks.length === 0 ? (
                <p className="text-sm text-muted-foreground">No remarks yet</p>
              ) : (
                inquiryRemarks.map((remark) => (
                  <Card key={remark.id} className="p-3">
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <p className="text-xs font-medium text-primary">{remark.author}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(remark.timestamp).toLocaleDateString()}
                        </p>
                      </div>
                      <p className="text-sm text-foreground">{remark.text}</p>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </div>

          <Separator />

          {/* Actions */}
          <div className="space-y-2 pt-4">
            <Button className="w-full bg-transparent" variant="outline">
              <Edit2 className="mr-2 h-4 w-4" />
              Edit Inquiry
            </Button>
            <Button className="w-full bg-transparent" variant="outline">
              <MessageSquare className="mr-2 h-4 w-4" />
              Add Remark
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
