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
    <div className="border rounded-xl p-6 bg-background space-y-6">
      {/* ================= HEADER ================= */}
      <div className="space-y-1">
        <h2 className="text-lg font-semibold tracking-tight">
          Quotation Summary
        </h2>
        <p className="text-sm text-muted-foreground">
          Charges, details, discount & totals
        </p>
      </div>

      {/* ================= GRID ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-6">
        {/* ========== LEFT SIDE ========== */}
        <div className="space-y-6">
          {/* ADDITIONAL CHARGES */}
          <div className="space-y-3">
            <div className="flex justify-between items-center h-9">
              <h3 className="text-sm font-medium">Additional Charges</h3>
              <Button size="sm" onClick={addCharge} className="h-8 px-3">
                + Add
              </Button>
            </div>

            <div className="space-y-2">
              {additionalCharges.map((charge, index) => (
                <div key={index} className="flex gap-2 items-center w-full">
                  {/* NAME */}
                  <input
                    className="flex-1 min-w-[120px] h-9 bg-transparent border rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                    placeholder="Name"
                    value={charge.name}
                    onChange={(e) =>
                      updateCharge(index, "name", e.target.value)
                    }
                  />

                  {/* AMOUNT */}
                  <input
                    type="number"
                    className="w-24 h-9 bg-transparent border rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                    placeholder="Amount"
                    value={charge.amount}
                    onChange={(e) =>
                      updateCharge(index, "amount", e.target.value)
                    }
                  />

                  {/* CURRENCY */}
                  <select
                    className="w-20 h-9 border rounded-md px-2 py-1 text-sm bg-background focus:outline-none focus:ring-1 focus:ring-ring cursor-pointer"
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
                    className="h-9 w-9 shrink-0"
                    onClick={() => removeCharge(index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* DISCOUNT */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Discount (LKR)</h3>
            <div className="flex gap-2">
              <input
                type="number"
                className="flex-1 h-9 bg-transparent border rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                value={discountLKR}
                onChange={(e) => setDiscountLKR(e.target.value)}
              />
              <Button
                variant="outline"
                size="sm"
                className="h-9 px-4"
                onClick={() => setDiscountLKR("")}
              >
                Clear
              </Button>
            </div>
          </div>
        </div>

        {/* ========== RIGHT SIDE ========== */}
        <div className="space-y-6">
          {/* DATES */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">
                Date Arrived
              </label>
              <DatePicker date={dateArrived} onDateChange={setDateArrived} />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">
                Date Sailed
              </label>
              <DatePicker date={dateSailed} onDateChange={setDateSailed} />
            </div>
          </div>

          {/* REMARK */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              Remarks
            </label>
            <textarea
              className="w-full bg-transparent border rounded-lg p-3 text-sm min-h-[96px] focus:outline-none focus:ring-1 focus:ring-ring resize-none"
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
            />
          </div>

          {/* TOTALS */}
          <div className="border rounded-xl p-4 bg-muted space-y-3.5">
            <h3 className="text-sm font-medium">Total Summary</h3>

            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">LKR</span>
              <span className="text-base font-bold tracking-tight">
                {totalLKR.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">USD</span>
              <span className="text-base font-bold tracking-tight">
                {totalUSD.toLocaleString(undefined, {
                  minimumFractionDigits: 3,
                })}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
