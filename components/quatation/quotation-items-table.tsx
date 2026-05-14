"use client";

import { Button } from "@/components/ui/button";
import { Trash2, Plus, Expand } from "lucide-react";

import type { QuotationItem } from "@/types/quotation.types";

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

  return (
    <div className="space-y-4">
      {/* HEADER ACTIONS */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Quotation Items</h2>

          <p className="text-sm text-muted-foreground">
            Total Items: {items.length}
          </p>
        </div>

        <Button type="button" variant="outline" onClick={openPopupWindow}>
          <Expand className="w-4 h-4 mr-2" />
          Full Screen View
        </Button>
      </div>

      {/* TABLE */}
      <div className="w-full overflow-auto rounded-xl border">
        <table className="min-w-[2200px] w-full border-collapse">
          <thead className="sticky top-0 bg-muted z-10">
            <tr className="border-b">
              {[
                "Item No",
                "Description",
                "Customer Remark",
                "Qty",
                "Unit",
                "IMPA",
                "Unit Price",
                "Unit USD",
                "Additional",
                "Total RS",
                "Total USD",
                "Basis",
                "OMS Remark",
                "Supplier",
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

          <tbody>
            {items.map((item, index) => (
              <tr key={index} className="border-b hover:bg-muted/30">
                {/* ITEM NO */}
                <td className="border-r p-2">
                  <input
                    className="w-[100px] border rounded px-2 py-1"
                    value={item.item_no || ""}
                    onChange={(e) =>
                      updateItem(index, "item_no", e.target.value)
                    }
                  />
                </td>

                {/* DESCRIPTION */}
                <td className="border-r p-2">
                  <textarea
                    className="w-[250px] border rounded px-2 py-1 min-h-[70px]"
                    value={item.description || ""}
                    onChange={(e) =>
                      updateItem(index, "description", e.target.value)
                    }
                  />
                </td>

                {/* CUSTOMER REMARK */}
                <td className="border-r p-2">
                  <textarea
                    className="w-[220px] border rounded px-2 py-1 min-h-[70px]"
                    value={item.customer_remark || ""}
                    onChange={(e) =>
                      updateItem(index, "customer_remark", e.target.value)
                    }
                  />
                </td>

                {/* QUANTITY */}
                <td className="border-r p-2">
                  <input
                    className="w-[90px] border rounded px-2 py-1"
                    value={item.quantity || ""}
                    onChange={(e) =>
                      updateItem(index, "quantity", e.target.value)
                    }
                  />
                </td>

                {/* UNIT */}
                <td className="border-r p-2">
                  <input
                    className="w-[90px] border rounded px-2 py-1"
                    value={item.unit || ""}
                    onChange={(e) => updateItem(index, "unit", e.target.value)}
                  />
                </td>

                {/* IMPA */}
                <td className="border-r p-2">
                  <input
                    className="w-[130px] border rounded px-2 py-1"
                    value={item.impa_code || ""}
                    onChange={(e) =>
                      updateItem(index, "impa_code", e.target.value)
                    }
                  />
                </td>

                {/* PRICE */}
                <td className="border-r p-2">
                  <input
                    className="w-[120px] border rounded px-2 py-1"
                    value={item.price || ""}
                    onChange={(e) => updateItem(index, "price", e.target.value)}
                  />
                </td>

                {/* UNIT USD */}
                <td className="border-r p-2">
                  <input
                    readOnly
                    className="w-[120px] border rounded px-2 py-1 bg-muted"
                    value={item.unit_rate_usd || ""}
                  />
                </td>

                {/* ADDITIONAL */}
                <td className="border-r p-2">
                  <input
                    className="w-[120px] border rounded px-2 py-1"
                    value={item.additional_charges || ""}
                    onChange={(e) =>
                      updateItem(index, "additional_charges", e.target.value)
                    }
                  />
                </td>

                {/* TOTAL RS */}
                <td className="border-r p-2">
                  <input
                    readOnly
                    className="w-[140px] border rounded px-2 py-1 bg-muted"
                    value={item.total_rs || ""}
                  />
                </td>

                {/* TOTAL USD */}
                <td className="border-r p-2">
                  <input
                    readOnly
                    className="w-[140px] border rounded px-2 py-1 bg-muted"
                    value={item.total_usd || ""}
                  />
                </td>

                {/* BASIS */}
                <td className="border-r p-2">
                  <input
                    readOnly
                    className="w-[120px] border rounded px-2 py-1 bg-muted"
                    value={item.conva_basis || ""}
                  />
                </td>

                {/* OMS */}
                <td className="border-r p-2">
                  <textarea
                    className="w-[200px] border rounded px-2 py-1 min-h-[70px]"
                    value={item.osc_remark || ""}
                    onChange={(e) =>
                      updateItem(index, "osc_remark", e.target.value)
                    }
                  />
                </td>

                {/* SUPPLIER */}
                <td className="border-r p-2">
                  <div className="flex gap-2">
                    <select
                      className="w-[180px] border rounded px-2 py-1"
                      value={(item as any).supplier_name || ""}
                      onChange={(e) =>
                        updateItem(index, "supplier_name", e.target.value)
                      }
                    >
                      <option value="">Select Supplier</option>

                      {vendors.map((v: any) => (
                        <option key={v.vendor_id} value={v.vendor_id}>
                          {v.vendor_name || v.name}
                        </option>
                      ))}
                    </select>

                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => {
                        setActiveItemIndex(index);
                        setTempVendorOpen(true);
                      }}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </td>

                {/* ACTIONS */}
                <td className="p-2">
                  <Button
                    size="icon"
                    variant="destructive"
                    onClick={() => removeItem(index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
