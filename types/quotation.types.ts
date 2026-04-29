// ===== Backend Excel Validation Types =====
export interface ExcelValidationItem {
  price: string;
  unit: string;
  quantity: string;
  osc_remark: string;
  item_no: string;
  description: string;
  impa_code: string;
  customer_remark: string;
}

export interface ExcelValidationResponse {
  message: string;
  data: ExcelValidationItem[];
}

// ===== Frontend Quotation Item (Main UI Model) =====
export interface QuotationItem {
  // ===== From Backend =====
  item_no: string;
  description: string;
  customer_remark: string;
  quantity: string;
  unit: string;
  price: string;
  impa_code: string;
  osc_remark: string;

  // ===== Added in Frontend =====
  supplier_name: string;
  additional_charges: string;
  total_unit_rate_rs: string;
  total_rs: string;
  conva_basis: string;
  total_usd: string;
}

// ===== Optional: Numeric Version (For Calculations / Future Use) =====
export interface QuotationItemNumeric {
  item_no: string;
  description: string;
  customer_remark?: string;

  quantity: number;
  unit: string;
  price: number;

  impa_code?: string;
  osc_remark?: string;

  supplier_name?: string;
  additional_charges?: number;
  total_unit_rate_rs?: number;
  total_rs?: number;
  conva_basis?: number;
  total_usd?: number;
}

// ===== Create Quotation Request (Submit to Backend) =====
export interface CreateQuotationRequest {
  inquiry_id: string;
  items: QuotationItem[];
}

// ===== Optional: API Response for Quotation Creation =====
export interface CreateQuotationResponse {
  success: boolean;
  message: string;
  data?: any;
}