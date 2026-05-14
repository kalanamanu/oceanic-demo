"use client";

import apiClient from "@/lib/api-client";

import type {
  DashboardResponse,
  DashboardCards,
  RecentInquiry,
} from "@/types/dashboard.types";

export class DashboardService {
  /* ================= GET DASHBOARD ================= */

  static async getDashboard(): Promise<{
    cards: DashboardCards;
    recentInquiries: RecentInquiry[];
  }> {
    try {
      const res = await apiClient.get<DashboardResponse>("/api/dashboard");

      return {
        cards: res.data.cards,
        recentInquiries: res.data.recentInquiries,
      };
    } catch (error) {
      console.error(error);

      throw new Error("Failed to load dashboard data");
    }
  }
}