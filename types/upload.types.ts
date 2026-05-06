// src/types/upload.types.ts
export interface UploadFileRequest {
  file: File;
  useFor: string;
}

export interface UploadFileResponse {
  success: boolean;
  message: string;
  data: {
    id: number;
    file_path: string;
    file_type: string;
    file_size: number;
    original_name: string;
    use_for: string;
    uploaded_by: string;
    createdAt: string;
    updatedAt: string;
    file_url: string;
    file: File,
    useFor: string,
  };
}

export interface GetSignedUrlResponse {
  success: boolean;
  message: string;
  data: {
    id: number;
    file_url: string;
  };
}