"use client";

interface Props {
  totalLKR: number;
  totalUSD: number;
}

export function QuotationTotalSection({ totalLKR, totalUSD }: Props) {
  return (
    <div className="border rounded-xl p-6 space-y-4 bg-muted">
      <h2 className="text-lg font-semibold">Total Cost</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-medium">Total (LKR)</label>

          <input
            className="w-full border p-2 rounded font-bold text-lg bg-background"
            value={Number(totalLKR).toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
            readOnly
          />
        </div>

        <div>
          <label className="text-xs font-medium">Total (USD)</label>

          <input
            className="w-full border p-2 rounded font-bold text-lg bg-background"
            value={Number(totalUSD).toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
            readOnly
          />
        </div>
      </div>
    </div>
  );
}
