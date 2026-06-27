"use client";

import { Megaphone } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { NotificationService } from "@/services/notification.service";
import type { NotificationData } from "@/types/notification.types";

interface AnnouncementCardProps {
  collapsed: boolean;
}

export function AnnouncementCard({ collapsed }: AnnouncementCardProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [latest, setLatest] = useState<NotificationData | null>(null);
  const [loading, setLoading] = useState(true);

  const isActive = pathname.startsWith("/announcements");

  useEffect(() => {
    loadLatest();
  }, []);

  async function loadLatest() {
    try {
      const res = await NotificationService.getAnnouncements();

      if (res.announcements?.length) {
        // get latest (assuming sorted by createdAt OR fallback)
        const sorted = [...res.announcements].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );

        setLatest(sorted[0]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const truncate = (text: string, length = 60) => {
    if (!text) return "";
    return text.length > length ? text.slice(0, length) + "..." : text;
  };

  return (
    <div className="mb-3">
      <button
        onClick={() => router.push("/announcements")}
        className={`
          w-full flex items-start gap-3 rounded-lg border transition-all p-3 text-left
          ${collapsed ? "justify-center" : "justify-start"}
          ${
            isActive
              ? "bg-primary/15 border-primary/30"
              : "bg-gradient-to-r from-primary/10 to-transparent hover:bg-muted/50"
          }
        `}
      >
        {/* Icon */}
        <div className="flex items-center justify-center h-9 w-9 rounded-md bg-primary/10 flex-shrink-0">
          <Megaphone className="h-5 w-5 text-primary" />
        </div>

        {/* Content */}
        {!collapsed && (
          <div className="flex flex-col text-left w-full min-w-0">
            <span className="text-sm font-semibold text-foreground">
              Announcements
            </span>

            {loading ? (
              <div className="mt-1 h-3 w-24 bg-muted animate-pulse rounded" />
            ) : latest ? (
              <>
                <span className="text-[11px] font-medium text-foreground mt-1 truncate">
                  {latest.notificationHeadline}
                </span>

                <span className="text-[10px] text-muted-foreground mt-0.5 line-clamp-2">
                  {truncate(latest.notificationDescription, 70)}
                </span>
              </>
            ) : (
              <span className="text-[10px] text-muted-foreground mt-1">
                No announcements
              </span>
            )}
          </div>
        )}
      </button>
    </div>
  );
}
