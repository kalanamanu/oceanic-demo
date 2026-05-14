export type DocumentType = "pdf" | "excel";

/**
 * Precost item inside documentData
 */
export interface PreCostItem {
  item_name: string;
  customer_remark?: string;
  quantity: number;
  unit: string;
  impa?: string;
  vendor_id?: string;
  is_verified_vendor?: boolean;
  unit_price: number;
  total_price: number;
  basis?: string;
  unit_rate_usd?: number;
  total_price_usd?: number;
}

/**
 * Additional charges
 */
export interface AdditionalCharge {
  charge_name: string;
  amount: number;
  currency: string;
}

/**
 * Precost document payload (MATCHES YOUR BACKEND)
 */
export interface PreCostDocumentData {
  id: string;
  vessel_name: string;
  date_arrived: string;
  date_saild: string;
  discount: number;
  usd_rate: number;
  total_cost: number;
  total_cost_usd: number;
  status: string;
  remark?: string;

  // flags (your API uses these)
  discount_enabled?: boolean;
  additional_charge?: boolean;

  items: PreCostItem[];
  additional_charges: AdditionalCharge[];
}

/**
 * Request
 */
export interface GenerateDocumentRequest {
  document: "precost" | string;
  documentType: DocumentType;

  // IMPORTANT: API expects array
  documentData: PreCostDocumentData[];
}

/**
 * Response
 */
export interface GenerateDocumentResponse {
  success: boolean;
  message: string;
  jobId: string;
}

/**
 * Job state
 */
export type JobState =
  | "waiting"
  | "active"
  | "completed"
  | "failed"
  | "delayed";

export interface DocumentJobResult {
  fileName: string;
  filePath: string;
  mimeType: string;
  size: number;
}

export interface DocumentJobStatusResponse {
  success: boolean;
  jobId: string;
  state: JobState;
  result: DocumentJobResult | null;
  error: string | null;
  attempts: number;
  stacktrace: string[];
}

/**
 * Cancel job
 */
export interface CancelJobResponse {
  success: boolean;
  message: string;
  jobId: string;
}

/**
 * Generic API error
 */
export interface ApiErrorResponse {
  success: false;
  message: string;
}