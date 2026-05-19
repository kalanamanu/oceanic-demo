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

  /* ================= FETCH ================= */
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

  /* ================= DELETE ================= */
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

  /* ================= STATUS UPDATE ================= */
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
      <main className="max-w-6xl mx-auto px-6 py-10 space-y-8">
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">PreCosts</h1>
            <p className="text-muted-foreground mt-1">
              Manage and view all Pre-Cost records
            </p>
          </div>
        </div>

        {/* TABLE */}
        <div className="rounded-xl border bg-card overflow-hidden">
          {loading ? (
            <div className="p-10 text-center">Loading...</div>
          ) : data.length === 0 ? (
            <div className="p-10 text-center text-muted-foreground">
              No PreCosts found
            </div>
          ) : (
            <>
              <table className="w-full text-sm">
                <thead className="bg-muted">
                  <tr>
                    <th className="p-3 text-left">Vessel</th>
                    <th className="p-3 text-left">Arrival</th>
                    <th className="p-3 text-left">Sailed</th>
                    <th className="p-3 text-left">Total (LKR)</th>
                    <th className="p-3 text-left">Total (USD)</th>
                    <th className="p-3 text-left">Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {paginatedData.map((item) => (
                    <tr key={item.pre_cost_id} className="border-t">
                      <td className="p-3">{item.vessel_name}</td>

                      <td className="p-3">
                        {item.date_arrived
                          ? new Date(item.date_arrived).toLocaleDateString()
                          : "-"}
                      </td>

                      <td className="p-3">
                        {item.date_saild
                          ? new Date(item.date_saild).toLocaleDateString()
                          : "-"}
                      </td>

                      <td className="p-3 font-medium">
                        {Number(item.total_cost || 0).toLocaleString()}
                      </td>

                      <td className="p-3 font-medium">
                        {Number(item.total_cost_usd || 0).toLocaleString()}
                      </td>

                      <td className="p-3">
                        <select
                          className="px-2 py-1 text-xs rounded border bg-background"
                          value={item.status}
                          disabled={statusLoading}
                          onChange={(e) =>
                            handleStatusChange(item.pre_cost_id, e.target.value)
                          }
                        >
                          <option value="PENDING">PENDING</option>
                          <option value="COMPLETED">COMPLETED</option>
                        </select>
                      </td>

                      <td className="p-3 text-right space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            router.push(`/quotation/view/${item.pre_cost_id}`)
                          }
                        >
                          <Eye className="w-4 h-4" />
                        </Button>

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            router.push(`/quotation/edit/${item.pre_cost_id}`)
                          }
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>

                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => {
                            setDeleteId(item.pre_cost_id);
                            setOpenDelete(true);
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* ================= PAGINATION ================= */}
              <div className="flex items-center justify-between p-3 border-t bg-muted">
                <p className="text-sm text-muted-foreground">
                  Page {page} of {totalPages}
                </p>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={page === 1}
                    onClick={() => setPage((p) => p - 1)}
                  >
                    Previous
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
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

        {/* Delete Dialog */}
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
