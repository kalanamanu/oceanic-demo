"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

import { ConfirmedOrderService } from "@/services/confirmed-order.service";
import { AuthService } from "@/services/auth.service";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";

import { CheckCircle, FileText, Users, ArrowLeft } from "lucide-react";

/* ================= PAGE ================= */

export default function ConfirmedOrderDetailPage() {
  const router = useRouter();
  const { id } = useParams();

  const [loading, setLoading] = React.useState(true);
  const [authLoading, setAuthLoading] = React.useState(true);

  const [user, setUser] = React.useState<any>(null);

  const [data, setData] = React.useState<any>(null);
  const [approving, setApproving] = React.useState(false);

  /* ================= AUTH ================= */

  React.useEffect(() => {
    const loadAuth = async () => {
      try {
        setAuthLoading(true);

        const u = await AuthService.checkAuth();
        setUser(u);
      } catch (err) {
        console.error(err);
        setUser(null);
      } finally {
        setAuthLoading(false);
      }
    };

    loadAuth();
  }, []);

  /* ================= LOAD DATA ================= */

  React.useEffect(() => {
    const load = async () => {
      if (!id) return;

      try {
        setLoading(true);

        const res = await ConfirmedOrderService.getConfirmedOrderById(
          id as string,
        );

        setData(res);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load confirmed order");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  /* ================= APPROVE ================= */

  const handleApprove = async () => {
    if (!data?.confirmed_pre_cost_id) return;

    try {
      setApproving(true);

      await ConfirmedOrderService.updateStatus(data.confirmed_pre_cost_id, {
        gm_status: "approved",
        document_status: "approved",
      });

      toast.success("Order approved successfully");

      setData((prev: any) => ({
        ...prev,
        gm_status: "approved",
        document_status: "approved",
      }));
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Approval failed");
    } finally {
      setApproving(false);
    }
  };

  /* ================= LOADING ================= */

  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        No data found
      </div>
    );
  }

  /* ================= ROLE CHECK ================= */

  const isAllowed =
    user?.role === "Manager" || user?.role === "System Developer";

  const isPending = data.gm_status === "pending";

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-6xl mx-auto px-6 py-10 space-y-8">
        {/* HEADER */}
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            {/* BACK BUTTON */}
            <Button
              variant="ghost"
              className="gap-2 px-0"
              onClick={() => router.back()}
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>

            <div>
              <h1 className="text-2xl font-bold">Confirmed Order Details</h1>
              <p className="text-sm text-muted-foreground">
                ID: {data.pre_cost_id}
              </p>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex gap-2">
            {/* APPROVE */}
            {isAllowed && data.gm_status !== "approved" && (
              <Button
                onClick={handleApprove}
                disabled={approving}
                className="gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                {approving ? "Approving..." : "Approve Order"}
              </Button>
            )}

            {/* VENDORS */}
            <Button
              variant="outline"
              disabled={isPending}
              className="gap-2"
              onClick={() =>
                router.push(`/confirmed-orders/vendors?id=${data.pre_cost_id}`)
              }
            >
              <Users className="w-4 h-4" />
              Vendors
            </Button>

            {/* INVOICE */}
            <Button variant="outline" disabled={isPending} className="gap-2">
              <FileText className="w-4 h-4" />
              Invoice
            </Button>
          </div>
        </div>

        <Separator />

        {/* SUMMARY */}
        <div className="grid md:grid-cols-4 gap-4">
          {/* ORIGINAL */}
          <Card className="p-4 space-y-1">
            <p className="text-sm text-muted-foreground">Original Total</p>
            <p className="text-lg font-bold">
              LKR {Number(data.original_total_lkr).toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground">
              USD {Number(data.original_total_usd).toLocaleString()}
            </p>
          </Card>

          {/* CONFIRMED */}
          <Card className="p-4 space-y-1">
            <p className="text-sm text-muted-foreground">Confirmed Total</p>
            <p className="text-lg font-bold text-green-600">
              LKR {Number(data.confirmed_total_lkr).toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground">
              USD {Number(data.confirmed_total_usd).toLocaleString()}
            </p>
          </Card>

          {/* VARIANCE */}
          <Card className="p-4 space-y-1">
            <p className="text-sm text-muted-foreground">Variance</p>

            <p
              className={`text-lg font-bold ${
                Number(data.variance_lkr) < 0
                  ? "text-red-600"
                  : "text-green-600"
              }`}
            >
              LKR {Number(data.variance_lkr).toLocaleString()}
            </p>

            <p
              className={`text-sm ${
                Number(data.variance_usd) < 0
                  ? "text-red-600"
                  : "text-green-600"
              }`}
            >
              USD {Number(data.variance_usd).toLocaleString()}
            </p>
          </Card>

          {/* STATUS */}
          <Card className="p-4 space-y-1">
            <p className="text-sm text-muted-foreground">Status</p>

            <p className="text-lg font-bold capitalize">{data.gm_status}</p>

            <p className="text-sm text-muted-foreground capitalize">
              Document: {data.document_status}
            </p>
          </Card>
        </div>

        {/* ITEMS */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Confirmed Items</h2>

          {data.confirmedItems?.map((item: any, i: number) => (
            <Card key={i} className="p-4 space-y-2">
              <div className="flex justify-between">
                <b>{item.item_name}</b>
                <span className="text-sm text-muted-foreground">
                  {item.unit}
                </span>
              </div>

              <div className="text-sm grid grid-cols-3 gap-2">
                <span>
                  Qty: {item.original_quantity} → {item.quantity}
                </span>
                <span>LKR: {item.total_price}</span>
                <span>USD: {item.total_price_usd}</span>
              </div>

              {item.is_qty_changed && (
                <p className="text-xs text-orange-500">Quantity changed</p>
              )}
            </Card>
          ))}
        </div>

        {/* REMOVED ITEMS */}
        {data.confirmedRemovedItems?.length > 0 && (
          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-red-600">
              Removed Items
            </h2>

            {data.confirmedRemovedItems.map((item: any, i: number) => (
              <Card key={i} className="p-3 text-sm text-red-600">
                {item.data_id}
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
