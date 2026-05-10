"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Basis } from "@/types/basis.types";

export function ActiveBasisCard({ basis }: { basis?: Basis }) {
  if (!basis) {
    return (
      <Card>
        <CardContent className="p-4 text-sm text-muted-foreground">
          No active basis found
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-l-4 border-l-green-500">
      <CardHeader>
        <CardTitle>Active Basis</CardTitle>
      </CardHeader>

      <CardContent className="space-y-2">
        <div className="flex justify-between">
          <span>Margin</span>
          <Badge>{basis.margin}%</Badge>
        </div>

        <div className="flex justify-between">
          <span>USD Rate</span>
          <Badge>{basis.USDRate}</Badge>
        </div>

        <div className="flex justify-between">
          <span>Calculated Basis</span>
          <Badge variant="secondary">{basis.basis}</Badge>
        </div>

        <div className="text-xs text-muted-foreground pt-2">
          Created by {basis.created_by}
        </div>
      </CardContent>
    </Card>
  );
}
