"use client";

import * as React from "react";
import { Eye, Edit, Trash2, FileText } from "lucide-react";

import { Button } from "@/components/ui/button";

import { VendorService } from "@/services/vendor.service";
import { UploadService } from "@/services/upload.service";

import { toast } from "sonner";

interface VendorDocumentListProps {
  vendorId: string;
  readOnly?: boolean;

  // UPDATED
  onEdit?: (document: any) => void;

  onDelete?: () => void;
  refreshTrigger?: number;
}

export function VendorDocumentList({
  vendorId,
  readOnly = false,
  onEdit,
  onDelete,
  refreshTrigger,
}: VendorDocumentListProps) {
  const [documents, setDocuments] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);

  /* ================= LOAD DOCUMENTS ================= */
  const loadDocuments = async () => {
    try {
      setLoading(true);

      const res = await VendorService.getVendorDocuments({
        vendor_id: vendorId,
      });

      setDocuments(res);
    } catch (err) {
      console.error(err);

      toast.error("Failed to load documents");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (vendorId) {
      loadDocuments();
    }
  }, [vendorId, refreshTrigger]);

  /* ================= VIEW FILE ================= */
  const handleViewFile = async (fileId: number) => {
    try {
      const url = await UploadService.getFileUrl(fileId);

      window.open(url, "_blank");
    } catch (err) {
      console.error(err);

      toast.error("Failed to open file");
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = async (docId: string) => {
    const confirmed = confirm("Delete this document?");

    if (!confirmed) return;

    try {
      await VendorService.deleteVendorDocument(docId);

      toast.success("Document deleted");

      onDelete?.();

      loadDocuments();
    } catch (err) {
      console.error(err);

      toast.error("Failed to delete document");
    }
  };

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="h-20 rounded-lg border animate-pulse bg-muted/30"
          />
        ))}
      </div>
    );
  }

  /* ================= EMPTY ================= */
  if (documents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center border border-dashed rounded-lg">
        <FileText className="w-10 h-10 text-muted-foreground mb-3" />

        <p className="font-medium">No documents uploaded</p>

        <p className="text-sm text-muted-foreground">
          Upload vendor documents to manage records
        </p>
      </div>
    );
  }

  /* ================= UI ================= */
  return (
    <div className="space-y-3">
      {documents.map((doc) => (
        <div
          key={doc.document_id}
          className="flex items-center justify-between rounded-lg border p-4 hover:bg-muted/40 transition-colors"
        >
          {/* LEFT */}
          <div className="space-y-1">
            <p className="font-medium text-sm capitalize">
              {doc.document_type?.replaceAll("_", " ")}
            </p>

            <p className="text-xs text-muted-foreground">
              Expiry:{" "}
              {doc.document_expiry_date
                ? new Date(doc.document_expiry_date).toLocaleDateString()
                : "-"}
            </p>

            {doc.remarks && (
              <p className="text-xs text-muted-foreground italic">
                {doc.remarks}
              </p>
            )}
          </div>

          {/* ACTIONS */}
          <div className="flex items-center gap-2">
            {/* VIEW */}
            <Button
              size="icon"
              variant="outline"
              className="h-8 w-8"
              onClick={() => handleViewFile(doc.upload_doc_id)}
            >
              <Eye className="w-4 h-4" />
            </Button>

            {!readOnly && (
              <>
                {/* EDIT */}
                <Button
                  size="icon"
                  variant="secondary"
                  className="h-8 w-8"
                  onClick={() => onEdit?.(doc)}
                >
                  <Edit className="w-4 h-4" />
                </Button>

                {/* DELETE */}
                <Button
                  size="icon"
                  variant="destructive"
                  className="h-8 w-8"
                  onClick={() => handleDelete(doc.document_id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
