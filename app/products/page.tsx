"use client";

import { useState } from "react";
import { ProductTable, Product } from "@/components/products/ProductTable";
import { ProductFilterBar } from "@/components/products/ProductFilterBar";

// Sample/mock product data
const sampleProducts: Product[] = [
  {
    id: "P-001",
    name: "Anchor",
    description: "Heavy-duty anchor for commercial vessels.",
    costPrice: 1200,
    retailPrice: 1600,
  },
  {
    id: "P-002",
    name: "Life Jacket",
    description: "Regulation-compliant adult life jacket.",
    costPrice: 50,
    retailPrice: 80,
  },
  {
    id: "P-003",
    name: "Marine Paint",
    description: "Long-lasting marine hull paint, white.",
    costPrice: 200,
    retailPrice: 260,
  },
  // ...Add more as desired
];

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>(sampleProducts);
  const [search, setSearch] = useState("");

  // Demo handler: open a modal or edit form here
  const handleAddProduct = () => {
    alert("Show Add Product modal here!");
  };

  // Demo: filter products by ID or name (case insensitive)
  const handleSearch = (keyword: string) => {
    setSearch(keyword);
  };

  // Filtered products for the table
  const filteredProducts = !search
    ? products
    : products.filter(
        (p) =>
          p.id.toLowerCase().includes(search.toLowerCase()) ||
          p.name.toLowerCase().includes(search.toLowerCase())
      );

  // Table "onSelectProduct" action, e.g. view modal/detail
  const handleSelectProduct = (product: Product) => {
    alert(`Selected: ${product.name}`);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex flex-1">
        <div className="flex-1 p-6 space-y-6">
          <h1 className="text-2xl font-bold mb-2">Products</h1>
          <section className="space-y-4">
            <ProductFilterBar
              onSearch={handleSearch}
              onAddProduct={(newProduct) => {
                setProducts((prev) => [
                  ...prev,
                  {
                    id: `P-${prev.length + 1}`.padStart(5, "0"),
                    ...newProduct,
                  },
                ]);
              }}
            />
            <ProductTable
              products={filteredProducts}
              onSelectProduct={handleSelectProduct}
            />
          </section>
        </div>
      </main>
    </div>
  );
}
