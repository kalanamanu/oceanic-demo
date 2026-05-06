"use client";

import * as React from "react";
import { Eye, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VendorService } from "@/services/vendor.service";
import { UploadService } from "@/services/upload.service";
import { toast } from "sonner";

interface VendorDocumentListProps {
  vendorId: string;
  readOnly?: boolean;
  onEdit?: (id: string) => void;
  onDelete?: () => void;
  refreshTrigger?: number; // Used to force reload from parent
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

  const loadDocuments = async () => {
    try {
      setLoading(true);
      const res = await VendorService.getVendorDocuments({
        vendor_id: vendorId,
      });
      setDocuments(res);
    } catch (err) {
      toast.error("Failed to load documents");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (vendorId) loadDocuments();
  }, [vendorId, refreshTrigger]);

  const handleViewFile = async (fileId: number) => {
    const url = await UploadService.getFileUrl(fileId);
    window.open(url, "_blank");
  };

  const handleDelete = async (docId: string) => {
    if (!confirm("Delete this document?")) return;
    try {
      await VendorService.deleteVendorDocument(docId);
      toast.success("Document deleted");
      if (onDelete) onDelete();
      loadDocuments();
    } catch {
      toast.error("Failed to delete document");
    }
  };

  if (loading)
    return <p className="text-sm animate-pulse">Loading documents...</p>;
  if (documents.length === 0)
    return (
      <p className="text-sm text-muted-foreground">No documents uploaded</p>
    );

  return (
    <div className="space-y-3">
      {documents.map((doc) => (
        <div
          key={doc.document_id}
          className="flex justify-between items-center border p-3 rounded hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
        >
          <div>
            <p className="font-medium text-sm">{doc.document_type}</p>
            <p className="text-xs text-muted-foreground">
              Expiry: {new Date(doc.document_expiry_date).toLocaleDateString()}
            </p>
          </div>

          <div className="flex items-center gap-2">
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
                <Button
                  size="icon"
                  variant="secondary"
                  className="h-8 w-8"
                  onClick={() => onEdit?.(doc.document_id)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
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
