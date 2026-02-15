// Request Types
export interface RequestOTPRequest {
  email: string;
  password: string;
}

export interface VerifyOTPRequest {
  email: string;
  otp: string;
}

// Response Types
export interface RequestOTPResponse {
  success: boolean;
  message: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: UserData;
}

export interface LogoutResponse {
  success: boolean;
  message: string;
}

export interface CheckAuthResponse {
  authenticated: boolean;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    accountType: "admin" | "user" | "manager";
  } | null;
}

// User Data Type 
export interface UserData {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  accountType: "admin" | "management" | "team_head" | "user";
  department?: string;
}

// Error Response
export interface APIError {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}