"use client";

import { Button } from "@/components/ui/button";
import { Trash2, Plus, Expand } from "lucide-react";

import type { QuotationItem } from "@/types/quotation.types";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import { useState } from "react";

interface Props {
  items: QuotationItem[];

  updateItem: (index: number, field: string, value: string) => void;

  removeItem: (index: number) => void;

  vendors: any[];

  setActiveItemIndex: (index: number) => void;

  setTempVendorOpen: (open: boolean) => void;
}

export default function QuotationItemsTable({
  items,
  updateItem,
  removeItem,
  vendors,
  setActiveItemIndex,
  setTempVendorOpen,
}: Props) {
  const openPopupWindow = () => {
    const popup = window.open(
      "/quotation/fullscreen-table",
      "_blank",
      "width=1600,height=900",
    );

    if (popup) {
      popup.onload = () => {
        popup.postMessage(
          {
            type: "INIT_QUOTATION_ITEMS",
            payload: items,
          },
          "*",
        );
      };
    }
  };
  const [applyAllAdditional, setApplyAllAdditional] = useState(false);

  const toggleRowAdditional = (index: number, checked: boolean) => {
    updateItem(index, "additional_charges", checked ? "100" : "");
  };

  return (
    <div className="space-y-4">
      {/* HEADER ACTIONS */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">PRE COST SHEET</h2>

          <p className="text-sm text-muted-foreground">
            Total Items: {items.length}
          </p>
        </div>

        {/* <Button type="button" variant="outline" onClick={openPopupWindow}>
          <Expand className="w-4 h-4 mr-2" />
          Full Screen View
        </Button> */}
      </div>

      {/* TABLE */}
      <div className="w-full overflow-auto rounded-xl border">
        <table className="min-w-[2200px] w-full border-collapse">
          {/* ================= HEADER ================= */}
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
                "Additional Charges",
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

          {/* ================= BODY ================= */}
          <tbody>
            {(items || []).length === 0 ? (
              <tr>
                <td
                  colSpan={15}
                  className="text-center py-6 text-muted-foreground"
                >
                  No quotation items loaded
                </td>
              </tr>
            ) : (
              (items || []).map((item, index) => (
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
                    <Select
                      value={item.supplier_id || ""}
                      onValueChange={(value) =>
                        updateItem(index, "supplier_id", value)
                      }
                    >
                      <SelectTrigger className="w-[150px] h-8 text-sm">
                        <SelectValue placeholder="Supplier" />
                      </SelectTrigger>

                      <SelectContent className="z-[9999]">
                        {vendors.map((v: any) => (
                          <SelectItem key={v.vendor_id} value={v.vendor_id}>
                            {v.vendor_name || v.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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

                  {/* ADDITIONAL (tick + input) */}
                  <td className="border-r p-1">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          updateItem(
                            index,
                            "additional_charges",
                            item.additional_charges === "100" ? "" : "100",
                          )
                        }
                        className={`w-5 h-5 rounded border flex items-center justify-center text-xs
                    ${
                      item.additional_charges === "100"
                        ? "bg-green-500 text-white border-green-500"
                        : "bg-background"
                    }`}
                      >
                        {item.additional_charges === "100" ? "✓" : ""}
                      </button>

                      <input
                        className="w-[90px] border rounded px-2 py-1 text-sm"
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

                  {/* OMS REMARKS */}
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
