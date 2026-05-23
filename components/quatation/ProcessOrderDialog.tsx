"use client";

import * as React from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import { Upload, Download, FileSpreadsheet, CheckCircle2 } from "lucide-react";

import { toast } from "sonner";

import { ConfirmedOrderService } from "@/services/confirmed-order.service";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  preCostId: string;
}

export function ProcessOrderDialog({ open, onOpenChange, preCostId }: Props) {
  const [downloading, setDownloading] = React.useState(false);

  const [uploading, setUploading] = React.useState(false);

  const [file, setFile] = React.useState<File | null>(null);

  const [result, setResult] = React.useState<any>(null);

  /* ================= DOWNLOAD TEMPLATE ================= */

  const handleDownloadTemplate = async () => {
    try {
      setDownloading(true);

      const blob = await ConfirmedOrderService.downloadTemplate(preCostId);

      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");

      a.href = url;

      a.download = `confirm-order-template-${preCostId}.xlsx`;

      a.click();

      window.URL.revokeObjectURL(url);

      toast.success("Template downloaded");
    } catch (err) {
      console.error(err);

      toast.error("Failed to download template");
    } finally {
      setDownloading(false);
    }
  };

  /* ================= UPLOAD & PROCESS ================= */

  const handleProcessOrder = async () => {
    if (!file) {
      toast.error("Please select an Excel file");

      return;
    }

    try {
      setUploading(true);

      const data = await ConfirmedOrderService.confirmOrder(preCostId, file);

      setResult(data);

      toast.success("Order confirmed successfully");
    } catch (err: any) {
      console.error(err);

      toast.error(err.message || "Failed to process order");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-hidden p-0">
        <div className="flex flex-col max-h-[90vh]">
          {/* HEADER */}
          <DialogHeader className="px-6 pt-6 pb-4 border-b shrink-0">
            <DialogTitle>Process Confirm Order</DialogTitle>

            <DialogDescription>
              Download the confirmation template, update quantities, and upload
              the completed file.
            </DialogDescription>
          </DialogHeader>

          {/* SCROLLABLE CONTENT */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
            {/* DOWNLOAD */}
            <div className="border rounded-xl p-4 flex items-center justify-between">
              <div>
                <h3 className="font-medium">Download Template</h3>

                <p className="text-sm text-muted-foreground">
                  Download the Excel confirmation template.
                </p>
              </div>

              <Button
                onClick={handleDownloadTemplate}
                disabled={downloading}
                className="gap-2"
              >
                <Download className="w-4 h-4" />

                {downloading ? "Downloading..." : "Download"}
              </Button>
            </div>

            {/* UPLOAD */}
            <div className="border rounded-xl p-4 space-y-4">
              <div>
                <h3 className="font-medium">Upload Confirm Order</h3>

                <p className="text-sm text-muted-foreground">
                  Upload the completed confirmation Excel file.
                </p>
              </div>

              <label className="border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-muted/40 transition">
                <FileSpreadsheet className="w-10 h-10 mb-3 text-muted-foreground" />

                <span className="text-sm font-medium">
                  {file ? file.name : "Click to select Excel file"}
                </span>

                <span className="text-xs text-muted-foreground mt-1">
                  .xlsx files only
                </span>

                <input
                  type="file"
                  accept=".xlsx"
                  className="hidden"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
              </label>

              <Button
                onClick={handleProcessOrder}
                disabled={!file || uploading}
                className="w-full gap-2"
              >
                <Upload className="w-4 h-4" />

                {uploading ? "Processing Order..." : "Upload & Process Order"}
              </Button>
            </div>

            {/* SUCCESS RESULT */}
            {result && (
              <div className="border rounded-xl p-5 bg-green-50 dark:bg-green-950/20 space-y-4">
                {/* SUCCESS HEADER */}
                <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
                  <CheckCircle2 className="w-5 h-5" />

                  <h3 className="font-semibold">
                    Order Confirmed Successfully
                  </h3>
                </div>

                {/* TOTALS */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="border rounded-lg p-3 bg-background">
                    <p className="text-muted-foreground mb-1">
                      Confirmed Total LKR
                    </p>

                    <p className="font-bold text-lg">
                      {Number(result.confirmed_total_lkr || 0).toLocaleString()}
                    </p>
                  </div>

                  <div className="border rounded-lg p-3 bg-background">
                    <p className="text-muted-foreground mb-1">
                      Confirmed Total USD
                    </p>

                    <p className="font-bold text-lg">
                      $
                      {Number(result.confirmed_total_usd || 0).toLocaleString()}
                    </p>
                  </div>

                  <div className="border rounded-lg p-3 bg-background">
                    <p className="text-muted-foreground mb-1">Variance LKR</p>

                    <p className="font-bold text-lg">
                      {Number(result.variance_lkr || 0).toLocaleString()}
                    </p>
                  </div>

                  <div className="border rounded-lg p-3 bg-background">
                    <p className="text-muted-foreground mb-1">Variance USD</p>

                    <p className="font-bold text-lg">
                      {Number(result.variance_usd || 0).toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* CONFIRMED ITEMS */}
                {result.confirmed_items?.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Confirmed Items</h4>

                    <div className="flex flex-wrap gap-2">
                      {result.confirmed_items.map(
                        (id: string, index: number) => (
                          <div
                            key={index}
                            className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs"
                          >
                            {id}
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                )}

                {/* CHANGED ITEMS */}
                {result.quantity_changed_items?.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">
                      Quantity Changed Items
                    </h4>

                    <div className="space-y-2">
                      {result.quantity_changed_items.map(
                        (item: any, index: number) => (
                          <div
                            key={index}
                            className="border rounded-lg p-3 text-sm bg-background"
                          >
                            <div>
                              <b>Item ID:</b> {item.item_id}
                            </div>

                            <div>
                              <b>Original Qty:</b> {item.original_quantity}
                            </div>

                            <div>
                              <b>New Qty:</b> {item.new_quantity}
                            </div>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                )}

                {/* REMOVED ITEMS */}
                {result.removed_items?.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Removed Items</h4>

                    <div className="flex flex-wrap gap-2">
                      {result.removed_items.map((id: string, index: number) => (
                        <div
                          key={index}
                          className="px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs"
                        >
                          {id}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
