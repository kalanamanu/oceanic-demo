export interface BasisCalculation {
  basis: number;
  margin: number;
  usdRate: number;
}

export interface BasisCalculationResponse {
  success: boolean;
  message: string;
  data: {
    basis: string;
    margin: number;
    usdRate: number;
  };
}