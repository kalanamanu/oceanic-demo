"use client";
import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
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

  // Handle simple field changes (string fields)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFields({ ...fields, [e.target.name]: e.target.value });
  };

  // Handle categories field as comma-separated names -> array of Category objects
  const handleCategoriesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFields({
      ...fields,
      categories: e.target.value
        .split(/\s*,\s*/)
        .filter(Boolean) // Remove empty strings
        .map((name) => ({ name }) as unknown as Category),
    });
  };

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
            Update all inquiry details below. (Remarks cannot be edited here.)
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            name="referenceNumber"
            value={fields.referenceNumber}
            onChange={handleChange}
            placeholder="Reference Number"
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
          <Input
            name="eta"
            value={fields.eta}
            onChange={handleChange}
            placeholder="ETA"
            type="datetime-local"
          />
          <Input
            name="receivedDate"
            value={fields.receivedDate ?? ""}
            onChange={handleChange}
            placeholder="Inquiry Received Date & Time"
            type="datetime-local"
          />
          <Input
            name="categories"
            value={fields.categories.join(", ")}
            onChange={handleCategoriesChange}
            placeholder="Categories (comma separated)"
          />
          {/* Add other fields as per your Inquiry type here if needed */}
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
