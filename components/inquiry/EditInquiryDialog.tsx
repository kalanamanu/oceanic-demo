// components/inquiry/EditInquiryDialog.tsx
"use client";
import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function EditInquiryDialog({
  inquiry,
  open,
  onClose,
  onSave,
}: {
  inquiry: any; // or Inquiry type
  open: boolean;
  onClose: () => void;
  onSave: (updatedInquiry: any) => void;
}) {
  const [fields, setFields] = React.useState(inquiry);
  React.useEffect(() => {
    setFields(inquiry);
  }, [inquiry]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFields({ ...fields, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(fields);
    onClose();
  };

  if (!fields) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl w-full">
        <DialogHeader>
          <DialogTitle>Edit Inquiry</DialogTitle>
          <DialogDescription>
            Edit vessel inquiry details here.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1">
              Vessel Name
            </label>
            <Input
              name="vesselName"
              value={fields.vesselName || ""}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Agent</label>
            <Input
              name="agent"
              value={fields.agent || ""}
              onChange={handleChange}
            />
          </div>
          {/* Add other fields as needed */}
          <DialogFooter className="mt-6 flex gap-3">
            <Button type="submit">Save Changes</Button>
            <DialogClose asChild>
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
