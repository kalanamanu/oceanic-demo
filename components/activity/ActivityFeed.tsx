"use client";

import { UserActivity } from "@/types/activity.types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function ActivityFeed({
  data,
  loading,
  onSelect,
}: {
  data: UserActivity[];
  loading: boolean;
  onSelect: (a: UserActivity) => void;
}) {
  if (loading) {
    return <p className="text-sm animate-pulse">Loading activities...</p>;
  }

  return (
    <div className="space-y-3 max-h-[600px] overflow-y-auto">
      {data.map((a) => (
        <Card
          key={a.id}
          onClick={() => onSelect(a)}
          className="p-4 cursor-pointer hover:bg-muted/40 transition"
        >
          <div className="flex justify-between">
            <div className="space-y-1">
              <p className="font-medium text-sm">{a.username}</p>
              <p className="text-sm text-muted-foreground">
                {a.activity_description}
              </p>

              <div className="flex gap-2 mt-2 flex-wrap">
                <Badge>{a.activity_type}</Badge>

                {a.module && <Badge variant="secondary">{a.module}</Badge>}
              </div>
            </div>

            <div className="text-xs text-muted-foreground text-right">
              <p>{new Date(a.activity_time).toLocaleString()}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
