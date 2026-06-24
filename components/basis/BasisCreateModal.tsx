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
  onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: { margin: number; name: string }) => Promise<void>;
}) {
  const [name, setName] = React.useState("");
  const [margin, setMargin] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);

      await onSubmit({
        name,
        margin: Number(margin),
      });

      toast.success("Margin created successfully");

      setName("");
      setMargin("");
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
          <DialogTitle>Create New Margin</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* COMPANY NAME */}
          <div>
            <Label>Company Name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Revelo"
            />
          </div>

          {/* MARGIN */}
          <div>
            <Label>Margin (%)</Label>
            <Input
              value={margin}
              onChange={(e) => setMargin(e.target.value)}
              placeholder="e.g. 18"
            />
          </div>

          {/* SUBMIT */}
          <Button onClick={handleSubmit} disabled={loading} className="w-full">
            {loading ? "Saving..." : "Create Margin"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
