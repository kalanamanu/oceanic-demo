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

/**
 * GET /api/document/types
 */
export interface DocumentTypesResponse {
  success: boolean;
  availableDocumentTypes: DocumentType[];
  note: string;
}

/**
 * Generic item structure found in document.data.items
 */
export interface DocumentItem {
  quantity: number;
  item_name: string;
  unit_price: number;
  total_price: number;
}

/**
 * Generic document data
 * Different document types may contain additional fields
 */
export interface DocumentData {
  date?: string;
  items?: DocumentItem[];

  discount?: number;
  total_cost?: number;
  additional_charges?: number;

  reference_no?: string;

  billToName?: string;

  [key: string]: any;
}

/**
 * Document status
 */
export type DocumentStatus =
  | "DRAFT"
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "COMPLETED";

/**
 * Saved document
 */
export interface SavedDocument {
  doc_id: string;
  reference_no: string;
  doc_type: DocumentType;
  data: DocumentData;
  status: DocumentStatus;
  createdAt: string;
  updatedAt: string;
}

/**
 * POST /api/document/saved
 */
export interface GetSavedDocumentsRequest {
  documentType: DocumentType;
}

export interface GetSavedDocumentsResponse {
  success: boolean;
  savedDocuments: SavedDocument[];
}

/**
 * GET /api/document/:doc_id
 */
export interface GetDocumentResponse {
  success: boolean;
  document: SavedDocument;
}

/**
 * Generic API error
 */
export interface ApiErrorResponse {
  success: false;
  message: string;
}

export interface GetReferenceNumberResponse {
  success: boolean;
  reference_no: string;
}

export interface GetReferenceNumberRequest {
  /**
   * Path parameter
   * GET /api/document/reference-number/:doc_type
   */
  doc_type: DocumentType;
}