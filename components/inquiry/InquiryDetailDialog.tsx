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
import { Input } from "@/components/ui/input";
import * as React from "react";

interface InquiryDetailDialogProps {
  inquiry: Inquiry | null;
  remarks: Remark[];
  open: boolean;
  onClose: () => void;
  onEditInquiry?: (updatedInquiry: Inquiry) => void; // Callback if parent wants to update
}

export function InquiryDetailDialog({
  inquiry,
  remarks,
  open,
  onClose,
  onEditInquiry,
}: InquiryDetailDialogProps) {
  const [editOpen, setEditOpen] = React.useState(false);
  const [editFields, setEditFields] = React.useState<Partial<Inquiry> | null>(
    null
  );

  React.useEffect(() => {
    if (inquiry) setEditFields(inquiry);
  }, [inquiry, editOpen]);

  if (!inquiry) return null;

  const inquiryRemarks = remarks.filter((r) => r.inquiryId === inquiry.id);

  // Edit Inquiry Dialog (inline)
  function EditInquiryDialog() {
    if (!editFields) return null;

    const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setEditFields({ ...editFields, [e.target.name]: e.target.value });
    };

    const handleEditSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      setEditOpen(false);
      if (onEditInquiry) {
        // Create a copy with updated values, using defaults for other fields
        onEditInquiry({ ...inquiry, ...editFields } as Inquiry);
      }
    };

    return (
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-2xl w-full">
          <DialogHeader>
            <DialogTitle>Edit Inquiry</DialogTitle>
            <DialogDescription>
              Edit vessel inquiry details here.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-1">
                Vessel Name
              </label>
              <Input
                name="vesselName"
                value={editFields.vesselName || ""}
                onChange={handleEditChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Agent</label>
              <Input
                name="agent"
                value={editFields.agent || ""}
                onChange={handleEditChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Port</label>
              <Input
                name="port"
                value={editFields.port || ""}
                onChange={handleEditChange}
              />
            </div>
            {/* Add more fields as needed (picAssigned, status, etc.) */}
            <div className="mt-6 flex gap-3">
              <Button type="submit">Save Changes</Button>
              <Button
                variant="outline"
                type="button"
                onClick={() => setEditOpen(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    );
  }

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
              {/* Vessel Info - use grid */}
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
                  {inquiry.categories.map((cat) => (
                    <Badge key={cat} variant="outline">
                      {cat}
                    </Badge>
                  ))}
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
      {editOpen && <EditInquiryDialog />}
    </>
  );
}
