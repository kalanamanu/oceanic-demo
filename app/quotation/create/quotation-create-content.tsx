"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import * as XLSX from "xlsx";
import { Edit2, Trash2 } from "lucide-react";

const FIELDS = [
  "Item No (When search automatically suggest the item)",
  "Item  (When search automatically suggest the item)",
  "Customer remarks",
  "Quantity",
  "Unit",
  "Unit rate $",
  "Total USD",
  "OMS Remark",
];

// Dummy inquiry fetch
const getInquiryById = (id: string) => ({
  id,
  referenceNumber: "INQ-001",
  vesselName: "Demo Vessel",
  agent: "Demo Agent",
  port: "Demo Port",
  eta: new Date().toISOString(),
});

export function QuotationCreateContent() {
  const searchParams = useSearchParams();
  const inquiryId = searchParams.get("inquiryId");
  const inquiry = inquiryId ? getInquiryById(inquiryId) : null;

  const [step, setStep] = React.useState<null | "excel" | "manual">(null);

  /* ================= EXCEL STATES ================= */
  const [excelHeaders, setExcelHeaders] = React.useState<string[]>([]);
  const [excelRows, setExcelRows] = React.useState<any[][]>([]);
  const [mapping, setMapping] = React.useState<Record<string, string>>({});
  const [quotation, setQuotation] = React.useState<any[] | null>(null);
  const [fileError, setFileError] = React.useState<string | null>(null);

  /* ================= MANUAL STATES ================= */
  const [manualItems, setManualItems] = React.useState<any[]>([]);
  const [manualQuotation, setManualQuotation] = React.useState<any[] | null>(
    null,
  );

  /* ================= DIALOG STATES ================= */
  const emptyItem = Object.fromEntries(FIELDS.map((f) => [f, ""]));

  const [addDialogOpen, setAddDialogOpen] = React.useState(false);
  const [editDialogOpen, setEditDialogOpen] = React.useState(false);
  const [editIndex, setEditIndex] = React.useState<number | null>(null);

  const [addItemFields, setAddItemFields] = React.useState<any>(emptyItem);
  const [editItemFields, setEditItemFields] = React.useState<any>(emptyItem);

  /* ================= EXCEL HANDLERS ================= */
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const workbook = XLSX.read(evt.target?.result, { type: "binary" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows: any[] = XLSX.utils.sheet_to_json(sheet, { header: 1 });
      setExcelHeaders(rows[0] || []);
      setExcelRows(rows.slice(1));
      setMapping({});
      setQuotation(null);
      setFileError(null);
    };
    reader.onerror = () => setFileError("Failed to read file");
    reader.readAsBinaryString(file);
  };

  const handleGenerateExcel = (e: React.FormEvent) => {
    e.preventDefault();
    const mapped = excelRows.map((row) => {
      const obj: any = {};
      FIELDS.forEach((f) => {
        const idx = excelHeaders.indexOf(mapping[f]);
        obj[f] = idx >= 0 ? row[idx] : "";
      });
      return obj;
    });
    setQuotation(mapped);
  };

  /* ================= MANUAL HANDLERS ================= */
  const handleAddItemSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setManualItems((p) => [...p, { ...addItemFields }]);
    setAddDialogOpen(false);
  };

  const handleEditItemSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editIndex !== null) {
      setManualItems((p) => {
        const copy = [...p];
        copy[editIndex] = { ...editItemFields };
        return copy;
      });
    }
    setEditDialogOpen(false);
    setEditIndex(null);
  };

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-6xl mx-auto px-6 py-10 space-y-10">
        {/* ================= HEADER ================= */}
        <div className="space-y-4">
          <h1 className="text-2xl font-bold">Generate Quotation</h1>

          {inquiry && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 rounded-xl border bg-muted p-4 text-sm">
              <div>
                <b>Ref:</b> {inquiry.referenceNumber}
              </div>
              <div>
                <b>Vessel:</b> {inquiry.vesselName}
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

        {/* ================= STEP SELECTOR ================= */}
        {step === null && (
          <div className="rounded-xl border bg-card p-8 flex flex-col items-center gap-6">
            <p className="text-muted-foreground">
              Choose how you want to create your quotation
            </p>
            <div className="flex gap-4">
              <Button size="lg" onClick={() => setStep("excel")}>
                Upload from Excel
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => setStep("manual")}
              >
                Enter Manually
              </Button>
            </div>
          </div>
        )}

        {/* ================= EXCEL FLOW ================= */}
        {step === "excel" && (
          <form onSubmit={handleGenerateExcel} className="space-y-6">
            <div className="rounded-xl border bg-card p-6 space-y-4">
              <h3 className="font-semibold">Upload Excel</h3>
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileUpload}
              />
              {fileError && <p className="text-sm text-red-500">{fileError}</p>}
            </div>

            {excelHeaders.length > 0 && (
              <div className="rounded-xl border bg-card p-6 space-y-4">
                <h3 className="font-semibold">Map Columns</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {FIELDS.map((f) => (
                    <div key={f}>
                      <label className="text-xs font-medium">{f}</label>
                      <select
                        className="w-full border rounded px-2 py-1 text-sm"
                        value={mapping[f] || ""}
                        onChange={(e) =>
                          setMapping((p) => ({ ...p, [f]: e.target.value }))
                        }
                      >
                        <option value="">-- Select --</option>
                        {excelHeaders.map((h) => (
                          <option key={h}>{h}</option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>

                <div className="flex gap-3 pt-4">
                  <Button type="submit">Generate</Button>
                  <Button variant="outline" onClick={() => setStep(null)}>
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {quotation && (
              <div className="rounded-xl border bg-card p-6 space-y-4">
                <h3 className="font-semibold">Generated Quotation</h3>
                <div className="overflow-x-auto border rounded">
                  <table className="min-w-full text-xs">
                    <thead className="bg-muted">
                      <tr>
                        {FIELDS.map((f) => (
                          <th key={f} className="px-2 py-1 text-left">
                            {f}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {quotation.map((row, i) => (
                        <tr key={i} className="hover:bg-muted/50">
                          {FIELDS.map((f) => (
                            <td key={f} className="px-2 py-1">
                              {row[f]}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </form>
        )}

        {/* ================= MANUAL FLOW ================= */}
        {step === "manual" && (
          <div className="space-y-6">
            <div className="rounded-xl border bg-card p-6 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold">Items</h3>
                <Button
                  variant="outline"
                  onClick={() => {
                    setAddItemFields(emptyItem);
                    setAddDialogOpen(true);
                  }}
                >
                  + Add Item
                </Button>
              </div>

              {manualItems.length > 0 && (
                <div className="overflow-x-auto border rounded">
                  <table className="min-w-full text-xs">
                    <thead className="bg-muted">
                      <tr>
                        {FIELDS.map((f) => (
                          <th key={f} className="px-2 py-1 text-left">
                            {f}
                          </th>
                        ))}
                        <th className="px-2 py-1">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {manualItems.map((row, i) => (
                        <tr key={i} className="hover:bg-muted/50">
                          {FIELDS.map((f) => (
                            <td key={f} className="px-2 py-1">
                              {row[f]}
                            </td>
                          ))}
                          <td className="px-2 py-1 flex gap-2">
                            <button
                              type="button"
                              className="p-1 rounded hover:bg-muted"
                              title="Edit"
                              onClick={() => {
                                setEditIndex(i);
                                setEditItemFields(row);
                                setEditDialogOpen(true);
                              }}
                            >
                              <Edit2 className="w-4 h-4 text-primary" />
                            </button>
                            <button
                              type="button"
                              className="p-1 rounded hover:bg-muted"
                              title="Remove"
                              onClick={() =>
                                setManualItems((p) =>
                                  p.filter((_, idx) => idx !== i),
                                )
                              }
                            >
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <div className="flex gap-3">
                <Button onClick={() => setManualQuotation(manualItems)}>
                  Generate
                </Button>
                <Button variant="outline" onClick={() => setStep(null)}>
                  Cancel
                </Button>
              </div>
            </div>

            {manualQuotation && (
              <div className="rounded-xl border bg-card p-6 space-y-4">
                <h3 className="font-semibold">Generated Quotation</h3>
                <div className="overflow-x-auto border rounded">
                  <table className="min-w-full text-xs">
                    <thead className="bg-muted">
                      <tr>
                        {FIELDS.map((f) => (
                          <th key={f} className="px-2 py-1 text-left">
                            {f}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {manualQuotation.map((row, i) => (
                        <tr key={i}>
                          {FIELDS.map((f) => (
                            <td key={f} className="px-2 py-1">
                              {row[f]}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* ================= ADD DIALOG ================= */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Item</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddItemSubmit} className="space-y-4">
            {FIELDS.map((f) => (
              <div key={f}>
                <label className="text-sm font-medium">{f}</label>
                <input
                  className="w-full border rounded px-2 py-1"
                  value={addItemFields[f]}
                  onChange={(e) =>
                    setAddItemFields((p: any) => ({
                      ...p,
                      [f]: e.target.value,
                    }))
                  }
                />
              </div>
            ))}
            <DialogFooter>
              <Button type="submit">Add</Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setAddDialogOpen(false)}
              >
                Cancel
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ================= EDIT DIALOG ================= */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Item</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditItemSubmit} className="space-y-4">
            {FIELDS.map((f) => (
              <div key={f}>
                <label className="text-sm font-medium">{f}</label>
                <input
                  className="w-full border rounded px-2 py-1"
                  value={editItemFields[f]}
                  onChange={(e) =>
                    setEditItemFields((p: any) => ({
                      ...p,
                      [f]: e.target.value,
                    }))
                  }
                />
              </div>
            ))}
            <DialogFooter>
              <Button type="submit">Save</Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditDialogOpen(false)}
              >
                Cancel
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
