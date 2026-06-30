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
import { DatePicker } from "@/components/ui/date-picker";
import { DateTimePicker } from "@/components/ui/datetime-picker";

import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { VendorService } from "@/services/vendor.service";
import { PreCostVendorService } from "@/services/precost-vendor.service";
import { BasisService } from "@/services/basis.service";

import { useDocumentEngine } from "@/hooks/use-document-job";

import { DocumentService } from "@/services/document.service";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  preCostId: string;
  vendorId: string;
}

type Currency = "LKR" | "USD";

export function CreatePODialog({
  open,
  onOpenChange,
  preCostId,
  vendorId,
}: Props) {
  const { loading, runJob, autoSave } = useDocumentEngine({
    pollInterval: 2000,
    maxAttempts: 10,
  });

  const [vendor, setVendor] = React.useState<any>(null);
  const [items, setItems] = React.useState<any[]>([]);
  const [usdRate, setUsdRate] = React.useState(1);

  const [form, setForm] = React.useState({
    reference_no: "",
    company: "",
    ETA: undefined as Date | undefined,
    date: new Date(),
    transport_cost: "",
    currency: "LKR" as Currency,
    documentType: "pdf" as const,
  });

  /* ================= LOAD DATA ================= */
  React.useEffect(() => {
    if (!open) return;

    const load = async () => {
      try {
        const [vendorRes, itemsRes, usdRateRes, refRes] = await Promise.all([
          VendorService.getVendorById(vendorId),
          PreCostVendorService.getVendorItems(preCostId, vendorId),
          BasisService.getLatestUSDRate(),
          DocumentService.getReferenceNumber("PO" as any),
        ]);

        setUsdRate(usdRateRes?.USDRate || 1);

        setVendor(vendorRes);
        setItems(itemsRes || []);

        setForm((prev) => ({
          ...prev,
          reference_no: refRes?.reference_no || "",
        }));
      } catch (err: any) {
        console.error(err);
        toast.error("Failed to load PO data");
      }
    };

    load();
  }, [open, preCostId, vendorId]);

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

  const transportCost = React.useMemo(() => {
    return Number(form.transport_cost || 0);
  }, [form.transport_cost]);

  const fullTotal = subTotal + transportCost;

  /* ================= BUILD PAYLOAD ================= */

  const buildPayload = React.useCallback(() => {
    return {
      document: "PO",
      documentType: form.documentType,
      documentData: {
        reference_no: form.reference_no,
        company: form.company,
        supplier: vendor?.name || "",
        ETA: form.ETA ? form.ETA.toISOString() : "",
        currency: form.currency,
        usd_rate: usdRate,
        discount: 0,
        sub_total: Number(subTotal.toFixed(2)),
        full_total_cost: Number(fullTotal.toFixed(2)),
        transport_cost: transportCost,
        date: form.date.toISOString().split("T")[0],
        items: items.map((item, index) => ({
          no: index + 1,
          item_name: item.item_name,
          remark: item.customer_remark || "",
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
  }, [form, vendor, items, subTotal, fullTotal, transportCost, usdRate]);

  /* ================= DRAFT ON CLOSE ================= */

  const handleOpenChange = async (state: boolean) => {
    if (!state) {
      await autoSave(buildPayload());
    }
    onOpenChange(state);
  };

  /* ================= GENERATE ================= */

  const handleGenerate = async () => {
    try {
      await runJob(buildPayload(), "Purchase Order");
      onOpenChange(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-xl p-6 gap-6">
        <DialogHeader className="space-y-1">
          <DialogTitle className="text-xl">Generate Purchase Order</DialogTitle>
          <DialogDescription>
            Configuration will be saved as a draft when you close this dialog.
          </DialogDescription>
        </DialogHeader>

        {/* SCROLLABLE BODY */}
        <div className="max-h-[60vh] overflow-y-auto pr-1 space-y-5">
          {/* RATE BADGE */}
          <div className="text-xs text-muted-foreground bg-muted/60 px-3 py-2 rounded-md border border-border/50 flex justify-between items-center">
            <span>Exchange Reference:</span>
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
                  placeholder="e.g. PO/OSC/2602/V12"
                  value={form.reference_no}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, reference_no: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground">
                  Company
                </Label>
                <Input
                  placeholder="Ordering Entity"
                  value={form.company}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, company: e.target.value }))
                  }
                />
              </div>
            </div>

            {/* SUPPLIER (READ ONLY) */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground">
                Supplier / Vendor
              </Label>
              <Input
                value={vendor?.name || ""}
                disabled
                className="bg-muted/30"
              />
            </div>

            {/* GRID 2: ETA (WITH DATE TIME) & DOCUMENT DATE (DATE ONLY) */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground">
                  ETA
                </Label>
                <DateTimePicker
                  date={form.ETA}
                  placeholder="Select ETA Date & Time"
                  onDateChange={(newDateTime) =>
                    setForm((p) => ({ ...p, ETA: newDateTime }))
                  }
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground">
                  Document Date
                </Label>
                <DatePicker
                  date={form.date}
                  onDateChange={(newDate) => {
                    if (newDate) setForm((p) => ({ ...p, date: newDate }));
                  }}
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
                  type="number"
                  placeholder="0.00"
                  value={form.transport_cost}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, transport_cost: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground">
                  Currency
                </Label>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant={form.currency === "LKR" ? "default" : "outline"}
                    onClick={() => {
                      if (form.currency === "USD" && form.transport_cost) {
                        const valLkr = Number(form.transport_cost) * usdRate;
                        setForm((p) => ({
                          ...p,
                          currency: "LKR",
                          transport_cost: valLkr.toFixed(2),
                        }));
                      } else {
                        setForm((p) => ({ ...p, currency: "LKR" }));
                      }
                    }}
                  >
                    LKR
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant={form.currency === "USD" ? "default" : "outline"}
                    onClick={() => {
                      if (
                        form.currency === "LKR" &&
                        form.transport_cost &&
                        usdRate > 0
                      ) {
                        const valUsd = Number(form.transport_cost) / usdRate;
                        setForm((p) => ({
                          ...p,
                          currency: "USD",
                          transport_cost: valUsd.toFixed(2),
                        }));
                      } else {
                        setForm((p) => ({ ...p, currency: "USD" }));
                      }
                    }}
                  >
                    USD
                  </Button>
                </div>
              </div>
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

        <DialogFooter className="sm:justify-end gap-2 border-t pt-4">
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Cancel
          </Button>

          <Button
            onClick={handleGenerate}
            disabled={loading}
            className="min-w-[160px]"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              "Generate Purchase Order"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
