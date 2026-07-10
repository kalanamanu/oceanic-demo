"use client";

import * as React from "react";
import { useState } from "react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Plus, Trash } from "lucide-react";

interface Item {
  quantity: number;
  unit: string;
  description: string;
  rate: number;
  total: number;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: any) => Promise<void>;
}

export function CustomDocumentCreateDialog({ open, onClose, onSubmit }: Props) {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "CUSTOM DOCUMENT",
    date: "",
    telePhone: "",
    emailAddress: "",
    officeAddressLine1: "",
    officeAddressLine2: "",
    officeAddressLine3: "",
    directorOfCustoms: "",
    vehicleNo: "",
    permitNo: "",
    chiefSecurityOfficer: "",
    exportGate: "",
    slpa: "",
    gateNo: "",
    permissionText: "",
    companyName: "",
    subtitle: "",
    sectionCode: "",
    dateLabel: "DATE :",
  });

  const [items, setItems] = useState<Item[]>([
    {
      quantity: 1,
      unit: "",
      description: "",
      rate: 0,
      total: 0,
    },
  ]);

  // handle input change
  const handleChange = (key: string, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  // handle item change
  const handleItemChange = <K extends keyof Item>(
    index: number,
    key: K,
    value: Item[K],
  ) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [key]: value };

    // auto calculate total
    if (key === "quantity" || key === "rate") {
      updated[index].total =
        Number(updated[index].quantity) * Number(updated[index].rate);
    }

    setItems(updated);
  };

  const addItem = () => {
    setItems([
      ...items,
      { quantity: 1, unit: "", description: "", rate: 0, total: 0 },
    ]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const payload = {
        document: "CUSTOMDOCUMENT",
        documentType: "pdf",
        documentData: {
          ...form,
          items,
        },
      };

      await onSubmit(payload);

      toast.success("Custom document created!");
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Failed to create document");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Custom Document</DialogTitle>
        </DialogHeader>

        {/* FORM */}
        <div className="grid grid-cols-2 gap-4">
          <Input
            placeholder="Title"
            value={form.title}
            onChange={(e) => handleChange("title", e.target.value)}
          />

          <Input
            placeholder="Date"
            value={form.date}
            onChange={(e) => handleChange("date", e.target.value)}
          />

          <Input
            placeholder="Telephone"
            value={form.telePhone}
            onChange={(e) => handleChange("telePhone", e.target.value)}
          />

          <Input
            placeholder="Email"
            value={form.emailAddress}
            onChange={(e) => handleChange("emailAddress", e.target.value)}
          />

          <Input
            placeholder="Company Name"
            value={form.companyName}
            onChange={(e) => handleChange("companyName", e.target.value)}
          />

          <Input
            placeholder="Subtitle"
            value={form.subtitle}
            onChange={(e) => handleChange("subtitle", e.target.value)}
          />

          <Input
            placeholder="Section Code"
            value={form.sectionCode}
            onChange={(e) => handleChange("sectionCode", e.target.value)}
          />

          <Input
            placeholder="Vehicle No"
            value={form.vehicleNo}
            onChange={(e) => handleChange("vehicleNo", e.target.value)}
          />

          <Input
            placeholder="Permit No"
            value={form.permitNo}
            onChange={(e) => handleChange("permitNo", e.target.value)}
          />

          <Input
            placeholder="Gate No"
            value={form.gateNo}
            onChange={(e) => handleChange("gateNo", e.target.value)}
          />
        </div>

        {/* ADDRESS */}
        <div className="mt-4 space-y-2">
          <Input
            placeholder="Address Line 1"
            value={form.officeAddressLine1}
            onChange={(e) => handleChange("officeAddressLine1", e.target.value)}
          />
          <Input
            placeholder="Address Line 2"
            value={form.officeAddressLine2}
            onChange={(e) => handleChange("officeAddressLine2", e.target.value)}
          />
          <Input
            placeholder="Address Line 3"
            value={form.officeAddressLine3}
            onChange={(e) => handleChange("officeAddressLine3", e.target.value)}
          />
        </div>

        {/* PERMISSION TEXT */}
        <div className="mt-4">
          <Textarea
            placeholder="Permission Text"
            value={form.permissionText}
            onChange={(e) => handleChange("permissionText", e.target.value)}
          />
        </div>

        {/* ITEMS */}
        <div className="mt-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold">Items</h3>
            <Button size="sm" onClick={addItem}>
              <Plus className="w-4 h-4 mr-1" /> Add Item
            </Button>
          </div>

          {items.map((item, index) => (
            <div
              key={index}
              className="grid grid-cols-6 gap-2 mb-2 items-center"
            >
              <Input
                type="number"
                placeholder="Qty"
                value={item.quantity}
                onChange={(e) =>
                  handleItemChange(index, "quantity", Number(e.target.value))
                }
              />
              <Input
                placeholder="Unit"
                value={item.unit}
                onChange={(e) =>
                  handleItemChange(index, "unit", e.target.value)
                }
              />
              <Input
                placeholder="Description"
                value={item.description}
                onChange={(e) =>
                  handleItemChange(index, "description", e.target.value)
                }
              />
              <Input
                type="number"
                placeholder="Rate"
                value={item.rate}
                onChange={(e) =>
                  handleItemChange(index, "rate", Number(e.target.value))
                }
              />
              <Input placeholder="Total" value={item.total} disabled />

              <Button
                variant="destructive"
                size="icon"
                onClick={() => removeItem(index)}
              >
                <Trash className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>

        {/* FOOTER */}
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>

          <Button onClick={handleSubmit} disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Document
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
