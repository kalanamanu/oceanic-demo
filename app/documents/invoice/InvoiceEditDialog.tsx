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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Loader2 } from "lucide-react";

import { useDocumentEngine } from "@/hooks/use-document-job";
import { DocumentService } from "@/services/document.service";
import { BasisService } from "@/services/basis.service";

import { SavedDocument } from "@/types/document.types";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  document: SavedDocument | null;
}

export function InvoiceEditDialog({ open, onOpenChange, document }: Props) {
  const { loading, runJob } = useDocumentEngine();

  const doc = document;
  const data = (doc as any)?.data;

  /* ================= USD RATE ================= */
  const [usdRate, setUsdRate] = React.useState(1);

  React.useEffect(() => {
    const load = async () => {
      try {
        const res = await BasisService.getActiveBasis();
        setUsdRate(res?.USDRate || 1);
      } catch (err) {
        console.error("Failed to load rate", err);
      }
    };
    load();
  }, []);

  /* ================= FORM ================= */
  const [form, setForm] = React.useState({
    reference_no: "",
    date: new Date().toISOString().split("T")[0],
    billToName: "",
    currency: "LKR" as "LKR" | "USD",
    documentType: "pdf" as "pdf" | "excel",
  });

  /* ================= LOAD EXISTING DATA ================= */
  React.useEffect(() => {
    if (doc) {
      setForm({
        reference_no: doc.reference_no || "",
        date: data?.date || new Date().toISOString().split("T")[0],
        billToName: data?.billToName || "",
        currency: "LKR",
        documentType: "pdf",
      });
    }
  }, [doc]);

  /* ================= CONVERT ================= */
  const convert = (value: number) =>
    form.currency === "USD" ? value / usdRate : value;

  /* ================= TOTAL ================= */
  const rawTotal = Number(data?.total_cost || 0);
  const grandTotal = convert(rawTotal);

  /* ================= PAYLOAD ================= */
  const buildPayload = () => ({
    document: "INVOICE",
    documentType: form.documentType,
    documentData: {
      reference_no: form.reference_no,
      date: form.date,
      billToName: form.billToName,

      discount: 0,
      additional_charges: 0,

      total_cost: Number(grandTotal.toFixed(2)),

      items: (data?.items || []).map((item: any) => ({
        item_name: item.item_name,
        quantity: item.quantity,

        // ✅ FIXED: same conversion logic as Create
        unit_price: Number(convert(item.unit_price).toFixed(2)),
        total_price: Number(convert(item.total_price).toFixed(2)),
      })),
    },
  });

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {
    try {
      const result = await runJob(buildPayload(), "Invoice");

      const documentId = result?.documentId;
      const fileName = result?.fileName || "invoice.pdf";

      if (!documentId) throw new Error("Missing documentId");

      const blob = await DocumentService.downloadDocument(documentId);

      const url = window.URL.createObjectURL(blob);

      window.open(url, "_blank");

      const a = window.document.createElement("a");
      a.href = url;
      a.download = fileName;
      window.document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(url);

      onOpenChange(false);
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  /* ================= UI ================= */
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        {/* HEADER */}
        <DialogHeader>
          <DialogTitle>Edit Invoice</DialogTitle>
          <DialogDescription>
            Modify invoice and regenerate document
          </DialogDescription>
        </DialogHeader>

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

          <Input
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
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

          {/* DOC TYPE */}
          <Select
            value={form.documentType}
            onValueChange={(v) => setForm({ ...form, documentType: v as any })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Document Type" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="pdf">PDF</SelectItem>
              <SelectItem value="excel">Excel</SelectItem>
            </SelectContent>
          </Select>
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
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>

          <Button onClick={handleSubmit} disabled={loading}>
            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {loading ? "Processing..." : "Edit and Regenerate"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
