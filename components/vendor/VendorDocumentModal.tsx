"use client";

import * as React from "react";
import { VendorService } from "@/services/vendor.service";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { DatePicker } from "@/components/ui/date-picker";
import { UploadService } from "@/services/upload.service";

interface Props {
  open: boolean;
  onClose: () => void;
  vendorId: string;

  documentId?: string | null;
  initialData?: any;

  onSuccess?: () => void;
}

const DOCUMENT_TYPES = [
  "vendor_registration_form",
  "agreement",
  "bank_details",
  "business_registration_certificate",
  "ISO_certification",
  "VAT",
  "other",
];

export function VendorDocumentModal({
  open,
  onClose,
  vendorId,
  documentId,
  initialData,
  onSuccess,
}: Props) {
  const isEditMode = !!documentId;

  const [loading, setLoading] = React.useState(false);
  const [uploading, setUploading] = React.useState(false);

  const [uploadDocId, setUploadDocId] = React.useState<number | null>(null);
  const [fileName, setFileName] = React.useState("");

  const [documentType, setDocumentType] = React.useState("");
  const [otherDocType, setOtherDocType] = React.useState("");
  const [expiryDate, setExpiryDate] = React.useState<Date | undefined>();
  const [remarks, setRemarks] = React.useState("");

  /* ================= LOAD EDIT DATA ================= */
  React.useEffect(() => {
    if (!initialData || !open) return;

    setUploadDocId(
      initialData.upload_doc_id ? Number(initialData.upload_doc_id) : null,
    );

    setDocumentType(initialData.document_type || "");

    setOtherDocType(initialData.other_document_type || "");

    setRemarks(initialData.remarks || "");

    if (initialData.document_expiry_date) {
      setExpiryDate(new Date(initialData.document_expiry_date));
    }

    // optional if backend returns original_name
    setFileName(initialData.original_name || "");
  }, [initialData, open]);

  /* ================= RESET ================= */
  const resetForm = () => {
    setUploadDocId(null);
    setFileName("");
    setDocumentType("");
    setOtherDocType("");
    setExpiryDate(undefined);
    setRemarks("");
  };

  /* ================= FILE UPLOAD ================= */
  const handleFileUpload = async (file: File) => {
    try {
      setUploading(true);

      const data = await UploadService.uploadFile({
        file,
        useFor: "vendor_documents",
      });

      setUploadDocId(data.id);
      setFileName(data.original_name);

      toast.success("File uploaded successfully");
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  /* ================= VALIDATION ================= */
  const isValid = () => {
    if (!uploadDocId || !documentType || !expiryDate) {
      toast.error("Please complete all required fields");
      return false;
    }

    if (documentType === "other" && !otherDocType) {
      toast.error("Please specify other document type");
      return false;
    }

    return true;
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {
    if (!isValid()) return;

    try {
      setLoading(true);

      const payload = {
        vendor_id: vendorId,
        upload_doc_id: uploadDocId!,
        document_type: documentType,
        other_document_type: documentType === "other" ? otherDocType : null,
        document_expiry_date: expiryDate!.toISOString().split("T")[0],
        remarks,
      };

      if (isEditMode && documentId) {
        await VendorService.updateVendorDocument(documentId, payload);

        toast.success("Document updated successfully");
      } else {
        await VendorService.createVendorDocument(payload);

        toast.success("Document created successfully");
      }

      onSuccess?.();

      resetForm();

      onClose();
    } catch (err: any) {
      console.error(err);

      toast.error(err?.message || "Failed to save vendor document");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        if (!state) {
          onClose();

          if (!isEditMode) {
            resetForm();
          }
        }
      }}
    >
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Edit Vendor Document" : "Upload Vendor Document"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* FILE UPLOAD */}
          <div>
            <Label>Document File *</Label>

            <div className="border border-dashed rounded-lg p-4 text-center bg-muted/20">
              <input
                type="file"
                id="file-upload"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];

                  if (file) {
                    handleFileUpload(file);
                  }
                }}
              />

              <label
                htmlFor="file-upload"
                className="cursor-pointer flex flex-col items-center gap-2 text-sm"
              >
                {uploading ? (
                  <span>Uploading...</span>
                ) : fileName ? (
                  <>
                    <span className="font-medium">{fileName}</span>

                    <span className="text-xs text-muted-foreground">
                      Click to replace file
                    </span>
                  </>
                ) : (
                  <>
                    <span className="font-medium">Click to upload file</span>

                    <span className="text-xs text-muted-foreground">
                      PDF, DOCX, Images, etc.
                    </span>
                  </>
                )}
              </label>
            </div>
          </div>

          {/* DOCUMENT TYPE */}
          <div>
            <Label>Document Type *</Label>

            <select
              className="w-full border rounded-md p-2 bg-background text-foreground"
              value={documentType}
              onChange={(e) => setDocumentType(e.target.value)}
            >
              <option value="">Select type</option>

              {DOCUMENT_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type.replaceAll("_", " ")}
                </option>
              ))}
            </select>
          </div>

          {/* OTHER TYPE */}
          {documentType === "other" && (
            <div>
              <Label>Specify Document Type *</Label>

              <Input
                placeholder="Enter document type"
                value={otherDocType}
                onChange={(e) => setOtherDocType(e.target.value)}
              />
            </div>
          )}

          {/* EXPIRY DATE */}
          <div>
            <Label>Expiry Date *</Label>

            <DatePicker date={expiryDate} onDateChange={setExpiryDate} />
          </div>

          {/* REMARKS */}
          <div>
            <Label>Remarks</Label>

            <textarea
              rows={3}
              className="w-full border rounded-md p-2 bg-background"
              placeholder="Enter remarks"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
            />
          </div>

          {/* ACTIONS */}
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>

            <Button onClick={handleSubmit} disabled={loading || uploading}>
              {loading
                ? "Saving..."
                : isEditMode
                  ? "Update Document"
                  : "Save Document"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
