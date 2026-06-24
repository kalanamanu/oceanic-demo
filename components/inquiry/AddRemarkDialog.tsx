"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface AddRemarkDialogProps {
  inquiryId: string;
  referenceNumber: string;
  open: boolean;
  onClose: () => void;
  onSave: (inquiryId: string, remarkText: string) => Promise<void>;
}

export function AddRemarkDialog({
  inquiryId,
  referenceNumber, // ✅ FIX: destructure it
  open,
  onClose,
  onSave,
}: AddRemarkDialogProps) {
  const [remark, setRemark] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (open) {
      setRemark("");
      setLoading(false);
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!remark.trim()) return;

    setLoading(true);
    try {
      await onSave(inquiryId, remark.trim());
      onClose();
    } catch (error) {
      console.error("Failed to save remark", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) onClose();
      }}
    >
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add Remark</DialogTitle>

            <DialogDescription>
              Add a new remark for inquiry {referenceNumber}.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <textarea
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              placeholder="Type your remark here..."
              className="flex min-h-[120px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              disabled={loading}
              required
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={loading || !remark.trim()}>
              {loading ? "Saving..." : "Save Remark"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
