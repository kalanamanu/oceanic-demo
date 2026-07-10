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
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

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

    showDiscount: true,
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
        ...(form.showDiscount && {
          discount: totalDiscount,
        }),
        total: subtotal,
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
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto p-6">
        <DialogHeader className="border-b pb-4">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl font-bold">
                Create Invoice
              </DialogTitle>
              <DialogDescription className="text-sm mt-1">
                Auto-saves draft when closed
              </DialogDescription>
            </div>
            <div className="text-xs bg-muted border px-2.5 py-1 rounded-md font-medium text-muted-foreground">
              Exchange Rate: 1 USD = {usdRate} LKR
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Section: References */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Invoice References
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="reference_no" className="text-xs font-medium">
                  Reference No
                </Label>
                <Input
                  id="reference_no"
                  placeholder="e.g. INV-2026-001"
                  value={form.reference_no}
                  onChange={(e) =>
                    setForm({ ...form, reference_no: e.target.value })
                  }
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="jobReference" className="text-xs font-medium">
                  Job Reference
                </Label>
                <Input
                  id="jobReference"
                  placeholder="e.g. JOB-992"
                  value={form.jobReference}
                  onChange={(e) =>
                    setForm({ ...form, jobReference: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="poNumber" className="text-xs font-medium">
                  PO Number
                </Label>
                <Input
                  id="poNumber"
                  placeholder="e.g. PO-8812"
                  value={form.poNumber}
                  onChange={(e) =>
                    setForm({ ...form, poNumber: e.target.value })
                  }
                />
              </div>
              <div className="space-y-1.5 flex flex-col justify-end">
                <Label className="text-xs font-medium mb-1.5">
                  Invoice Date
                </Label>
                <DatePicker
                  date={form.date}
                  onDateChange={(d) => d && setForm({ ...form, date: d })}
                />
              </div>
            </div>
          </div>

          {/* Section: Billing Details */}
          <div className="space-y-3 border-t pt-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Billing Details
            </h3>
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="billToName" className="text-xs font-medium">
                  Bill To Name
                </Label>
                <Input
                  id="billToName"
                  placeholder="Client or Company Name"
                  value={form.billToName}
                  onChange={(e) =>
                    setForm({ ...form, billToName: e.target.value })
                  }
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="billToAddress" className="text-xs font-medium">
                  Bill To Address
                </Label>
                <Input
                  id="billToAddress"
                  placeholder="Full Billing Address"
                  value={form.billToAddress}
                  onChange={(e) =>
                    setForm({ ...form, billToAddress: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          {/* Section: Vessel & Port Details */}
          <div className="space-y-3 border-t pt-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Vessel & Port Details
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="vesselName" className="text-xs font-medium">
                  Vessel Name
                </Label>
                <Input
                  id="vesselName"
                  placeholder="Name of vessel"
                  value={form.vesselName}
                  onChange={(e) =>
                    setForm({ ...form, vesselName: e.target.value })
                  }
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="purposeOfCall" className="text-xs font-medium">
                  Purpose of Call
                </Label>
                <Input
                  id="purposeOfCall"
                  placeholder="e.g. Bunkering, Crew Change"
                  value={form.purposeOfCall}
                  onChange={(e) =>
                    setForm({ ...form, purposeOfCall: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5 flex flex-col justify-end">
                <Label className="text-xs font-medium mb-1.5">
                  Supply Date
                </Label>
                <DatePicker
                  date={form.supplyDate}
                  onDateChange={(d) => d && setForm({ ...form, supplyDate: d })}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="grt" className="text-xs font-medium">
                  Gross Registered Tonnage (GRT)
                </Label>
                <Input
                  id="grt"
                  placeholder="GRT value"
                  value={form.grt}
                  onChange={(e) => setForm({ ...form, grt: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="imoNumber" className="text-xs font-medium">
                  IMO Number
                </Label>
                <Input
                  id="imoNumber"
                  placeholder="7-digit number"
                  value={form.imoNumber}
                  onChange={(e) =>
                    setForm({ ...form, imoNumber: e.target.value })
                  }
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="portCountry" className="text-xs font-medium">
                  Port / Country
                </Label>
                <Input
                  id="portCountry"
                  placeholder="Port name, Country"
                  value={form.portCountry}
                  onChange={(e) =>
                    setForm({ ...form, portCountry: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          {/* Section: Terms & Preferences */}
          <div className="space-y-3 border-t pt-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Terms & Settings
            </h3>
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="paymentTerms" className="text-xs font-medium">
                  Payment Terms
                </Label>
                <Input
                  id="paymentTerms"
                  placeholder="Terms layout"
                  value={form.paymentTerms}
                  onChange={(e) =>
                    setForm({ ...form, paymentTerms: e.target.value })
                  }
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="notes" className="text-xs font-medium">
                  Notes / Remarks
                </Label>
                <Input
                  id="notes"
                  placeholder="Additional terms or details"
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="showDiscount"
                    checked={form.showDiscount}
                    onCheckedChange={(val) =>
                      setForm({ ...form, showDiscount: !!val })
                    }
                  />
                  <Label
                    htmlFor="showDiscount"
                    className="text-sm font-medium cursor-pointer"
                  >
                    Show Discount breakdown line items
                  </Label>
                </div>

                <div className="flex gap-1 bg-muted p-1 rounded-md border">
                  <Button
                    type="button"
                    size="sm"
                    variant={form.currency === "USD" ? "secondary" : "ghost"}
                    className="h-7 text-xs px-3 font-semibold"
                    onClick={() => setForm({ ...form, currency: "USD" })}
                  >
                    USD
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant={form.currency === "LKR" ? "secondary" : "ghost"}
                    className="h-7 text-xs px-3 font-semibold"
                    onClick={() => setForm({ ...form, currency: "LKR" })}
                  >
                    LKR
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================= TOTAL PANEL ================= */}
        <div className="bg-muted/50 border rounded-xl p-4 text-sm space-y-2 mt-2">
          <div className="flex justify-between text-muted-foreground">
            <span>Base Total:</span>
            <span className="font-medium text-foreground">
              {convert(rawTotal).toFixed(2)} {form.currency}
            </span>
          </div>

          {form.showDiscount && (
            <div className="flex justify-between text-muted-foreground">
              <span>Total Discount:</span>
              <span className="font-medium text-emerald-600">
                -{buildPayload().documentData.discount.toFixed(2)}{" "}
                {form.currency}
              </span>
            </div>
          )}

          <div className="flex justify-between text-muted-foreground">
            <span>Tax:</span>
            <span>0.00 {form.currency}</span>
          </div>

          <div className="flex justify-between font-semibold border-t pt-2.5 text-base">
            <span>Grand Total:</span>
            <span className="text-foreground">
              {grandTotal.toFixed(2)} {form.currency}
            </span>
          </div>
        </div>

        <DialogFooter className="border-t pt-4 gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Cancel
          </Button>

          <Button onClick={handleCreate} disabled={loading} className="px-5">
            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {loading ? "Creating..." : "Create Invoice"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
