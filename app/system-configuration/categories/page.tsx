"use client";

import * as React from "react";
import { toast } from "sonner";
import { Plus } from "lucide-react";

import { CategoryService } from "@/services/category.service";
import { Category } from "@/types/category.types";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { CategoryTable } from "@/components/category/CategoryTable";
import { CategoryModal } from "@/components/category/CategoryModal";

export default function CategoryPage() {
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [loading, setLoading] = React.useState(true);

  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<Category | null>(null);

  const [search, setSearch] = React.useState("");
  const [typeFilter, setTypeFilter] = React.useState("");

  const filteredCategories = React.useMemo(() => {
    return categories.filter((cat) => {
      const matchesSearch = cat.cte_name
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesType = typeFilter ? cat.type === typeFilter : true;

      return matchesSearch && matchesType;
    });
  }, [categories, search, typeFilter]);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await CategoryService.getAllCategories();
      setCategories(data);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadCategories();
  }, []);

  const handleEdit = (category: Category) => {
    setSelected(category);
    setOpen(true);
  };

  const handleCreate = () => {
    setSelected(null);
    setOpen(true);
  };

  const handleSuccess = () => {
    setOpen(false);
    setSelected(null);
    loadCategories();
  };

  return (
    <div className="p-6 space-y-4">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">Categories</h1>

        <Button onClick={handleCreate}>
          <Plus className="w-4 h-4 mr-2" />
          Add Category
        </Button>
      </div>
      <div className="flex flex-col md:flex-row gap-3 mb-4">
        {/* SEARCH */}
        <input
          className="border p-2 rounded w-full bg-background text-foreground border-border"
          placeholder="Search categories..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* FILTER */}
        <select
          className="w-full md:w-60 rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="">All Types</option>

          {/* auto extract unique types */}
          {[...new Set(categories.map((c) => c.type))].map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>

        {/* CLEAR */}
        <Button
          variant="outline"
          onClick={() => {
            setSearch("");
            setTypeFilter("");
          }}
        >
          Clear
        </Button>
      </div>
      {/* TABLE */}
      <Card>
        <CardContent className="p-4">
          <CategoryTable
            data={filteredCategories}
            loading={loading}
            onEdit={handleEdit}
            onDelete={loadCategories}
          />
        </CardContent>
      </Card>

      {/* MODAL */}
      <CategoryModal
        open={open}
        onClose={() => setOpen(false)}
        initialData={selected}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
