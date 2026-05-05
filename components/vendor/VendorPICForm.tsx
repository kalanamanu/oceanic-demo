"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

export interface PIC {
  firstName: string;
  lastName: string;
  email: string;
  picType: string;
  remark: string;
  phone_number: string;
}

interface Props {
  value: PIC[];
  onChange: (pics: PIC[]) => void;
}

export function VendorPICForm({ value, onChange }: Props) {
  /* ================= ADD PIC ================= */
  const addPic = () => {
    onChange([
      ...value,
      {
        firstName: "",
        lastName: "",
        email: "",
        picType: "",
        remark: "",
        phone_number: "",
      },
    ]);
  };

  /* ================= UPDATE PIC ================= */
  const updatePic = (index: number, field: keyof PIC, val: string) => {
    const copy = [...value];
    copy[index] = { ...copy[index], [field]: val };
    onChange(copy);
  };

  /* ================= REMOVE PIC ================= */
  const removePic = (index: number) => {
    const copy = value.filter((_, i) => i !== index);
    onChange(copy);
  };

  return (
    <div className="space-y-4">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-md">Vendor PICs</h3>

        <Button size="sm" onClick={addPic}>
          + Add PIC
        </Button>
      </div>

      {/* EMPTY STATE */}
      {value.length === 0 && (
        <p className="text-sm text-muted-foreground border rounded p-4">
          No PICs added yet.
        </p>
      )}

      {/* LIST */}
      <div className="space-y-3">
        {value.map((pic, index) => (
          <div key={index} className="border rounded-lg p-4 space-y-3 bg-card">
            {/* GRID INPUTS */}
            <div className="grid md:grid-cols-3 gap-3">
              <input
                className="border p-2 rounded"
                placeholder="First Name"
                value={pic.firstName}
                onChange={(e) => updatePic(index, "firstName", e.target.value)}
              />

              <input
                className="border p-2 rounded"
                placeholder="Last Name"
                value={pic.lastName}
                onChange={(e) => updatePic(index, "lastName", e.target.value)}
              />

              <input
                className="border p-2 rounded"
                placeholder="Email"
                value={pic.email}
                onChange={(e) => updatePic(index, "email", e.target.value)}
              />

              <input
                className="border p-2 rounded"
                placeholder="Phone Number"
                value={pic.phone_number}
                onChange={(e) =>
                  updatePic(index, "phone_number", e.target.value)
                }
              />

              <input
                className="border p-2 rounded"
                placeholder="PIC Type (Manager / Ops)"
                value={pic.picType}
                onChange={(e) => updatePic(index, "picType", e.target.value)}
              />

              <input
                className="border p-2 rounded"
                placeholder="Remark"
                value={pic.remark}
                onChange={(e) => updatePic(index, "remark", e.target.value)}
              />
            </div>

            {/* ACTIONS */}
            <div className="flex justify-end">
              <Button
                variant="destructive"
                size="sm"
                onClick={() => removePic(index)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
