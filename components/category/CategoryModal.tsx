"use client";

import * as React from "react";
import { toast } from "sonner";

import { CategoryService } from "@/services/category.service";
import { Category } from "@/types/category.types";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Props {
  open: boolean;
  onClose: () => void;
  initialData?: Category | null;
  onSuccess: () => void;
}

export function CategoryModal({
  open,
  onClose,
  initialData,
  onSuccess,
}: Props) {
  const isEdit = !!initialData;

  const [name, setName] = React.useState("");
  const [color, setColor] = React.useState("#000000");
  const [type, setType] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (initialData) {
      setName(initialData.cte_name);
      setColor(initialData.color);
      setType(initialData.type);
    } else {
      setName("");
      setColor("#000000");
      setType("");
    }
  }, [initialData, open]);

  const handleSubmit = async () => {
    if (!name || !color || !type) {
      toast.error("All fields required");
      return;
    }

    try {
      setLoading(true);

      if (isEdit && initialData) {
        await CategoryService.updateCategory(initialData.cte_id, {
          cte_name: name,
          color,
          type,
        });

        toast.success("Category updated");
      } else {
        await CategoryService.createCategory({
          cte_name: name,
          color,
          type,
        });

        toast.success("Category created");
      }

      onSuccess();
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
          <DialogTitle>
            {isEdit ? "Edit Category" : "Create Category"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <div>
            <Label>Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div>
            <Label>Color</Label>
            <Input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
            />
          </div>

          <div>
            <Label>Type</Label>
            <Input value={type} onChange={(e) => setType(e.target.value)} />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>

            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? "Saving..." : isEdit ? "Update" : "Create"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
