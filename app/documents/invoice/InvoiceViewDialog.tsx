"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Receipt, Loader2 } from "lucide-react";

import { SavedDocument } from "@/types/document.types";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  document: SavedDocument | null;
  onDownload: () => void;
}

export function InvoiceViewDialog({
  open,
  onOpenChange,
  document,
  onDownload,
}: Props) {
  const doc = document;
  const data = (doc as any)?.data;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        {/* HEADER */}
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5 text-emerald-500" />
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
            {/* BASIC INFO (same structure style as create dialog) */}
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

              <div className="space-y-2">
                {data?.items?.length ? (
                  data.items.map((item: any, idx: number) => (
                    <div
                      key={idx}
                      className="flex justify-between text-sm border-b pb-1"
                    >
                      <span>
                        {item.item_name} × {item.quantity}
                      </span>

                      <span className="font-medium">{item.total_price}</span>
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
                <span>{data?.total_cost || 0}</span>
              </div>
            </div>
          </div>
        )}

        {/* FOOTER */}
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>

          <Button onClick={onDownload}>Download</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
