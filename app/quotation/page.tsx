"use client";

import * as React from "react";
import { PreCostService } from "@/services/precost.service";
import { ConfirmDeleteDialog } from "@/components/ConfirmDeleteDialog";
import { toast } from "sonner";
import PreCostTable from "@/components/quatation/PreCostTable";
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
  const [data, setData] = React.useState<PreCost[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [statusLoading, setStatusLoading] = React.useState(false);

  const [deleteId, setDeleteId] = React.useState<string | null>(null);
  const [openDelete, setOpenDelete] = React.useState(false);
  const [deleting, setDeleting] = React.useState(false);

  const [page, setPage] = React.useState(1);
  const pageSize = 10;

  const totalPages = Math.max(1, Math.ceil(data.length / pageSize));

  // 🔥 SORT NEWEST FIRST
  const sortedData = React.useMemo(() => {
    return [...data].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }, [data]);

  const paginatedData = React.useMemo(() => {
    const start = (page - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, page]);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await PreCostService.getAllPreCosts();
      setData(res || []);
    } catch {
      toast.error("Failed to load PreCosts");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadData();
  }, []);

  const handleDelete = (id: string) => {
    setDeleteId(id);
    setOpenDelete(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;

    try {
      setDeleting(true);
      await PreCostService.deletePreCost(deleteId);
      toast.success("Deleted successfully");
      setOpenDelete(false);
      loadData();
    } catch {
      toast.error("Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      setStatusLoading(true);

      await PreCostService.updateStatus(id, {
        status: status as "PENDING" | "COMPLETED",
      });

      toast.success("Updated");
      loadData();
    } catch {
      toast.error("Status update failed");
    } finally {
      setStatusLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-4">PRE COSTS</h1>

      <PreCostTable
        data={paginatedData}
        loading={loading}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        onDelete={handleDelete}
        onStatusChange={handleStatusChange}
        statusLoading={statusLoading}
      />

      <ConfirmDeleteDialog
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={handleConfirmDelete}
        loading={deleting}
      />
    </div>
  );
}
