import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function VendorSidebar({ vendor }: { vendor: any }) {
  return (
    <div className="space-y-6">
      {/* CATEGORY */}
      <Card>
        <CardHeader>
          <CardTitle>Categories</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {vendor.categories?.length ? (
            vendor.categories.map((c: any) => (
              <Badge key={c.cte_id} variant="secondary">
                {c.cte_name}
              </Badge>
            ))
          ) : (
            <span className="text-sm text-muted-foreground">None</span>
          )}
        </CardContent>
      </Card>

      {/* APPROVAL */}
      <Card>
        <CardHeader>
          <CardTitle>Approval Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <ApprovalRow
            label="MD Approved"
            status={vendor.status?.is_md_approved}
          />
          <ApprovalRow
            label="Manager Approved"
            status={vendor.status?.is_manager_approved}
          />
        </CardContent>
      </Card>
    </div>
  );
}

function ApprovalRow({ label, status }: any) {
  return (
    <div className="flex justify-between items-center text-sm border-b pb-2 last:border-0 last:pb-0">
      <span className="text-muted-foreground">{label}</span>
      <Badge variant={status ? "default" : "destructive"}>
        {status ? "Yes" : "No"}
      </Badge>
    </div>
  );
}
