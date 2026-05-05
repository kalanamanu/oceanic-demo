"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { PreCostService } from "@/services/precost.service";
import { Trash2, Eye, Pencil } from "lucide-react";
import { toast } from "sonner";

// Define a basic interface for better type safety
interface PreCost {
  pre_cost_id: string;
  vessel_name: string;
  date_arrived: string;
  date_saild: string;
  total_cost: number;
  total_cost_usd: number;
  status: string;
}

export default function QuotationPage() {
  const router = useRouter();

  const [data, setData] = React.useState<PreCost[]>([]);
  const [loading, setLoading] = React.useState(true);

  const [deleteId, setDeleteId] = React.useState<string | null>(null);
  const [open, setOpen] = React.useState(false);

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
  const handleDelete = async (id: string) => {
    const confirmDelete = confirm(
      "Are you sure you want to delete this PreCost?",
    );
    if (!confirmDelete) return;

    try {
      await PreCostService.deletePreCost(id);
      toast.success("PreCost deleted successfully");
      loadData(); // refresh list
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete PreCost");
    }
  };

  /* ================= UI ================= */
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
                {data.map((item) => (
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
                      <span className="px-2 py-1 text-xs rounded bg-yellow-100 text-yellow-800">
                        {item.status}
                      </span>
                    </td>

                    <td className="p-3 text-right space-x-2">
                      {/* VIEW */}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          router.push(`/quotation/view/${item.pre_cost_id}`)
                        }
                      >
                        <Eye className="w-4 h-4" />
                      </Button>

                      {/* EDIT */}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          router.push(`/quotation/edit/${item.pre_cost_id}`)
                        }
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>

                      {/* DELETE */}
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => {
                          setDeleteId(item.pre_cost_id);
                          setOpen(true);
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Delete Dialog */}
        <div
          className={`fixed inset-0 bg-black/50 flex items-center justify-center ${
            open ? "" : "hidden"
          }`}
        >
          <div className="bg-white rounded-xl p-6 w-[400px] space-y-4">
            <h2 className="text-lg font-semibold">Confirm Delete</h2>

            <p className="text-sm text-muted-foreground">
              Are you sure you want to delete this PreCost? This action cannot
              be undone.
            </p>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                onClick={() => {
                  setOpen(false);
                  setDeleteId(null);
                }}
              >
                Cancel
              </Button>

              <Button
                variant="destructive"
                onClick={async () => {
                  if (!deleteId) return;

                  try {
                    await PreCostService.deletePreCost(deleteId);
                    toast.success("PreCost deleted successfully");
                    loadData();
                  } catch (err) {
                    toast.error("Failed to delete PreCost");
                  } finally {
                    setOpen(false);
                    setDeleteId(null);
                  }
                }}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
