"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { VendorService } from "@/services/vendor.service";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Edit,
  Mail,
  Phone,
  MapPin,
  Building2,
  User,
} from "lucide-react";
import { VendorStatusBadge } from "@/components/vendor/VendorStatusBadge";

export default function VendorViewPage() {
  const { id } = useParams();
  const router = useRouter();

  const [vendor, setVendor] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!id) return;
    const load = async () => {
      try {
        setLoading(true);
        const res = await VendorService.getVendorById(id as string);
        setVendor(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen animate-pulse">
        Loading vendor...
      </div>
    );
  if (!vendor)
    return (
      <div className="flex items-center justify-center min-h-screen">
        Vendor not found
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-background">
      {/* TOP HEADER NAVIGATION */}
      <div className="border-b bg-background sticky top-0 z-10">
        <div className="max-w-7xl mx-auto p-4 md:px-8 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              className="rounded-full"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold tracking-tight">
                {vendor.name}
              </h1>
              <div className="flex items-center gap-2 mt-0.5">
                <VendorStatusBadge status={vendor.status?.status} />
                <span className="text-xs text-muted-foreground font-mono">
                  ID: {vendor.vendor_id}
                </span>
              </div>
            </div>
          </div>
          <Button
            onClick={() => router.push(`/vendors/edit/${vendor.vendor_id}`)}
            className="gap-2 shadow-sm"
          >
            <Edit className="w-4 h-4" />
            Edit Profile
          </Button>
        </div>
      </div>

      <main className="max-w-7xl mx-auto p-6 md:p-8 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT COLUMN: PRIMARY INFO & PICS */}
          <div className="lg:col-span-2 space-y-6">
            {/* INFORMATION CARD */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  General Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-y-6 gap-x-4">
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
                    className="md:col-span-2"
                  />
                  <InfoItem
                    icon={<Building2 className="w-4 h-4" />}
                    label="Company Type"
                    value={vendor.company_type}
                  />
                </div>
                {vendor.remark && (
                  <>
                    <Separator className="my-6" />
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Remark
                      </span>
                      <p className="mt-2 text-sm text-foreground/80 leading-relaxed bg-muted/30 p-3 rounded-md border border-dashed">
                        {vendor.remark}
                      </p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* PIC SECTION */}
            <section className="space-y-4">
              <h2 className="text-lg font-bold flex items-center gap-2 px-1">
                <User className="w-5 h-5 text-primary" />
                Contact Persons (PIC)
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {vendor.pics?.length > 0 ? (
                  vendor.pics.map((p: any) => (
                    <Card
                      key={p.pic_id}
                      className="bg-card/50 hover:bg-card transition-colors"
                    >
                      <CardContent className="p-4 space-y-2">
                        <div className="flex justify-between items-start">
                          <p className="font-bold text-base">
                            {p.firstName} {p.lastName}
                          </p>
                          <Badge
                            variant="outline"
                            className="text-[10px] uppercase tracking-tighter"
                          >
                            {p.picType}
                          </Badge>
                        </div>
                        <div className="text-sm space-y-1 text-muted-foreground">
                          <p className="flex items-center gap-2">
                            <Mail className="w-3 h-3" /> {p.email}
                          </p>
                          <p className="flex items-center gap-2">
                            <Phone className="w-3 h-3" /> {p.phone_number}
                          </p>
                        </div>
                        {p.remark && (
                          <p className="text-[11px] italic pt-2 border-t mt-2">
                            {p.remark}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground italic col-span-2 text-center py-8 border rounded-lg border-dashed">
                    No PICs available
                  </p>
                )}
              </div>
            </section>
          </div>

          {/* RIGHT COLUMN: CATEGORIES & APPROVAL */}
          <div className="space-y-6">
            {/* CATEGORIES CARD */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Service Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {vendor.categories?.length > 0 ? (
                    vendor.categories.map((c: any) => (
                      <Badge
                        key={c.cte_id}
                        variant="secondary"
                        className="px-3 py-1 rounded-md"
                      >
                        {c.cte_name}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-sm text-muted-foreground italic">
                      No categories assigned
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* APPROVAL STATUS CARD */}
            <Card className="border-l-4 border-l-primary">
              <CardHeader>
                <CardTitle className="text-lg">Internal Approval</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ApprovalRow
                  label="MD Approved"
                  status={vendor.status?.is_md_approved}
                />
                <Separator />
                <ApprovalRow
                  label="Manager Approved"
                  status={vendor.status?.is_manager_approved}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

/* HELPER COMPONENTS FOR CLEANER CODE */

function InfoItem({ icon, label, value, className }: any) {
  return (
    <div className={className}>
      <div className="flex items-center gap-2 text-muted-foreground mb-1">
        {icon}
        <span className="text-xs font-semibold uppercase tracking-wider">
          {label}
        </span>
      </div>
      <p className="text-sm font-medium">{value || "-"}</p>
    </div>
  );
}

function ApprovalRow({ label, status }: { label: string; status: boolean }) {
  return (
    <div className="flex justify-between items-center text-sm">
      <span className="text-muted-foreground font-medium">{label}</span>
      <Badge
        variant={status ? "default" : "destructive"}
        className="rounded-sm"
      >
        {status ? "Yes" : "No"}
      </Badge>
    </div>
  );
}
