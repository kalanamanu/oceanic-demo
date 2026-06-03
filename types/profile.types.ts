export interface Profile {
  profile_id: string;
  user_id: string;
  theme: string;
  notificationsEnabled: boolean;
  profilePicture_id?: string | null;
  backgroundImage_id?: string | null;
  dob?: string | null;
  phone_number?: string | null;
  createdAt: string;
  updatedAt: string;
}

/* =====================================================
   AVATAR
===================================================== */

export interface ProfileAvatar {
  userId: string;
  profilePictureUrl: string;
}

export interface ProfileAvatarResponse {
  success: boolean;
  data: ProfileAvatar;
}

/* =====================================================
   BACKGROUND
===================================================== */

export interface ProfileBackground {
  userId: string;
  backgroundImageUrl: string;
}

export interface ProfileBackgroundResponse {
  success: boolean;
  data: ProfileBackground;
}

/* =====================================================
   PASSWORD RESET
===================================================== */

export interface RequestPasswordResetPayload {
  email: string;
}

export interface RequestPasswordResetResponse {
  success: boolean;
  message: string;
}

export interface ResetPasswordPayload {
  email: string;
  token: string;
  newPassword: string;
}

export interface ResetPasswordResponse {
  success: boolean;
  message: string;
}

/* =====================================================
   COMMON API RESPONSE
===================================================== */

export interface ApiMessageResponse {
  success: boolean;
  message: string;
}