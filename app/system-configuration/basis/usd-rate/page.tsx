"use client";

import * as React from "react";
import { toast } from "sonner";
import {
  Plus,
  TrendingUp,
  Calendar,
  User,
  Activity,
  Clock,
  Layers,
} from "lucide-react";
import { format } from "date-fns";

import { BasisService } from "@/services/basis.service";
import type { USDRate } from "@/types/usd-rate.types";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function USDRatePage() {
  const [rates, setRates] = React.useState<USDRate[]>([]);
  const [latest, setLatest] = React.useState<USDRate | null>(null);

  const [loading, setLoading] = React.useState(true);

  const [open, setOpen] = React.useState(false);
  const [usd, setUsd] = React.useState("");
  const [saving, setSaving] = React.useState(false);

  /* ================= LOAD DATA ================= */
  const loadRates = async () => {
    try {
      setLoading(true);
      const data = await BasisService.getUSDRateHistory();
      setRates(data);
    } catch (err: any) {
      toast.error(err.message || "Failed to load history");
    } finally {
      setLoading(false);
    }
  };

  const loadLatest = async () => {
    try {
      const data = await BasisService.getLatestUSDRate();
      setLatest(data);
    } catch (err: any) {
      toast.error(err.message || "Failed to load latest rate");
    }
  };

  React.useEffect(() => {
    loadRates();
    loadLatest();
  }, []);

  /* ================= CREATE USD RATE ================= */
  const handleCreate = async () => {
    if (!usd || isNaN(Number(usd))) {
      toast.error("Please enter a valid numeric exchange rate");
      return;
    }

    try {
      setSaving(true);
      await BasisService.createUSDRate({
        usdRate: Number(usd),
      });

      toast.success("USD Rate updated successfully");
      setUsd("");
      setOpen(false);

      await Promise.all([loadRates(), loadLatest()]);
    } catch (err: any) {
      toast.error(err.message || "Failed to save rate");
    } finally {
      setSaving(false);
    }
  };

  // Helper formatting for professional corporate layout presentation
  const formatDisplayDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const d = new Date(dateString);
    return `${format(d, "dd.MM.yyyy")} ${format(d, "HH:mm")}`;
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 antialiased">
      {/* ================= HEADER SECTION ================= */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b pb-5">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            USD Rates
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage system-wide USD rate, and audit tracking history.
          </p>
        </div>

        <Button
          onClick={() => setOpen(true)}
          className="sm:w-auto self-start shadow-sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Rate
        </Button>
      </div>

      {/* ================= MAIN CONTENT DASHBOARD ================= */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* LATEST SUMMARY HIGHLIGHT */}
        <Card className="md:col-span-1 shadow-sm border-muted/60 flex flex-col justify-between">
          <CardHeader className="pb-3">
            <CardDescription className="text-xs uppercase tracking-wider font-medium">
              Current USD Rate (LKR)
            </CardDescription>
            <CardTitle className="text-4xl font-bold tracking-tight text-foreground mt-1">
              {latest ? `${Number(latest.USDRate).toFixed(2)}` : "—"}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/40 p-2.5 rounded-lg border border-border/50">
              <span>Live system wide conversions baseline</span>
            </div>
          </CardContent>
        </Card>

        {/* LATEST METADATA DETAILS */}
        <Card className="md:col-span-2 shadow-sm border-muted/60">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Layers className="w-4 h-4 text-muted-foreground" />
              Active Rate Metadata
            </CardTitle>
          </CardHeader>

          <CardContent>
            {latest ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 text-sm">
                <div className="flex items-center justify-between border-b border-border/40 pb-2 sm:pb-3">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <User className="w-4 h-4 text-muted-foreground/70" />{" "}
                    Created By
                  </span>
                  <span className="font-medium text-foreground">
                    {latest.created_by}
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-border/40 pb-2 sm:pb-3">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Activity className="w-4 h-4 text-muted-foreground/70" />{" "}
                    Status
                  </span>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                      latest.is_active === "1.0000000000"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200/60 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/50"
                        : "bg-amber-50 text-amber-700 border-amber-200/60 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/50"
                    }`}
                  >
                    {latest.is_active === "1.0000000000"
                      ? "Active"
                      : "Inactive"}
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-border/40 pb-2 sm:pb-0">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground/70" />{" "}
                    Record Created
                  </span>
                  <span className="font-medium text-foreground/90">
                    {formatDisplayDate(latest.created_date)}
                  </span>
                </div>

                {/* <div className="flex items-center justify-between border-b border-border/40 pb-2 sm:border-0 sm:pb-0">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground/70" /> Last
                    Modified
                  </span>
                  <span className="font-medium text-foreground/90">
                    {formatDisplayDate(latest.updatedAt)}
                  </span>
                </div> */}
              </div>
            ) : (
              <div className="h-24 flex items-center justify-center text-muted-foreground text-sm border border-dashed rounded-lg">
                No telemetry data available for active record
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ================= LOGS AND AUDIT HISTORY ================= */}
      <Card className="shadow-sm border-muted/60">
        <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle className="text-base font-semibold">
              USD Rate History
            </CardTitle>
            <CardDescription className="text-xs">
              Immutable chronological entries of older system valuation points.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="py-20 flex items-center justify-center space-x-2 text-sm text-muted-foreground">
              <div className="w-4 h-4 rounded-full border-2 border-muted border-t-foreground animate-spin" />
              <span>Fetching operational records...</span>
            </div>
          ) : rates.length === 0 ? (
            <div className="py-12 text-center text-sm text-muted-foreground border border-dashed rounded-lg">
              No historical entries identified in database.
            </div>
          ) : (
            <div className="border rounded-lg overflow-hidden bg-card shadow-inner">
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse text-left">
                  <thead>
                    <tr className="border-b bg-muted/40 text-muted-foreground font-medium text-xs tracking-wider">
                      <th className="p-3.5 pl-4 font-semibold">ID</th>
                      <th className="p-3.5 font-semibold">Exchange Rate</th>
                      <th className="p-3.5 font-semibold">Created By</th>
                      <th className="p-3.5 font-semibold">Status</th>
                      <th className="p-3.5 font-semibold">Created</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-border/60">
                    {rates.map((r) => (
                      <tr
                        key={r.id}
                        className="hover:bg-muted/20 transition-colors text-foreground/90"
                      >
                        <td className="p-3.5 pl-4 font-mono text-xs text-muted-foreground">
                          {r.id}
                        </td>
                        <td className="p-3.5 font-medium text-foreground">
                          {Number(r.USDRate).toFixed(2)}
                        </td>
                        <td className="p-3.5 text-xs text-muted-foreground">
                          {r.created_by}
                        </td>
                        <td className="p-3.5">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium border ${
                              r.is_active === "1.0000000000"
                                ? "bg-emerald-50/60 text-emerald-700 border-emerald-200/40 dark:bg-emerald-950/10 dark:text-emerald-400"
                                : "bg-muted text-muted-foreground border-border/50"
                            }`}
                          >
                            {r.is_active === "1.0000000000"
                              ? "Active"
                              : "Inactive"}
                          </span>
                        </td>
                        <td className="p-3.5 text-xs text-muted-foreground/90">
                          {formatDisplayDate(r.created_date)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ================= CREATE DATA MODAL ================= */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold tracking-tight">
              Create USD Rate
            </DialogTitle>
            <DialogDescription className="text-xs">
              Introduce a fresh base rate into the schema. This updates active
              validation models immediately.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label
                htmlFor="usdRateInput"
                className="text-xs font-semibold text-muted-foreground"
              >
                Exchange Valuation (USD)
              </Label>
              <Input
                id="usdRateInput"
                type="number"
                step="0.0001"
                value={usd}
                onChange={(e) => setUsd(e.target.value)}
                placeholder="e.g. 263.50"
                className="focus-visible:ring-1"
                disabled={saving}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={saving}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreate}
              disabled={saving}
              className="text-xs min-w-[100px]"
            >
              {saving ? (
                <span className="flex items-center gap-1.5">
                  <span className="w-3.5 h-3.5 rounded-full border-2 border-background border-t-transparent animate-spin" />
                  Saving...
                </span>
              ) : (
                "Commit Rate"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
