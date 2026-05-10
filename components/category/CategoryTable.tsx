"use client";

import * as React from "react";
import { Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { CategoryService } from "@/services/category.service";
import { Category } from "@/types/category.types";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Props {
  data: Category[];
  loading: boolean;
  onEdit: (category: Category) => void;
  onDelete: () => void;
}

export function CategoryTable({ data, loading, onEdit, onDelete }: Props) {
  const handleDelete = async (id: string) => {
    if (!confirm("Delete this category?")) return;

    try {
      await CategoryService.deleteCategory(id);
      toast.success("Category deleted");
      onDelete();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  if (loading) {
    return <p className="text-sm animate-pulse">Loading categories...</p>;
  }

  return (
    <div className="max-h-[500px] overflow-y-auto space-y-2 pr-1">
      {data.map((cat) => (
        <div
          key={cat.cte_id}
          className="flex justify-between items-center border p-3 rounded"
        >
          {/* LEFT */}
          <div className="flex items-center gap-3">
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: cat.color }}
            />

            <div>
              <p className="font-medium text-sm">{cat.cte_name}</p>

              <div className="flex gap-2 mt-1">
                <Badge variant="secondary">{cat.type}</Badge>
              </div>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="flex gap-2">
            <Button size="icon" variant="outline" onClick={() => onEdit(cat)}>
              <Edit className="w-4 h-4" />
            </Button>

            <Button
              size="icon"
              variant="destructive"
              onClick={() => handleDelete(cat.cte_id)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
