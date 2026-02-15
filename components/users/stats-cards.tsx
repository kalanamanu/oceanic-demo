"use client";

import { Users, UserCheck, UserX, Shield } from "lucide-react";

interface StatsCardsProps {
  stats: {
    totalUsers: number;
    activeUsers: number;
    inactiveUsers: number;
    adminUsers: number;
  };
}

export function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Total Users */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Total Users
            </p>
            <p className="text-3xl font-bold text-foreground mt-2">
              {stats.totalUsers}
            </p>
          </div>
          <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center">
            <Users className="h-6 w-6 text-blue-500" />
          </div>
        </div>
      </div>

      {/* Active Users */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Active Users
            </p>
            <p className="text-3xl font-bold text-foreground mt-2">
              {stats.activeUsers}
            </p>
          </div>
          <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center">
            <UserCheck className="h-6 w-6 text-green-500" />
          </div>
        </div>
      </div>

      {/* Inactive Users */}
      {/* <div className="rounded-xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Inactive Users
            </p>
            <p className="text-3xl font-bold text-foreground mt-2">
              {stats.inactiveUsers}
            </p>
          </div>
          <div className="h-12 w-12 rounded-full bg-red-500/10 flex items-center justify-center">
            <UserX className="h-6 w-6 text-red-500" />
          </div>
        </div>
      </div> */}

      {/* Admin Users */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Administrators
            </p>
            <p className="text-3xl font-bold text-foreground mt-2">
              {stats.adminUsers}
            </p>
          </div>
          <div className="h-12 w-12 rounded-full bg-purple-500/10 flex items-center justify-center">
            <Shield className="h-6 w-6 text-purple-500" />
          </div>
        </div>
      </div>
    </div>
  );
}
