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
import apiClient from "@/lib/api-client";
import { UploadService } from "@/services/upload.service";

interface Props {
  open: boolean;
  onClose: () => void;
  vendorId: string;
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
  onSuccess,
}: Props) {
  const [loading, setLoading] = React.useState(false);
  const [uploading, setUploading] = React.useState(false);

  const [uploadDocId, setUploadDocId] = React.useState<number | null>(null);
  const [fileName, setFileName] = React.useState("");

  const [documentType, setDocumentType] = React.useState("");
  const [otherDocType, setOtherDocType] = React.useState("");
  const [expiryDate, setExpiryDate] = React.useState<Date | undefined>();
  const [remarks, setRemarks] = React.useState("");

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
      toast.error(err.message || "Upload failed");
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

      await VendorService.createVendorDocument({
        vendor_id: vendorId,
        upload_doc_id: uploadDocId!,
        document_type: documentType,
        other_document_type: documentType === "other" ? otherDocType : null,
        document_expiry_date: expiryDate!.toISOString().split("T")[0],
        remarks,
      });

      toast.success("Document added");

      onSuccess?.();
      onClose();

      // reset
      setUploadDocId(null);
      setFileName("");
      setDocumentType("");
      setOtherDocType("");
      setExpiryDate(undefined);
      setRemarks("");
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "Failed to save document");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Upload Vendor Document</DialogTitle>
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
                  if (e.target.files?.[0]) {
                    handleFileUpload(e.target.files[0]);
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
                      PDF, Image, etc.
                    </span>
                  </>
                )}
              </label>
            </div>
          </div>
          <div>
            <Label>Document Type *</Label>
            <select
              className="w-full border rounded p-2 bg-background"
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
                value={otherDocType}
                onChange={(e) => setOtherDocType(e.target.value)}
              />
            </div>
          )}

          {/* DATE PICKER */}
          <div>
            <Label>Expiry Date *</Label>
            <DatePicker date={expiryDate} onDateChange={setExpiryDate} />
          </div>

          {/* REMARKS */}
          <div>
            <Label>Remarks</Label>
            <textarea
              className="w-full border rounded p-2 bg-background"
              rows={3}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
            />
          </div>

          {/* ACTIONS */}
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>

            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? "Saving..." : "Save Document"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
