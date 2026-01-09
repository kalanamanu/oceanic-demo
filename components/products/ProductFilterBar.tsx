"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { AddProductDialog } from "@/components/products/AddProductDialog";

interface ProductFilterBarProps {
  onSearch: (keyword: string) => void;
  onAddProduct: (product: {
    name: string;
    description: string;
    costPrice?: number;
    retailPrice: number;
  }) => void;
}

export function ProductFilterBar({
  onSearch,
  onAddProduct,
}: ProductFilterBarProps) {
  const [search, setSearch] = useState("");

  // Optional: call onSearch live (onChange) or wait for Enter/icon-click
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(search.trim());
  };

  return (
    <Card className="p-4 mb-4">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between"
      >
        <div className="flex flex-1 items-center gap-2">
          <Search className="h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-xs"
            type="search"
          />
          <Button type="submit" variant="outline" size="sm">
            Search
          </Button>
        </div>
        <div>
          <AddProductDialog onAdd={onAddProduct}>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </AddProductDialog>
        </div>
      </form>
    </Card>
  );
}
