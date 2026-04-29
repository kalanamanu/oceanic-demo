"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Trash2 } from "lucide-react";
import { InquiryService } from "@/services/inquiry.service";
import { QuotationService } from "@/services/quotation.service";
import type { QuotationItem } from "@/types/quotation.types";

export function QuotationCreateContent() {
  const searchParams = useSearchParams();
  const inquiryId = searchParams.get("inquiryId");

  const [inquiry, setInquiry] = React.useState<any | null>(null);
  const [loadingInquiry, setLoadingInquiry] = React.useState(false);

  const [step, setStep] = React.useState<null | "excel">(null);
  const [items, setItems] = React.useState<QuotationItem[]>([]);
  const [expandedIndex, setExpandedIndex] = React.useState<number | null>(null);

  const [downloading, setDownloading] = React.useState(false);
  const [uploading, setUploading] = React.useState(false);

  /* ================= DOWNLOAD ================= */
  const handleDownloadTemplate = async () => {
    try {
      setDownloading(true);
      const blob = await QuotationService.downloadTemplate();

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "quotation-template.xlsx";
      a.click();

      window.URL.revokeObjectURL(url);
    } finally {
      setDownloading(false);
    }
  };

  /* ================= UPLOAD ================= */
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const validated = await QuotationService.validateExcel(file);
      setItems(validated);
    } finally {
      setUploading(false);
    }
  };

  /* ================= UPDATE ================= */
  const updateItem = (index: number, field: string, value: string) => {
    setItems((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };

      // auto calc
      const qty = Number(copy[index].quantity || 0);
      const price = Number(copy[index].price || 0);
      const unitRate = Number(copy[index].total_unit_rate_rs || 0);

      copy[index].total_usd = (qty * price).toString();
      copy[index].total_rs = (qty * unitRate).toString();

      return copy;
    });
  };

  /* ================= DELETE ================= */
  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  /* ================= FETCH ================= */
  React.useEffect(() => {
    if (!inquiryId) return;

    const fetchInquiry = async () => {
      setLoadingInquiry(true);
      try {
        const data = await InquiryService.getInquiryById(inquiryId);
        setInquiry(data);
      } finally {
        setLoadingInquiry(false);
      }
    };

    fetchInquiry();
  }, [inquiryId]);

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-6xl mx-auto px-6 py-10 space-y-10">
        {/* HEADER */}
        <div className="space-y-4">
          <h1 className="text-2xl font-bold">Generate Quotation</h1>

          {inquiry && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 border p-4 rounded text-sm">
              <div>
                <b>Ref:</b> {inquiry.inq_id}
              </div>
              <div>
                <b>Vessel:</b> {inquiry.vessel_name}
              </div>
              <div>
                <b>Agent:</b> {inquiry.agent}
              </div>
              <div>
                <b>Port:</b> {inquiry.port}
              </div>
              <div>
                <b>ETA:</b> {new Date(inquiry.eta).toLocaleString()}
              </div>
            </div>
          )}
        </div>

        <Separator />

        {/* STEP */}
        {step === null && (
          <div className="border p-8 text-center rounded space-y-4">
            <p>Download → Fill → Upload</p>
            <div className="flex justify-center gap-4">
              <Button onClick={() => setStep("excel")}>Upload Excel</Button>
              <Button
                variant="outline"
                onClick={handleDownloadTemplate}
                disabled={downloading}
              >
                {downloading ? "Downloading..." : "Download Template"}
              </Button>
            </div>
          </div>
        )}

        {/* UPLOAD */}
        {step === "excel" && (
          <div className="space-y-6">
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileUpload}
            />

            {uploading && <p>Validating...</p>}

            {/* CARDS */}
            {items.map((item, index) => (
              <div key={index} className="border rounded p-4 space-y-3">
                {/* COLLAPSED */}
                <div className="flex justify-between items-center">
                  <div className="grid grid-cols-2 md:grid-cols-6 gap-2 text-sm">
                    <div>
                      <b>Item:</b> {item.item_no}
                    </div>
                    <div>
                      <b>Description:</b> {item.description}
                    </div>
                    <div>
                      <b>Remark:</b> {item.customer_remark}
                    </div>
                    <div>
                      <b>Qty:</b> {item.quantity}
                    </div>
                    <div>
                      <b>Unit:</b> {item.unit}
                    </div>
                    <div>
                      <b>IMPA:</b> {item.impa_code}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        setExpandedIndex(expandedIndex === index ? null : index)
                      }
                    >
                      {expandedIndex === index ? "Close" : "Edit"}
                    </Button>

                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => removeItem(index)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* EXPANDED */}
                {expandedIndex === index && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4">
                    {/* Editable ALL fields */}
                    {[
                      ["Item Number", "item_no"],
                      ["Description", "description"],
                      ["Customer Remark", "customer_remark"],
                      ["Quantity", "quantity"],
                      ["Unit", "unit"],
                      ["IMPA Code", "impa_code"],
                      ["Supplier Name", "supplier_name"],
                      ["Unit Rate (RS)", "price"],
                      ["Additional Charges", "additional_charges"],
                      ["Total Unit Rate (RS)", "total_unit_rate_rs"],
                      ["CONVA (Basis)", "conva_basis"],
                      ["OMS Remark", "osc_remark"],
                    ].map(([label, field]) => (
                      <div key={field}>
                        <label className="text-xs">{label}</label>
                        <input
                          className="w-full border p-1 rounded"
                          value={(item as any)[field] || ""}
                          onChange={(e) =>
                            updateItem(index, field, e.target.value)
                          }
                        />
                      </div>
                    ))}

                    {/* AUTO */}
                    <div>
                      <label>Total USD</label>
                      <input
                        className="w-full border p-1"
                        value={item.total_usd}
                        readOnly
                      />
                    </div>

                    <div>
                      <label>Total RS</label>
                      <input
                        className="w-full border p-1"
                        value={item.total_rs}
                        readOnly
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
