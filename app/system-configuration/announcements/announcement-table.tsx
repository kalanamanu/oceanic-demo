"use client";

import * as React from "react";
import { format } from "date-fns";
import { Megaphone, Inbox, CircleDot } from "lucide-react";

import { NotificationService } from "@/services/notification.service";
import type { NotificationData } from "@/types/notification.types";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function AnnouncementTable() {
  const [data, setData] = React.useState<NotificationData[]>([]);
  const [loading, setLoading] = React.useState(true);

  const loadAnnouncements = async () => {
    try {
      setLoading(true);
      const res = await NotificationService.getAnnouncements();

      const sorted = [...(res?.announcements || [])].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );

      setData(sorted);
    } catch (err) {
      console.error("Failed to load system announcements:", err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadAnnouncements();
  }, []);

  // Professional formatting Baseline
  const formatDisplayDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const d = new Date(dateString);
    return `${format(d, "dd.MM.yyyy")} ${format(d, "HH:mm")}`;
  };

  return (
    <div className="border rounded-lg overflow-hidden bg-card shadow-sm border-muted/60 antialiased">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-muted/40 text-xs uppercase tracking-wider font-medium">
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[24%] pl-4 font-semibold">
                Headline
              </TableHead>
              <TableHead className="w-[44%] font-semibold">
                Description
              </TableHead>
              <TableHead className="w-[18%] font-semibold">
                Created At
              </TableHead>
              <TableHead className="w-[14%] pr-4 font-semibold">
                Status
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              /* PROGRESSIVE STRUCTURAL MULTI-ROW SKELETON LOADERS */
              Array.from({ length: 3 }).map((_, idx) => (
                <TableRow
                  key={`announcement-skeleton-${idx}`}
                  className="animate-pulse"
                >
                  <TableCell className="pl-4 py-4">
                    <div className="h-4 w-3/4 bg-muted rounded" />
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="h-4 w-11/12 bg-muted rounded" />
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="h-4 w-28 bg-muted rounded" />
                  </TableCell>
                  <TableCell className="pr-4 py-4">
                    <div className="h-5 w-16 bg-muted rounded-full" />
                  </TableCell>
                </TableRow>
              ))
            ) : data.length === 0 ? (
              /* POLISHED SYSTEM EMPTY STATE OVERLAY */
              <TableRow>
                <TableCell colSpan={4} className="h-48 text-center">
                  <div className="flex flex-col items-center justify-center space-y-2.5 text-muted-foreground">
                    <Inbox className="h-8 w-8 text-muted-foreground/50 stroke-[1.5]" />
                    <div className="text-sm font-medium">
                      No announcements published
                    </div>
                    <p className="text-xs text-muted-foreground/70 max-w-[280px] mx-auto">
                      System wide broadsheets or broadcasts will appear here
                      when issued.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              /* ACTIVE BROADCAST ARTIFACT CELLS */
              data.map((item) => (
                <TableRow
                  key={item.notification_id}
                  className="hover:bg-muted/20 transition-colors text-foreground/90"
                >
                  {/* HEADLINE COLUMN WITH ACTION SYMBOL */}
                  <td className="p-4 pl-4 font-medium text-foreground max-w-[200px] truncate">
                    <div className="flex items-center gap-2">
                      <span className="truncate">
                        {item.notificationHeadline}
                      </span>
                    </div>
                  </td>

                  {/* DESCRIPTION PARAGRAPH BOUNDED CELL */}
                  <td className="p-4 text-xs text-muted-foreground/90 max-w-md">
                    <p className="line-clamp-2 leading-relaxed break-words">
                      {item.notificationDescription}
                    </p>
                  </td>

                  {/* FORMATTED TIMESTAMP */}
                  <td className="p-4 text-xs text-muted-foreground/80 font-mono whitespace-nowrap">
                    {formatDisplayDate(item.createdAt)}
                  </td>

                  {/* ADAPTIVE INLINE MINI STATUS BADGES */}
                  <td className="p-4 pr-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium border ${
                        item.isActive
                          ? "bg-emerald-50/60 text-emerald-700 border-emerald-200/40 dark:bg-emerald-950/10 dark:text-emerald-400"
                          : "bg-muted text-muted-foreground border-border/50"
                      }`}
                    >
                      <CircleDot
                        className={`w-1.5 h-1.5 ${item.isActive ? "fill-emerald-500 text-emerald-500" : "fill-muted-foreground/60 text-muted-foreground/60"}`}
                      />
                      {item.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
