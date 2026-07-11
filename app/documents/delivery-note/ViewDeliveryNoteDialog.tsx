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
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";

import {
  FileSpreadsheet,
  Calendar,
  Building2,
  MapPin,
  Hash,
  X,
  Download,
  Loader2,
} from "lucide-react";

import { useDocumentEngine } from "@/hooks/use-document-job";

type Item = {
  description?: string;
  item_name?: string;
  remarks?: string;
  customer_remark?: string;
  unit: string;
  quantity: number;
};

type DeliveryNoteData = {
  referenceNumber: string;
  date: string | Date;
  supplyDate?: string | Date;
  billToName: string;
  billToAddress: string;
  poNumber?: string;
  items: Item[];
};

interface Props {
  open: boolean;
  onClose: () => void;
  deliveryNote: DeliveryNoteData | null;
}

export const ViewDeliveryNoteDialog = ({
  open,
  onClose,
  deliveryNote,
}: Props) => {
  // 🚀 Hook connected directly to engine worker
  const { runJob, loading } = useDocumentEngine({
    pollInterval: 2000,
    maxAttempts: 6,
  });

  if (!deliveryNote) return null;

  const formatDate = (dateVal?: string | Date) => {
    if (!dateVal) return "—";
    if (dateVal instanceof Date) return dateVal.toLocaleDateString("en-GB");
    return dateVal;
  };

  /* ====================================
      DOWNLOAD ENGINE ACTION HANDLER
  ==================================== */
  const handleDownload = async (type: "pdf" | "excel") => {
    try {
      const payload = {
        document: "deliverynote",
        documentType: type,
        documentData: {
          reference_no: deliveryNote.referenceNumber,
          date: deliveryNote.date,
          supplyDate: deliveryNote.supplyDate,
          billToName: deliveryNote.billToName,
          billToAddress: deliveryNote.billToAddress,
          poNumber: deliveryNote.poNumber,
          items: (deliveryNote.items || []).map((item, index) => ({
            no: index + 1,
            item_name: item.item_name || item.description || "—",
            customer_remark: item.customer_remark || item.remarks || "—",
            unit: item.unit || "PCS",
            quantity: Number(item.quantity || 0),
          })),
        },
      };

      await runJob(payload, `Delivery Note ${deliveryNote.referenceNumber}`);
      onClose(); // Auto close window when job finishes download stream cleanly
    } catch (err) {
      console.error("Error running delivery note download task:", err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[90vw] md:max-w-[85vw] lg:max-w-[80vw] xl:max-w-[1200px] max-h-[90vh] flex flex-col p-0 overflow-hidden gap-0">
        <DialogHeader className="p-6 border-b shrink-0">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-primary" />
            <DialogTitle className="text-xl font-bold flex items-center gap-3">
              Delivery Note Details
              <Badge
                variant="outline"
                className="font-mono text-xs font-semibold px-2 py-0.5"
              >
                {deliveryNote.referenceNumber || "Draft Reference"}
              </Badge>
            </DialogTitle>
          </div>
          <DialogDescription className="text-sm mt-1">
            Review logistics tracking info, consignee metadata, and verified
            dispatch manifests.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* METADATA CARDS */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" /> Core Metadata & Logistics
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 bg-muted/20 p-4 rounded-xl border border-muted">
              <div className="space-y-1">
                <span className="text-[11px] font-medium text-muted-foreground block uppercase tracking-wider">
                  Reference Code
                </span>
                <p className="text-sm font-semibold font-mono text-primary flex items-center gap-1.5">
                  <Hash className="w-3.5 h-3.5 text-muted-foreground" />
                  {deliveryNote.referenceNumber || "—"}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-medium text-muted-foreground block uppercase tracking-wider">
                  Document Date
                </span>
                <p className="text-sm font-medium">
                  {formatDate(deliveryNote.date)}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-medium text-muted-foreground block uppercase tracking-wider">
                  Supply/Delivery Date
                </span>
                <p className="text-sm font-medium">
                  {formatDate(deliveryNote.supplyDate)}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-1 bg-muted/20 p-4 rounded-xl border border-muted">
                <span className="text-[11px] font-medium text-muted-foreground block uppercase tracking-wider">
                  PO Number Reference
                </span>
                <p className="text-sm font-medium font-mono">
                  {deliveryNote.poNumber || "—"}
                </p>
              </div>

              <div className="md:col-span-2 space-y-1 bg-muted/20 p-4 rounded-xl border border-muted">
                <span className="text-[11px] font-medium text-muted-foreground block uppercase tracking-wider flex items-center gap-1">
                  <Building2 className="w-3 h-3" /> Client / Consignee Name
                </span>
                <p className="text-sm font-semibold text-foreground">
                  {deliveryNote.billToName || "—"}
                </p>
              </div>
            </div>

            <div className="space-y-1 bg-muted/20 p-4 rounded-xl border border-muted">
              <span className="text-[11px] font-medium text-muted-foreground block uppercase tracking-wider flex items-center gap-1">
                <MapPin className="w-3 h-3" /> Delivery Destination Address
              </span>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {deliveryNote.billToAddress || "—"}
              </p>
            </div>
          </div>

          <Separator />

          {/* ITEM ENTRIES TABLE */}
          <div className="space-y-4">
            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Consignment Items ({deliveryNote.items?.length || 0})
            </Label>

            {deliveryNote.items && deliveryNote.items.length > 0 ? (
              <div className="space-y-2">
                <div className="hidden md:grid grid-cols-12 gap-3 px-4 py-2 text-xs font-semibold text-muted-foreground border-b uppercase tracking-wider bg-muted/40 rounded-t-lg">
                  <div className="col-span-5">Item Description</div>
                  <div className="col-span-3">Internal Remarks</div>
                  <div className="col-span-2 text-center">Unit</div>
                  <div className="col-span-2 text-right">Quantity</div>
                </div>

                <div className="space-y-1.5">
                  {deliveryNote.items.map((item, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center p-3 md:px-4 md:py-3 bg-muted/5 hover:bg-muted/10 rounded-xl border md:border-b md:border-muted/30 md:rounded-none transition-colors"
                    >
                      <div className="col-span-5 space-y-0.5 md:space-y-0">
                        <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground md:hidden block">
                          Description
                        </span>
                        <p className="text-sm font-medium text-foreground">
                          {item.item_name || item.description || "—"}
                        </p>
                      </div>

                      <div className="col-span-3 space-y-0.5 md:space-y-0">
                        <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground md:hidden block">
                          Remarks
                        </span>
                        <p className="text-sm text-muted-foreground italic">
                          {item.customer_remark || item.remarks || "—"}
                        </p>
                      </div>

                      <div className="col-span-2 space-y-0.5 md:space-y-0 md:text-center">
                        <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground md:hidden block">
                          Unit
                        </span>
                        <Badge
                          variant="secondary"
                          className="font-medium text-xs rounded-md"
                        >
                          {item.unit || "PCS"}
                        </Badge>
                      </div>

                      <div className="col-span-2 space-y-0.5 md:space-y-0 text-left md:text-right">
                        <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground md:hidden block">
                          Qty
                        </span>
                        <p className="text-sm font-semibold font-mono text-primary pr-2">
                          {Number(item.quantity || 0).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12 border border-dashed rounded-xl bg-muted/5">
                <p className="text-sm text-muted-foreground">
                  No item rows declared in this manifest.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* FOOTER ACTION PANEL */}
        <DialogFooter className="p-6 border-t bg-background shrink-0 flex flex-row items-center justify-between sm:justify-between gap-2">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            className="gap-1.5"
            disabled={loading}
          >
            <X className="w-4 h-4" /> Close View
          </Button>

          <Button
            type="button"
            onClick={() => handleDownload("pdf")}
            disabled={loading}
            className="px-5 font-medium shadow-sm gap-1.5"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Generating Document...
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                Download Note PDF
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
