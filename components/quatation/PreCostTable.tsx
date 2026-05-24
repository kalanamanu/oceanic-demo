"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Trash2,
  Eye,
  Pencil,
  ChevronLeft,
  ChevronRight,
  Anchor,
} from "lucide-react";

interface PreCost {
  pre_cost_id: string;
  vessel_name: string;
  date_arrived: string;
  date_saild: string;
  total_cost: number;
  total_cost_usd: number;
  status: "PENDING" | "COMPLETED";
  createdAt: string;
  updatedAt: string;
}

interface Props {
  data: PreCost[];
  loading: boolean;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: string) => void;
  statusLoading: boolean;
}

export default function PreCostTable({
  data,
  loading,
  page,
  totalPages,
  onPageChange,
  onDelete,
  onStatusChange,
  statusLoading,
}: Props) {
  const router = useRouter();

  const formatDateTime = (dateString: string) => {
    if (!dateString) return "-";

    const date = new Date(dateString);

    const dd = String(date.getDate()).padStart(2, "0");
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const yyyy = date.getFullYear();

    const hh = String(date.getHours()).padStart(2, "0");
    const min = String(date.getMinutes()).padStart(2, "0");

    return `${dd}.${mm}.${yyyy} ${hh}:${min}`;
  };

  return (
    <div className="w-full bg-card rounded-xl border border-border overflow-hidden shadow-sm">
      {/* TABLE WORKFLOW CONTAINER */}
      <div className="w-full overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          {/* HEADER FRAME */}
          <thead className="bg-muted/40 border-b border-border text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            <tr>
              <th className="px-5 py-4 text-left font-semibold">Vessel</th>
              <th className="px-5 py-4 text-left font-semibold">Arrival</th>
              <th className="px-5 py-4 text-left font-semibold">Sailed</th>
              <th className="px-5 py-4 text-right font-semibold">
                Total (LKR)
              </th>
              <th className="px-5 py-4 text-right font-semibold">
                Total (USD)
              </th>
              <th className="px-5 py-4 text-left font-semibold">Status</th>
              <th className="px-5 py-4 text-left font-semibold">Created</th>
              <th className="px-5 py-4 text-left font-semibold">Updated</th>
              <th className="px-5 py-4 text-right w-[160px] font-semibold">
                Actions
              </th>
            </tr>
          </thead>

          {/* DYNAMIC BODY DATA GENERATOR */}
          <tbody className="divide-y divide-border/50 text-foreground">
            {loading ? (
              // Loading Placeholder Rows
              Array.from({ length: 3 }).map((_, i) => (
                <tr key={`loading-${i}`} className="bg-card">
                  <td className="p-5" colSpan={9}>
                    <div className="flex items-center gap-3 w-full">
                      <div className="h-4 w-1/4 bg-muted animate-pulse rounded" />
                      <div className="h-4 w-1/2 bg-muted/60 animate-pulse rounded" />
                    </div>
                  </td>
                </tr>
              ))
            ) : data.length === 0 ? (
              // Clean Empty Fallback
              <tr>
                <td
                  className="p-12 text-center text-muted-foreground"
                  colSpan={9}
                >
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Anchor className="w-8 h-8 text-muted-foreground/40 stroke-[1.5]" />
                    <p className="text-sm font-medium">
                      No record entries cataloged
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr
                  key={item.pre_cost_id}
                  className="hover:bg-muted/30 dark:hover:bg-muted/20 transition-colors group"
                >
                  {/* Vessel Profile Column */}
                  <td className="px-5 py-3.5 font-semibold text-foreground/90 max-w-[200px] truncate">
                    {item.vessel_name}
                  </td>

                  {/* Arrival Date Column */}
                  <td className="px-5 py-3.5 text-muted-foreground/90">
                    {item.date_arrived
                      ? new Date(item.date_arrived).toLocaleDateString(
                          undefined,
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          },
                        )
                      : "—"}
                  </td>

                  {/* Sailed Date Column */}
                  <td className="px-5 py-3.5 text-muted-foreground/90">
                    {item.date_saild
                      ? new Date(item.date_saild).toLocaleDateString(
                          undefined,
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          },
                        )
                      : "—"}
                  </td>

                  {/* Local Balance Metric Column */}
                  <td className="px-5 py-3.5 text-right font-mono font-medium tracking-tight text-foreground/90">
                    {Number(item.total_cost || 0).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                    })}
                  </td>

                  {/* Base Currency USD Metric Column */}
                  <td className="px-5 py-3.5 text-right font-mono font-semibold tracking-tight text-primary">
                    $
                    {Number(item.total_cost_usd || 0).toLocaleString(
                      undefined,
                      { minimumFractionDigits: 2 },
                    )}
                  </td>

                  {/* Context State Managed Dropdown Selector */}
                  <td className="px-5 py-3.5">
                    <select
                      value={item.status}
                      disabled={statusLoading}
                      onChange={(e) =>
                        onStatusChange(item.pre_cost_id, e.target.value)
                      }
                      className={`text-xs font-bold tracking-wide rounded-md px-2.5 py-1 border transition-all cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary/40 disabled:opacity-50 disabled:cursor-not-allowed ${
                        item.status === "COMPLETED"
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                          : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                      }`}
                    >
                      <option
                        value="PENDING"
                        className="bg-popover text-foreground font-semibold"
                      >
                        PENDING
                      </option>
                      <option
                        value="COMPLETED"
                        className="bg-popover text-foreground font-semibold"
                      >
                        COMPLETED
                      </option>
                    </select>
                  </td>

                  {/* System Generation Logs */}
                  <td className="px-5 py-3.5 text-xs text-muted-foreground/80 font-mono">
                    {formatDateTime(item.createdAt)}
                  </td>

                  {/* Delta Mutation Metric Logs */}
                  <td className="px-5 py-3.5 text-xs text-muted-foreground/80 font-mono">
                    {formatDateTime(item.updatedAt)}
                  </td>

                  {/* Control Target Interface Action Grid */}
                  <td className="px-5 py-3.5">
                    <div className="flex justify-end gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-8 w-8 rounded-md hover:bg-muted border-border text-muted-foreground hover:text-foreground transition-colors"
                        onClick={() =>
                          router.push(`/quotation/view/${item.pre_cost_id}`)
                        }
                        title="View Record"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </Button>

                      <Button
                        size="icon"
                        variant="outline"
                        className="h-8 w-8 rounded-md hover:bg-muted border-border text-muted-foreground hover:text-foreground transition-colors"
                        onClick={() =>
                          router.push(`/quotation/edit/${item.pre_cost_id}`)
                        }
                        title="Edit Record"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>

                      <Button
                        size="icon"
                        variant="outline"
                        className="h-8 w-8 rounded-md border-border/60 hover:border-destructive/30 text-muted-foreground/70 hover:bg-destructive/10 hover:text-destructive transition-colors"
                        onClick={() => onDelete(item.pre_cost_id)}
                        title="Delete Entry"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* FOOTER PAGINATION CONSOLE */}
      <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-muted/20">
        <p className="text-xs font-medium text-muted-foreground">
          Showing page{" "}
          <span className="text-foreground font-semibold">{page}</span> of{" "}
          <span className="text-foreground font-semibold">
            {totalPages || 1}
          </span>
        </p>

        <div className="flex gap-1.5">
          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-1 text-xs px-2.5 rounded-md border-border text-muted-foreground hover:text-foreground transition-all"
            disabled={page === 1 || loading}
            onClick={() => onPageChange(page - 1)}
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            Prev
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-1 text-xs px-2.5 rounded-md border-border text-muted-foreground hover:text-foreground transition-all"
            disabled={page >= totalPages || loading}
            onClick={() => onPageChange(page + 1)}
          >
            Next
            <ChevronRight className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
