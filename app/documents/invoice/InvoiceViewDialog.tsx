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
import { Receipt, Loader2, Download } from "lucide-react";

import { SavedDocument } from "@/types/document.types";
import { useDocumentEngine } from "@/hooks/use-document-job";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  document: SavedDocument | null;
}

export function InvoiceViewDialog({ open, onOpenChange, document }: Props) {
  const { loading: engineLoading, runJob } = useDocumentEngine({
    pollInterval: 2000,
    maxAttempts: 10,
  });

  const doc = document;
  const data = (doc as any)?.data;

  /* ================= BUILD PAYLOAD ================= */
  const buildPayload = React.useCallback(() => {
    if (!doc || !data) return null;

    return {
      document: "INVOICE",
      documentType: "pdf",
      documentData: {
        reference_no: doc.reference_no,
        date: data.date || "",
        billToName: data.billToName || "",
        billToCompany: data.billToCompany || "",
        billToAddress: data.billToAddress || "",
        sub_total: Number(data.sub_total || data.total_cost || 0),
        total_cost: Number(data.total_cost || 0),
        items: (data.items || []).map((item: any, index: number) => ({
          no: item.no || index + 1,
          item_name: item.item_name,
          description: item.description || "",
          quantity: Number(item.quantity || 1),
          unit_price: Number(item.unit_price || 0),
          total_price: Number(item.total_price || 0),
        })),
      },
    };
  }, [doc, data]);

  /* ================= DOWNLOAD WORKFLOW HANDLER ================= */
  const handleGenerateAndDownload = async () => {
    const payload = buildPayload();
    if (!payload) return;

    try {
      await runJob(payload, "Invoice");
      onOpenChange(false);
    } catch (err) {
      console.error("Invoice job generation failed:", err);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        // Prevent closing the dialog modal manually while processing an active background task
        if (!state && engineLoading) return;
        onOpenChange(state);
      }}
    >
      <DialogContent className="max-w-lg">
        {/* HEADER */}
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Invoice Details
          </DialogTitle>

          <DialogDescription>
            View invoice information and Download
          </DialogDescription>
        </DialogHeader>

        {/* BODY */}
        {!doc ? (
          <p className="text-sm text-muted-foreground">Loading invoice...</p>
        ) : (
          <div className="space-y-3 mt-2">
            {/* BASIC INFO */}
            <div className="border rounded-lg p-3 text-sm space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Reference No</span>
                <span className="font-medium">{doc.reference_no}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-muted-foreground">Status</span>
                <span className="font-medium">{doc.status}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-muted-foreground">Date</span>
                <span className="font-medium">
                  {data?.date
                    ? new Date(data.date).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })
                    : "-"}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-muted-foreground">Bill To</span>
                <span className="font-medium">{data?.billToName || "-"}</span>
              </div>
            </div>

            {/* ITEMS */}
            <div className="border rounded-lg p-3">
              <h3 className="text-sm font-semibold mb-2">Items</h3>

              <div className="max-h-[20vh] overflow-y-auto space-y-2 pr-1">
                {data?.items?.length ? (
                  data.items.map((item: any, idx: number) => (
                    <div
                      key={idx}
                      className="flex justify-between text-sm border-b pb-1 last:border-0 last:pb-0"
                    >
                      <span>
                        {item.item_name} × {item.quantity}
                      </span>

                      <span className="font-medium">
                        {Number(item.total_price || 0).toFixed(2)}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No items found
                  </p>
                )}
              </div>
            </div>

            {/* SUMMARY */}
            <div className="border rounded-lg p-3 text-sm">
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>{Number(data?.total_cost || 0).toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}

        {/* FOOTER */}
        <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-2">
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
