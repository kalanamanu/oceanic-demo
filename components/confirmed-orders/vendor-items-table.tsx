"use client";

import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { Package, HelpCircle, FileText } from "lucide-react";
import type { PreCostVendorItem } from "@/types/precost-vendor.types";

interface VendorItemsTableProps {
  items: PreCostVendorItem[];
}

export function VendorItemsTable({ items }: VendorItemsTableProps) {
  return (
    <div className="border rounded-lg bg-card shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          {/* HEADER */}
          <TableHeader className="bg-muted/40">
            <TableRow>
              <TableHead className="w-[220px]">Item</TableHead>
              <TableHead className="text-center w-[120px]">IMPA</TableHead>
              <TableHead className="text-right w-[120px]">Qty</TableHead>
              <TableHead className="text-right w-[160px]">LKR</TableHead>
              <TableHead className="text-right w-[160px]">USD</TableHead>
              <TableHead className="text-right w-[140px]">
                Discount (LKR)
              </TableHead>
              <TableHead className="text-center w-[120px]">Status</TableHead>
            </TableRow>
          </TableHeader>

          {/* BODY */}
          <TableBody>
            {items.map((item) => {
              const hasQtyChanged = item.is_qty_changed;
              const isRemoved = item.is_removed;

              return (
                <TableRow
                  key={item.id}
                  className={`hover:bg-muted/30 transition ${
                    isRemoved ? "bg-red-50 line-through" : ""
                  }`}
                >
                  {/* ITEM */}
                  <TableCell className="align-top py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 font-medium">
                        <Package
                          className={`w-4 h-4 ${
                            isRemoved ? "text-muted-foreground" : "text-primary"
                          }`}
                        />
                        {item.item_name}
                      </div>

                      {item.customer_remark && (
                        <div className="text-xs text-muted-foreground italic">
                          "{item.customer_remark}"
                        </div>
                      )}
                    </div>
                  </TableCell>

                  {/* IMPA */}
                  <TableCell className="text-center font-mono text-xs text-muted-foreground">
                    {item.impa || "—"}
                  </TableCell>

                  {/* QUANTITY */}
                  <TableCell className="text-right">
                    <div className="font-medium">{item.quantity}</div>

                    {hasQtyChanged && (
                      <div className="text-xs text-orange-500 line-through">
                        {item.original_quantity}
                      </div>
                    )}
                  </TableCell>

                  {/* LKR PRICING */}
                  <TableCell className="text-right">
                    <div className="text-xs text-muted-foreground">
                      Unit Rate LKR: {Number(item.unit_price).toLocaleString()}
                    </div>

                    <div className="font-bold">
                      {Number(item.total_price).toLocaleString()}
                    </div>

                    <div className="text-[11px] text-muted-foreground">
                      Additional Charges:{" "}
                      {Number(item.additional_charges).toLocaleString()}
                    </div>
                  </TableCell>

                  {/* USD */}
                  <TableCell className="text-right">
                    <div className="text-[11px] text-muted-foreground flex items-center justify-end gap-1">
                      Unit Rate USD: {item.unit_rate_usd}
                      {/* <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="w-3 h-3 cursor-help text-muted-foreground/50" />
                          </TooltipTrigger>
                          <TooltipContent>Unit Rate USD</TooltipContent>
                        </Tooltip>
                      </TooltipProvider> */}
                    </div>

                    <div className="font-semibold text-primary">
                      ${Number(item.total_price_usd).toLocaleString()}
                    </div>

                    <div className="text-[11px] text-muted-foreground">
                      Basis: {item.basis}
                    </div>

                    {/* <div className="text-[11px] text-muted-foreground">
                      Grand: ${Number(item.grand_total_usd).toLocaleString()}
                    </div> */}
                  </TableCell>

                  {/* DISCOUNT (LKR) */}
                  <TableCell className="text-right font-medium text-red-600">
                    - {Number(item.discount).toLocaleString()}
                  </TableCell>

                  {/* STATUS */}
                  <TableCell className="text-center">
                    {isRemoved ? (
                      <Badge variant="destructive">Removed</Badge>
                    ) : hasQtyChanged ? (
                      <Badge variant="outline" className="text-orange-600">
                        Qty Changed
                      </Badge>
                    ) : (
                      <Badge className="bg-green-100 text-green-700">
                        Not Changed
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
