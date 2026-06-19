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

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { VendorService } from "@/services/vendor.service";
import { PreCostVendorService } from "@/services/precost-vendor.service";
import { BasisService } from "@/services/basis.service";

import { useDocumentEngine } from "@/hooks/use-document-job";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  document?: any;
}

type Currency = "LKR" | "USD";

export default function PurchaseOrderEditDialog({
  open,
  onOpenChange,
  document,
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
    ETA: "",
    date: new Date().toISOString().split("T")[0],
    transport_cost: "",
    currency: "LKR" as Currency,
    documentType: "pdf" as "pdf" | "excel",
  });

  /* ================= LOAD DATA ================= */
  React.useEffect(() => {
    if (!document?.document?.data) return;

    const data = document.document.data;

    setForm({
      reference_no: data.reference_no || "",
      company: data.company || "",
      ETA: data.ETA || "",
      date: data.date || new Date().toISOString().split("T")[0],

      transport_cost: String(data.transport_cost || 0),

      currency: (data.currency as Currency) || "LKR",

      documentType: "pdf",
    });

    setVendor({
      name: data.supplier || "",
    });

    setItems(
      (data.items || []).map((item: any) => ({
        item_name: item.item_name,
        remark: item.remark,
        quantity: item.quantity,
        unit: item.unit,
        unit_price: item.unit_price,
        total_price: item.total_price,
      })),
    );
  }, [document]);

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

  const transportCost = Number(form.transport_cost || 0);
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
        ETA: form.ETA,
        discount: 0,
        sub_total: Number(subTotal.toFixed(2)),
        full_total_cost: Number(fullTotal.toFixed(2)),
        transport_cost: transportCost,
        date: form.date,
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
        })),
      },
    };
  }, [form, vendor, items, subTotal, fullTotal, transportCost]);

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
          <DialogDescription>Edit and Regenerate the PO.</DialogDescription>
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
                  placeholder="e.g. PO-2024-001"
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

            {/* GRID 2: ETA & DATE */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground">
                  ETA
                </Label>
                <Input
                  type="date"
                  value={form.ETA}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, ETA: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground">
                  Document Date
                </Label>
                <Input
                  type="date"
                  value={form.date}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, date: e.target.value }))
                  }
                />
              </div>
            </div>

            {/* GRID 3: TRANSPORT & CURRENCY */}
            <div className="grid grid-cols-2 gap-4 pt-1">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground">
                  Transport Cost
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
                    onClick={() => setForm((p) => ({ ...p, currency: "LKR" }))}
                  >
                    LKR
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant={form.currency === "USD" ? "default" : "outline"}
                    onClick={() => setForm((p) => ({ ...p, currency: "USD" }))}
                  >
                    USD
                  </Button>
                </div>
              </div>
            </div>

            {/* DOCUMENT FORMAT */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground">
                Export Format
              </Label>
              <Select
                value={form.documentType}
                onValueChange={(v) =>
                  setForm((p) => ({ ...p, documentType: v as any }))
                }
              >
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Select Format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF Document</SelectItem>
                  <SelectItem value="excel">Excel Spreadsheet</SelectItem>
                </SelectContent>
              </Select>
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
