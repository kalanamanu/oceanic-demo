"use client";

import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface Props {
  additionalCharges: any[];
  addCharge: () => void;
  updateCharge: (index: number, field: string, value: string) => void;
  removeCharge: (index: number) => void;
}

export function QuotationAdditionalCharges({
  additionalCharges,
  addCharge,
  updateCharge,
  removeCharge,
}: Props) {
  return (
    <div className="border rounded-xl p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Additional Charges</h2>

        <Button size="sm" onClick={addCharge}>
          + Add Charge
        </Button>
      </div>

      {additionalCharges.map((charge, index) => (
        <div
          key={index}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 border p-4 rounded-lg"
        >
          <div>
            <label className="text-xs font-medium">Charge Name</label>

            <input
              className="w-full border p-2 rounded"
              value={charge.name}
              onChange={(e) => updateCharge(index, "name", e.target.value)}
            />
          </div>

          <div>
            <label className="text-xs font-medium">Amount</label>

            <input
              type="number"
              className="w-full border p-2 rounded"
              value={charge.amount}
              onChange={(e) => updateCharge(index, "amount", e.target.value)}
            />
          </div>

          <div>
            <label className="text-xs font-medium">Currency</label>

            <select
              className="w-full border p-2 rounded"
              value={charge.currency}
              onChange={(e) => updateCharge(index, "currency", e.target.value)}
            >
              <option value="USD">USD</option>
              <option value="LKR">LKR</option>
              <option value="EUR">EUR</option>
            </select>
          </div>

          <div className="flex items-end">
            <Button
              variant="destructive"
              size="sm"
              onClick={() => removeCharge(index)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
