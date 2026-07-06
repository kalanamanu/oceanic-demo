"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search, Coins, Plus } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

import { DocumentService } from "@/services/document.service";
import { SavedDocument } from "@/types/document.types";

import CreditNoteViewDialog from "./CreditNoteViewDialog";
import EditCreditNoteDialog from "./CreditNoteEditDialog";
import CreditNoteCreateDialog from "./CreditNoteCreateDialog";

export default function CreditNotePage() {
  const [documents, setDocuments] = useState<SavedDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  /* ================= VIEW ================= */
  const [viewDoc, setViewDoc] = useState<any>(null);
  const [viewOpen, setViewOpen] = useState(false);

  /* ================= EDIT ================= */
  const [editDoc, setEditDoc] = useState<any>(null);
  const [editOpen, setEditOpen] = useState(false);

  /* ================= CREATE ================= */
  const [createOpen, setCreateOpen] = useState(false);

  /* ================= LOAD LIST ================= */
  useEffect(() => {
    const loadCreditNotes = async () => {
      try {
        const res = await DocumentService.getSavedDocuments({
          documentType: "CREDIT NOTE" as any, // 👈 IMPORTANT FIX
        });

        if (res.success) {
          setDocuments(res.savedDocuments || []);
        }
      } catch (err) {
        console.error("Failed to load credit notes:", err);
      } finally {
        setLoading(false);
      }
    };

    loadCreditNotes();
  }, []);

  /* ================= FILTER ================= */
  const filteredDocuments = documents.filter((doc) => {
    const ref = doc.reference_no?.toLowerCase() || "";
    const status = doc.status?.toLowerCase() || "";
    const query = search.toLowerCase();

    return ref.includes(query) || status.includes(query);
  });

  /* ================= VIEW ================= */
  const handleViewDocument = async (docId: string) => {
    try {
      setViewOpen(true);
      setViewDoc(null);

      const res = await DocumentService.getDocument(docId);

      if (res.success) {
        setViewDoc(res.document);
      }
    } catch (err) {
      console.error("View failed:", err);
    }
  };

  /* ================= EDIT ================= */
  const handleEditDocument = async (docId: string) => {
    try {
      setEditOpen(true);
      setEditDoc(null);

      const res = await DocumentService.getDocument(docId);

      if (res.success) {
        setEditDoc(res.document);
      }
    } catch (err) {
      console.error("Edit failed:", err);
    }
  };

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-muted-foreground">Loading credit notes...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* HEADER */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Credit Notes</h1>
            <p className="text-muted-foreground">
              Manage customer credit notes and adjustments
            </p>
          </div>

          <div className="flex flex-col gap-3 md:flex-row">
            {/* SEARCH */}
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

              <Input
                className="pl-9"
                placeholder="Search reference..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* CREATE (OPENS DIALOG) */}
            <Button onClick={() => setCreateOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Credit Note
            </Button>
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
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-cyan-500/10 p-2">
                      <Coins className="h-5 w-5 text-cyan-500" />
                    </div>

                    <CardTitle className="text-base">
                      {doc.reference_no}
                    </CardTitle>
                  </div>
                </CardHeader>

                <CardContent className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">
                    Created:{" "}
                    {doc.createdAt
                      ? new Date(doc.createdAt).toLocaleDateString("en-GB")
                      : "-"}
                  </p>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewDocument(doc.doc_id)}
                    >
                      View
                    </Button>

                    <Button
                      size="sm"
                      onClick={() => handleEditDocument(doc.doc_id)}
                    >
                      Edit
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* EMPTY STATE */}
        {!loading && filteredDocuments.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Coins className="h-10 w-10 text-muted-foreground" />

            <h3 className="mt-3 text-lg font-semibold">
              No credit notes found
            </h3>

            <p className="text-muted-foreground">
              Create your first credit note.
            </p>

            <Button className="mt-5" onClick={() => setCreateOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Credit Note
            </Button>
          </div>
        )}
      </div>

      {/* ================= VIEW ================= */}
      <CreditNoteViewDialog
        open={viewOpen}
        onOpenChange={setViewOpen}
        document={viewDoc}
      />

      {/* ================= EDIT ================= */}
      <EditCreditNoteDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        document={editDoc}
      />

      {/* ================= CREATE ================= */}
      <CreditNoteCreateDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
      />
    </div>
  );
}
