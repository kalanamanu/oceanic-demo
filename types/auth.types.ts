// Request/Response types
export interface RequestOTPRequest {
  email: string;
  password: string;
}

export interface RequestOTPResponse {
  success: boolean;
  message: string;
}

export interface VerifyOTPRequest {
  email: string;
  otp: string;
}

export interface VerifyOTPResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

// Error response type
export interface APIError {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}