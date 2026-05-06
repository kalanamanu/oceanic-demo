import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function VendorCategoryCard({ categories }: { categories: any[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Categories</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-2">
        {categories?.length ? (
          categories.map((c: any) => (
            <Badge key={c.cte_id} variant="secondary">
              {c.cte_name}
            </Badge>
          ))
        ) : (
          <span className="text-sm text-muted-foreground">None assigned</span>
        )}
      </CardContent>
    </Card>
  );
}
