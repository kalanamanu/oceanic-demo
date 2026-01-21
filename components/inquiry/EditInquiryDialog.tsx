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

const STATUS_OPTIONS = [
  "Pending",
  "Active",
  "Confirmed",
  "Rejected",
  "Quotation Submitted",
];

interface EditInquiryDialogProps {
  inquiry: Inquiry;
  open: boolean;
  onClose: () => void;
  onSave: (updatedInquiry: Inquiry) => void;
}

// Local state type for editing, allowing picAssigned as string[]
type EditableInquiry = Omit<Inquiry, "picAssigned"> & { picAssigned: string[] };

export function EditInquiryDialog({
  inquiry,
  open,
  onClose,
  onSave,
}: EditInquiryDialogProps) {
  // Ensure picAssigned is always an array for editing
  const initialPicAssigned = Array.isArray(inquiry.picAssigned)
    ? inquiry.picAssigned
    : inquiry.picAssigned
      ? [inquiry.picAssigned]
      : [""];

  const [fields, setFields] = React.useState<EditableInquiry>({
    ...inquiry,
    picAssigned: initialPicAssigned,
  });

  React.useEffect(() => {
    setFields({
      ...inquiry,
      picAssigned: Array.isArray(inquiry.picAssigned)
        ? inquiry.picAssigned
        : inquiry.picAssigned
          ? [inquiry.picAssigned]
          : [""],
    });
  }, [inquiry, open]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    if (name.startsWith("picAssigned-")) {
      // Handle sub PICs
      const idx = parseInt(name.split("-")[1], 10);
      setFields((prev) => ({
        ...prev,
        picAssigned: prev.picAssigned.map((pic, i) =>
          i === idx ? value : pic,
        ),
      }));
    } else if (name === "keyPicAssigned") {
      setFields((prev) => ({
        ...prev,
        picAssigned: [value, ...prev.picAssigned.slice(1)],
      }));
    } else {
      setFields({ ...fields, [name]: value });
    }
  };

  // Add a new sub PIC
  const handleAddSubPic = () => {
    setFields((prev) => ({
      ...prev,
      picAssigned: [...(prev.picAssigned || []), ""],
    }));
  };

  // Remove a sub PIC by index (not the key PIC)
  const handleRemoveSubPic = (idx: number) => {
    setFields((prev) => ({
      ...prev,
      picAssigned: prev.picAssigned.filter((_, i) => i !== idx),
    }));
  };

  // Convert input into array of {name: string}
  const handleCategoriesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFields({
      ...fields,
      categories: e.target.value
        .split(/\s*,\s*/)
        .filter(Boolean)
        .map((name) => ({ name }) as unknown as Category),
    });
  };

  // Safely extract name for both string and object cases
  const categoriesArr: (string | Category)[] = Array.isArray(fields.categories)
    ? (fields.categories as (string | Category)[])
    : [];

  const categoriesText = categoriesArr
    .map((c) =>
      typeof c === "string"
        ? c
        : typeof c === "object" && "name" in c
          ? (c as any).name
          : "",
    )
    .join(", ");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Convert picAssigned array to string for Inquiry type
    const inquiryToSave: Inquiry = {
      ...fields,
      picAssigned: fields.picAssigned.filter(Boolean).join(", "),
    };
    onSave(inquiryToSave);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="w-full max-w-screen-xl mx-auto rounded-xl shadow-lg p-0"
        style={{ maxHeight: "90vh" }}
      >
        <DialogHeader className="px-10 pt-10 pb-4">
          <DialogTitle>Edit Inquiry</DialogTitle>
          <DialogDescription>
            Update all inquiry details below. (Remarks cannot be edited here.)
          </DialogDescription>
        </DialogHeader>
        {/* Scrollable inside */}
        <div className="overflow-y-auto max-h-[70vh] px-10 py-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-1">
                Reference Number
              </label>
              <Input
                name="referenceNumber"
                value={fields.referenceNumber}
                onChange={handleChange}
                placeholder="Reference Number"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Vessel Name
              </label>
              <Input
                name="vesselName"
                value={fields.vesselName}
                onChange={handleChange}
                placeholder="Vessel Name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Agent</label>
              <Input
                name="agent"
                value={fields.agent}
                onChange={handleChange}
                placeholder="Agent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Port</label>
              <Input
                name="port"
                value={fields.port}
                onChange={handleChange}
                placeholder="Port"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Key PIC <span className="text-red-500">*</span>
              </label>
              <Input
                name="keyPicAssigned"
                value={fields.picAssigned[0] ?? ""}
                onChange={handleChange}
                placeholder="Key Person in Charge"
                required
              />
              <div className="mt-2">
                <label className="block text-sm font-medium mb-1">
                  Sub PICs
                </label>
                {(fields.picAssigned.slice(1) || []).map((pic, idx) => (
                  <div key={idx} className="flex items-center gap-2 mb-2">
                    <Input
                      name={`picAssigned-${idx + 1}`}
                      value={pic}
                      onChange={handleChange}
                      placeholder={`Sub PIC #${idx + 1}`}
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() => handleRemoveSubPic(idx + 1)}
                      title="Remove Sub PIC"
                    >
                      &times;
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddSubPic}
                >
                  + Add Sub PIC
                </Button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select
                name="status"
                value={fields.status}
                onChange={handleChange}
                className="block w-full h-10 px-3 py-2 rounded-md border border-input bg-background text-sm text-foreground"
              >
                <option value="" disabled>
                  Select status...
                </option>
                {STATUS_OPTIONS.map((status) => (
                  <option value={status} key={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">ETA</label>
              <Input
                name="eta"
                value={fields.eta}
                onChange={handleChange}
                placeholder="ETA"
                type="datetime-local"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Inquiry Received Date & Time
              </label>
              <Input
                name="receivedDate"
                value={fields.receivedDate ?? ""}
                onChange={handleChange}
                placeholder="Inquiry Received Date & Time"
                type="datetime-local"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Categories (comma separated)
              </label>
              <Input
                name="categories"
                value={categoriesText}
                onChange={handleCategoriesChange}
                placeholder="Bonded, Provisions, Deck/Engine"
              />
            </div>
            <Separator />
            <div className="mt-6 flex gap-3">
              <Button type="submit">Save Changes</Button>
              <Button variant="outline" type="button" onClick={onClose}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
