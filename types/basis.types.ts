export interface Basis {
  id: number;
  margin: number;
  USDRate: number;
  basis: number;
  created_by: string;
  created_date: string;
  is_active: boolean;
  ended_date: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface BasisListResponse {
  success: boolean;
  message: string;
  data: {
    basisList: Basis[];
  };
}