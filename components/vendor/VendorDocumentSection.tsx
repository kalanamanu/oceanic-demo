"use client";

import * as React from "react";
import { FileText, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { VendorDocumentModal } from "@/components/vendor/VendorDocumentModal";
import { VendorDocumentList } from "./VendorDocumentList";

export function VendorDocumentSection({ vendorId }: { vendorId: string }) {
  const [modalOpen, setModalOpen] = React.useState(false);
  const [selectedDocId, setSelectedDocId] = React.useState<string | null>(null);
  const [refreshKey, setRefreshKey] = React.useState(0);

  const triggerRefresh = () => setRefreshKey((prev) => prev + 1);

  const handleEdit = (id: string) => {
    setSelectedDocId(id);
    setModalOpen(true);
  };

  return (
    <section>
      <div className="flex justify-between items-center mb-3">
        <h2 className="font-bold flex items-center gap-2">
          <FileText className="w-4 h-4" />
          Documents
        </h2>
        <Button size="sm" onClick={() => setModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Upload
        </Button>
      </div>

      <Card>
        <CardContent className="p-4">
          <VendorDocumentList
            vendorId={vendorId}
            onEdit={handleEdit}
            refreshTrigger={refreshKey}
          />
        </CardContent>
      </Card>

      <VendorDocumentModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedDocId(null);
        }}
        vendorId={vendorId}
        documentId={selectedDocId}
        onSuccess={triggerRefresh}
      />
    </section>
  );
}
