export interface BasisCalculation {
  basis: string;
  margin: number;
  usdRate: number;
}

export interface BasisCalculationResponse {
  success: boolean;
  message: string;
  data: BasisCalculation;
}