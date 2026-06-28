"use client";

import QuotationItemsTableEdit from "./QuotationItemsTableEdit";

import type { QuotationItem } from "@/types/quotation.types";

interface Props {
  items: QuotationItem[];

  updateItem: (index: number, field: string, value: string) => void;

  removeItem: (index: number) => void;

  vendors: any[];

  setActiveItemIndex: (index: number) => void;

  setTempVendorOpen: (open: boolean) => void;
}

export function QuotationEditSection({
  items,
  updateItem,
  removeItem,
  vendors,
  setActiveItemIndex,
  setTempVendorOpen,
}: Props) {
  return (
    <div className="space-y-6">
      {/* SECTION HEADER */}
      <div className="space-y-1">
        <h2 className="text-lg font-semibold">Edit Pre Cost Items</h2>

        <p className="text-sm text-muted-foreground">
          Modify supplier, pricing, quantities, and remarks. Changes will be
          reflected in totals.
        </p>
      </div>

      {/* EDIT TABLE */}
      <QuotationItemsTableEdit
        items={items}
        updateItem={updateItem}
        removeItem={removeItem}
        vendors={vendors}
        setActiveItemIndex={setActiveItemIndex}
        setTempVendorOpen={setTempVendorOpen}
      />
    </div>
  );
}
