"use client";

import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { DatePicker } from "@/components/ui/date-picker";

interface Props {
  additionalCharges: any[];
  addCharge: () => void;
  updateCharge: (index: number, field: string, value: string) => void;
  removeCharge: (index: number) => void;

  dateArrived: Date | undefined;
  setDateArrived: (date: Date | undefined) => void;

  dateSailed: Date | undefined;
  setDateSailed: (date: Date | undefined) => void;

  remark: string;
  setRemark: (value: string) => void;

  discountLKR: string;
  setDiscountLKR: (value: string) => void;

  totalLKR: number;
  totalUSD: number;
}

export function QuotationSummaryCard({
  additionalCharges,
  addCharge,
  updateCharge,
  removeCharge,
  dateArrived,
  setDateArrived,
  dateSailed,
  setDateSailed,
  remark,
  setRemark,
  discountLKR,
  setDiscountLKR,
  totalLKR,
  totalUSD,
}: Props) {
  return (
    <div className="border rounded-xl p-6 bg-background space-y-8">
      {/* ================= HEADER ================= */}
      <div>
        <h2 className="text-lg font-semibold">Quotation Summary</h2>
        <p className="text-sm text-muted-foreground">
          Charges, details, discount & totals
        </p>
      </div>

      {/* ================= GRID ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ========== LEFT SIDE ========== */}
        <div className="space-y-6">
          {/* ADDITIONAL CHARGES */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">Additional Charges</h3>

              <Button size="sm" onClick={addCharge}>
                + Add
              </Button>
            </div>

            {additionalCharges.map((charge, index) => (
              <div key={index} className="grid grid-cols-12 gap-2 items-center">
                {/* NAME */}
                <input
                  className="col-span-5 border rounded px-2 py-1 text-sm"
                  placeholder="Name"
                  value={charge.name}
                  onChange={(e) => updateCharge(index, "name", e.target.value)}
                />

                {/* AMOUNT */}
                <input
                  type="number"
                  className="col-span-3 border rounded px-2 py-1 text-sm"
                  placeholder="Amount"
                  value={charge.amount}
                  onChange={(e) =>
                    updateCharge(index, "amount", e.target.value)
                  }
                />

                {/* CURRENCY */}
                <select
                  className="col-span-2 border rounded px-2 py-1 text-sm bg-background"
                  value={charge.currency || "USD"}
                  onChange={(e) =>
                    updateCharge(index, "currency", e.target.value)
                  }
                >
                  <option value="USD">USD</option>
                  <option value="LKR">LKR</option>
                </select>

                {/* DELETE */}
                <Button
                  size="icon"
                  variant="destructive"
                  className="col-span-2 h-8 w-8"
                  onClick={() => removeCharge(index)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>

          {/* DISCOUNT */}
          <div>
            <h3 className="font-medium mb-2">Discount (LKR)</h3>

            <div className="flex gap-2">
              <input
                type="number"
                className="flex-1 border rounded px-2 py-1"
                value={discountLKR}
                onChange={(e) => setDiscountLKR(e.target.value)}
              />

              <Button variant="outline" onClick={() => setDiscountLKR("")}>
                Clear
              </Button>
            </div>
          </div>
        </div>

        {/* ========== RIGHT SIDE ========== */}
        <div className="space-y-6">
          {/* DATES */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-muted-foreground">
                Date Arrived
              </label>
              <DatePicker date={dateArrived} onDateChange={setDateArrived} />
            </div>

            <div>
              <label className="text-xs text-muted-foreground">
                Date Sailed
              </label>
              <DatePicker date={dateSailed} onDateChange={setDateSailed} />
            </div>
          </div>

          {/* REMARK */}
          <div>
            <label className="text-xs text-muted-foreground">Remarks</label>

            <textarea
              className="w-full border rounded-lg p-2 min-h-[90px]"
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
            />
          </div>

          {/* TOTALS */}
          <div className="border rounded-xl p-4 bg-muted space-y-3">
            <h3 className="font-medium">Total Summary</h3>

            <div className="flex justify-between">
              <span className="text-sm">LKR</span>
              <span className="font-bold">
                {totalLKR.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-sm">USD</span>
              <span className="font-bold">
                {totalUSD.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
