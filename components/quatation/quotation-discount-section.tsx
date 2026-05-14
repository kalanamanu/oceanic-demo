"use client";

import { Button } from "@/components/ui/button";

interface Props {
  discountLKR: string;
  setDiscountLKR: (value: string) => void;
}

export function QuotationDiscountSection({
  discountLKR,
  setDiscountLKR,
}: Props) {
  return (
    <div className="border rounded-xl p-6 space-y-4">
      <h2 className="text-lg font-semibold">Discount</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="text-xs font-medium">Discount Amount (LKR)</label>

          <input
            type="number"
            className="w-full border p-2 rounded"
            value={discountLKR}
            onChange={(e) => setDiscountLKR(e.target.value)}
          />
        </div>

        <div>
          <label className="text-xs font-medium">Currency</label>

          <input
            className="w-full border p-2 rounded bg-muted"
            value="LKR"
            readOnly
          />
        </div>

        <div className="flex items-end">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setDiscountLKR("")}
          >
            Clear
          </Button>
        </div>
      </div>
    </div>
  );
}
