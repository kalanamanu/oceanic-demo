"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  FileText,
  Receipt,
  Truck,
  ShoppingCart,
  ShieldCheck,
  Search,
  ArrowRight,
  ClipboardList, // New icon for Delivery Note
  Coins, // New icon for Credit Note
  LucideIcon,
} from "lucide-react";

import { DocumentService } from "@/services/document.service";
import { DocumentType } from "@/types/document.types";

import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

type DocumentCardConfig = {
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  href: string;
};

const DOCUMENT_TYPE_CONFIG: Record<string, DocumentCardConfig> = {
  // "CREDITNOTE: {
  //   title: "Pre-Costing",
  //   description: "Estimations and initial cost analysis for vessel inquiries.",
  //   icon: FileText,
  //   color: "text-blue-500",
  //   bgColor: "bg-blue-500/10",
  //   href: "/documents/pre-cost",
  // },
  INVOICE: {
    title: "Invoices",
    description: "Manage billing, commercial invoices, and payment tracking.",
    icon: Receipt,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
    href: "/documents/invoice",
  },
  DISPATCHNOTE: {
    title: "Dispatch Notes",
    description: "Tracking delivery logs and issued items manifesto.",
    icon: Truck,
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
    href: "/documents/dispatch-note",
  },
  DELIVERYNOTE: {
    title: "Delivery Notes",
    description:
      "Proof of shipment delivery, structural acknowledgments, and customer receipts.",
    icon: ClipboardList,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    href: "/documents/delivery-note",
  },
  PO: {
    title: "Purchase Orders",
    description: "Supplier orders, PO numbers, and procurement records.",
    icon: ShoppingCart,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
    href: "/documents/purchase-order",
  },
  CREDITNOTE: {
    title: "Credit Notes",
    description:
      "Manage returns, balance adjustments, and customer credit values.",
    icon: Coins,
    color: "text-cyan-500",
    bgColor: "bg-cyan-500/10",
    href: "/documents/credit-note",
  },
  CUSTOMDOCUMENT: {
    title: "Custom Documents",
    description: "Custom document templates and generated records.",
    icon: ShieldCheck,
    color: "text-red-500",
    bgColor: "bg-red-500/10",
    href: "/documents/custom-document",
  },
};

export default function DocumentsPage() {
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [documentTypes, setDocumentTypes] = useState<DocumentType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDocumentTypes = async () => {
      try {
        const response = await DocumentService.getDocumentTypes();

        if (response.success) {
          setDocumentTypes(response.availableDocumentTypes);
        }
      } catch (error) {
        console.error("Failed to load document types:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDocumentTypes();
  }, []);

  const documents = documentTypes
    .filter((type) => DOCUMENT_TYPE_CONFIG[type])
    .map((type) => ({
      id: type,
      ...DOCUMENT_TYPE_CONFIG[type],
    }));

  const filteredDocs = documents.filter((doc) =>
    doc.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-muted-foreground">Loading document types...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Documents</h1>
            <p className="text-muted-foreground">
              Centralized repository for vessel documentation and procurement
              records.
            </p>
          </div>

          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

            <Input
              placeholder="Search documents..."
              className="h-11 rounded-xl pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Document Cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredDocs.map((doc, index) => (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              whileHover={{ y: -4 }}
            >
              <Card
                className="group cursor-pointer overflow-hidden border-2 shadow-sm transition-all hover:border-primary/50"
                onClick={() => router.push(doc.href)}
              >
                <CardHeader className="space-y-4">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl ${doc.bgColor}`}
                  >
                    <doc.icon className={`h-6 w-6 ${doc.color}`} />
                  </div>

                  <div>
                    <CardTitle className="text-xl transition-colors group-hover:text-primary">
                      {doc.title}
                    </CardTitle>

                    <CardDescription className="mt-2 line-clamp-2">
                      {doc.description}
                    </CardDescription>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="flex items-center text-sm font-semibold text-primary">
                    View Documents
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {!loading && filteredDocs.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="rounded-full bg-muted p-6">
              <Search className="h-10 w-10 text-muted-foreground" />
            </div>

            <h3 className="mt-4 text-lg font-semibold">
              No document types found
            </h3>

            <p className="text-muted-foreground">
              Try adjusting your search criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
