"use client";

import { DatePicker } from "@/components/ui/date-picker";

interface Props {
  dateArrived: Date | undefined;
  setDateArrived: (date: Date | undefined) => void;

  dateSailed: Date | undefined;
  setDateSailed: (date: Date | undefined) => void;

  remark: string;
  setRemark: (value: string) => void;
}

export function QuotationAdditionalDetails({
  dateArrived,
  setDateArrived,
  dateSailed,
  setDateSailed,
  remark,
  setRemark,
}: Props) {
  return (
    <div className="border rounded-xl p-6 space-y-4">
      <h2 className="text-lg font-semibold">Additional Details</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="text-xs font-medium">Date Arrived</label>

          <DatePicker
            date={dateArrived}
            onDateChange={setDateArrived}
            placeholder="Select arrival date"
          />
        </div>

        <div>
          <label className="text-xs font-medium">Date Sailed</label>

          <DatePicker
            date={dateSailed}
            onDateChange={setDateSailed}
            placeholder="Select sailed date"
          />
        </div>
      </div>

      <div>
        <label className="text-xs font-medium">Remark</label>

        <textarea
          className="w-full border p-2 rounded min-h-[100px]"
          value={remark}
          onChange={(e) => setRemark(e.target.value)}
        />
      </div>
    </div>
  );
}
