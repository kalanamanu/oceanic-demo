import { Mail, Phone, MapPin, Building2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export function VendorGeneralInfo({ vendor }: { vendor: any }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>General Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-4">
          <InfoItem
            icon={<Mail className="w-4 h-4" />}
            label="Email"
            value={vendor.email}
          />
          <InfoItem
            icon={<Phone className="w-4 h-4" />}
            label="Phone"
            value={vendor.phone_number}
          />
          <InfoItem
            icon={<MapPin className="w-4 h-4" />}
            label="Address"
            value={vendor.address}
            className="col-span-2"
          />
          <InfoItem
            icon={<Building2 className="w-4 h-4" />}
            label="Company Type"
            value={vendor.company_type}
          />
        </div>

        {vendor.remark && (
          <>
            <Separator className="my-4" />
            <p className="text-sm text-muted-foreground">{vendor.remark}</p>
          </>
        )}
      </CardContent>
    </Card>
  );
}

function InfoItem({ icon, label, value, className }: any) {
  return (
    <div className={className}>
      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
        {icon}
        {label}
      </div>
      <p className="text-sm font-medium">{value || "-"}</p>
    </div>
  );
}
