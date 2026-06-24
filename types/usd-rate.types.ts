export interface USDRate {
  id: number;
  USDRate: number;

  is_active: boolean | string;

  created_by: string;
  created_date: string;

  createdAt: string;
  updatedAt: string;
}

/* ================= CREATE ================= */
export interface CreateUSDRateRequest {
  usdRate: number;
}

export interface CreateUSDRateResponse {
  success: boolean;
  message: string;
  data: USDRate;
}

/* ================= LATEST ================= */
export interface LatestUSDRateResponse {
  success: boolean;
  message: string;
  data: USDRate;
}

/* ================= HISTORY ================= */
export interface USDRateHistoryResponse {
  success: boolean;
  message: string;
  data: USDRate[];
}