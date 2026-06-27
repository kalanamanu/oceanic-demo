"use client";

import * as React from "react";
import { Megaphone, RefreshCw } from "lucide-react";

import { AnnouncementDialog } from "./announcement-dialog";
import { AnnouncementTable } from "./announcement-table";
import { Button } from "@/components/ui/button";

export default function SystemAnnouncementsPage() {
  // Global table state hook to allow cross-component data refreshing
  const [refreshKey, setRefreshKey] = React.useState(0);

  const triggerDataRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 antialiased">
      {/* ================= HEADER CONTROL SECTION ================= */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b pb-6 border-border/60">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-primary/10 border border-primary/10 shrink-0 hidden sm:block">
            <Megaphone className="h-5 w-5 text-primary stroke-[2]" />
          </div>

          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Announcement Management
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Create, schedule, and audit active broadcast bulletins across
              global administrative nodes.
            </p>
          </div>
        </div>

        {/* ================= ACTION CONTEXT PANEL ================= */}
        <div className="flex items-center gap-3 self-start sm:self-center shrink-0">
          {/* BROADSHEET COMPILE DIALOG */}
          <AnnouncementDialog onCreated={triggerDataRefresh} />
        </div>
      </div>

      {/* ================= DATA ARCHIVE SECTOR ================= */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-sm font-semibold text-foreground/90">
            Published Announcements Archive
          </h2>
        </div>

        {/* The data grid mounts natively here, carrying the re-validation ticker key */}
        <AnnouncementTable key={refreshKey} />
      </div>
    </div>
  );
}
