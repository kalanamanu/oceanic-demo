"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Search, FileSpreadsheet, ArrowRight, Loader2 } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

import { DocumentService } from "@/services/document.service";
import { SavedDocument } from "@/types/document.types";

import { CreateDeliveryNoteDialog } from "./CreateDeliveryNoteDialog";
import { ViewDeliveryNoteDialog } from "./ViewDeliveryNoteDialog";

export default function DeliveryNotePage() {
  const router = useRouter();

  const [documents, setDocuments] = useState<SavedDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [viewOpen, setViewOpen] = useState(false);
  const [viewDoc, setViewDoc] = useState<any>(null);
  const [createOpen, setCreateOpen] = useState(false);

  /* ================= LOAD LIST ================= */
  useEffect(() => {
    const loadDeliveryNotes = async () => {
      try {
        // 🚀 Fix: passing documentType matching your GetSavedDocumentsRequest type structure
        const res = await DocumentService.getSavedDocuments({
          documentType: "DELIVERYNOTE" as any,
        });

        if (res.success) {
          setDocuments(res.savedDocuments);
        }
      } catch (err) {
        console.error("Failed to load delivery notes:", err);
      } finally {
        setLoading(false);
      }
    };

    loadDeliveryNotes();
  }, []);

  /* ================= VIEW HANDLER ================= */
  const handleView = async (docId: string) => {
    try {
      const response = await DocumentService.getDocument(docId);

      if (response?.success && response.document) {
        const savedDoc = response.document;

        // 🚀 Fix: API uses data schema matching `SavedDocument.data` configuration
        const formattedData = {
          referenceNumber: savedDoc.reference_no,
          date: savedDoc.data?.date || "",
          supplyDate: savedDoc.data?.supplyDate || "",
          billToName: savedDoc.data?.billToName || "",
          billToAddress: savedDoc.data?.billToAddress || "",
          poNumber: savedDoc.data?.poNumber || "",
          items: savedDoc.data?.items || [],
        };

        setViewDoc(formattedData);
        setViewOpen(true);
      }
    } catch (error) {
      console.error("Error loading delivery note criteria:", error);
    }
  };

  /* ================= FILTER MATRIX ================= */
  const filteredDocuments = documents.filter((doc) => {
    const ref = doc.reference_no?.toLowerCase() || "";
    const status = doc.status?.toLowerCase() || "";
    const query = search.toLowerCase();

    return ref.includes(query) || status.includes(query);
  });

  if (loading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-2">
        <Loader2 className="h-6 w-6 text-primary animate-spin" />
        <p className="text-sm text-muted-foreground font-medium">
          Loading delivery note records...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* HEADER BLOCK */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Delivery Notes
            </h1>
            <p className="text-sm text-muted-foreground">
              Manage consignment logs, drop destinations, and issued receipt
              records
            </p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-72 md:flex-initial">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                className="pl-9"
                placeholder="Search reference number..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* LOGISTICS CARDS */}
        <div className="grid grid-cols-1 gap-4">
          {filteredDocuments.map((doc, index) => (
            <motion.div
              key={doc.doc_id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
            >
              <Card className="transition-all duration-200 hover:border-primary/40 hover:shadow-sm group">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 p-5">
                  <div className="flex items-center gap-4">
                    <div className="rounded-xl bg-primary/10 p-2.5 transition-colors group-hover:bg-primary/15">
                      <FileSpreadsheet className="h-5 w-5 text-primary" />
                    </div>

                    <div className="space-y-0.5">
                      <CardTitle className="text-base font-semibold tracking-tight">
                        {doc.reference_no}
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                          Created:{" "}
                          {new Date(doc.createdAt).toLocaleDateString("en-GB")}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-9 text-xs font-medium gap-1"
                      onClick={() => handleView(doc.doc_id)}
                    >
                      View
                    </Button>
                  </div>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* EMPTY DATAGRID FALLBACK */}
        {!loading && filteredDocuments.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center border rounded-2xl bg-muted/5 border-dashed">
            <FileSpreadsheet className="h-10 w-10 text-muted-foreground/60 stroke-[1.5]" />
            <h3 className="mt-4 text-base font-semibold tracking-tight">
              No delivery note documents found
            </h3>
            <p className="text-sm text-muted-foreground max-w-xs mt-1">
              There are no files logging under this sequence. Try modifying your
              search filter query.
            </p>
          </div>
        )}
      </div>

      <CreateDeliveryNoteDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
      />

      <ViewDeliveryNoteDialog
        open={viewOpen}
        onClose={() => setViewOpen(false)}
        deliveryNote={viewDoc}
      />
    </div>
  );
}
