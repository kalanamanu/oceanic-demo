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
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Quotation Preview</DialogTitle>
        </DialogHeader>

        {/* HEADER DETAILS */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
          <div>
            <b>Ref:</b> {inquiry?.inq_id}
          </div>
          <div>
            <b>Vessel:</b> {inquiry?.vessel_name}
          </div>
          <div>
            <b>Status:</b> Pending
          </div>

          <div>
            <b>Date Arrived:</b> {dateArrived?.toLocaleDateString()}
          </div>
          <div>
            <b>Date Sailed:</b> {dateSailed?.toLocaleDateString()}
          </div>
          <div>
            <b>USD Rate:</b> {basis?.USDRate}
          </div>

          <div>
            <b>Discount (LKR):</b> {discountLKR}
          </div>
          <div>
            <b>Total LKR:</b> {totalLKR.toLocaleString()}
          </div>
          <div>
            <b>Total USD:</b> {totalUSD.toFixed(2)}
          </div>
        </div>

        <Separator />

        {/* ADDITIONAL CHARGES */}
        <div>
          <h3 className="font-semibold mb-2">Additional Charges</h3>

          {additionalCharges.length === 0 ? (
            <p className="text-sm text-muted-foreground">No charges</p>
          ) : (
            additionalCharges.map((c, i) => (
              <div
                key={i}
                className="text-sm flex justify-between border-b py-1"
              >
                <span>{c.name}</span>
                <span>
                  {c.amount} {c.currency}
                </span>
              </div>
            ))
          )}
        </div>

        <Separator />

        {/* ITEMS */}
        <div>
          <h3 className="font-semibold mb-2">Items</h3>

          {items.map((item, i) => (
            <div
              key={i}
              className="grid grid-cols-2 md:grid-cols-6 gap-2 text-xs border p-2 rounded mb-2"
            >
              <div>{item.item_no}</div>
              <div>{item.description}</div>
              <div>Qty: {item.quantity}</div>
              <div>Unit: {item.unit}</div>
              <div>RS: {item.total_rs}</div>
              <div>USD: {item.total_usd}</div>
            </div>
          ))}
        </div>

        <Separator />

        {/* REMARK */}
        <div>
          <h3 className="font-semibold mb-2">Remark</h3>
          <p className="text-sm">{remark || "-"}</p>
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>

          <Button onClick={onConfirm}>Confirm Save</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
