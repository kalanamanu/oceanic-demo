"use client";

import { useEffect, useState } from "react";
import { NotificationService } from "@/services/notification.service";
import type { NotificationData } from "@/types/notification.types";
import { AnnouncementCardFull } from "./announcement-card-full";

export function AnnouncementList() {
  const [announcements, setAnnouncements] = useState<NotificationData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      const res = await NotificationService.getAnnouncements();

      // sort newest first
      const sorted = [...res.announcements].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );

      setAnnouncements(sorted);
    } catch (err) {
      console.error("Failed to load announcements", err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-24 rounded-lg border bg-muted animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (!announcements.length) {
    return (
      <div className="text-center py-20 text-muted-foreground">
        No announcements available
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {announcements.map((item) => (
        <AnnouncementCardFull key={item.notification_id} announcement={item} />
      ))}
    </div>
  );
}
