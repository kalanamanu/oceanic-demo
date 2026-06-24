"use client";

import * as React from "react";
import { toast } from "sonner";
import {
  Search,
  ChevronDown,
  Check,
  Loader2,
  Landmark,
  Timer,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { BasisService } from "@/services/basis.service";
import type { Margin } from "@/types/margin.types";
import type { USDRate } from "@/types/usd-rate.types";

interface Props {
  open: boolean;
  onClose: () => void;
  onSelect: (basis: {
    marginId: number;
    margin: number;
    basis: number;
    usdRate: number;
  }) => void;
}

export function SelectBasisDialog({ open, onClose, onSelect }: Props) {
  const [margins, setMargins] = React.useState<Margin[]>([]);
  const [filtered, setFiltered] = React.useState<Margin[]>([]);
  const [search, setSearch] = React.useState("");

  const [selected, setSelected] = React.useState<Margin | null>(null);
  const [latestUsd, setLatestUsd] = React.useState<USDRate | null>(null);

  const [openDropdown, setOpenDropdown] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [selecting, setSelecting] = React.useState(false);

  // Auto-redirect tracking parameters
  const [countdown, setCountdown] = React.useState<number | null>(null);

  const containerRef = React.useRef<HTMLDivElement>(null);

  /* ================= LOAD DATA ================= */
  const loadData = async () => {
    try {
      setLoading(true);
      const [m, u] = await Promise.all([
        BasisService.getAllMargins(),
        BasisService.getLatestUSDRate(),
      ]);

      setMargins(m);
      setFiltered(m);
      setLatestUsd(u);
    } catch (err: any) {
      toast.error(err.message || "Failed to load underlying margin matrices");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (open) {
      loadData();
      setSelected(null);
      setSearch("");
      setCountdown(null);
    }
  }, [open]);

  /* ================= AUTO REDIRECT TICKER HOOK ================= */
  React.useEffect(() => {
    if (countdown === null) return;

    if (countdown <= 0) {
      onClose();
      return;
    }

    const timerId = setTimeout(() => {
      setCountdown((prev) => (prev !== null ? prev - 1 : null));
    }, 1000);

    return () => clearTimeout(timerId);
  }, [countdown, onClose]);

  /* ================= CLOSE ON OUTSIDE CLICK ================= */
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpenDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ================= SEARCH FILTER ================= */
  React.useEffect(() => {
    if (!search.trim()) {
      setFiltered(margins);
      return;
    }

    const filteredData = margins.filter((m) =>
      `${m.name} ${m.margin}`.toLowerCase().includes(search.toLowerCase()),
    );
    setFiltered(filteredData);
  }, [search, margins]);

  /* ================= SELECT HANDLER ================= */
  const handleSelect = async (m: Margin) => {
    try {
      setSelecting(true);
      setSelected(m);
      setOpenDropdown(false);
      setCountdown(null); // Clear any pending countdown instances before rebuilding

      const basisData = await BasisService.calculateBasis(m.id);
      if (!basisData) return;

      onSelect({
        marginId: m.id,
        margin: basisData.margin,
        basis: Number(basisData.basis),
        usdRate: basisData.usdRate,
      });

      // Initialize the 5-second auto redirect hook sequence
      setCountdown(5);
    } catch (err: any) {
      toast.error(err.message || "Error resolving rate validation profile");
      setSelected(null);
    } finally {
      setSelecting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] gap-0 antialiased">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-lg font-semibold tracking-tight">
            Select Commercial Profile
          </DialogTitle>
          <DialogDescription className="text-xs">
            Assign an audited commercial baseline index layer to this quotation
            window.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-4 border-t border-border/60">
          {/* ================= ADAPTIVE CUSTOM DROPDOWN ================= */}
          <div className="relative" ref={containerRef}>
            <Button
              variant="outline"
              type="button"
              disabled={loading || selecting}
              className="w-full justify-between h-10 px-3 font-normal text-sm bg-background hover:bg-muted/50 border-muted-foreground/20 text-left transition-all focus:ring-1"
              onClick={() => setOpenDropdown(!openDropdown)}
            >
              {loading ? (
                <span className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> Fetching
                  matrices...
                </span>
              ) : selected ? (
                <span className="font-medium text-foreground">
                  {selected.name}{" "}
                  <span className="text-muted-foreground font-normal ml-1">
                    ({selected.margin}%)
                  </span>
                </span>
              ) : (
                <span className="text-muted-foreground">
                  Choose margin profile...
                </span>
              )}
              <ChevronDown
                className={`w-4 h-4 ml-2 text-muted-foreground/70 transition-transform duration-200 ${openDropdown ? "rotate-180" : ""}`}
              />
            </Button>

            {openDropdown && (
              <div className="absolute z-50 mt-1.5 w-full border border-border bg-popover text-popover-foreground rounded-lg shadow-xl animate-in fade-in-50 slide-in-from-top-1 duration-150 overflow-hidden">
                {/* IN-DROPDOWN SEARCH BAR */}
                <div className="relative p-2 border-b border-border/60 bg-muted/20">
                  <Search className="absolute left-4 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground/80" />
                  <Input
                    placeholder="Filter profiles..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9 h-9 text-xs bg-background focus-visible:ring-1"
                    autoFocus
                  />
                </div>

                {/* SCROLLABLE OPTION ELEMENT CONTAINER */}
                <div className="max-h-56 overflow-y-auto p-1 divide-y divide-border/20">
                  {filtered.map((m) => {
                    const isCurrent = selected?.id === m.id;
                    return (
                      <button
                        type="button"
                        key={m.id}
                        onClick={() => handleSelect(m)}
                        className="w-full text-left px-3 py-2.5 rounded-md hover:bg-muted/80 text-sm font-normal flex items-center justify-between transition-colors text-foreground/90 group"
                      >
                        <span className="truncate pr-4 font-medium group-hover:text-foreground">
                          {m.name}
                        </span>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-xs font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded border border-border/40">
                            {m.margin}%
                          </span>
                          {isCurrent && (
                            <Check className="w-3.5 h-3.5 text-primary stroke-[2.5]" />
                          )}
                        </div>
                      </button>
                    );
                  })}

                  {filtered.length === 0 && (
                    <div className="p-4 text-center text-xs text-muted-foreground">
                      No matching records located
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* ================= TELEMETRY REVIEW PANEL ================= */}
          {selected && !selecting && (
            <div className="text-xs border border-border/80 bg-muted/30 rounded-lg p-3.5 space-y-2.5 shadow-inner">
              <div className="flex items-center justify-between pb-1.5 border-b border-border/40 text-muted-foreground font-medium uppercase tracking-wider text-[10px]">
                <div className="flex items-center gap-2">
                  <Landmark className="w-3.5 h-3.5 text-muted-foreground/80" />
                  Selected Strategy Context
                </div>
                {countdown !== null && (
                  <span className="flex items-center gap-1 normal-case text-amber-600 dark:text-amber-400 font-mono text-[11px]">
                    <Timer className="w-3 h-3 animate-pulse" /> Redirecting in{" "}
                    {countdown}s
                  </span>
                )}
              </div>
              <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                <div className="flex flex-col">
                  <span className="text-muted-foreground/80 text-[11px]">
                    Profile Identity
                  </span>
                  <span className="font-medium text-foreground mt-0.5 truncate">
                    {selected.name}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-muted-foreground/80 text-[11px]">
                    System Margin Rate
                  </span>
                  <span className="font-semibold text-foreground mt-0.5 font-mono">
                    {selected.margin}%
                  </span>
                </div>
                {latestUsd && (
                  <div className="flex flex-col col-span-2 pt-1 border-t border-dashed border-border/40 mt-1">
                    <span className="text-muted-foreground/70 text-[10px]">
                      Active conversion valuation baseline context
                    </span>
                    <span className="font-mono text-xs text-muted-foreground/90 mt-0.5">
                      1 USD = {Number(latestUsd.USDRate).toFixed(2)} Index units
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {selecting && (
            <div className="py-6 flex items-center justify-center space-x-2 text-xs text-muted-foreground border border-dashed rounded-lg bg-muted/10">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-muted-foreground" />
              <span>Resolving valuation variables via server pipeline...</span>
            </div>
          )}

          {/* ================= FORM CLOSE ACTION ================= */}
          <Button
            className="w-full text-xs font-medium h-10 shadow-sm transition-all"
            disabled={!selected || selecting || loading}
            onClick={onClose}
          >
            {countdown !== null
              ? `Confirm Window (${countdown}s)`
              : "Confirm Configuration"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
