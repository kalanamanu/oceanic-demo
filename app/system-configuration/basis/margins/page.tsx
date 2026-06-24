"use client";

import * as React from "react";
import { toast } from "sonner";
import { Plus, DollarSign } from "lucide-react";
import { useRouter } from "next/navigation";

import { BasisService } from "@/services/basis.service";

import type { Margin } from "@/types/margin.types";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { BasisCreateModal } from "@/components/basis/BasisCreateModal";
import { BasisTable } from "@/components/basis/BasisTable";

export default function MarginsPage() {
  const router = useRouter();

  const [margins, setMargins] = React.useState<Margin[]>([]);
  const [loading, setLoading] = React.useState(true);

  const [open, setOpen] = React.useState(false);

  /* ================= LOAD MARGINS ================= */
  const loadMargins = async () => {
    try {
      setLoading(true);
      const data = await BasisService.getAllMargins();
      setMargins(data);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadMargins();
  }, []);

  /* ================= CREATE HANDLER ================= */
  const handleCreate = async (payload: { margin: number; name: string }) => {
    try {
      await BasisService.createMargin(payload);
      toast.success("Margin created successfully");
      setOpen(false);
      loadMargins();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">Margins</h1>

        <div className="flex gap-2">
          {/* USD PAGE BUTTON */}
          <Button
            variant="outline"
            onClick={() => router.push("/system-configuration/basis/usd-rate")}
          >
            <DollarSign className="w-4 h-4 mr-2" />
            USD Rates
          </Button>

          {/* CREATE MARGIN */}
          <Button onClick={() => setOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New Margin
          </Button>
        </div>
      </div>

      {/* TABLE */}
      <Card>
        <CardContent className="p-4">
          <BasisTable data={margins} loading={loading} />
        </CardContent>
      </Card>

      {/* CREATE MODAL */}
      <BasisCreateModal
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={handleCreate}
      />
    </div>
  );
}
