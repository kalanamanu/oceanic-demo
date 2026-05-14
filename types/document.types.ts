export type DocumentType = "pdf" | "excel";

export interface GenerateDocumentRequest {
  document: string; // e.g. "precost"
  documentType: DocumentType;
  documentData: Record<string, any>;
}

export interface GenerateDocumentResponse {
  success: boolean;
  message: string;
  jobId: string;
}

export type JobState =
  | "waiting"
  | "active"
  | "completed"
  | "failed"
  | "delayed";

export interface DocumentJobStatusResponse {
  success: boolean;
  jobId: string;
  state: JobState;
  result: DocumentJobResult | null;
  error: string | null;
  attempts: number;
  stacktrace: string[];
}

export interface DocumentJobResult {
  fileName: string;
  filePath: string;
  mimeType: string;
  size: number;
}

export interface CancelJobResponse {
  success: boolean;
  message: string;
  jobId: string;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
}