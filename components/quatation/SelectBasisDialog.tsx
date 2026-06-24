"use client";

import * as React from "react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
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
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (open) loadData();
  }, [open]);

  /* ================= SEARCH ================= */
  React.useEffect(() => {
    if (!search) {
      setFiltered(margins);
      return;
    }

    const filteredData = margins.filter((m) =>
      `${m.name} ${m.margin}`.toLowerCase().includes(search.toLowerCase()),
    );

    setFiltered(filteredData);
  }, [search, margins]);

  /* ================= FETCH BASIS FROM API ================= */
  const fetchBasis = async (marginId: number) => {
    try {
      const res = await BasisService.calculateBasis(marginId);

      return res; // { basis, margin, usdRate }
    } catch (err: any) {
      toast.error(err.message);
      return null;
    }
  };

  /* ================= SELECT ================= */
  const handleSelect = async (m: Margin) => {
    setSelected(m);
    setOpenDropdown(false);

    const basisData = await fetchBasis(m.id);

    if (!basisData) return;

    onSelect({
      marginId: m.id,
      margin: basisData.margin,
      basis: Number(basisData.basis),
      usdRate: basisData.usdRate,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select Margin for Quotation</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* ================= DROPDOWN ================= */}
          <div className="relative">
            <Button
              variant="outline"
              className="w-full justify-between"
              onClick={() => setOpenDropdown(!openDropdown)}
            >
              {selected
                ? `${selected.name} (${selected.margin}%)`
                : "Select Margin"}
            </Button>

            {openDropdown && (
              <div className="absolute z-50 mt-2 w-full border rounded-lg bg-white shadow-lg">
                {/* SEARCH */}
                <div className="p-2 border-b">
                  <Input
                    placeholder="Search margin..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>

                {/* LIST */}
                <div className="max-h-60 overflow-y-auto">
                  {filtered.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => handleSelect(m)}
                      className="w-full text-left px-3 py-2 hover:bg-muted flex justify-between"
                    >
                      <span>{m.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {m.margin}%
                      </span>
                    </button>
                  ))}

                  {filtered.length === 0 && (
                    <p className="p-3 text-sm text-muted-foreground">
                      No results found
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* ================= SELECTED INFO ================= */}
          {selected && (
            <div className="text-sm border rounded-lg p-3 space-y-1">
              <p>
                <b>Selected:</b> {selected.name}
              </p>
              <p>
                <b>Margin:</b> {selected.margin}%
              </p>
            </div>
          )}

          {/* ================= BUTTON ================= */}
          <Button className="w-full" disabled={!selected} onClick={onClose}>
            Confirm
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
