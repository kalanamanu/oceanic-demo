"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { NotificationData } from "@/types/notification.types";

interface Props {
  announcement: NotificationData;
}

export function AnnouncementCardFull({ announcement }: Props) {
  return (
    <Card className="hover:shadow-md transition">
      <CardContent className="p-5">
        <div className="flex justify-between items-start gap-4">
          <div>
            <h2 className="text-lg font-semibold">
              {announcement.notificationHeadline}
            </h2>

            <p className="text-muted-foreground mt-2 whitespace-pre-line">
              {announcement.notificationDescription}
            </p>
          </div>

          <Badge className="shrink-0">{announcement.notificationType}</Badge>
        </div>

        <div className="mt-4 text-xs text-muted-foreground">
          Created: {new Date(announcement.createdAt).toLocaleString()}
        </div>
      </CardContent>
    </Card>
  );
}
