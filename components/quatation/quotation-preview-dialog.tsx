"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { QuotationItem } from "@/types/quotation.types";

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;

  inquiry: any;
  items: QuotationItem[];

  additionalCharges: {
    name: string;
    amount: string;
    currency: string;
  }[];

  discountLKR: string;
  totalLKR: number;
  totalUSD: number;
  basis: any;

  dateArrived?: Date;
  dateSailed?: Date;
  remark: string;
}

export function QuotationPreviewDialog({
  open,
  onClose,
  onConfirm,
  inquiry,
  items,
  additionalCharges,
  discountLKR,
  totalLKR,
  totalUSD,
  basis,
  dateArrived,
  dateSailed,
  remark,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto p-0">
        {/* Sticky header */}
        <div className="sticky top-0 z-10 bg-background px-6 pt-6 pb-4 border-b">
          <DialogHeader>
            <DialogTitle className="text-xl">Quotation Preview</DialogTitle>
          </DialogHeader>
        </div>

        <div className="px-6 pb-6 space-y-6">
          {/* ---- CORE INFORMATION ---- */}
          <section className="rounded-lg border bg-muted/30 p-5">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-4 text-sm">
              <InfoField label="Ref" value={inquiry?.inq_id} />
              <InfoField label="Vessel" value={inquiry?.vessel_name} />
              <InfoField label="Status" value="Pending" />

              <InfoField
                label="Date Arrived"
                value={dateArrived?.toLocaleDateString()}
              />
              <InfoField
                label="Date Sailed"
                value={dateSailed?.toLocaleDateString()}
              />
              <InfoField label="USD Rate" value={basis?.USDRate} />

              <InfoField label="Discount (LKR)" value={discountLKR} />
              <InfoField
                label="Total LKR"
                value={totalLKR.toLocaleString()}
                highlight
              />
              <InfoField
                label="Total USD"
                value={totalUSD.toFixed(2)}
                highlight
              />
            </div>
          </section>

          <Separator />

          {/* ---- ADDITIONAL CHARGES ---- */}
          <section>
            <h3 className="text-sm font-semibold mb-3">Additional Charges</h3>

            {additionalCharges.length === 0 ? (
              <p className="text-sm text-muted-foreground">No charges</p>
            ) : (
              <div className="rounded-md border overflow-hidden">
                <div className="grid grid-cols-2 bg-muted/50 px-4 py-2 text-xs font-medium text-muted-foreground">
                  <span>Charge Name</span>
                  <span className="text-right">Amount</span>
                </div>
                {additionalCharges.map((c, i) => (
                  <div
                    key={i}
                    className="grid grid-cols-2 px-4 py-2 text-sm border-t even:bg-muted/10"
                  >
                    <span>{c.name}</span>
                    <span className="text-right">
                      {c.amount} {c.currency}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>

          <Separator />

          {/* ---- ITEMS TABLE (fixed 6 columns) ---- */}
          <section>
            <h3 className="text-sm font-semibold mb-3">Items</h3>

            <div className="rounded-md border overflow-hidden">
              {/* Header */}
              <div className="grid grid-cols-6 gap-2 bg-muted/50 px-4 py-2 text-xs font-medium text-muted-foreground">
                <span>Item No</span>
                <span>Description</span>
                <span>Qty</span>
                <span>Unit</span>
                <span>RS</span>
                <span>USD</span>
              </div>

              {/* Rows */}
              {items.map((item, i) => (
                <div
                  key={i}
                  className="grid grid-cols-6 gap-2 px-4 py-2.5 text-xs border-t even:bg-muted/10"
                >
                  <span>{item.item_no}</span>
                  <span className="truncate">{item.description}</span>
                  <span>{item.quantity}</span>
                  <span>{item.unit}</span>
                  <span>{item.total_rs}</span>
                  <span>{item.total_usd}</span>
                </div>
              ))}
            </div>
          </section>

          <Separator />

          {/* ---- REMARK ---- */}
          <section>
            <h3 className="text-sm font-semibold mb-2">Remark</h3>
            <p className="text-sm bg-muted/20 rounded-md p-3 min-h-[2.5rem]">
              {remark || "-"}
            </p>
          </section>
        </div>

        {/* Sticky footer */}
        <div className="sticky bottom-0 z-10 bg-background border-t px-6 py-4 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={onConfirm}>Confirm Save</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/** Helper for consistent label-value pairs */
function InfoField({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string | number | undefined;
  highlight?: boolean;
}) {
  return (
    <div className="space-y-0.5">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p
        className={`text-sm ${highlight ? "font-semibold text-foreground" : ""}`}
      >
        {value ?? "-"}
      </p>
    </div>
  );
}
