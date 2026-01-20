"use client";

import type { Inquiry, Remark } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Edit2, MessageSquare } from "lucide-react";
import { Card } from "@/components/ui/card";
import * as React from "react";
import { EditInquiryDialog } from "@/components/inquiry/EditInquiryDialog"; // Import here

interface InquiryDetailDialogProps {
  inquiry: Inquiry | null;
  remarks: Remark[];
  open: boolean;
  onClose: () => void;
  onEditInquiry?: (updatedInquiry: Inquiry) => void;
}

export function InquiryDetailDialog({
  inquiry,
  remarks,
  open,
  onClose,
  onEditInquiry,
}: InquiryDetailDialogProps) {
  const [editOpen, setEditOpen] = React.useState(false);

  if (!inquiry) return null;

  const inquiryRemarks = remarks.filter((r) => r.inquiryId === inquiry.id);

  const handleEditSave = (updatedInquiry: Inquiry) => {
    if (onEditInquiry) {
      onEditInquiry(updatedInquiry);
    }
    setEditOpen(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
        <DialogContent className="w-full max-w-screen-xl mx-auto rounded-xl shadow-lg p-0">
          <DialogHeader className="px-10 pt-10 pb-4">
            <DialogTitle className="text-2xl">
              {inquiry.referenceNumber}
            </DialogTitle>
            <DialogDescription className="mt-1 text-base">
              Vessel inquiry detail overview
            </DialogDescription>
          </DialogHeader>

          {/* content area */}
          <div
            className="overflow-y-auto px-10 py-6"
            style={{ maxHeight: "70vh" }}
          >
            <div className="space-y-8">
              {/* Vessel Info */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Vessel Information
                </h3>
                <div className="grid grid-cols-2 gap-x-10 gap-y-2 text-sm items-start">
                  <div>
                    <div className="text-muted-foreground">Vessel Name</div>
                    <div className="font-medium text-lg text-foreground">
                      {inquiry.vesselName}
                    </div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Agent</div>
                    <div className="font-medium text-lg text-foreground">
                      {inquiry.agent}
                    </div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Port</div>
                    <div className="font-medium text-lg text-foreground">
                      {inquiry.port}
                    </div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">ETA</div>
                    <div className="font-medium text-lg text-foreground">
                      {new Date(inquiry.eta).toLocaleDateString()}{" "}
                      {new Date(inquiry.eta).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Categories */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Categories
                </h3>
                <div className="flex flex-wrap gap-2">
                  {inquiry.categories.map(
                    (cat: string | { name: string }, i: number) =>
                      typeof cat === "string" ? (
                        <Badge key={cat} variant="outline">
                          {cat}
                        </Badge>
                      ) : (
                        <Badge key={cat.name ?? i} variant="outline">
                          {cat.name}
                        </Badge>
                      ),
                  )}
                </div>
              </div>

              <Separator />

              {/* Status & Assignment */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Status & Assignment
                </h3>
                <div className="grid grid-cols-2 gap-x-10 gap-y-2 text-sm items-start">
                  <div>
                    <div className="text-muted-foreground">Current Status</div>
                    <div className="font-medium text-lg text-foreground">
                      {inquiry.status}
                    </div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">
                      Person in Charge
                    </div>
                    <div className="font-medium text-lg text-foreground">
                      {inquiry.picAssigned || "Unassigned"}
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Remarks */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <MessageSquare className="h-5 w-5 text-muted-foreground" />
                  <h3 className="text-lg font-semibold text-foreground">
                    Remarks History
                  </h3>
                </div>
                <div className="space-y-3">
                  {inquiryRemarks.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      No remarks yet
                    </p>
                  ) : (
                    inquiryRemarks.map((remark) => (
                      <Card key={remark.id} className="p-4">
                        <div className="space-y-2">
                          <div className="flex items-start justify-between">
                            <p className="text-xs font-medium text-primary">
                              {remark.author}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(remark.timestamp).toLocaleDateString()}
                            </p>
                          </div>
                          <p className="text-base text-foreground">
                            {remark.text}
                          </p>
                        </div>
                      </Card>
                    ))
                  )}
                </div>
              </div>

              <Separator />

              <div className="space-y-2 pt-2">
                <Button
                  className="w-full bg-transparent"
                  variant="outline"
                  onClick={() => setEditOpen(true)}
                >
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
        </DialogContent>
      </Dialog>
      {editOpen && inquiry && (
        <EditInquiryDialog
          inquiry={inquiry}
          open={editOpen}
          onClose={() => setEditOpen(false)}
          onSave={handleEditSave}
        />
      )}
    </>
  );
}
