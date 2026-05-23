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

interface ConfirmedItem {
  item_name: string;
  unit: string;
  original_quantity: number | string;
  quantity: number | string;
  total_price: number | string;
  total_price_usd: number | string;
  is_qty_changed?: boolean;
}

interface RemovedItem {
  data_id: string;
}

interface ConfirmedItemsTableProps {
  items: ConfirmedItem[];
  removedItems?: RemovedItem[];
}

export function ConfirmedItemsTable({
  items = [],
  removedItems = [],
}: ConfirmedItemsTableProps) {
  return (
    <div className="space-y-8">
      {/* ACTIVE ITEMS TABLE */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold tracking-tight">
          Confirmed Items
        </h2>
        <div className="border rounded-lg bg-card shadow-sm overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/40">
              <TableRow>
                <TableHead className="py-3.5 font-medium">
                  Item Details
                </TableHead>
                <TableHead className="w-[100px] text-center font-medium">
                  Unit
                </TableHead>
                <TableHead className="text-right font-medium">
                  Original Qty
                </TableHead>
                <TableHead className="text-right font-medium">
                  Confirmed Qty
                </TableHead>
                <TableHead className="text-right font-medium">
                  Total (LKR)
                </TableHead>
                <TableHead className="text-right font-medium pr-6">
                  Total (USD)
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-8 text-muted-foreground"
                  >
                    No items found in this order.
                  </TableCell>
                </TableRow>
              ) : (
                items.map((item, i) => {
                  const qtyChanged =
                    item.is_qty_changed ||
                    Number(item.original_quantity) !== Number(item.quantity);

                  return (
                    <TableRow
                      key={i}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      <TableCell className="font-medium py-3">
                        <div className="flex flex-col gap-1">
                          <span>{item.item_name}</span>
                          {qtyChanged && (
                            <span className="text-xs text-orange-500 font-normal">
                              Quantity modified from original
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-center text-muted-foreground text-sm">
                        {item.unit || "—"}
                      </TableCell>
                      <TableCell className="text-right font-mono text-xs text-muted-foreground">
                        {Number(item.original_quantity).toLocaleString()}
                      </TableCell>
                      <TableCell
                        className={`text-right font-mono text-xs font-medium ${qtyChanged ? "text-orange-600" : ""}`}
                      >
                        {Number(item.quantity).toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right font-mono text-xs font-medium">
                        {Number(item.total_price).toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right font-mono text-xs font-medium pr-6">
                        ${Number(item.total_price_usd).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* REMOVED ITEMS LOG */}
      {removedItems && removedItems.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold tracking-tight text-red-600">
            Removed Items
          </h2>
          <div className="border border-red-100 rounded-lg bg-red-50/10 overflow-hidden">
            <Table>
              <TableHeader className="bg-red-50/40 dark:bg-red-950/10">
                <TableRow className="hover:bg-transparent border-red-100">
                  <TableHead className="py-3 font-medium text-red-800 dark:text-red-400">
                    Item ID / Data Reference
                  </TableHead>
                  <TableHead className="text-right pr-6 font-medium text-red-800 dark:text-red-400">
                    Status
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {removedItems.map((item, i) => (
                  <TableRow
                    key={i}
                    className="border-red-100 hover:bg-red-50/20 dark:hover:bg-red-950/5"
                  >
                    <TableCell className="font-mono text-xs font-medium text-red-700 dark:text-red-400 py-3">
                      {item.data_id}
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <Badge
                        variant="destructive"
                        className="text-[10px] uppercase font-bold tracking-wider px-2 py-0"
                      >
                        Omitted
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );
}
