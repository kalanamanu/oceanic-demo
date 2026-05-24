"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DocumentsPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Infinite fake loading
    setLoading(true);
  }, []);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Documents</h1>

            <p className="mt-1 text-muted-foreground">
              Manage vessel inquiry documents and files.
            </p>
          </div>

          <Button className="h-11 rounded-2xl px-6">
            <FolderOpen className="mr-2 h-4 w-4" />
            Browse Files
          </Button>
        </div>

        {/* Infinite Loading Screen */}
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-sm"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="w-[420px] rounded-3xl border bg-card p-8 shadow-2xl"
              >
                <div className="flex flex-col items-center text-center">
                  {/* Spinner */}
                  <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-primary/10">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                  </div>

                  {/* Title */}
                  <h2 className="text-2xl font-semibold">Loading Documents</h2>

                  {/* Description */}
                  <p className="mt-3 text-sm text-muted-foreground">
                    Preparing vessel documents and syncing records...
                  </p>

                  {/* Infinite Progress Bar */}
                  <div className="mt-8 h-3 w-full overflow-hidden rounded-full bg-muted relative">
                    <motion.div
                      initial={{ x: "-100%" }}
                      animate={{ x: "300%" }}
                      transition={{
                        repeat: Infinity,
                        duration: 1.8,
                        ease: "linear",
                      }}
                      className="absolute left-0 top-0 h-full w-1/3 rounded-full bg-primary"
                    />
                  </div>

                  {/* Footer Text */}
                  <div className="mt-5 text-xs text-muted-foreground">
                    Please wait while we process your files...
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
