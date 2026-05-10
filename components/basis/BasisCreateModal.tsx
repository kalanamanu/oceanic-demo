"use client";

import * as React from "react";
import { toast } from "sonner";

import { BasisService } from "@/services/basis.service";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function BasisCreateModal({
  open,
  onClose,
  onSuccess,
}: {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [margin, setMargin] = React.useState("");
  const [usd, setUsd] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);

      await BasisService.createBasis({
        margin: Number(margin),
        USDRate: Number(usd),
      });

      toast.success("Basis created");

      setMargin("");
      setUsd("");

      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Basis</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>Margin (%)</Label>
            <Input value={margin} onChange={(e) => setMargin(e.target.value)} />
          </div>

          <div>
            <Label>USD Rate</Label>
            <Input value={usd} onChange={(e) => setUsd(e.target.value)} />
          </div>

          <Button onClick={handleSubmit} disabled={loading} className="w-full">
            {loading ? "Saving..." : "Create Basis"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
