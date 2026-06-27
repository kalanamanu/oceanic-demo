// Request Types
export interface CreateNotificationRequest {
  notificationHeadline: string;
  notificationDescription: string;
  notificationType: "ANNOUNCEMENT";
}

// Notification Model
export interface NotificationData {
  notification_id: string;
  notificationHeadline: string;
  notificationDescription: string;
  notificationType: "ANNOUNCEMENT";
  dateCreated: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// User Notification Model
export interface UserNotificationData {
  id: string;
  user_id: string;
  notification_id: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
  notification: {
    notification_id: string;
    notificationHeadline: string;
    notificationDescription: string;
    notificationType: "ANNOUNCEMENT";
    isActive: boolean;
  };
}

// Response Types
export interface CreateNotificationResponse {
  success: boolean;
  message: string;
  notification: NotificationData;
}

export interface GetAnnouncementsResponse {
  success: boolean;
  announcements: NotificationData[];
}

export interface GetUserNotificationsResponse {
  success: boolean;
  notifications: UserNotificationData[];
}

export interface MarkNotificationReadResponse {
  success: boolean;
  message: string;
}

// Error Response
export interface APIError {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}