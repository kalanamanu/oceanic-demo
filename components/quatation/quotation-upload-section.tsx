"use client";

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
  return (
    <div className="space-y-6">
      <input type="file" accept=".xlsx,.xls" onChange={handleFileUpload} />

      {uploading && <p>Validating...</p>}

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
  );
}
