"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Search, ShoppingCart, ArrowRight } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

import { DocumentService } from "@/services/document.service";
import { SavedDocument } from "@/types/document.types";

import EditPODialog from "./PurchaseOrderEditDialog";
import PurchaseOrderViewDialog from "./PurchaseOrderViewDialog";

export default function PurchaseOrderPage() {
  const router = useRouter();

  const [documents, setDocuments] = useState<SavedDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // VIEW DIALOG STATE
  const [viewOpen, setViewOpen] = useState(false);
  const [viewDocId, setViewDocId] = useState<string | null>(null);

  // EDIT DIALOG STATE
  const [editOpen, setEditOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<any | null>(null);
  const [loadingDocId, setLoadingDocId] = useState<string | null>(null);

  /* ================= LOAD LIST ================= */
  useEffect(() => {
    const loadPurchaseOrders = async () => {
      try {
        const res = await DocumentService.getSavedDocuments({
          documentType: "PO" as any,
        });

        if (res?.success) {
          setDocuments(res.savedDocuments || []);
        }
      } catch (err) {
        console.error("Failed to load purchase orders:", err);
      } finally {
        setLoading(false);
      }
    };

    loadPurchaseOrders();
  }, []);

  /* ================= FILTER ================= */
  const filteredDocuments = documents.filter((doc) => {
    const ref = doc?.reference_no?.toLowerCase() || "";
    const status = doc?.status?.toLowerCase() || "";
    const query = search.toLowerCase();

    return ref.includes(query) || status.includes(query);
  });

  /* ================= VIEW HANDLER ================= */
  const handleView = (docId: string) => {
    setViewDocId(docId);
    setViewOpen(true);
  };

  /* ================= EDIT HANDLER ================= */
  const handleEdit = async (docId: string) => {
    try {
      setLoadingDocId(docId);

      const response = await DocumentService.getDocument(docId);

      console.log("FULL RESPONSE:", response);
      console.log("DOCUMENT ONLY:", response?.document);

      // ✅ IMPORTANT FIX
      setSelectedDocument(response?.document || null);

      setEditOpen(true);
    } catch (error) {
      console.error("Edit fetch failed:", error);
    } finally {
      setLoadingDocId(null);
    }
  };

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-muted-foreground">Loading purchase orders...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* HEADER */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Purchase Orders</h1>
            <p className="text-muted-foreground">
              Manage supplier orders and procurement records
            </p>
          </div>

          {/* SEARCH */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

            <Input
              className="pl-9"
              placeholder="Search reference no..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* LIST */}
        <div className="grid grid-cols-1 gap-4">
          {filteredDocuments.map((doc, index) => (
            <motion.div
              key={doc.doc_id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="transition hover:border-primary/50">
                <CardHeader className="flex flex-row items-center justify-between">
                  {/* LEFT */}
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-purple-500/10 p-2">
                      <ShoppingCart className="h-5 w-5 text-purple-500" />
                    </div>

                    <div>
                      <CardTitle className="text-base">
                        {doc.reference_no}
                      </CardTitle>

                      {/* <CardDescription>Status: {doc.status}</CardDescription> */}
                    </div>
                  </div>

                  {/* RIGHT ACTIONS */}
                  <div className="flex items-center gap-2">
                    {/* VIEW */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleView(doc.doc_id)}
                    >
                      View
                    </Button>

                    {/* EDIT */}
                    {/* <Button
                      size="sm"
                      onClick={() => handleEdit(doc.doc_id)}
                      disabled={loadingDocId === doc.doc_id}
                    >
                      {loadingDocId === doc.doc_id ? "Loading..." : "Edit"}
                    </Button> */}
                  </div>
                </CardHeader>

                <CardContent>
                  <p className="text-xs text-muted-foreground">
                    Created:{" "}
                    {doc?.createdAt
                      ? new Date(doc.createdAt).toLocaleDateString("en-GB")
                      : "-"}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* EMPTY STATE */}
        {!loading && filteredDocuments.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <ShoppingCart className="h-10 w-10 text-muted-foreground" />

            <h3 className="mt-3 text-lg font-semibold">
              No purchase orders found
            </h3>

            <p className="text-muted-foreground">
              Try changing your search query
            </p>
          </div>
        )}
      </div>

      {/* VIEW DIALOG */}
      {viewOpen && viewDocId && (
        <PurchaseOrderViewDialog
          docId={viewDocId}
          open={viewOpen}
          onClose={() => {
            setViewOpen(false);
            setViewDocId(null);
          }}
        />
      )}

      {/* EDIT DIALOG */}
      {editOpen && selectedDocument && (
        <EditPODialog
          docId={selectedDocument.doc_id}
          open={editOpen}
          onClose={() => {
            setEditOpen(false);
            setSelectedDocument(null);
          }}
        />
      )}
    </div>
  );
}
