"use client";

import { UserActivity } from "@/types/activity.types";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

function formatDate(dateStr: string) {
  const date = new Date(dateStr);

  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();

  return `${dd}.${mm}.${yyyy}`;
}

function formatTime(dateStr: string) {
  const date = new Date(dateStr);

  const hh = String(date.getHours()).padStart(2, "0");
  const min = String(date.getMinutes()).padStart(2, "0");
  const sec = String(date.getSeconds()).padStart(2, "0");

  return `${hh}:${min}:${sec}`;
}

export function ActivitySidePanel({
  activity,
  onClose,
}: {
  activity: UserActivity | null;
  onClose: () => void;
}) {
  if (!activity) return null;

  return (
    <div className="fixed right-0 top-0 h-full w-[380px] bg-background border-l shadow-xl p-4 z-50 overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bold">Activity Detail</h2>

        <Button size="icon" variant="ghost" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="space-y-3 text-sm">
        <div>
          <p className="text-muted-foreground">User</p>
          <p className="font-medium">{activity.username}</p>
        </div>

        <div>
          <p className="text-muted-foreground">Description</p>
          <p>{activity.activity_description}</p>
        </div>

        <div>
          <p className="text-muted-foreground">Type</p>
          <p>{activity.activity_type}</p>
        </div>

        <div>
          <p className="text-muted-foreground">Module</p>
          <p>{activity.module || "-"}</p>
        </div>

        <div>
          <p className="text-muted-foreground">Time</p>
          <p>{formatTime(activity.activity_time)}</p>
        </div>

        <div>
          <p className="text-muted-foreground">Date</p>
          <p>{formatDate(activity.activity_date)}</p>
        </div>
      </div>
    </div>
  );
}
