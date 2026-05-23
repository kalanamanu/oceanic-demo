"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

import { PreCostVendorService } from "@/services/precost-vendor.service";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

import {
  ArrowLeft,
  FilePlus,
  AlertTriangle,
  CheckCircle2,
  Package,
} from "lucide-react";

import type { PreCostVendorItem } from "@/types/precost-vendor.types";

export default function VendorItemsPage() {
  const router = useRouter();

  const params = useParams<{
    preCostId: string;
    vendorId: string;
  }>();

  const { preCostId, vendorId } = params;

  const [loading, setLoading] = React.useState(true);
  const [items, setItems] = React.useState<PreCostVendorItem[]>([]);

  /* ================= LOAD ================= */

  const loadItems = async () => {
    try {
      setLoading(true);

      const data = await PreCostVendorService.getVendorItems(
        preCostId,
        vendorId,
      );

      setItems(data || []);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to load vendor items");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (preCostId && vendorId) loadItems();
  }, [preCostId, vendorId]);

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading vendor items...</p>
      </div>
    );
  }

  /* ================= EMPTY ================= */

  if (!items.length) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-3">
        <p className="text-muted-foreground text-sm">
          No items found for this vendor
        </p>

        <Button variant="outline" onClick={loadItems}>
          Retry
        </Button>
      </div>
    );
  }

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-6xl mx-auto px-6 py-10 space-y-8">
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Button
              variant="ghost"
              className="gap-2 px-0"
              onClick={() => router.back()}
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>

            <h1 className="text-2xl font-bold">Vendor Items</h1>

            <p className="text-sm text-muted-foreground">
              PreCost: {preCostId} • Vendor: {vendorId}
            </p>
          </div>

          {/* CREATE PO */}
          <Button className="gap-2">
            <FilePlus className="w-4 h-4" />
            Create PO
          </Button>
        </div>

        <Separator />

        {/* ITEMS GRID */}
        <div className="space-y-4">
          {items.map((item) => (
            <Card
              key={item.id}
              className="p-5 space-y-4 hover:shadow-sm transition"
            >
              {/* TOP */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-primary" />
                  <h2 className="font-semibold">{item.item_name}</h2>
                </div>

                <div className="flex gap-2">
                  {item.is_qty_changed && (
                    <Badge variant="outline" className="text-yellow-600">
                      Qty Changed
                    </Badge>
                  )}

                  {item.is_removed && (
                    <Badge variant="destructive">Removed</Badge>
                  )}

                  {!item.is_qty_changed && !item.is_removed && (
                    <Badge className="bg-green-100 text-green-700">OK</Badge>
                  )}
                </div>
              </div>

              {/* DETAILS */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground text-xs">Original Qty</p>
                  <p className="font-medium">{item.original_quantity}</p>
                </div>

                <div>
                  <p className="text-muted-foreground text-xs">Confirmed Qty</p>
                  <p className="font-medium">{item.quantity}</p>
                </div>

                <div>
                  <p className="text-muted-foreground text-xs">Unit Price</p>
                  <p className="font-medium">{item.unit_price}</p>
                </div>

                <div>
                  <p className="text-muted-foreground text-xs">Total LKR</p>
                  <p className="font-bold text-primary">{item.total_price}</p>
                </div>

                <div>
                  <p className="text-muted-foreground text-xs">USD Rate</p>
                  <p>{item.unit_rate_usd}</p>
                </div>

                <div>
                  <p className="text-muted-foreground text-xs">Total USD</p>
                  <p className="font-medium">${item.total_price_usd}</p>
                </div>

                <div>
                  <p className="text-muted-foreground text-xs">IMPA</p>
                  <p>{item.impa || "-"}</p>
                </div>

                <div>
                  <p className="text-muted-foreground text-xs">Discount</p>
                  <p>{item.discount || 0}</p>
                </div>
              </div>

              {/* REMARK */}
              <div className="text-sm text-muted-foreground border-t pt-3">
                {item.customer_remark || "No remarks"}
              </div>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
