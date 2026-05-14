"use client";

import { Trash2, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

import type { QuotationItem } from "@/types/quotation.types";

interface Props {
  item: QuotationItem;

  index: number;

  updateItem: (index: number, field: string, value: string) => void;

  removeItem: (index: number) => void;

  vendors: any[];

  setActiveItemIndex: (index: number) => void;

  setTempVendorOpen: (open: boolean) => void;
}

export function QuotationTableRow({
  item,
  index,
  updateItem,
  removeItem,
  vendors,
  setActiveItemIndex,
  setTempVendorOpen,
}: Props) {
  const calculatedFields = [
    "unit_rate_usd",
    "total_unit_rate_rs",
    "total_unit_rate_usd",
    "conva_basis",
    "total_rs",
    "total_usd",
  ];

  const fields = [
    ["item_no", item.item_no],
    ["description", item.description],
    ["customer_remark", item.customer_remark],
    ["quantity", item.quantity],
    ["unit", item.unit],
    ["impa_code", item.impa_code],
    ["price", item.price],
    ["unit_rate_usd", item.unit_rate_usd],
    ["additional_charges", item.additional_charges],
    ["total_unit_rate_rs", item.total_unit_rate_rs],
    ["total_unit_rate_usd", item.total_unit_rate_usd],
    ["conva_basis", item.conva_basis],
    ["osc_remark", item.osc_remark],
  ];

  return (
    <tr className="hover:bg-muted/30 transition-colors align-top">
      <td className="border px-2 py-2 font-medium sticky left-0 bg-background z-10 min-w-[60px]">
        {index + 1}
      </td>

      {fields.map(([field, value]) => {
        const isReadOnly = calculatedFields.includes(field);

        return (
          <td key={field} className="border p-1 min-w-[180px]">
            <input
              value={(value as string) || ""}
              readOnly={isReadOnly}
              onChange={(e) =>
                !isReadOnly && updateItem(index, field, e.target.value)
              }
              className={`
                w-full
                min-h-[36px]
                rounded-md
                border
                px-2
                text-sm
                bg-background
                focus:outline-none
                focus:ring-2
                focus:ring-primary

                ${isReadOnly ? "bg-muted cursor-not-allowed" : ""}
              `}
            />
          </td>
        );
      })}

      {/* SUPPLIER */}
      <td className="border p-1 min-w-[260px]">
        <div className="flex gap-2">
          <select
            className="w-full border rounded-md px-2 h-9 bg-background"
            value={(item as any).supplier_name || ""}
            onChange={(e) => updateItem(index, "supplier_name", e.target.value)}
          >
            <option value="">Select Supplier</option>

            {vendors.map((v: any) => (
              <option key={v.vendor_id} value={v.vendor_id}>
                {v.vendor_name || v.name}
                {!v.is_verified && " (Temp)"}
              </option>
            ))}
          </select>

          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => {
              setActiveItemIndex(index);
              setTempVendorOpen(true);
            }}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </td>

      {/* TOTAL USD */}
      <td className="border p-1 min-w-[140px]">
        <input
          value={item.total_usd || ""}
          readOnly
          className="w-full h-9 rounded-md border px-2 bg-muted"
        />
      </td>

      {/* TOTAL RS */}
      <td className="border p-1 min-w-[140px]">
        <input
          value={item.total_rs || ""}
          readOnly
          className="w-full h-9 rounded-md border px-2 bg-muted"
        />
      </td>

      {/* ACTIONS */}
      <td className="border p-1 min-w-[100px]">
        <Button
          variant="destructive"
          size="sm"
          onClick={() => removeItem(index)}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </td>
    </tr>
  );
}
