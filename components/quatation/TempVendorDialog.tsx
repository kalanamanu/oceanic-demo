"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
  loading: boolean;
}

export function TempVendorDialog({ open, onClose, onSave, loading }: Props) {
  const [form, setForm] = React.useState({
    vendor_name: "",
    contact_person: "",
    email: "",
    phone: "",
  });

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Temporary Vendor</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {[
            ["Vendor Name", "vendor_name"],
            ["Contact Person", "contact_person"],
            ["Email", "email"],
            ["Phone", "phone"],
          ].map(([label, key]) => (
            <div key={key}>
              <label className="text-xs font-medium">{label}</label>
              <input
                className="w-full border p-2 rounded"
                value={(form as any)[key]}
                onChange={(e) => handleChange(key, e.target.value)}
              />
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={() => onSave(form)} disabled={loading}>
            {loading ? "Saving..." : "Save Vendor"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
