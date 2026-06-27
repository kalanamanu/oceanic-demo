import apiClient from "@/lib/api-client";
import type {
  APIError,
  CreateNotificationRequest,
  CreateNotificationResponse,
  GetAnnouncementsResponse,
  GetUserNotificationsResponse,
  MarkNotificationReadResponse,
} from "@/types/notification.types";

export class NotificationService {
  /**
   * Create a new notification
   */
  static async createNotification(
    data: CreateNotificationRequest
  ): Promise<CreateNotificationResponse> {
    try {
      const response = await apiClient.post<CreateNotificationResponse>(
        "/api/notification",
        data
      );

      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Get all announcements
   */
  static async getAnnouncements(): Promise<GetAnnouncementsResponse> {
    try {
      const response = await apiClient.get<GetAnnouncementsResponse>(
        "/api/notification/announcements"
      );

      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Get notifications for a user
   */
  static async getUserNotifications(
    userId: string
  ): Promise<GetUserNotificationsResponse> {
    try {
      const response = await apiClient.get<GetUserNotificationsResponse>(
        `/api/notification/user/${userId}`
      );

      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Mark a notification as read
   */
  static async markAsRead(
    userId: string,
    notificationId: string
  ): Promise<MarkNotificationReadResponse> {
    try {
      const response = await apiClient.patch<MarkNotificationReadResponse>(
        `/api/notification/user/${userId}/notification/${notificationId}/read`
      );

      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Centralized error handling
   */
  private static handleError(error: any): Error {
    if (error.response) {
      const apiError: APIError = error.response.data;
      return new Error(apiError.message || "An error occurred");
    } else if (error.request) {
      return new Error(
        "No response from server. Please check your connection or Contact IT support."
      );
    } else {
      return new Error(
        error.message ||
          "An unexpected error occurred. Please contact IT support"
      );
    }
  }
}