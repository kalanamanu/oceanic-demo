"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Maximize2, Minimize2 } from "lucide-react";
import type { QuotationItem } from "@/types/quotation.types";

export default function FullscreenQuotationTablePage() {
  const [items, setItems] = React.useState<QuotationItem[]>([]);
  const [isFullscreen, setIsFullscreen] = React.useState(false);

  // ================= RECEIVE DATA FROM MAIN WINDOW =================
  React.useEffect(() => {
    const handler = (event: MessageEvent) => {
      if (event.data?.type === "INIT_QUOTATION_ITEMS") {
        setItems(event.data.payload || []);
      }

      if (event.data?.type === "UPDATE_QUOTATION_ITEMS") {
        setItems(event.data.payload || []);
      }
    };

    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  // ================= SEND UPDATES BACK =================
  const syncToParent = (updated: QuotationItem[]) => {
    setItems(updated);

    window.opener?.postMessage(
      {
        type: "UPDATE_QUOTATION_ITEMS",
        payload: updated,
      },
      "*",
    );
  };

  // ================= UPDATE FIELD =================
  const updateItem = (index: number, field: string, value: string) => {
    const copy = [...items];
    (copy[index] as any)[field] = value;
    syncToParent(copy);
  };

  const removeItem = (index: number) => {
    const copy = items.filter((_, i) => i !== index);
    syncToParent(copy);
  };

  // ================= FULLSCREEN TOGGLE =================
  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      await document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-background">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Quotation Full Editor</h1>
          <p className="text-sm text-muted-foreground">
            Total Items: {items.length}
          </p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={() => window.close()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Close
          </Button>

          <Button onClick={toggleFullscreen}>
            {isFullscreen ? (
              <>
                <Minimize2 className="w-4 h-4 mr-2" />
                Exit
              </>
            ) : (
              <>
                <Maximize2 className="w-4 h-4 mr-2" />
                Fullscreen
              </>
            )}
          </Button>
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-auto border rounded-xl">
        <table className="min-w-[2400px] w-full border-collapse">
          <thead className="sticky top-0 bg-muted z-10">
            <tr>
              {[
                "Item No",
                "Description",
                "Remark",
                "Qty",
                "Unit",
                "IMPA",
                "Price",
                "USD",
                "Additional",
                "Total RS",
                "Total USD",
                "Basis",
                "OMS",
                "Supplier",
                "Action",
              ].map((h) => (
                <th key={h} className="border px-3 py-2 text-xs text-left">
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {items.map((item, i) => (
              <tr key={i} className="border-t hover:bg-muted/30">
                <td className="border p-1">
                  <input
                    value={item.item_no || ""}
                    onChange={(e) => updateItem(i, "item_no", e.target.value)}
                    className="w-[90px] border px-1"
                  />
                </td>

                <td className="border p-1">
                  <textarea
                    value={item.description || ""}
                    onChange={(e) =>
                      updateItem(i, "description", e.target.value)
                    }
                    className="w-[250px] border px-1"
                  />
                </td>

                <td className="border p-1">
                  <textarea
                    value={item.customer_remark || ""}
                    onChange={(e) =>
                      updateItem(i, "customer_remark", e.target.value)
                    }
                    className="w-[200px] border px-1"
                  />
                </td>

                <td className="border p-1">
                  <input
                    value={item.quantity || ""}
                    onChange={(e) => updateItem(i, "quantity", e.target.value)}
                    className="w-[80px] border px-1"
                  />
                </td>

                <td className="border p-1">
                  <input
                    value={item.unit || ""}
                    onChange={(e) => updateItem(i, "unit", e.target.value)}
                    className="w-[80px] border px-1"
                  />
                </td>

                <td className="border p-1">
                  <input
                    value={item.impa_code || ""}
                    onChange={(e) => updateItem(i, "impa_code", e.target.value)}
                    className="w-[120px] border px-1"
                  />
                </td>

                <td className="border p-1">
                  <input
                    value={item.price || ""}
                    onChange={(e) => updateItem(i, "price", e.target.value)}
                    className="w-[120px] border px-1"
                  />
                </td>

                <td className="border p-1">
                  <input
                    value={item.unit_rate_usd || ""}
                    readOnly
                    className="w-[120px] bg-muted border px-1"
                  />
                </td>

                <td className="border p-1">
                  <input
                    value={item.additional_charges || ""}
                    onChange={(e) =>
                      updateItem(i, "additional_charges", e.target.value)
                    }
                    className="w-[120px] border px-1"
                  />
                </td>

                <td className="border p-1">{item.total_rs}</td>
                <td className="border p-1">{item.total_usd}</td>
                <td className="border p-1">{item.conva_basis}</td>

                <td className="border p-1">
                  <textarea
                    value={item.osc_remark || ""}
                    onChange={(e) =>
                      updateItem(i, "osc_remark", e.target.value)
                    }
                    className="w-[180px] border px-1"
                  />
                </td>

                <td className="border p-1">
                  {(item as any).supplier_name || "-"}
                </td>

                <td className="border p-1">
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => removeItem(i)}
                  >
                    Delete
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
