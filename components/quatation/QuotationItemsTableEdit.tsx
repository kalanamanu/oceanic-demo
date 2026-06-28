"use client";

import { Button } from "@/components/ui/button";
import { Trash2, Plus } from "lucide-react";

import type { QuotationItem } from "@/types/quotation.types";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

interface Props {
  items: QuotationItem[];

  updateItem: (index: number, field: string, value: string) => void;

  removeItem: (index: number) => void;

  vendors: any[];

  setActiveItemIndex: (index: number) => void;

  setTempVendorOpen: (open: boolean) => void;
}

export default function QuotationItemsTableEdit({
  items,
  updateItem,
  removeItem,
  vendors,
  setActiveItemIndex,
  setTempVendorOpen,
}: Props) {
  /* =========================
     NORMALIZE VENDORS
  ========================= */
  const supplierOptions = (vendors || [])
    .map((v: any) => ({
      ...v,
      vendor_id: v.vendor_id || v.id || v.temp_vendor_id,
      display_name: v.vendor_name || v.name || "Unnamed Vendor",

      is_temporary:
        v.is_temporary === true ||
        !!v.temp_vendor_id ||
        v.is_approved !== undefined,

      is_approved_vendor: v?.status?.status === "Approved",
    }))
    .filter((v: any) => v.is_approved_vendor || v.is_temporary);

  /* =========================
     UI
  ========================= */
  return (
    <div className="space-y-4">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">EDIT PRE COST SHEET</h2>
          <p className="text-sm text-muted-foreground">
            Total Items: {items.length}
          </p>
        </div>
      </div>

      {/* TABLE */}
      <div className="w-full overflow-auto rounded-xl border">
        <table className="min-w-[2200px] w-full border-collapse">
          {/* HEADER */}
          <thead className="sticky top-0 bg-muted z-10">
            <tr className="border-b">
              {[
                "Item No",
                "Description",
                "Qty",
                "Unit",
                "IMPA",
                "Supplier",
                "Unit Rate LKR",
                "Additional Charges (LKR)",
                "Total RS",
                "CONVA Basis",
                "Unit Rate USD",
                "Total USD",
                "OMS Remarks",
                "Customer Remarks",
                "Actions",
              ].map((head) => (
                <th
                  key={head}
                  className="border-r px-3 py-3 text-left text-xs font-semibold whitespace-nowrap"
                >
                  {head}
                </th>
              ))}
            </tr>
          </thead>

          {/* BODY */}
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td
                  colSpan={15}
                  className="text-center py-6 text-muted-foreground"
                >
                  No PreCost items found
                </td>
              </tr>
            ) : (
              items.map((item, index) => (
                <tr key={index} className="border-b hover:bg-muted/20">
                  {/* ITEM NO */}
                  <td className="border-r p-1">
                    <input
                      className="w-[80px] border rounded px-2 py-1 text-sm"
                      value={item.item_no || ""}
                      onChange={(e) =>
                        updateItem(index, "item_no", e.target.value)
                      }
                    />
                  </td>

                  {/* DESCRIPTION */}
                  <td className="border-r p-1">
                    <input
                      className="w-[200px] border rounded px-2 py-1 text-sm"
                      value={item.description || ""}
                      onChange={(e) =>
                        updateItem(index, "description", e.target.value)
                      }
                    />
                  </td>

                  {/* QTY */}
                  <td className="border-r p-1">
                    <input
                      className="w-[70px] border rounded px-2 py-1 text-sm"
                      value={item.quantity || ""}
                      onChange={(e) =>
                        updateItem(index, "quantity", e.target.value)
                      }
                    />
                  </td>

                  {/* UNIT */}
                  <td className="border-r p-1">
                    <input
                      className="w-[70px] border rounded px-2 py-1 text-sm"
                      value={item.unit || ""}
                      onChange={(e) =>
                        updateItem(index, "unit", e.target.value)
                      }
                    />
                  </td>

                  {/* IMPA */}
                  <td className="border-r p-1">
                    <input
                      className="w-[110px] border rounded px-2 py-1 text-sm"
                      value={item.impa_code || ""}
                      onChange={(e) =>
                        updateItem(index, "impa_code", e.target.value)
                      }
                    />
                  </td>

                  {/* SUPPLIER */}
                  <td className="border-r p-1">
                    <div className="flex items-center gap-2">
                      <Select
                        value={item.supplier_id || ""}
                        onValueChange={(value) =>
                          updateItem(index, "supplier_id", value)
                        }
                      >
                        <SelectTrigger className="w-[240px] h-8 text-sm">
                          <SelectValue placeholder="Select Supplier" />
                        </SelectTrigger>

                        <SelectContent className="z-[9999]">
                          {supplierOptions.map((vendor: any) => (
                            <SelectItem
                              key={vendor.vendor_id}
                              value={vendor.vendor_id}
                            >
                              <div className="flex items-center gap-2">
                                <span>{vendor.display_name}</span>

                                {vendor.is_temporary && (
                                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-orange-100 text-orange-700 font-medium">
                                    TEMP
                                  </span>
                                )}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      {/* TEMP VENDOR */}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-8 shrink-0"
                        onClick={() => {
                          setActiveItemIndex(index);
                          setTempVendorOpen(true);
                        }}
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        Temp
                      </Button>
                    </div>
                  </td>

                  {/* UNIT PRICE */}
                  <td className="border-r p-1">
                    <input
                      className="w-[100px] border rounded px-2 py-1 text-sm"
                      value={item.price || ""}
                      onChange={(e) =>
                        updateItem(index, "price", e.target.value)
                      }
                    />
                  </td>

                  {/* ADDITIONAL CHARGES (FIXED) */}
                  <td className="border-r p-1">
                    <div className="flex items-center gap-2">
                      {/* ✅ TICK */}
                      <input
                        type="checkbox"
                        checked={Number(item.additional_charges) > 0}
                        onChange={(e) => {
                          if (e.target.checked) {
                            // when ticked → set default charge
                            updateItem(index, "additional_charges", "100");
                          } else {
                            // when unticked → reset
                            updateItem(index, "additional_charges", "0");
                          }
                        }}
                      />

                      {/* ✅ INPUT */}
                      <input
                        type="number"
                        disabled={Number(item.additional_charges) === 0}
                        className="w-[80px] border rounded px-2 py-1 text-sm disabled:bg-muted"
                        value={item.additional_charges || ""}
                        onChange={(e) =>
                          updateItem(
                            index,
                            "additional_charges",
                            e.target.value,
                          )
                        }
                      />
                    </div>
                  </td>

                  {/* TOTAL RS */}
                  <td className="border-r p-1">
                    <input
                      readOnly
                      className="w-[120px] border rounded px-2 py-1 bg-muted text-sm"
                      value={item.total_rs || ""}
                    />
                  </td>

                  {/* BASIS */}
                  <td className="border-r p-1">
                    <input
                      readOnly
                      className="w-[100px] border rounded px-2 py-1 bg-muted text-sm"
                      value={item.conva_basis || ""}
                    />
                  </td>

                  {/* UNIT USD */}
                  <td className="border-r p-1">
                    <input
                      readOnly
                      className="w-[100px] border rounded px-2 py-1 bg-muted text-sm"
                      value={item.unit_rate_usd || ""}
                    />
                  </td>

                  {/* TOTAL USD */}
                  <td className="border-r p-1">
                    <input
                      readOnly
                      className="w-[120px] border rounded px-2 py-1 bg-muted text-sm"
                      value={item.total_usd || ""}
                    />
                  </td>

                  {/* OMS REMARKS (FIXED FIELD NAME) */}
                  <td className="border-r p-1">
                    <input
                      className="w-[160px] border rounded px-2 py-1 text-sm"
                      value={item.osc_remark || ""}
                      onChange={(e) =>
                        updateItem(index, "osc_remark", e.target.value)
                      }
                    />
                  </td>

                  {/* CUSTOMER REMARKS */}
                  <td className="border-r p-1">
                    <input
                      className="w-[180px] border rounded px-2 py-1 text-sm"
                      value={item.customer_remark || ""}
                      onChange={(e) =>
                        updateItem(index, "customer_remark", e.target.value)
                      }
                    />
                  </td>

                  {/* ACTIONS */}
                  <td className="p-1">
                    <Button
                      size="icon"
                      variant="destructive"
                      className="h-8 w-8"
                      onClick={() => removeItem(index)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
