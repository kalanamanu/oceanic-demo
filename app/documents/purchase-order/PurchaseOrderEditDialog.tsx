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

import { DocumentService } from "@/services/document.service";
import { BasisService } from "@/services/basis.service";
import { useDocumentEngine } from "@/hooks/use-document-job";

interface Props {
  docId: string;
  open: boolean;
  onClose: () => void;
}

type Currency = "LKR" | "USD";

export default function EditPODialog({ docId, open, onClose }: Props) {
  const { loading, runJob, autoSave } = useDocumentEngine({
    pollInterval: 2000,
    maxAttempts: 10,
  });

  const [usdRate, setUsdRate] = React.useState(1);
  const [items, setItems] = React.useState<any[]>([]);

  const [form, setForm] = React.useState({
    reference_no: "",
    company: "",
    supplier: "",
    ETA: undefined as Date | undefined, // Handles Date + Time object
    date: new Date(), // Handles Date only object
    transport_cost: "",
    currency: "LKR" as Currency,
    documentType: "pdf" as const, // Locked strictly to PDF format
  });

  /* ================= LOAD DATA & COERCE RATES ================= */
  React.useEffect(() => {
    if (!open || !docId) return;

    const load = async () => {
      try {
        const [docRes, usdRateRes] = await Promise.all([
          DocumentService.getDocument(docId),
          BasisService.getLatestUSDRate(), // ✅ correct API
        ]);

        const activeUsdRate = usdRateRes?.USDRate || 1;
        setUsdRate(activeUsdRate);

        const docWrapper = docRes.document;
        const d = docWrapper?.data || {};
        const savedCurrency = (d.currency as Currency) || "LKR";

        // Safely parse timestamps into JS Date objects
        const incomingEta = d.ETA ? new Date(d.ETA) : undefined;
        const incomingDate = d.date ? new Date(d.date) : new Date();

        setForm({
          reference_no: d.reference_no || "",
          company: d.company || "",
          supplier: d.supplier || "",
          ETA:
            incomingEta && !isNaN(incomingEta.getTime())
              ? incomingEta
              : undefined,
          date:
            incomingDate && !isNaN(incomingDate.getTime())
              ? incomingDate
              : new Date(),
          transport_cost: d.transport_cost?.toString() || "",
          currency: savedCurrency,
          documentType: "pdf",
        });

        // Parse items back into predictable LKR vs USD properties for clean runtime toggling
        const parsedItems = (d.items || []).map((item: any) => {
          let uPriceLkr = Number(item.unit_price || 0);
          let tPriceLkr = Number(item.total_price || 0);
          let uPriceUsd = Number(item.unit_rate_usd || 0);
          let tPriceUsd = Number(item.total_price_usd || 0);

          // If fallback fields are missing from historical documents, back-calculate using active rate
          if (savedCurrency === "LKR" && !tPriceUsd) {
            uPriceUsd = uPriceLkr / activeUsdRate;
            tPriceUsd = tPriceLkr / activeUsdRate;
          } else if (savedCurrency === "USD" && !tPriceLkr) {
            uPriceLkr = uPriceUsd * activeUsdRate;
            tPriceLkr = tPriceUsd * activeUsdRate;
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
        toast.error("Failed to load PO data");
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
        supplier: form.supplier,
        ETA: form.ETA ? form.ETA.toISOString() : "", // Full timestamp for ETA
        discount: 0,
        sub_total: Number(subTotal.toFixed(2)),
        full_total_cost: Number(fullTotal.toFixed(2)),
        transport_cost: transportCost,
        date: form.date.toISOString().split("T")[0], // Date fragment only
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

  /* ================= DRAFT ON CLOSE ================= */

  const handleOpenChange = async (state: boolean) => {
    if (!state) {
      await autoSave(buildPayload());
      onClose();
    }
  };

  /* ================= GENERATE ================= */

  const handleGenerate = async () => {
    try {
      await runJob(buildPayload(), "Purchase Order");
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-xl p-6 gap-6">
        <DialogHeader className="space-y-1">
          <DialogTitle className="text-xl">Edit Purchase Order</DialogTitle>
          <DialogDescription>
            Edit and Regenerate the Purchase Order Document.
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
                  placeholder="e.g. PO-2026-001"
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
              <Input value={form.supplier} disabled className="bg-muted/30" />
            </div>

            {/* GRID 2: ETA (DATE & TIME) & DOCUMENT DATE (DATE ONLY) */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground">
                  ETA (Date & Time)
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
              "Edit and Regenerate"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
