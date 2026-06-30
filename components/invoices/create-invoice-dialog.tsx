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
import { DatePicker } from "@/components/ui/date-picker";
import { DocumentService } from "@/services/document.service";

import { Loader2 } from "lucide-react";
import { BasisService } from "@/services/basis.service";

// NEW ENGINE HOOK
import { useDocumentEngine } from "@/hooks/use-document-job";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: any;
}

export function InvoiceDialog({ open, onOpenChange, data }: Props) {
  const { loading, runJob, saveDraft } = useDocumentEngine();

  const [usdRate, setUsdRate] = React.useState(1);

  const [form, setForm] = React.useState({
    reference_no: "",
    date: new Date(), // Storing as a true Date object for the DatePicker
    billToName: "",
    currency: "LKR" as "LKR" | "USD",
    documentType: "pdf" as const, // Locked to PDF
  });

  /* ================= LOAD RATE ================= */
  React.useEffect(() => {
    if (!open) return;

    const load = async () => {
      try {
        const [usdRateData, referenceData] = await Promise.all([
          BasisService.getLatestUSDRate(),
          // Cast to any to satisfy DocumentService typing for DocumentType
          DocumentService.getReferenceNumber("INVOICE" as any),
        ]);

        setUsdRate(usdRateData.USDRate);

        setForm((prev) => ({
          ...prev,
          reference_no: referenceData.reference_no,
        }));
      } catch (error) {
        console.error(error);
      }
    };

    load();
  }, [open]);

  /* ================= CONVERT ================= */
  const convert = (value: number) =>
    form.currency === "USD" ? value / usdRate : value;

  /* ================= TOTAL ================= */
  const rawTotal = Number(data?.confirmed_total_lkr || 0);
  const grandTotal = convert(rawTotal);

  /* ================= PAYLOAD ================= */
  const buildPayload = () => ({
    document: "INVOICE",
    documentType: form.documentType,
    documentData: {
      reference_no: form.reference_no,
      invoiceNumber: form.reference_no, // ✅ ADD THIS LINE

      date: form.date.toISOString().split("T")[0],
      billToName: form.billToName,

      discount: 0,
      additional_charges: 0,

      total_cost: Number(grandTotal.toFixed(2)),

      items: (data?.confirmedItems || []).map((item: any) => ({
        item_name: item.item_name,
        quantity: item.quantity,
        unit_price: Number(convert(item.unit_price).toFixed(2)),
        total_price: Number(convert(item.total_price).toFixed(2)),
      })),
    },
  });

  /* ================= CLOSE (AUTO DRAFT) ================= */
  const handleOpenChange = async (state: boolean) => {
    if (!state) {
      try {
        await saveDraft(buildPayload());
      } catch (e) {
        console.error("Draft failed");
      }
    }

    onOpenChange(state);
  };

  /* ================= CREATE ================= */
  const handleCreate = async () => {
    try {
      await runJob(buildPayload(), "Invoice");
      onOpenChange(false);
    } catch (err) {
      // handled inside engine
    }
  };

  /* ================= UI ================= */
  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Create Invoice</DialogTitle>
          <DialogDescription>Auto-saves draft when closed</DialogDescription>
        </DialogHeader>

        {/* RATE */}
        <div className="text-xs text-muted-foreground">
          1 USD = {usdRate} LKR
        </div>

        {/* FORM */}
        <div className="space-y-3 mt-3">
          <Input
            placeholder="Reference No"
            value={form.reference_no}
            onChange={(e) => setForm({ ...form, reference_no: e.target.value })}
          />

          {/* CUSTOM DATE PICKER */}
          <DatePicker
            date={form.date}
            onDateChange={(newDate) => {
              if (newDate) setForm({ ...form, date: newDate });
            }}
          />

          <Input
            placeholder="Bill To"
            value={form.billToName}
            onChange={(e) => setForm({ ...form, billToName: e.target.value })}
          />

          {/* CURRENCY */}
          <div className="flex gap-2">
            <Button
              variant={form.currency === "USD" ? "default" : "outline"}
              onClick={() => setForm({ ...form, currency: "USD" })}
            >
              USD
            </Button>

            <Button
              variant={form.currency === "LKR" ? "default" : "outline"}
              onClick={() => setForm({ ...form, currency: "LKR" })}
            >
              LKR
            </Button>
          </div>
        </div>

        {/* SUMMARY */}
        <div className="border rounded-lg p-3 mt-3 text-sm space-y-1">
          <div>
            Base Total: {convert(rawTotal).toFixed(2)} {form.currency}
          </div>

          <div className="text-muted-foreground">Discount: 0 (disabled)</div>

          <div className="text-muted-foreground">Additional: 0 (disabled)</div>

          <div className="font-bold border-t pt-2">
            Grand Total: {grandTotal.toFixed(2)} {form.currency}
          </div>
        </div>

        {/* FOOTER */}
        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Cancel
          </Button>

          <Button onClick={handleCreate} disabled={loading}>
            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {loading ? "Creating..." : "Create Invoice"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
