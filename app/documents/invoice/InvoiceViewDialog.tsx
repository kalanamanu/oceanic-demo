"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Loader2, Download } from "lucide-react";

import { SavedDocument } from "@/types/document.types";
import { useDocumentEngine } from "@/hooks/use-document-job";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  document: SavedDocument | null;
}

export function InvoiceViewDialog({ open, onOpenChange, document }: Props) {
  const { loading: engineLoading, runJob } = useDocumentEngine();

  const doc = document;
  const data = doc?.data;

  /* ================= HELPERS ================= */

  const hasDiscount = React.useMemo(() => {
    return (data?.items || []).some(
      (item: any) => Number(item.discount || 0) > 0,
    );
  }, [data]);

  const calculateItemTotal = (item: any) => {
    const qty = Number(item.quantity || 0);
    const price = Number(item.unit_price || 0);
    const discount = Number(item.discount || 0);

    return qty * price - discount;
  };

  /* ================= PAYLOAD ================= */

  const buildPayload = React.useCallback(() => {
    if (!doc || !data) return null;

    const items = (data.items || []).map((item: any, index: number) => ({
      no: index + 1,
      item_name: item.description, // ✅ FIXED
      description: item.remarks || "",
      quantity: Number(item.quantity || 1),
      unit: item.unit || "",

      unit_price: Number(item.unit_price || 0),

      ...(hasDiscount && {
        discount: Number(item.discount || 0),
      }),

      total_price: calculateItemTotal(item),
    }));

    return {
      document: "INVOICE",
      documentType: "pdf",
      documentData: {
        reference_no: doc.reference_no,
        date: data.date || "",

        billToName: data.billToName || "",
        billToAddress: data.billToAddress || "",

        items,

        subtotal: Number(data.subtotal || 0),
        tax: Number(data.tax || 0),

        ...(hasDiscount && {
          discount: Number(data.discount || 0),
        }),

        total: Number(data.total || 0),
      },
    };
  }, [doc, data, hasDiscount]);

  /* ================= DOWNLOAD ================= */

  const handleGenerateAndDownload = async () => {
    const payload = buildPayload();
    if (!payload) return;

    try {
      await runJob(payload, "Invoice");
      onOpenChange(false);
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= UI ================= */

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        if (!state && engineLoading) return;
        onOpenChange(state);
      }}
    >
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Invoice Details</DialogTitle>
          <DialogDescription>
            View invoice information and Download
          </DialogDescription>
        </DialogHeader>

        {!doc ? (
          <p className="text-sm text-muted-foreground">Loading...</p>
        ) : (
          <div className="space-y-3 mt-2">
            {/* BASIC INFO */}
            <div className="border rounded-lg p-3 text-sm space-y-2">
              <div className="flex justify-between">
                <span>Reference</span>
                <span>{doc.reference_no}</span>
              </div>

              <div className="flex justify-between">
                <span>Status</span>
                <span>{doc.status}</span>
              </div>

              <div className="flex justify-between">
                <span>Date</span>
                <span>{data?.date || "-"}</span>
              </div>
            </div>

            {/* ITEMS */}
            <div className="border rounded-lg p-3">
              <h3 className="text-sm font-semibold mb-2">Items</h3>

              {(data?.items || []).map((item: any, idx: number) => (
                <div key={idx} className="border-b pb-2 text-sm">
                  <div className="flex justify-between">
                    <span>{item.description}</span>

                    <span className="font-medium">
                      {calculateItemTotal(item).toFixed(2)}
                    </span>
                  </div>

                  <div className="text-xs text-muted-foreground">
                    {item.quantity} {item.unit} × {item.unit_price}
                  </div>

                  {hasDiscount && item.discount ? (
                    <div className="text-xs text-red-500">
                      Discount: {item.discount}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>

            {/* SUMMARY */}
            <div className="border rounded-lg p-3 text-sm space-y-1">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{Number(data?.subtotal || 0).toFixed(2)}</span>
              </div>

              {hasDiscount && (
                <div className="flex justify-between text-red-500">
                  <span>Discount</span>
                  <span>-{Number(data?.discount || 0).toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between text-muted-foreground">
                <span>Tax</span>
                <span>{Number(data?.tax || 0).toFixed(2)}</span>
              </div>

              <div className="flex justify-between font-bold border-t pt-2">
                <span>Total</span>
                <span>{Number(data?.total || 0).toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={engineLoading}
          >
            Close
          </Button>

          <Button
            onClick={handleGenerateAndDownload}
            disabled={!doc || engineLoading}
          >
            {engineLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Download
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
