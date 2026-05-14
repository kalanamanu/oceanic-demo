"use client";

import * as React from "react";
import { ActivityService } from "@/services/activity.service";
import { UserActivity } from "@/types/activity.types";

import { ActivityFilterBar } from "@/components/activity/ActivityFilterBar";
import { ActivityFeed } from "@/components/activity/ActivityFeed";
import { ActivitySidePanel } from "@/components/activity/ActivitySidePanel";

export default function ActivityPage() {
  const [activities, setActivities] = React.useState<UserActivity[]>([]);
  const [loading, setLoading] = React.useState(true);

  const [selectedUser, setSelectedUser] = React.useState<string>("");
  const [selectedActivity, setSelectedActivity] =
    React.useState<UserActivity | null>(null);

  const [moduleFilter, setModuleFilter] = React.useState("");
  const [dateFilter, setDateFilter] = React.useState("");

  const loadData = async () => {
    try {
      setLoading(true);

      const data = await ActivityService.getAllActivities();

      setActivities(data);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadData();
  }, []);

  // LOCAL FILTERING
  const filteredActivities = activities.filter((activity) => {
    const search = selectedUser.toLowerCase();

    return (
      activity.user_id?.toLowerCase().includes(search) ||
      activity.username?.toLowerCase().includes(search)
    );
  });

  return (
    <div className="p-6 space-y-6 relative">
      {/* HEADER */}
      <div>
        <h1 className="text-xl font-bold">Activity Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          System audit and user actions
        </p>
      </div>

      {/* FILTER BAR */}
      <ActivityFilterBar
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
      />

      {/* FEED */}
      <ActivityFeed
        data={filteredActivities}
        loading={loading}
        onSelect={setSelectedActivity}
      />

      {/* SIDE PANEL */}
      <ActivitySidePanel
        activity={selectedActivity}
        onClose={() => setSelectedActivity(null)}
      />
    </div>
  );
}
