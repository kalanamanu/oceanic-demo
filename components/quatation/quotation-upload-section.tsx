"use client";

import * as React from "react";
import { UploadCloud, FileSpreadsheet } from "lucide-react";

import { QuotationItemCard } from "./quotation-item-card";

import type { QuotationItem } from "@/types/quotation.types";

interface Props {
  uploading: boolean;

  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;

  items: QuotationItem[];

  expandedIndex: number | null;

  setExpandedIndex: (index: number | null) => void;

  updateItem: (index: number, field: string, value: string) => void;

  removeItem: (index: number) => void;

  vendors: any[];

  setActiveItemIndex: (index: number) => void;

  setTempVendorOpen: (open: boolean) => void;
}

export function QuotationUploadSection({
  uploading,
  handleFileUpload,
  items,
  expandedIndex,
  setExpandedIndex,
  updateItem,
  removeItem,
  vendors,
  setActiveItemIndex,
  setTempVendorOpen,
}: Props) {
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  const [dragActive, setDragActive] = React.useState(false);

  const [selectedFile, setSelectedFile] = React.useState<string>("");

  /* ================= HANDLE FILE ================= */

  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      setSelectedFile(file.name);
    }

    handleFileUpload(e);
  };

  /* ================= DRAG EVENTS ================= */

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    setDragActive(false);

    const file = e.dataTransfer.files?.[0];

    if (!file) return;

    setSelectedFile(file.name);

    const fakeEvent = {
      target: {
        files: e.dataTransfer.files,
      },
    } as React.ChangeEvent<HTMLInputElement>;

    handleFileUpload(fakeEvent);
  };

  return (
    <div className="space-y-8">
      {/* ================= UPLOAD BOX ================= */}

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`
          relative
          border-2
          border-dashed
          rounded-2xl
          p-10
          transition-all
          cursor-pointer
          text-center
          hover:border-primary
          hover:bg-muted/40

          ${
            dragActive
              ? "border-primary bg-primary/5 scale-[1.01]"
              : "border-muted-foreground/30"
          }
        `}
      >
        {/* Hidden Input */}
        <input
          ref={inputRef}
          type="file"
          accept=".xlsx,.xls"
          className="hidden"
          onChange={onFileSelect}
        />

        {/* Upload Content */}
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <UploadCloud className="w-8 h-8 text-primary" />
          </div>

          <div className="space-y-1">
            <h3 className="text-lg font-semibold">Upload Excel File</h3>

            <p className="text-sm text-muted-foreground">
              Drag & drop your quotation Excel file here or click to browse
            </p>

            <p className="text-xs text-muted-foreground">
              Supported formats: .xlsx, .xls
            </p>
          </div>

          {selectedFile && (
            <div className="mt-4 flex items-center gap-2 rounded-lg border bg-background px-4 py-2 text-sm">
              <FileSpreadsheet className="w-4 h-4 text-green-600" />

              <span className="font-medium">{selectedFile}</span>
            </div>
          )}

          {uploading && (
            <div className="pt-4">
              <div className="flex items-center gap-2 text-sm text-primary font-medium">
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                Validating Excel File...
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ================= ITEMS ================= */}

      {items.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Uploaded Items</h2>

            <div className="text-sm text-muted-foreground">
              {items.length} item(s) found
            </div>
          </div>

          {items.map((item, index) => (
            <QuotationItemCard
              key={index}
              item={item}
              index={index}
              expandedIndex={expandedIndex}
              setExpandedIndex={setExpandedIndex}
              updateItem={updateItem}
              removeItem={removeItem}
              vendors={vendors}
              setActiveItemIndex={setActiveItemIndex}
              setTempVendorOpen={setTempVendorOpen}
            />
          ))}
        </div>
      )}
    </div>
  );
}
