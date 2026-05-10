"use client";

import * as React from "react";
import { FileText, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { VendorDocumentModal } from "@/components/vendor/VendorDocumentModal";
import { VendorDocumentList } from "./VendorDocumentList";

export function VendorDocumentSection({ vendorId }: { vendorId: string }) {
  const [modalOpen, setModalOpen] = React.useState(false);

  const [selectedDocument, setSelectedDocument] = React.useState<any>(null);

  const [refreshKey, setRefreshKey] = React.useState(0);

  /* ================= REFRESH ================= */
  const triggerRefresh = () => setRefreshKey((prev) => prev + 1);

  /* ================= CREATE ================= */
  const handleCreate = () => {
    setSelectedDocument(null);
    setModalOpen(true);
  };

  /* ================= EDIT ================= */
  const handleEdit = (document: any) => {
    setSelectedDocument(document);
    setModalOpen(true);
  };

  return (
    <section>
      {/* HEADER */}
      <div className="flex justify-between items-center mb-3">
        <h2 className="font-bold flex items-center gap-2">
          <FileText className="w-4 h-4" />
          Documents
        </h2>

        <Button size="sm" onClick={handleCreate}>
          <Plus className="w-4 h-4 mr-2" />
          Upload
        </Button>
      </div>

      {/* DOCUMENT LIST */}
      <Card>
        <CardContent className="p-4">
          <VendorDocumentList
            vendorId={vendorId}
            refreshTrigger={refreshKey}
            onEdit={handleEdit}
          />
        </CardContent>
      </Card>

      {/* MODAL */}
      <VendorDocumentModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedDocument(null);
        }}
        vendorId={vendorId}
        documentId={selectedDocument?.document_id || null}
        initialData={selectedDocument}
        onSuccess={triggerRefresh}
      />
    </section>
  );
}
