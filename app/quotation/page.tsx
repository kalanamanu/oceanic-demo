"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { PreCostService } from "@/services/precost.service";
import { ConfirmDeleteDialog } from "@/components/ConfirmDeleteDialog";
import { Trash2, Eye, Pencil } from "lucide-react";
import { toast } from "sonner";

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

export default function QuotationPage() {
  const router = useRouter();

  const [data, setData] = React.useState<PreCost[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [statusLoading, setStatusLoading] = React.useState(false);

  const [deleteId, setDeleteId] = React.useState<string | null>(null);
  const [openDelete, setOpenDelete] = React.useState(false);
  const [deleting, setDeleting] = React.useState(false);

  // ================= PAGINATION =================
  const [page, setPage] = React.useState(1);
  const pageSize = 10;

  const totalPages = Math.max(1, Math.ceil(data.length / pageSize));

  const paginatedData = React.useMemo(() => {
    const start = (page - 1) * pageSize;
    return data.slice(start, start + pageSize);
  }, [data, page]);

  // ================= DATE FORMATTER =================
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

  // ================= FETCH =================
  const loadData = async () => {
    try {
      setLoading(true);
      const res = await PreCostService.getAllPreCosts();
      setData(res || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load PreCosts");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadData();
  }, []);

  // ================= DELETE =================
  const handleConfirmDelete = async () => {
    if (!deleteId) return;

    try {
      setDeleting(true);
      await PreCostService.deletePreCost(deleteId);

      toast.success("PreCost deleted successfully");
      setOpenDelete(false);
      setDeleteId(null);
      loadData();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete PreCost");
    } finally {
      setDeleting(false);
    }
  };

  // ================= STATUS UPDATE =================
  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      setStatusLoading(true);

      await PreCostService.updateStatus(id, {
        status: newStatus as "PENDING" | "COMPLETED",
      });

      toast.success("Status updated successfully");
      loadData();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update status");
    } finally {
      setStatusLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-7xl mx-auto px-6 py-10 space-y-6">
        {/* HEADER */}
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">PreCosts</h1>
          <p className="text-sm text-muted-foreground">
            Manage and view all Pre-Cost records
          </p>
        </div>

        {/* TABLE CONTAINER */}
        <div className="rounded-xl border bg-card overflow-hidden shadow-sm">
          {loading ? (
            <div className="p-12 text-center text-sm text-muted-foreground">
              Loading records...
            </div>
          ) : data.length === 0 ? (
            <div className="p-12 text-center text-sm text-muted-foreground">
              No PreCosts found
            </div>
          ) : (
            <>
              <div className="w-full overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead className="bg-muted/60 border-b border-border/60">
                    <tr>
                      <th className="px-4 py-3.5 text-left font-medium text-muted-foreground">
                        Vessel
                      </th>
                      <th className="px-4 py-3.5 text-left font-medium text-muted-foreground">
                        Arrival
                      </th>
                      <th className="px-4 py-3.5 text-left font-medium text-muted-foreground">
                        Sailed
                      </th>
                      <th className="px-4 py-3.5 text-right font-medium text-muted-foreground">
                        Total (LKR)
                      </th>
                      <th className="px-4 py-3.5 text-right font-medium text-muted-foreground">
                        Total (USD)
                      </th>
                      <th className="px-4 py-3.5 text-left font-medium text-muted-foreground">
                        Status
                      </th>
                      <th className="px-4 py-3.5 text-left font-medium text-muted-foreground">
                        Created
                      </th>
                      <th className="px-4 py-3.5 text-left font-medium text-muted-foreground">
                        Updated
                      </th>
                      <th className="px-4 py-3.5 text-right font-medium text-muted-foreground w-[160px]">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-border/40">
                    {paginatedData.map((item) => (
                      <tr
                        key={item.pre_cost_id}
                        className="hover:bg-muted/40 transition-colors"
                      >
                        <td className="px-4 py-3.5 font-medium max-w-[180px] truncate">
                          {item.vessel_name}
                        </td>

                        <td className="px-4 py-3.5 text-muted-foreground whitespace-nowrap">
                          {item.date_arrived
                            ? new Date(item.date_arrived).toLocaleDateString()
                            : "-"}
                        </td>

                        <td className="px-4 py-3.5 text-muted-foreground whitespace-nowrap">
                          {item.date_saild
                            ? new Date(item.date_saild).toLocaleDateString()
                            : "-"}
                        </td>

                        <td className="px-4 py-3.5 text-right font-mono tracking-tight font-medium">
                          {Number(item.total_cost || 0).toLocaleString(
                            undefined,
                            {
                              minimumFractionDigits: 2,
                            },
                          )}
                        </td>

                        <td className="px-4 py-3.5 text-right font-mono tracking-tight font-medium">
                          {Number(item.total_cost_usd || 0).toLocaleString(
                            undefined,
                            {
                              minimumFractionDigits: 3,
                            },
                          )}
                        </td>

                        <td className="px-4 py-3.5">
                          <select
                            className="px-2.5 py-1 text-xs font-medium rounded-md border bg-background hover:bg-muted/50 transition-colors focus:outline-none focus:ring-1 focus:ring-ring cursor-pointer h-7"
                            value={item.status}
                            disabled={statusLoading}
                            onChange={(e) =>
                              handleStatusChange(
                                item.pre_cost_id,
                                e.target.value,
                              )
                            }
                          >
                            <option value="PENDING">PENDING</option>
                            <option value="COMPLETED">COMPLETED</option>
                          </select>
                        </td>

                        {/* CREATED */}
                        <td className="px-4 py-3.5 text-muted-foreground whitespace-nowrap">
                          {formatDateTime(item.createdAt)}
                        </td>

                        {/* UPDATED */}
                        <td className="px-4 py-3.5 text-muted-foreground whitespace-nowrap">
                          {formatDateTime(item.updatedAt)}
                        </td>

                        {/* ACTIONS */}
                        <td className="px-4 py-3.5">
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              size="icon"
                              variant="outline"
                              className="h-8 w-8 text-muted-foreground hover:text-foreground"
                              onClick={() =>
                                router.push(
                                  `/quotation/view/${item.pre_cost_id}`,
                                )
                              }
                            >
                              <Eye className="w-4 h-4" />
                            </Button>

                            <Button
                              size="icon"
                              variant="outline"
                              className="h-8 w-8 text-muted-foreground hover:text-foreground"
                              onClick={() =>
                                router.push(
                                  `/quotation/edit/${item.pre_cost_id}`,
                                )
                              }
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>

                            <Button
                              size="icon"
                              variant="destructive"
                              className="h-8 w-8"
                              onClick={() => {
                                setDeleteId(item.pre_cost_id);
                                setOpenDelete(true);
                              }}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* PAGINATION FOOTER */}
              <div className="flex items-center justify-between px-4 py-3.5 border-t bg-muted/30">
                <p className="text-xs text-muted-foreground">
                  Showing page{" "}
                  <span className="font-medium text-foreground">{page}</span> of{" "}
                  <span className="font-medium text-foreground">
                    {totalPages}
                  </span>
                </p>

                <div className="flex gap-1.5">
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 px-3 text-xs"
                    disabled={page === 1}
                    onClick={() => setPage((p) => p - 1)}
                  >
                    Previous
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 px-3 text-xs"
                    disabled={page >= totalPages}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* DELETE DIALOG */}
        <ConfirmDeleteDialog
          open={openDelete}
          onClose={() => setOpenDelete(false)}
          onConfirm={handleConfirmDelete}
          loading={deleting}
        />
      </main>
    </div>
  );
}
