"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search, Receipt } from "lucide-react";

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

// dialogs
import { InvoiceViewDialog } from "./InvoiceViewDialog";
import { InvoiceEditDialog } from "./InvoiceEditDialog";

export default function InvoicePage() {
  const [documents, setDocuments] = useState<SavedDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  /* ================= VIEW STATE ================= */
  const [viewDoc, setViewDoc] = useState<any>(null);
  const [viewOpen, setViewOpen] = useState(false);

  /* ================= EDIT STATE ================= */
  const [editDoc, setEditDoc] = useState<any>(null);
  const [editOpen, setEditOpen] = useState(false);

  /* ================= LOAD LIST ================= */
  useEffect(() => {
    const loadInvoices = async () => {
      try {
        const res = await DocumentService.getSavedDocuments({
          documentType: "invoice" as any,
        });

        if (res.success) {
          setDocuments(res.savedDocuments);
        }
      } catch (err) {
        console.error("Failed to load invoices:", err);
      } finally {
        setLoading(false);
      }
    };

    loadInvoices();
  }, []);

  /* ================= FILTER ================= */
  const filteredDocuments = documents.filter((doc) => {
    const ref = doc.reference_no?.toLowerCase() || "";
    const status = doc.status?.toLowerCase() || "";
    const query = search.toLowerCase();

    return ref.includes(query) || status.includes(query);
  });

  /* ================= VIEW HANDLER ================= */
  const handleViewDocument = async (docId: string) => {
    try {
      setViewOpen(true);
      setViewDoc(null);

      const res = await DocumentService.getDocument(docId);

      if (res.success) {
        setViewDoc(res.document);
      }
    } catch (err) {
      console.error("Failed to load document:", err);
    }
  };

  /* ================= EDIT HANDLER ================= */
  const handleEditDocument = async (docId: string) => {
    try {
      setEditOpen(true);
      setEditDoc(null);

      const res = await DocumentService.getDocument(docId);

      if (res.success) {
        setEditDoc(res.document);
      }
    } catch (err) {
      console.error("Failed to load document:", err);
    }
  };

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-muted-foreground">Loading invoices...</p>
      </div>
    );
  }

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* HEADER */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Invoices</h1>
            <p className="text-muted-foreground">
              Manage all commercial invoices and billing records
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
                {/* HEADER */}
                <CardHeader className="flex flex-row items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-emerald-500/10 p-2">
                      <Receipt className="h-5 w-5 text-emerald-500" />
                    </div>

                    <div>
                      <CardTitle className="text-base">
                        {doc.reference_no}
                      </CardTitle>

                      <CardDescription>Status: {doc.status}</CardDescription>
                    </div>
                  </div>
                </CardHeader>

                {/* FOOTER WITH ACTIONS */}
                <CardContent className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">
                    Created:{" "}
                    {new Date(doc.createdAt).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </p>

                  <div className="flex gap-2">
                    {/* VIEW */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewDocument(doc.doc_id)}
                    >
                      View
                    </Button>

                    {/* EDIT */}
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
            <Receipt className="h-10 w-10 text-muted-foreground" />

            <h3 className="mt-3 text-lg font-semibold">No invoices found</h3>

            <p className="text-muted-foreground">
              Try changing your search query
            </p>
          </div>
        )}
      </div>

      {/* ================= VIEW DIALOG ================= */}
      <InvoiceViewDialog
        open={viewOpen}
        onOpenChange={setViewOpen}
        document={viewDoc}
        onDownload={() => console.log("download view")}
      />

      {/* ================= EDIT DIALOG ================= */}
      <InvoiceEditDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        document={editDoc}
      />
    </div>
  );
}
