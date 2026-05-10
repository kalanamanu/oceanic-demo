"use client";

import { Basis } from "@/types/basis.types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function BasisTable({
  data,
  loading,
}: {
  data: Basis[];
  loading: boolean;
}) {
  if (loading) return <p className="text-sm animate-pulse">Loading...</p>;

  return (
    <div className="space-y-2 max-h-[400px] overflow-y-auto">
      {data.map((b) => (
        <Card key={b.id} className="p-3 flex justify-between items-center">
          <div>
            <p className="font-medium text-sm">
              Margin: {b.margin}% | USD: {b.USDRate}
            </p>

            <p className="text-xs text-muted-foreground">
              {new Date(b.created_date).toLocaleString()}
            </p>
          </div>

          <div className="flex gap-2 items-center">
            <Badge variant="secondary">{b.basis}</Badge>

            <Badge variant={b.is_active ? "default" : "outline"}>
              {b.is_active ? "Active" : "Inactive"}
            </Badge>
          </div>
        </Card>
      ))}
    </div>
  );
}
