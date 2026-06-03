import apiClient from "@/lib/api-client";

import type {
  ProfileAvatar,
  ProfileAvatarResponse,
  ProfileBackground,
  ProfileBackgroundResponse,
  RequestPasswordResetPayload,
  RequestPasswordResetResponse,
  ResetPasswordPayload,
  ResetPasswordResponse,
} from "@/types/profile.types";

export class ProfileService {
  /* =====================================================
     GET PROFILE AVATAR
  ===================================================== */

  static async getProfileAvatar(
    userId: string,
  ): Promise<ProfileAvatar> {
    try {
      const response = await apiClient.get<ProfileAvatarResponse>(
        `/api/profile/avatar/${encodeURIComponent(userId)}`,
      );

      return response.data.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /* =====================================================
     GET PROFILE BACKGROUND
  ===================================================== */

  static async getProfileBackground(
    userId: string,
  ): Promise<ProfileBackground> {
    try {
      const response = await apiClient.get<ProfileBackgroundResponse>(
        `/api/profile/background/${encodeURIComponent(userId)}`,
      );

      return response.data.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /* =====================================================
     REQUEST PASSWORD RESET
  ===================================================== */

  static async requestPasswordReset(
    payload: RequestPasswordResetPayload,
  ): Promise<RequestPasswordResetResponse> {
    try {
      const response =
        await apiClient.post<RequestPasswordResetResponse>(
          "/api/profile/req-reset-password",
          payload,
        );

      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /* =====================================================
     RESET PASSWORD
  ===================================================== */

  static async resetPassword(
    payload: ResetPasswordPayload,
  ): Promise<ResetPasswordResponse> {
    try {
      const response = await apiClient.post<ResetPasswordResponse>(
        "/api/profile/reset-password",
        payload,
      );

      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /* =====================================================
     ERROR HANDLER
  ===================================================== */

  private static handleError(error: any): Error {
    if (error.response) {
      const apiError = error.response.data;

      return new Error(
        apiError?.message ||
          apiError?.error ||
          "An error occurred",
      );
    }

    if (error.request) {
      return new Error(
        "No response from server. Please check your connection.",
      );
    }

    return new Error(
      error.message || "An unexpected error occurred.",
    );
  }
}