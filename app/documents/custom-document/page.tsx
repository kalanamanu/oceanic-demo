"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Search, ShieldCheck, ArrowRight } from "lucide-react";

import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

import { DocumentService } from "@/services/document.service";
import { SavedDocument } from "@/types/document.types";

export default function CustomDocumentPage() {
  const router = useRouter();

  const [documents, setDocuments] = useState<SavedDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const loadCustomDocuments = async () => {
      try {
        const res = await DocumentService.getSavedDocuments({
          documentType: "CUSTOMDOCUMENT" as any,
        });

        if (res.success) {
          setDocuments(res.savedDocuments);
        }
      } catch (err) {
        console.error("Failed to load custom documents:", err);
      } finally {
        setLoading(false);
      }
    };

    loadCustomDocuments();
  }, []);

  const filteredDocuments = documents.filter((doc) => {
    const ref = doc.reference_no?.toLowerCase() || "";
    const status = doc.status?.toLowerCase() || "";
    const query = search.toLowerCase();

    return ref.includes(query) || status.includes(query);
  });

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-muted-foreground">Loading custom documents...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Custom Documents</h1>
            <p className="text-muted-foreground">
              Manage user-defined and custom generated documents
            </p>
          </div>

          {/* Search */}
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

        {/* List */}
        <div className="grid grid-cols-1 gap-4">
          {filteredDocuments.map((doc, index) => (
            <motion.div
              key={doc.doc_id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card
                className="cursor-pointer transition hover:border-primary/50"
                onClick={() =>
                  router.push(`/documents/custom-document/${doc.doc_id}`)
                }
              >
                <CardHeader className="flex flex-row items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-red-500/10 p-2">
                      <ShieldCheck className="h-5 w-5 text-red-500" />
                    </div>

                    <div>
                      <CardTitle className="text-base">
                        {doc.reference_no}
                      </CardTitle>

                      <CardDescription>Status: {doc.status}</CardDescription>
                    </div>
                  </div>

                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </CardHeader>

                <CardContent>
                  <p className="text-xs text-muted-foreground">
                    Created: {new Date(doc.createdAt).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Empty state */}
        {!loading && filteredDocuments.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <ShieldCheck className="h-10 w-10 text-muted-foreground" />

            <h3 className="mt-3 text-lg font-semibold">
              No custom documents found
            </h3>

            <p className="text-muted-foreground">
              Try changing your search query
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
