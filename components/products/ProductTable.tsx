"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

// Example Product type
export interface Product {
  id: string;
  name: string;
  description: string;
  costPrice?: number;
  retailPrice: number;
}

interface ProductTableProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
}

export function ProductTable({ products, onSelectProduct }: ProductTableProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted">
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                  Product ID
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                  Cost Price
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                  Retail Price
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {products.map((product) => (
                <tr
                  key={product.id}
                  className="hover:bg-muted/50 transition-colors"
                >
                  <td className="px-6 py-4 text-sm font-mono font-medium text-primary">
                    {product.id}
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground">
                    {product.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground">
                    {product.description}
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground">
                    {product.costPrice !== undefined &&
                    product.costPrice !== null
                      ? product.costPrice.toLocaleString(undefined, {
                          style: "currency",
                          currency: "LKR",
                        })
                      : "—"}
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground">
                    {product.retailPrice.toLocaleString(undefined, {
                      style: "currency",
                      currency: "LKR",
                    })}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setExpandedId(
                          expandedId === product.id ? null : product.id
                        );
                        onSelectProduct(product);
                      }}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
