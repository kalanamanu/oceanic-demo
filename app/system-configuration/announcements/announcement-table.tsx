"use client";

import { useEffect, useState } from "react";
import { NotificationService } from "@/services/notification.service";
import type { NotificationData } from "@/types/notification.types";

export function AnnouncementTable() {
  const [data, setData] = useState<NotificationData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      const res = await NotificationService.getAnnouncements();

      const sorted = [...res.announcements].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );

      setData(sorted);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 bg-muted animate-pulse rounded-md" />
        ))}
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        No announcements found
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-muted text-left">
          <tr>
            <th className="p-3">Headline</th>
            <th className="p-3">Description</th>
            <th className="p-3">Date</th>
            <th className="p-3">Status</th>
          </tr>
        </thead>

        <tbody>
          {data.map((item) => (
            <tr key={item.notification_id} className="border-t">
              <td className="p-3 font-medium">{item.notificationHeadline}</td>

              <td className="p-3 text-muted-foreground line-clamp-2">
                {item.notificationDescription}
              </td>

              <td className="p-3 text-muted-foreground">
                {new Date(item.createdAt).toLocaleDateString()}
              </td>

              <td className="p-3">
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    item.isActive
                      ? "bg-green-500/10 text-green-600"
                      : "bg-red-500/10 text-red-600"
                  }`}
                >
                  {item.isActive ? "Active" : "Inactive"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
