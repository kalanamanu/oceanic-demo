import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function VendorApprovalCard({ status }: { status: any }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Approval Status</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <ApprovalRow label="MD Approved" status={status?.is_md_approved} />
        <ApprovalRow
          label="Manager Approved"
          status={status?.is_manager_approved}
        />
      </CardContent>
    </Card>
  );
}

function ApprovalRow({ label, status }: { label: string; status: boolean }) {
  return (
    <div className="flex justify-between items-center text-sm border-b pb-2 last:border-0 last:pb-0">
      <span className="text-muted-foreground">{label}</span>
      <Badge variant={status ? "default" : "destructive"}>
        {status ? "Yes" : "No"}
      </Badge>
    </div>
  );
}
