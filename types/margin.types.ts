export interface Margin {
  id: number;
  margin: number;
  name: string;

  is_active: boolean;

  created_by: string;
  created_date: string;

  createdAt: string;
  updatedAt: string;
}

/* ================= CREATE ================= */
export interface CreateMarginRequest {
  margin: number;
  name: string;
}

export interface CreateMarginResponse {
  success: boolean;
  message: string;
  data: Margin;
}

/* ================= LIST ================= */
export interface MarginListResponse {
  success: boolean;
  message: string;
  data: {
    basisList: Margin[];
  };
}