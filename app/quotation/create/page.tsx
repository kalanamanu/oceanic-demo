"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import * as XLSX from "xlsx";

const FIELDS = [
  "Item No",
  "Item",
  "Customer remarks",
  "Quantity",
  "Unit",
  "Unit rate $",
  "Total USD",
  "OMS Remark",
];

export default function QuotationCreatePage() {
  const router = useRouter();
  const [excelHeaders, setExcelHeaders] = React.useState<string[]>([]);
  const [excelRows, setExcelRows] = React.useState<any[][]>([]);
  const [mapping, setMapping] = React.useState<{ [key: string]: string }>({});
  const [fileError, setFileError] = React.useState<string | null>(null);
  const [quotation, setQuotation] = React.useState<any[] | null>(null);

  // Handle Excel upload and parse
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = evt.target?.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const rows: any[] = XLSX.utils.sheet_to_json(sheet, { header: 1 });
      // Get headers from the first row
      const headers = (rows[0] as string[]) || [];
      setExcelHeaders(headers);
      // Data rows (skip header row)
      setExcelRows(rows.slice(1));
      // Reset mapping and quotation
      setMapping({});
      setQuotation(null);
      setFileError(null);
    };
    reader.onerror = () => setFileError("Failed to read file");
    reader.readAsBinaryString(file);
  };

  // Handle mapping change
  const handleMappingChange = (field: string, excelField: string) => {
    setMapping((prev) => ({
      ...prev,
      [field]: excelField,
    }));
  };

  // Generate and display quotation (for demo)
  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    // Map excelRows to system fields using mapping
    const mapped = excelRows.map((row) => {
      const obj: any = {};
      FIELDS.forEach((field) => {
        const excelField = mapping[field];
        if (excelField) {
          const idx = excelHeaders.indexOf(excelField);
          obj[field] = idx !== -1 ? row[idx] : "";
        } else {
          obj[field] = "";
        }
      });
      return obj;
    });
    setQuotation(mapped);
  };

  return (
    <div className="max-w-4xl mx-auto p-8 rounded-xl shadow-lg bg-white mt-8">
      <h1 className="text-2xl font-bold mb-2">Generate Quotation</h1>
      <p className="mb-4 text-muted-foreground">
        Upload an Excel file, map columns, and generate a quotation.
      </p>
      <Separator />
      <form onSubmit={handleGenerate} className="space-y-5 mt-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Upload Excel (.xlsx)
          </label>
          <input type="file" accept=".xlsx,.xls" onChange={handleFileUpload} />
          {fileError && (
            <div className="text-red-500 text-sm mt-2">{fileError}</div>
          )}
        </div>
        {/* Mapping UI */}
        {excelHeaders.length > 0 && (
          <div className="mt-6">
            <h3 className="font-semibold mb-2">Map Excel Columns</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {FIELDS.map((field) => (
                <div key={field}>
                  <label className="block text-sm font-medium mb-1">
                    {field}
                  </label>
                  <select
                    className="w-full border rounded px-2 py-1"
                    value={mapping[field] || ""}
                    onChange={(e) => handleMappingChange(field, e.target.value)}
                  >
                    <option value="">-- Select Excel Column --</option>
                    {excelHeaders.map((header) => (
                      <option key={header} value={header}>
                        {header}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>
        )}
        {excelHeaders.length > 0 && (
          <div className="mt-6 flex gap-3">
            <Button type="submit">Generate Quotation</Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
          </div>
        )}
      </form>
      {/* DEMO: Show generated quotation below */}
      {quotation && (
        <div className="mt-8 border-t pt-6">
          <h2 className="text-lg font-bold mb-4">Generated Quotation</h2>
          <table className="w-full border text-sm">
            <thead>
              <tr>
                {FIELDS.map((field) => (
                  <th key={field} className="border px-2 py-1 bg-muted">
                    {field}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {quotation.map((item, idx) => (
                <tr key={idx}>
                  {FIELDS.map((field) => (
                    <td key={field} className="border px-2 py-1">
                      {item[field]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
