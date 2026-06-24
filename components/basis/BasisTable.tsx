"use client";

import * as React from "react";
import { Search, Loader2, Inbox } from "lucide-react";
import { format } from "date-fns";

import type { Margin } from "@/types/margin.types";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface BasisTableProps {
  data: Margin[];
  loading: boolean;
}

export function BasisTable({ data, loading }: BasisTableProps) {
  const [search, setSearch] = React.useState("");

  const filteredData = React.useMemo(() => {
    return data.filter((item) =>
      item.name?.toLowerCase().includes(search.toLowerCase()),
    );
  }, [data, search]);

  // Helper formatting for professional corporate layout presentation
  const formatDisplayDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const d = new Date(dateString);
    return `${format(d, "dd.MM.yyyy")} ${format(d, "HH:mm")}`;
  };

  return (
    <div className="space-y-4 antialiased">
      {/* ================= ACTIONS BAR ================= */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/70" />
          <Input
            placeholder="Search enterprise accounts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-background focus-visible:ring-1"
          />
        </div>

        {filteredData.length > 0 && !loading && (
          <div className="text-xs text-muted-foreground hidden sm:block font-medium">
            Showing {filteredData.length} of {data.length} records
          </div>
        )}
      </div>

      {/* ================= TABLE SHELL ================= */}
      <div className="border rounded-lg overflow-hidden bg-card shadow-sm border-muted/60">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/40 text-xs uppercase tracking-wider font-medium">
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[100px] pl-4 font-semibold">
                  Margin ID
                </TableHead>
                <TableHead className="font-semibold">Company Name</TableHead>
                <TableHead className="font-semibold text-right">
                  Margin
                </TableHead>
                <TableHead className="font-semibold">Created By</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="pr-4 font-semibold">Created</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading ? (
                /* SKELETON LOADING GRID LAYER */
                Array.from({ length: 4 }).map((_, idx) => (
                  <TableRow key={`skeleton-${idx}`} className="animate-pulse">
                    <TableCell className="pl-4">
                      <div className="h-4 w-12 bg-muted rounded" />
                    </TableCell>
                    <TableCell>
                      <div className="h-4 w-36 bg-muted rounded" />
                    </TableCell>
                    <TableCell>
                      <div className="h-4 w-12 bg-muted rounded ml-auto" />
                    </TableCell>
                    <TableCell>
                      <div className="h-4 w-24 bg-muted rounded" />
                    </TableCell>
                    <TableCell>
                      <div className="h-5 w-16 bg-muted rounded-full" />
                    </TableCell>
                    <TableCell className="pr-4">
                      <div className="h-4 w-28 bg-muted rounded" />
                    </TableCell>
                  </TableRow>
                ))
              ) : filteredData.length === 0 ? (
                /* EMPTY STATE INTERFACE */
                <TableRow>
                  <TableCell colSpan={6} className="h-48 text-center">
                    <div className="flex flex-col items-center justify-center space-y-2.5 text-muted-foreground">
                      <Inbox className="h-8 w-8 text-muted-foreground/50 stroke-[1.5]" />
                      <div className="text-sm font-medium">
                        No system margins identified
                      </div>
                      <p className="text-xs text-muted-foreground/70 max-w-[240px] mx-auto">
                        Adjust your lookup query or verify configurations.
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                /* DATA PRESENTATION CELLS */
                filteredData.map((item) => (
                  <TableRow
                    key={item.id}
                    className="hover:bg-muted/20 transition-colors text-foreground/90"
                  >
                    <td className="p-3.5 pl-4 font-mono text-xs text-muted-foreground">
                      {item.id}
                    </td>

                    <td className="p-3.5 font-medium text-foreground">
                      {item.name}
                    </td>

                    <td className="p-3.5 text-right font-medium text-foreground font-mono">
                      {item.margin}%
                    </td>

                    <td className="p-3.5 text-xs text-muted-foreground">
                      {item.created_by}
                    </td>

                    <td className="p-3.5">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium border ${
                          item.is_active
                            ? "bg-emerald-50/60 text-emerald-700 border-emerald-200/40 dark:bg-emerald-950/10 dark:text-emerald-400"
                            : "bg-muted text-muted-foreground border-border/50"
                        }`}
                      >
                        {item.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td className="p-3.5 pr-4 text-xs text-muted-foreground/90">
                      {formatDisplayDate(item.createdAt)}
                    </td>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
