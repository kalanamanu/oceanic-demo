"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

import { ConfirmedOrderService } from "@/services/confirmed-order.service";
import { AuthService } from "@/services/auth.service";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import {
  CheckCircle,
  FileText,
  Users,
  ArrowLeft,
  MoreVertical,
  Truck,
  Send,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ConfirmedItemsTable } from "@/components/confirmed-orders/confirmed-items-table";
import { CreateDispatchNoteDialog } from "@/components/dispatch-note/create-dispatch-note-dialog";

import { InvoiceDialog } from "@/components/invoices/create-invoice-dialog";

export default function ConfirmedOrderDetailPage() {
  const router = useRouter();
  const { id } = useParams();

  const [loading, setLoading] = React.useState(true);
  const [authLoading, setAuthLoading] = React.useState(true);

  const [user, setUser] = React.useState<any>(null);
  const [data, setData] = React.useState<any>(null);
  const [approving, setApproving] = React.useState(false);

  const [invoiceOpen, setInvoiceOpen] = React.useState(false);
  const [dispatchOpen, setDispatchOpen] = React.useState(false);

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

  /* ================= LOADING & FALLBACKS ================= */
  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-sm text-muted-foreground animate-pulse">
          Loading order profile...
        </p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-sm text-muted-foreground">
          No confirmed order data discovered.
        </p>
      </div>
    );
  }

  const isAllowed =
    user?.role === "Manager" ||
    user?.role === "System Developer" ||
    user?.role === "Purchasing - Manager";
  const isPending = data.gm_status === "pending";
  const isLkrNegative = Number(data.variance_lkr) < 0;
  const isUsdNegative = Number(data.variance_usd) < 0;

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-6xl mx-auto px-6 py-10 space-y-8">
        {/* TOP INTERACTION HEADER */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div className="space-y-1">
            <Button
              variant="ghost"
              className="gap-1.5 px-0 text-muted-foreground hover:text-foreground h-auto py-1 mb-1 text-sm"
              onClick={() => router.back()}
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                Confirmed Order List
              </h1>
              <p className="text-xs font-mono text-muted-foreground mt-0.5">
                PreCost ID: {data.pre_cost_id}
              </p>
            </div>
          </div>

          {/* ACTION SUB-GROUP */}
          <div className="flex items-center gap-2">
            {isAllowed && data.gm_status !== "approved" && (
              <Button
                onClick={handleApprove}
                disabled={approving}
                className="gap-2 shadow-sm"
                size="sm"
              >
                <CheckCircle className="w-4 h-4" />
                {approving ? "Approving..." : "Approve Order"}
              </Button>
            )}

            <Button
              variant="outline"
              disabled={isPending}
              size="sm"
              className="gap-2"
              onClick={() =>
                router.push(`/confirmed-orders/vendors?id=${data.pre_cost_id}`)
              }
            >
              <Users className="w-4 h-4" />
              Vendors
            </Button>

            {/* 3 DOT MENU */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="px-2">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-44">
                {/* Generate Invoice (your existing action) */}
                <DropdownMenuItem onClick={() => setInvoiceOpen(true)}>
                  <FileText className="w-4 h-4 mr-2" />
                  Invoice
                </DropdownMenuItem>

                {/* NEW OPTIONS (UI only for now) */}
                <DropdownMenuItem
                  onClick={() => toast.info("Delivery Note coming soon")}
                >
                  <Truck className="w-4 h-4 mr-2" />
                  Delivery Note
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => setDispatchOpen(true)}>
                  <Send className="w-4 h-4 mr-2" />
                  Dispatch Note
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <Separator />

        {/* METRICS SUMMARY GRID */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* ORIGINAL */}
          <Card className="p-4 bg-card shadow-sm flex flex-col justify-between">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Original Base
            </span>
            <div className="mt-3 space-y-0.5">
              <p className="text-lg font-bold font-mono tracking-tight">
                {Number(data.original_total_lkr).toLocaleString()}{" "}
                <span className="text-xs font-normal text-muted-foreground">
                  LKR
                </span>
              </p>
              <p className="text-sm text-muted-foreground font-mono">
                ${Number(data.original_total_usd).toLocaleString()}{" "}
                <span className="text-[10px]">USD</span>
              </p>
            </div>
          </Card>

          {/* CONFIRMED */}
          <Card className="p-4 bg-card shadow-sm flex flex-col justify-between border-l-2 border-l-green-500">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Confirmed Settled
            </span>
            <div className="mt-3 space-y-0.5">
              <p className="text-lg font-bold text-green-600 font-mono tracking-tight">
                {Number(data.confirmed_total_lkr).toLocaleString()}{" "}
                <span className="text-xs font-normal text-muted-foreground">
                  LKR
                </span>
              </p>
              <p className="text-sm text-green-600/80 font-mono">
                ${Number(data.confirmed_total_usd).toLocaleString()}{" "}
                <span className="text-[10px]">USD</span>
              </p>
            </div>
          </Card>

          {/* VARIANCE */}
          <Card
            className={`p-4 bg-card shadow-sm flex flex-col justify-between border-l-2 ${isLkrNegative ? "border-l-red-500" : "border-l-green-500"}`}
          >
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Variance Span
            </span>
            <div className="mt-3 space-y-0.5">
              <p
                className={`text-lg font-bold font-mono tracking-tight ${isLkrNegative ? "text-red-600" : "text-green-600"}`}
              >
                {isLkrNegative ? "" : "+"}
                {Number(data.variance_lkr).toLocaleString()}{" "}
                <span className="text-xs font-normal text-muted-foreground">
                  LKR
                </span>
              </p>
              <p
                className={`text-sm font-mono ${isUsdNegative ? "text-red-600/80" : "text-green-600/80"}`}
              >
                {isUsdNegative ? "-$" : "+$"}
                {Math.abs(Number(data.variance_usd)).toLocaleString()}{" "}
                <span className="text-[10px]">USD</span>
              </p>
            </div>
          </Card>

          {/* DOCUMENTATION STATUS */}
          <Card className="p-4 bg-card shadow-sm flex flex-col justify-between">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Workflow State
            </span>
            <div className="mt-3 flex flex-col gap-1.5 items-start">
              <Badge
                variant={
                  data.gm_status === "approved" ? "default" : "secondary"
                }
                className="capitalize text-xs font-semibold py-0.5 px-2.5"
              >
                Purchasing Manager: {data.gm_status}
              </Badge>
              <span className="text-xs text-muted-foreground font-medium capitalize pl-0.5">
                Doc Workflow:{" "}
                <span className="text-foreground">{data.document_status}</span>
              </span>
            </div>
          </Card>
        </div>

        {/* ITEMS SEPARATE COMPONENT */}
        <ConfirmedItemsTable
          items={data.confirmedItems}
          removedItems={data.confirmedRemovedItems}
        />
        <InvoiceDialog
          open={invoiceOpen}
          onOpenChange={setInvoiceOpen}
          data={data}
        />
        <CreateDispatchNoteDialog
          open={dispatchOpen}
          onOpenChange={setDispatchOpen}
        />
      </main>
    </div>
  );
}
