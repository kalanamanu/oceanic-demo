"use client";

import * as React from "react";
import { toast } from "sonner";
import { Plus } from "lucide-react";

import { BasisService } from "@/services/basis.service";
import { Basis } from "@/types/basis.types";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { BasisCreateModal } from "@/components/basis/BasisCreateModal";
import { ActiveBasisCard } from "@/components/basis/ActiveBasisCard";
import { BasisTable } from "@/components/basis/BasisTable";

export default function BasisPage() {
  const [basisList, setBasisList] = React.useState<Basis[]>([]);
  const [loading, setLoading] = React.useState(true);

  const [open, setOpen] = React.useState(false);

  const loadBasis = async () => {
    try {
      setLoading(true);
      const data = await BasisService.getAllBasis();
      setBasisList(data);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadBasis();
  }, []);

  const activeBasis = basisList.find((b) => b.is_active);
  const history = basisList.filter((b) => !b.is_active);

  return (
    <div className="p-6 space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">Basis Management</h1>

        <Button onClick={() => setOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          New Basis
        </Button>
      </div>

      {/* ACTIVE BASIS */}
      <ActiveBasisCard basis={activeBasis} />

      {/* HISTORY */}
      <Card>
        <CardContent className="p-4">
          <BasisTable data={history} loading={loading} />
        </CardContent>
      </Card>

      {/* MODAL */}
      <BasisCreateModal
        open={open}
        onClose={() => setOpen(false)}
        onSuccess={loadBasis}
      />
    </div>
  );
}
