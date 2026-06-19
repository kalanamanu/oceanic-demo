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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Download } from "lucide-react";
import { toast } from "sonner";

import { DocumentService } from "@/services/document.service";
import { useDocumentEngine } from "@/hooks/use-document-job";

interface Props {
  docId: string;
  open: boolean;
  onClose: () => void;
}

type Currency = "LKR" | "USD";

export default function PurchaseOrderViewDialog({
  docId,
  open,
  onClose,
}: Props) {
  const { loading: engineLoading, runJob } = useDocumentEngine({
    pollInterval: 2000,
    maxAttempts: 10,
  });

  const [loading, setLoading] = React.useState(false);
  const [usdRate, setUsdRate] = React.useState(1);
  const [items, setItems] = React.useState<any[]>([]);

  const [form, setForm] = React.useState({
    reference_no: "",
    company: "",
    supplier: "",
    ETA: "",
    date: "",
    transport_cost: 0,
    currency: "LKR" as Currency,
    documentType: "pdf" as "pdf" | "excel",
  });

  /* ================= LOAD DATA ================= */
  React.useEffect(() => {
    if (!open || !docId) return;

    const load = async () => {
      setLoading(true);
      try {
        const docRes = await DocumentService.getDocument(docId);

        const docWrapper = docRes.document;
        const d = docWrapper?.data || {};
        const savedCurrency = (d.currency as Currency) || "LKR";
        const savedUsdRate = d.usd_rate || 1;

        setUsdRate(savedUsdRate);

        setForm({
          reference_no: d.reference_no || "",
          company: d.company || "",
          supplier: d.supplier || "",
          ETA: d.ETA || "",
          date: d.date || "",
          transport_cost: Number(d.transport_cost || 0),
          currency: savedCurrency,
          documentType:
            ((docWrapper as any)?.documentType as "pdf" | "excel") || "pdf",
        });

        const parsedItems = (d.items || []).map((item: any) => {
          let uPriceLkr = Number(item.unit_price || 0);
          let tPriceLkr = Number(item.total_price || 0);
          let uPriceUsd = Number(item.unit_rate_usd || 0);
          let tPriceUsd = Number(item.total_price_usd || 0);

          if (savedCurrency === "LKR" && !tPriceUsd) {
            uPriceUsd = uPriceLkr / savedUsdRate;
            tPriceUsd = tPriceLkr / savedUsdRate;
          } else if (savedCurrency === "USD" && !tPriceLkr) {
            uPriceLkr = uPriceUsd * savedUsdRate;
            tPriceLkr = tPriceUsd * savedUsdRate;
          }

          return {
            ...item,
            unit_price: uPriceLkr,
            total_price: tPriceLkr,
            unit_rate_usd: uPriceUsd,
            total_price_usd: tPriceUsd,
          };
        });

        setItems(parsedItems);
      } catch (err: any) {
        console.error(err);
        toast.error("Failed to load PO view data");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [open, docId]);

  /* ================= CALCULATIONS ================= */
  const subTotal = React.useMemo(() => {
    if (form.currency === "USD") {
      return items.reduce(
        (sum, item) => sum + Number(item.total_price_usd || 0),
        0,
      );
    }
    return items.reduce((sum, item) => sum + Number(item.total_price || 0), 0);
  }, [items, form.currency]);

  const transportCost = form.transport_cost;
  const fullTotal = subTotal + transportCost;

  /* ================= BUILD PAYLOAD ================= */
  const buildPayload = React.useCallback(() => {
    return {
      document: "PO",
      documentType: form.documentType,
      documentData: {
        reference_no: form.reference_no,
        company: form.company,
        supplier: form.supplier,
        ETA: form.ETA,
        discount: 0,
        sub_total: Number(subTotal.toFixed(2)),
        full_total_cost: Number(fullTotal.toFixed(2)),
        transport_cost: transportCost,
        date: form.date,
        currency: form.currency,
        usd_rate: usdRate,
        items: items.map((item, index) => ({
          no: item.no || index + 1,
          item_name: item.item_name,
          remark: item.remark || item.customer_remark || "",
          quantity: item.quantity,
          unit: item.unit,
          unit_price:
            form.currency === "USD"
              ? Number(item.unit_rate_usd || 0)
              : Number(item.unit_price || 0),
          total_price:
            form.currency === "USD"
              ? Number(item.total_price_usd || 0)
              : Number(item.total_price || 0),
          unit_rate_usd: Number(item.unit_rate_usd || 0),
          total_price_usd: Number(item.total_price_usd || 0),
        })),
      },
    };
  }, [form, items, subTotal, fullTotal, transportCost, usdRate]);

  /* ================= GENERATE / DOWNLOAD HANDLER ================= */
  const handleGenerateAndDownload = async () => {
    try {
      await runJob(buildPayload(), "Purchase Order");
      onClose();
    } catch (err) {
      console.error("Job generation failed:", err);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        !state && !engineLoading && onClose();
      }}
    >
      <DialogContent className="max-w-xl p-6 gap-6">
        <DialogHeader className="space-y-1">
          <DialogTitle className="text-xl">View Purchase Order</DialogTitle>
          <DialogDescription>
            Reviewing details for Purchase Order {form.reference_no || "Draft"}.
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex h-[40vh] items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            {/* SCROLLABLE BODY */}
            <div className="max-h-[60vh] overflow-y-auto pr-1 space-y-5">
              {/* RATE BADGE */}
              <div className="text-xs text-muted-foreground bg-muted/60 px-3 py-2 rounded-md border border-border/50 flex justify-between items-center">
                <span>Exchange Reference (At time of creation):</span>
                <b className="text-foreground font-semibold">
                  1 USD = {usdRate} LKR
                </b>
              </div>

              <div className="space-y-4">
                {/* GRID 1: REF & COMPANY */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-muted-foreground">
                      Reference Number
                    </Label>
                    <Input
                      value={form.reference_no}
                      disabled
                      className="bg-muted/30"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-muted-foreground">
                      Company
                    </Label>
                    <Input
                      value={form.company}
                      disabled
                      className="bg-muted/30"
                    />
                  </div>
                </div>

                {/* SUPPLIER (READ ONLY) */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-muted-foreground">
                    Supplier / Vendor
                  </Label>
                  <Input
                    value={form.supplier}
                    disabled
                    className="bg-muted/30"
                  />
                </div>

                {/* GRID 2: ETA & DATE */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-muted-foreground">
                      ETA
                    </Label>
                    <Input
                      type="date"
                      value={form.ETA}
                      disabled
                      className="bg-muted/30"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-muted-foreground">
                      Document Date
                    </Label>
                    <Input
                      type="date"
                      value={form.date}
                      disabled
                      className="bg-muted/30"
                    />
                  </div>
                </div>

                {/* GRID 3: TRANSPORT & CURRENCY */}
                <div className="grid grid-cols-2 gap-4 pt-1">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-muted-foreground">
                      Transport Cost ({form.currency})
                    </Label>
                    <Input
                      value={transportCost.toFixed(2)}
                      disabled
                      className="bg-muted/30"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-muted-foreground">
                      Selected Document Currency
                    </Label>
                    <Input
                      value={form.currency}
                      disabled
                      className="bg-muted/30 font-bold"
                    />
                  </div>
                </div>

                {/* EXPORT FORMAT */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-muted-foreground">
                    Export Format
                  </Label>
                  <Input
                    value={
                      form.documentType === "pdf"
                        ? "PDF Document"
                        : "Excel Spreadsheet"
                    }
                    disabled
                    className="bg-muted/30"
                  />
                </div>
              </div>

              {/* SUMMARY BOX */}
              <div className="border border-border/80 rounded-xl bg-card p-4 space-y-2 text-sm shadow-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Items Count:</span>
                  <span className="font-medium text-foreground">
                    {items.length} Units
                  </span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Sub Total:</span>
                  <span className="font-medium text-foreground">
                    {subTotal.toFixed(2)} {form.currency}
                  </span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Transport:</span>
                  <span className="font-medium text-foreground">
                    {transportCost.toFixed(2)} {form.currency}
                  </span>
                </div>

                <div className="flex justify-between font-bold border-t pt-2.5 text-base text-foreground">
                  <span>Full Total:</span>
                  <span className="text-primary">
                    {fullTotal.toFixed(2)} {form.currency}
                  </span>
                </div>
              </div>
            </div>

            <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 border-t pt-4">
              <Button
                variant="outline"
                onClick={onClose}
                disabled={engineLoading}
              >
                Close
              </Button>
              <Button
                onClick={handleGenerateAndDownload}
                disabled={engineLoading}
              >
                {engineLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Document...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Download File
                  </>
                )}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
