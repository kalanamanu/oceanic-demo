"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

import { PreCostVendorService } from "@/services/precost-vendor.service";

import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  ArrowLeft,
  RefreshCcw,
  MoreVertical,
  FilePlus,
  Send,
} from "lucide-react";

import { VendorItemsTable } from "@/components/confirmed-orders/vendor-items-table";
import { CreatePODialog } from "@/components/purchase-orders/create-po-dialog";
import { CreateDispatchNoteDialog } from "@/components/dispatch-note/create-dispatch-note-dialog";

import type { PreCostVendorItem } from "@/types/precost-vendor.types";

export default function VendorItemsPage() {
  const router = useRouter();
  const params = useParams<{ preCostId: string; vendorId: string }>();
  const { preCostId, vendorId } = params;

  const [loading, setLoading] = React.useState(true);

  const [items, setItems] = React.useState<PreCostVendorItem[]>([]);
  const [vendorData, setVendorData] = React.useState<any>(null);

  const [poDialogOpen, setPoDialogOpen] = React.useState(false);
  const [dispatchOpen, setDispatchOpen] = React.useState(false);

  /* ================= LOAD ================= */
  const loadItems = async () => {
    if (!preCostId || !vendorId) return;

    try {
      setLoading(true);

      const response = await PreCostVendorService.getVendorItems(
        preCostId,
        vendorId,
      );
      const payload = response as any;

      // Keep the entire response for Dispatch Note
      setVendorData(payload);

      // Support both array responses and { data } responses
      setItems(Array.isArray(payload) ? payload : payload?.data || []);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to load vendor items");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadItems();
  }, [preCostId, vendorId]);

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-sm text-muted-foreground animate-pulse">
          Loading items...
        </p>
      </div>
    );
  }

  /* ================= EMPTY ================= */
  if (!items.length) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-3">
        <p className="text-muted-foreground text-sm font-medium">
          No items found for this vendor profile.
        </p>

        <Button variant="outline" size="sm" onClick={loadItems}>
          <RefreshCcw className="w-3.5 h-3.5 mr-1.5" />
          Retry Connection
        </Button>
      </div>
    );
  }

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-7xl mx-auto px-6 py-10 space-y-8">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div className="space-y-1">
            <Button
              variant="ghost"
              className="gap-1.5 px-0 text-muted-foreground hover:text-foreground h-auto py-1 mb-1 text-sm"
              onClick={() => router.back()}
            >
              <ArrowLeft className="w-4 h-4" />
              Return to Vendors
            </Button>

            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                Vendor Items
              </h1>

              <p className="text-xs font-mono text-muted-foreground mt-0.5">
                PreCost ID: {preCostId} • Vendor ID: {vendorId}
              </p>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="flex items-center gap-2 self-start sm:self-center">
            <Button
              size="sm"
              className="gap-1.5 text-xs font-medium shadow-sm"
              onClick={() => setPoDialogOpen(true)}
            >
              Generate Purchase Order
            </Button>

            {/* 3 DOT MENU */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="px-2">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={() => setPoDialogOpen(true)}>
                  <FilePlus className="w-4 h-4 mr-2" />
                  Generate Purchase Order
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => setDispatchOpen(true)}>
                  <Send className="w-4 h-4 mr-2" />
                  Dispatch Note
                </DropdownMenuItem>

                <DropdownMenuItem onClick={loadItems}>
                  <RefreshCcw className="w-4 h-4 mr-2" />
                  Refresh Items
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <Separator />

        {/* VENDOR ITEMS TABLE */}
        <VendorItemsTable items={items} />

        {/* PURCHASE ORDER */}
        <CreatePODialog
          open={poDialogOpen}
          onOpenChange={setPoDialogOpen}
          preCostId={preCostId}
          vendorId={vendorId}
        />

        {/* DISPATCH NOTE */}
        <CreateDispatchNoteDialog
          open={dispatchOpen}
          onOpenChange={setDispatchOpen}
          data={items}
        />
      </main>
    </div>
  );
}
