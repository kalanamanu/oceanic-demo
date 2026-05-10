import apiClient from "@/lib/api-client";
import type {
  ActivityListResponse,
  UserActivity,
} from "@/types/activity.types";

export class ActivityService {
  /* ==============================
     GET ALL ACTIVITIES
  ============================== */
  static async getAllActivities(): Promise<UserActivity[]> {
    try {
      const res = await apiClient.get<ActivityListResponse>(
        "/api/activity",
      );

      return res.data.data;
    } catch (err: any) {
      throw new Error(
        err?.response?.data?.message || "Failed to fetch activities",
      );
    }
  }

  /* ==============================
     GET USER ACTIVITIES
  ============================== */
  static async getActivitiesByUser(userId: string): Promise<UserActivity[]> {
    try {
      const res = await apiClient.get<ActivityListResponse>(
        `/api/activity/user/${userId}`,
      );

      return res.data.data;
    } catch (err: any) {
      throw new Error(
        err?.response?.data?.message ||
          "Failed to fetch user activities",
      );
    }
  }
}