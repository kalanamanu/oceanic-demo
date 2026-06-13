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
import type { InquiryRemark } from "@/types/inquiry.types";

interface EditRemarkDialogProps {
  remark: InquiryRemark;
  open: boolean;
  onClose: () => void;
  onSave: (remarkId: string, newText: string) => Promise<void>;
}

export function EditRemarkDialog({
  remark,
  open,
  onClose,
  onSave,
}: EditRemarkDialogProps) {
  const [text, setText] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  // ✅ safer reset logic
  React.useEffect(() => {
    if (open && remark?.remark) {
      setText(remark.remark);
      setLoading(false);
    }
  }, [open, remark]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("👉 SUBMIT CLICKED"); // ADD THIS

    if (!text.trim()) return;

    setLoading(true);

    try {
      console.log("👉 CALLING onSave"); // ADD THIS
      console.log("remark id:", remark.remark_id);
      console.log("text:", text.trim());

      await onSave(remark.remark_id, text.trim());

      console.log("👉 AFTER onSave");
      onClose();
    } catch (error) {
      console.error("Failed to update remark", error);
    } finally {
      setLoading(false);
    }
  };

  const isUnchanged = !remark?.remark || text.trim() === remark.remark.trim();

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Remark</DialogTitle>
            <DialogDescription>
              Update your remark text below.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
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

            <Button
              type="submit"
              disabled={loading || !text.trim() || isUnchanged}
            >
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
