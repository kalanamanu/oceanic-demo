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
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import type { Inquiry, Category } from "@/lib/types";

interface EditInquiryDialogProps {
  inquiry: Inquiry;
  open: boolean;
  onClose: () => void;
  onSave: (updatedInquiry: Inquiry) => void;
}

export function EditInquiryDialog({
  inquiry,
  open,
  onClose,
  onSave,
}: EditInquiryDialogProps) {
  const [fields, setFields] = React.useState<Inquiry>(inquiry);

  React.useEffect(() => setFields(inquiry), [inquiry, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFields({ ...fields, [e.target.name]: e.target.value });
  };

  // Add custom handlers for complex fields (dates, categories, status, etc.) as needed

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(fields);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl w-full">
        <DialogHeader>
          <DialogTitle>Edit Inquiry</DialogTitle>
          <DialogDescription>
            Edit all vessel inquiry fields below.
          </DialogDescription>
        </DialogHeader>
        {/* All fields except remarks */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            name="referenceNumber"
            value={fields.referenceNumber}
            onChange={handleChange}
            placeholder="Ref #"
          />
          <Input
            name="vesselName"
            value={fields.vesselName}
            onChange={handleChange}
            placeholder="Vessel Name"
          />
          <Input
            name="agent"
            value={fields.agent}
            onChange={handleChange}
            placeholder="Agent"
          />
          <Input
            name="port"
            value={fields.port}
            onChange={handleChange}
            placeholder="Port"
          />
          <Input
            name="picAssigned"
            value={fields.picAssigned ?? ""}
            onChange={handleChange}
            placeholder="Person in Charge"
          />
          <Input
            name="status"
            value={fields.status}
            onChange={handleChange}
            placeholder="Status"
          />
          {/* ETA/date fields: add proper date pickers if you want */}
          <Input
            name="eta"
            value={fields.eta}
            onChange={handleChange}
            placeholder="ETA"
          />
          {/* Categories: could be comma separated, or custom chip input */}
          <Input
            name="categories"
            value={fields.categories.join(", ")}
            onChange={(e) =>
              setFields({
                ...fields,
                categories: e.target.value
                  .split(/\s*,\s*/)
                  .map((cat) => ({ name: cat } as unknown as Category)), // ensure correct type
              })
            }
            placeholder="Categories (comma separated)"
          />
          {/* Add other custom fields as needed */}
          <Separator />
          <div className="mt-6 flex gap-3">
            <Button type="submit">Save Changes</Button>
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
