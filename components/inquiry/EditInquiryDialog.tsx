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
import type { Inquiry, InquiryCategory } from "@/types/inquiry.types";

const STATUS_OPTIONS = [
  "Pending",
  "Active",
  "Confirmed",
  "Rejected",
];

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

  React.useEffect(() => {
    setFields(inquiry);
  }, [inquiry, open]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFields({ ...fields, [name]: value });
  };

  const handlePicChange = (idx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const newPics = [...(fields.pics || [])];
    newPics[idx] = { ...newPics[idx], pic_name: e.target.value };
    setFields((prev) => ({ ...prev, pics: newPics }));
  };

  const handleAddSubPic = () => {
    setFields((prev) => ({
      ...prev,
      pics: [...(prev.pics || []), { pic_name: "", pic_usr_id: "" }],
    }));
  };

  const handleRemoveSubPic = (idx: number) => {
    setFields((prev) => ({
      ...prev,
      pics: (prev.pics || []).filter((_, i) => i !== idx),
    }));
  };

  const handleKeyPicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFields((prev) => ({ ...prev, key_pic_usr_id: e.target.value }));
  };

  // Convert input into array of {name: string}
  const handleCategoriesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFields({
      ...fields,
      categories: e.target.value
        .split(/\s*,\s*/)
        .filter(Boolean)
        .map((name) => ({ name, id: "" } as InquiryCategory)),
    });
  };

  const categoriesText = (fields.categories || [])
    .map((c) => c.name)
    .join(", ");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(fields);
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
                Vessel Name
              </label>
              <Input
                name="vessel_name"
                value={fields.vessel_name || ""}
                onChange={handleChange}
                placeholder="Vessel Name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Agent</label>
              <Input
                name="agent"
                value={fields.agent || ""}
                onChange={handleChange}
                placeholder="Agent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Port</label>
              <Input
                name="port"
                value={fields.port || ""}
                onChange={handleChange}
                placeholder="Port"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Key PIC User ID <span className="text-red-500">*</span>
              </label>
              <Input
                name="key_pic_usr_id"
                value={fields.key_pic_usr_id || ""}
                onChange={handleKeyPicChange}
                placeholder="Key Person in Charge User ID"
                required
              />
              <div className="mt-2">
                <label className="block text-sm font-medium mb-1">
                  Sub PICs
                </label>
                {(fields.pics || []).map((pic, idx) => (
                  <div key={idx} className="flex items-center gap-2 mb-2">
                    <Input
                      value={pic.pic_name || ""}
                      onChange={(e) => handlePicChange(idx, e)}
                      placeholder={`PIC Name #${idx + 1}`}
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() => handleRemoveSubPic(idx)}
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
                value={fields.status || "Pending"}
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
                value={fields.eta || ""}
                onChange={handleChange}
                placeholder="ETA"
                type="datetime-local"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Inquiry Received Date
              </label>
              <Input
                name="received_date"
                value={fields.received_date || ""}
                onChange={handleChange}
                placeholder="Inquiry Received Date"
                type="date"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Inquiry Received Time
              </label>
              <Input
                name="received_time"
                value={fields.received_time || ""}
                onChange={handleChange}
                placeholder="HH:MM"
                type="time"
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

