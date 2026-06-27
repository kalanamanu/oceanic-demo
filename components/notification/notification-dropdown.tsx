"use client";

import { useEffect, useState } from "react";
import { Bell, Check } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";

import { NotificationService } from "@/services/notification.service";
import { AuthService } from "@/services/auth.service";

import type { UserNotificationData } from "@/types/notification.types";

export function NotificationDropdown() {
  const [notifications, setNotifications] = useState<UserNotificationData[]>(
    [],
  );
  const [loading, setLoading] = useState(true);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const loadNotifications = async () => {
    try {
      const user = AuthService.getCurrentUser();

      if (!user) return;

      const res = await NotificationService.getUserNotifications(user.id);

      setNotifications(res.notifications);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const markAsRead = async (notificationId: string) => {
    try {
      const user = AuthService.getCurrentUser();

      if (!user) return;

      await NotificationService.markAsRead(user.id, notificationId);

      setNotifications((prev) =>
        prev.map((item) =>
          item.notification.notification_id === notificationId
            ? { ...item, isRead: true }
            : item,
        ),
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <DropdownMenu onOpenChange={(open) => open && loadNotifications()}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="relative h-9 w-9">
          <Bell className="h-4 w-4" />

          {unreadCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-[380px] p-0">
        <div className="border-b px-4 py-3">
          <h4 className="font-semibold">Notifications</h4>
          <p className="text-xs text-muted-foreground">{unreadCount} unread</p>
        </div>

        <div className="max-h-[400px] overflow-y-auto">
          {loading && (
            <div className="p-4 text-center text-sm text-muted-foreground">
              Loading...
            </div>
          )}

          {!loading && notifications.length === 0 && (
            <div className="p-6 text-center text-sm text-muted-foreground">
              No notifications
            </div>
          )}

          {!loading &&
            notifications.map((item) => (
              <div
                key={item.id}
                className={`cursor-pointer border-b p-4 transition hover:bg-muted ${
                  !item.isRead && "bg-primary/5"
                }`}
                onClick={() =>
                  !item.isRead && markAsRead(item.notification.notification_id)
                }
              >
                <div className="flex justify-between gap-3">
                  <div>
                    <p className="font-medium">
                      {item.notification.notificationHeadline}
                    </p>

                    <p className="mt-1 text-sm text-muted-foreground">
                      {item.notification.notificationDescription}
                    </p>
                  </div>

                  {!item.isRead && (
                    <Check className="mt-1 h-4 w-4 text-primary" />
                  )}
                </div>
              </div>
            ))}
        </div>

        <DropdownMenuSeparator />

        <div className="p-2 text-center text-xs text-muted-foreground">
          End of notifications
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
