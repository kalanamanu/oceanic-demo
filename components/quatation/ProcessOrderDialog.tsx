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

import { Download, Upload, Loader2 } from "lucide-react";

import { toast } from "sonner";

import { ConfirmedOrderService } from "@/services/confirmed-order.service";

interface Props {
  open: boolean;

  onOpenChange: (open: boolean) => void;

  preCostId: string;
}

export function ProcessOrderDialog({ open, onOpenChange, preCostId }: Props) {
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const [downloading, setDownloading] = React.useState(false);

  const [uploading, setUploading] = React.useState(false);

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

  /* ================= OPEN FILE PICKER ================= */

  const handleChooseFile = () => {
    fileInputRef.current?.click();
  };

  /* ================= UPLOAD CONFIRM ORDER ================= */

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    try {
      setUploading(true);

      const result = await ConfirmedOrderService.confirmOrder(preCostId, file);

      console.log("CONFIRM RESULT", result);

      toast.success("Order confirmed successfully");

      onOpenChange(false);
    } catch (err) {
      console.error(err);

      toast.error("Failed to confirm order");
    } finally {
      setUploading(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Process Confirm Order</DialogTitle>

          <DialogDescription>
            Download the confirmation template, update quantities, then upload
            the completed file.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-4">
          {/* DOWNLOAD */}
          <Button
            className="w-full"
            variant="outline"
            onClick={handleDownloadTemplate}
            disabled={downloading}
          >
            {downloading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Downloading...
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Download Template
              </>
            )}
          </Button>

          {/* HIDDEN INPUT */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx"
            className="hidden"
            onChange={handleFileUpload}
          />

          {/* UPLOAD */}
          <Button
            className="w-full"
            onClick={handleChooseFile}
            disabled={uploading}
          >
            {uploading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Confirm Order
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
