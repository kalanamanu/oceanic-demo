"use client";

import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import type { QuotationItem } from "@/types/quotation.types";

interface Props {
  item: QuotationItem;
  index: number;
  expandedIndex: number | null;
  setExpandedIndex: (index: number | null) => void;
  updateItem: (index: number, field: string, value: string) => void;
  removeItem: (index: number) => void;
  vendors: any[];
  setActiveItemIndex: (index: number) => void;
  setTempVendorOpen: (open: boolean) => void;
}

export function QuotationItemCard({
  item,
  index,
  expandedIndex,
  setExpandedIndex,
  updateItem,
  removeItem,
  vendors,
  setActiveItemIndex,
  setTempVendorOpen,
}: Props) {
  return (
    <div className="border rounded-xl p-4 space-y-4">
      <div className="flex justify-between items-start">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-2 text-sm">
          <div>
            <b>Item:</b> {item.item_no}
          </div>

          <div>
            <b>Description:</b> {item.description}
          </div>

          <div>
            <b>Remark:</b> {item.customer_remark}
          </div>

          <div>
            <b>Qty:</b> {item.quantity}
          </div>

          <div>
            <b>Unit:</b> {item.unit}
          </div>

          <div>
            <b>IMPA:</b> {item.impa_code}
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() =>
              setExpandedIndex(expandedIndex === index ? null : index)
            }
          >
            {expandedIndex === index ? "Close" : "Edit"}
          </Button>

          <Button
            size="sm"
            variant="destructive"
            onClick={() => removeItem(index)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {expandedIndex === index && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4">
          {[
            ["Item Number", "item_no"],
            ["Description", "description"],
            ["Customer Remark", "customer_remark"],
            ["Quantity", "quantity"],
            ["Unit", "unit"],
            ["IMPA Code", "impa_code"],
            ["Unit Rate (RS)", "price"],
            ["Unit Rate (USD)", "unit_rate_usd"],
            ["Additional Charges", "additional_charges"],
            ["Total Unit Rate (RS)", "total_unit_rate_rs"],
            ["Total Unit Rate (USD)", "total_unit_rate_usd"],
            ["CONVA (Basis)", "conva_basis"],
            ["OMS Remark", "osc_remark"],
          ].map(([label, field]) => {
            const calculatedFields = [
              "unit_rate_usd",
              "total_unit_rate_rs",
              "total_unit_rate_usd",
              "conva_basis",
              "total_rs",
              "total_usd",
            ];

            const isReadOnly = calculatedFields.includes(field);

            return (
              <div key={field}>
                <label className="text-xs font-medium">{label}</label>

                <input
                  className={`w-full border p-2 rounded ${
                    isReadOnly ? "bg-muted cursor-not-allowed" : ""
                  }`}
                  value={(item as any)[field] || ""}
                  readOnly={isReadOnly}
                  onChange={(e) =>
                    !isReadOnly && updateItem(index, field, e.target.value)
                  }
                />
              </div>
            );
          })}

          <div>
            <label className="text-xs font-medium">Supplier Name</label>

            <div className="flex gap-2">
              <select
                className="w-full border p-2 rounded"
                value={(item as any).supplier_name || ""}
                onChange={(e) =>
                  updateItem(index, "supplier_name", e.target.value)
                }
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
                size="sm"
                onClick={() => {
                  setActiveItemIndex(index);
                  setTempVendorOpen(true);
                }}
              >
                + Add
              </Button>
            </div>
          </div>

          <div>
            <label className="text-xs font-medium">Total USD</label>

            <input
              className="w-full border p-2 rounded bg-muted"
              value={item.total_usd}
              readOnly
            />
          </div>

          <div>
            <label className="text-xs font-medium">Total RS</label>

            <input
              className="w-full border p-2 rounded bg-muted"
              value={item.total_rs}
              readOnly
            />
          </div>
        </div>
      )}
    </div>
  );
}
