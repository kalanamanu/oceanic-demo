"use client";

import { Megaphone } from "lucide-react";
import { AnnouncementList } from "@/components/announcements/announcement-list";

export default function AnnouncementsPage() {
  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 rounded-lg bg-primary/10">
          <Megaphone className="h-6 w-6 text-primary" />
        </div>

        <div>
          <h1 className="text-2xl font-bold">Announcements</h1>
          <p className="text-muted-foreground text-sm">
            All system updates and important notices
          </p>
        </div>
      </div>

      {/* List */}
      <AnnouncementList />
    </div>
  );
}
