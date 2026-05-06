"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { VendorService } from "@/services/vendor.service";
import { VendorDocumentModal } from "@/components/vendor/VendorDocumentModal";

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
  FileText,
  Plus,
  Trash2,
} from "lucide-react";

import { VendorStatusBadge } from "@/components/vendor/VendorStatusBadge";
import { toast } from "sonner";

export default function VendorViewPage() {
  const { id } = useParams();
  const router = useRouter();

  const [vendor, setVendor] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  /* ================= DOCUMENTS ================= */
  const [documents, setDocuments] = React.useState<any[]>([]);
  const [docLoading, setDocLoading] = React.useState(false);
  const [docModalOpen, setDocModalOpen] = React.useState(false);

  /* ================= LOAD VENDOR ================= */
  const loadVendor = async () => {
    try {
      setLoading(true);
      const res = await VendorService.getVendorById(id as string);
      setVendor(res);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load vendor");
    } finally {
      setLoading(false);
    }
  };

  /* ================= LOAD DOCUMENTS ================= */
  const loadDocuments = async () => {
    try {
      setDocLoading(true);
      const res = await VendorService.getVendorDocuments({
        vendor_id: id as string,
      });
      setDocuments(res);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load documents");
    } finally {
      setDocLoading(false);
    }
  };

  React.useEffect(() => {
    if (!id) return;

    loadVendor();
    loadDocuments();
  }, [id]);

  /* ================= DELETE DOCUMENT ================= */
  const handleDeleteDoc = async (docId: string) => {
    if (!confirm("Delete this document?")) return;

    try {
      await VendorService.deleteVendorDocument(docId);
      toast.success("Document deleted");
      loadDocuments();
    } catch {
      toast.error("Failed to delete document");
    }
  };

  /* ================= STATES ================= */
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
      {/* ================= HEADER ================= */}
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
              <h1 className="text-xl font-bold">{vendor.name}</h1>
              <div className="flex items-center gap-2 mt-1">
                <VendorStatusBadge status={vendor.status?.status} />
                <span className="text-xs text-muted-foreground font-mono">
                  ID: {vendor.vendor_id}
                </span>
              </div>
            </div>
          </div>

          <Button
            onClick={() => router.push(`/vendors/edit/${vendor.vendor_id}`)}
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
        </div>
      </div>

      {/* ================= MAIN ================= */}
      <main className="max-w-7xl mx-auto p-6 md:p-8 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT */}
          <div className="lg:col-span-2 space-y-6">
            {/* INFO */}
            <Card>
              <CardHeader>
                <CardTitle>General Information</CardTitle>
              </CardHeader>

              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <InfoItem
                    icon={<Mail />}
                    label="Email"
                    value={vendor.email}
                  />
                  <InfoItem
                    icon={<Phone />}
                    label="Phone"
                    value={vendor.phone_number}
                  />
                  <InfoItem
                    icon={<MapPin />}
                    label="Address"
                    value={vendor.address}
                    className="col-span-2"
                  />
                  <InfoItem
                    icon={<Building2 />}
                    label="Company Type"
                    value={vendor.company_type}
                  />
                </div>

                {vendor.remark && (
                  <>
                    <Separator className="my-4" />
                    <p className="text-sm">{vendor.remark}</p>
                  </>
                )}
              </CardContent>
            </Card>

            {/* PIC */}
            <section>
              <h2 className="font-bold mb-2 flex items-center gap-2">
                <User className="w-4 h-4" />
                PICs
              </h2>

              <div className="grid md:grid-cols-2 gap-3">
                {vendor.pics?.length ? (
                  vendor.pics.map((p: any) => (
                    <Card key={p.pic_id}>
                      <CardContent className="p-3">
                        <p className="font-semibold">
                          {p.firstName} {p.lastName}
                        </p>
                        <p className="text-sm">{p.email}</p>
                        <p className="text-sm">{p.phone_number}</p>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No PICs available
                  </p>
                )}
              </div>
            </section>
          </div>

          {/* RIGHT */}
          <div className="space-y-6">
            {/* CATEGORY */}
            <Card>
              <CardHeader>
                <CardTitle>Categories</CardTitle>
              </CardHeader>

              <CardContent className="flex flex-wrap gap-2">
                {vendor.categories?.map((c: any) => (
                  <Badge key={c.cte_id}>{c.cte_name}</Badge>
                ))}
              </CardContent>
            </Card>

            {/* APPROVAL */}
            <Card>
              <CardHeader>
                <CardTitle>Approval</CardTitle>
              </CardHeader>

              <CardContent>
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
        </div>

        {/* ================= DOCUMENTS ================= */}
        <section>
          <div className="flex justify-between items-center mb-3">
            <h2 className="font-bold flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Documents
            </h2>

            <Button size="sm" onClick={() => setDocModalOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Upload
            </Button>
          </div>

          <Card>
            <CardContent className="p-4 space-y-3">
              {docLoading ? (
                <p>Loading...</p>
              ) : documents.length === 0 ? (
                <p className="text-muted-foreground">No documents uploaded</p>
              ) : (
                documents.map((doc) => (
                  <div
                    key={doc.document_id}
                    className="flex justify-between items-center border p-2 rounded"
                  >
                    <div>
                      <p className="font-medium text-sm">{doc.document_type}</p>
                      <p className="text-xs">
                        Expiry:{" "}
                        {new Date(
                          doc.document_expiry_date,
                        ).toLocaleDateString()}
                      </p>
                    </div>

                    <Button
                      size="icon"
                      variant="destructive"
                      onClick={() => handleDeleteDoc(doc.document_id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </section>
      </main>

      {/* ================= MODAL ================= */}
      <VendorDocumentModal
        open={docModalOpen}
        onClose={() => setDocModalOpen(false)}
        vendorId={vendor.vendor_id}
        onSuccess={loadDocuments}
      />
    </div>
  );
}

/* ================= HELPERS ================= */

function InfoItem({ icon, label, value, className }: any) {
  return (
    <div className={className}>
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        {icon}
        {label}
      </div>
      <p className="text-sm font-medium">{value || "-"}</p>
    </div>
  );
}

function ApprovalRow({ label, status }: any) {
  return (
    <div className="flex justify-between text-sm">
      <span>{label}</span>
      <Badge variant={status ? "default" : "destructive"}>
        {status ? "Yes" : "No"}
      </Badge>
    </div>
  );
}
