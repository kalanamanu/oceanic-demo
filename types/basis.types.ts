export interface Basis {
  id: number;
  margin: number;
  USDRate: number;
  basis: number;

  is_active: boolean;

  created_by: string;
  created_date: string;

  ended_date: string | null;

  createdAt: string;
  updatedAt: string;
}

/* ================= CREATE REQUEST ================= */
export interface CreateBasisRequest {
  margin: number;
  USDRate: number;
}

/* ================= CREATE RESPONSE ================= */
export interface CreateBasisResponse {
  success: boolean;
  message: string;
  data: Basis;
}

/* ================= GET ALL RESPONSE ================= */
export interface BasisListResponse {
  success: boolean;
  message: string;
  data: {
    basisList: Basis[];
  };
}

/* ================= OPTIONAL: SINGLE ITEM RESPONSE (future-proof) ================= */
export interface SingleBasisResponse {
  success: boolean;
  message: string;
  data: Basis;
}