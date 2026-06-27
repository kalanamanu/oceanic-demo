"use client";

import { Megaphone } from "lucide-react";

import { AnnouncementForm } from "./announcement-form";
import { AnnouncementTable } from "./announcement-table";

export default function SystemAnnouncementsPage() {
  return (
    <div className="p-6 space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-lg bg-primary/10">
          <Megaphone className="h-6 w-6 text-primary" />
        </div>

        <div>
          <h1 className="text-2xl font-bold">Announcement Management</h1>
          <p className="text-muted-foreground text-sm">
            Create and manage system-wide announcements
          </p>
        </div>
      </div>

      {/* Create Form */}
      <AnnouncementForm />

      {/* List */}
      <AnnouncementTable />
    </div>
  );
}
