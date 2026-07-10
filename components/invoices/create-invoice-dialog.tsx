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
import { Checkbox } from "@/components/ui/checkbox"; // ✅ NEW
import { Label } from "@/components/ui/label"; // ✅ NEW

import { DocumentService } from "@/services/document.service";
import { Loader2 } from "lucide-react";
import { BasisService } from "@/services/basis.service";
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
    jobReference: "",
    poNumber: "",

    date: new Date(),
    supplyDate: new Date(),

    pageLabel: "Page 01 of 01",

    billToName: "",
    billToAddress: "",

    vesselName: "",
    purposeOfCall: "",

    grt: "",
    imoNumber: "",
    portCountry: "",

    paymentTerms: "Payment due within 30 days",
    notes: "",

    currency: "LKR" as "LKR" | "USD",
    documentType: "pdf" as const,

    showDiscount: true, // ✅ NEW FLAG
  });

  /* ================= LOAD RATE + REF ================= */
  React.useEffect(() => {
    if (!open) return;

    const load = async () => {
      try {
        const [usdRateData, referenceData] = await Promise.all([
          BasisService.getLatestUSDRate(),
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
  const buildPayload = () => {
    const subtotal = Number(grandTotal.toFixed(2));

    const items = (data?.confirmedItems || [])
      .filter((item: any) => !item.is_removed)
      .map((item: any) => ({
        description: item.item_name,
        remarks: item.customer_remark || "",

        quantity: item.quantity,
        unit: item.unit,

        unit_price: Number(convert(item.unit_price).toFixed(2)),

        // ✅ include only if checkbox enabled
        ...(form.showDiscount && {
          discount: Number(item.discount || 0),
        }),
      }));

    const totalDiscount = form.showDiscount
      ? (data?.confirmedItems || [])
          .filter((item: any) => !item.is_removed)
          .reduce(
            (sum: number, item: any) => sum + Number(item.discount || 0),
            0,
          )
      : 0;

    return {
      document: "INVOICE",
      documentType: form.documentType,
      documentData: {
        reference_no: form.reference_no,
        invoiceNumber: form.reference_no,

        jobReference: form.jobReference,
        poNumber: form.poNumber,

        date: form.date.toLocaleDateString("en-GB"),
        pageLabel: form.pageLabel,

        billToName: form.billToName,
        billToAddress: form.billToAddress,

        vesselName: form.vesselName,
        purposeOfCall: form.purposeOfCall,

        supplyDate: form.supplyDate.toLocaleDateString("en-GB"),

        grt: form.grt,
        imoNumber: form.imoNumber,
        portCountry: form.portCountry,

        items,

        subtotal,
        tax: 0,

        // ✅ only include if enabled
        ...(form.showDiscount && {
          discount: totalDiscount,
        }),

        total: subtotal, // can upgrade later

        paymentTerms: form.paymentTerms,
        notes: form.notes,
      },
    };
  };

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
    } catch (err) {}
  };

  /* ================= UI ================= */
  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Invoice</DialogTitle>
          <DialogDescription>Auto-saves draft when closed</DialogDescription>
        </DialogHeader>

        <div className="text-xs text-muted-foreground">
          1 USD = {usdRate} LKR
        </div>

        <div className="space-y-3 mt-3">
          <Input
            placeholder="Reference No"
            value={form.reference_no}
            onChange={(e) => setForm({ ...form, reference_no: e.target.value })}
          />

          <Input
            placeholder="Job Reference"
            value={form.jobReference}
            onChange={(e) => setForm({ ...form, jobReference: e.target.value })}
          />

          <Input
            placeholder="PO Number"
            value={form.poNumber}
            onChange={(e) => setForm({ ...form, poNumber: e.target.value })}
          />

          <DatePicker
            date={form.date}
            onDateChange={(d) => d && setForm({ ...form, date: d })}
          />

          <Input
            placeholder="Bill To Name"
            value={form.billToName}
            onChange={(e) => setForm({ ...form, billToName: e.target.value })}
          />

          <Input
            placeholder="Bill To Address"
            value={form.billToAddress}
            onChange={(e) =>
              setForm({ ...form, billToAddress: e.target.value })
            }
          />

          <Input
            placeholder="Vessel Name"
            value={form.vesselName}
            onChange={(e) => setForm({ ...form, vesselName: e.target.value })}
          />

          <Input
            placeholder="Purpose of Call"
            value={form.purposeOfCall}
            onChange={(e) =>
              setForm({ ...form, purposeOfCall: e.target.value })
            }
          />

          <DatePicker
            date={form.supplyDate}
            onDateChange={(d) => d && setForm({ ...form, supplyDate: d })}
          />

          <Input
            placeholder="GRT"
            value={form.grt}
            onChange={(e) => setForm({ ...form, grt: e.target.value })}
          />

          <Input
            placeholder="IMO Number"
            value={form.imoNumber}
            onChange={(e) => setForm({ ...form, imoNumber: e.target.value })}
          />

          <Input
            placeholder="Port / Country"
            value={form.portCountry}
            onChange={(e) => setForm({ ...form, portCountry: e.target.value })}
          />

          {/* ✅ CHECKBOX */}
          <div className="flex items-center space-x-2 pt-2">
            <Checkbox
              checked={form.showDiscount}
              onCheckedChange={(val) =>
                setForm({ ...form, showDiscount: !!val })
              }
            />
            <Label>Show Discount in Invoice</Label>
          </div>

          <Input
            placeholder="Payment Terms"
            value={form.paymentTerms}
            onChange={(e) => setForm({ ...form, paymentTerms: e.target.value })}
          />

          <Input
            placeholder="Notes"
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
          />

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

        {/* ================= TOTAL PANEL ================= */}
        <div className="border rounded-lg p-3 mt-3 text-sm space-y-1">
          <div>
            Base Total: {convert(rawTotal).toFixed(2)} {form.currency}
          </div>

          {form.showDiscount && (
            <div>Discount: {buildPayload().documentData.discount}</div>
          )}

          <div className="text-muted-foreground">Tax: 0</div>

          <div className="font-bold border-t pt-2">
            Grand Total: {grandTotal.toFixed(2)} {form.currency}
          </div>
        </div>

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
