export interface InquiryPIC {
  inq_id?: string;
  pic_usr_id: string;
  pic_name: string;
}

export interface Inquiry {
  id: string;
  vessel_name: string;
  agent: string;
  eta: string; // ISO date string
  port: string;
  category: string;
  received_date: string; // ISO date string
  received_time: string; // "HH:MM"
  quote_submission_deadline_date?: string; // ISO date string
  key_pic_usr_id: string;
  pics: InquiryPIC[];
  status?: "Pending" | "Active" | "Confirmed" | "Rejected";
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateInquiryRequest {
  vessel_name: string;
  agent: string;
  eta: string; // "YYYY-MM-DD"
  port: string;
  category: string;
  received_date: string; // "YYYY-MM-DD"
  received_time: string; // "HH:MM"
  quote_submission_deadline_date?: string; // "YYYY-MM-DD"
  key_pic_usr_id: string;
  pics: {
    pic_usr_id: string;
    pic_name: string;
  }[];
}

export interface UpdateInquiryRequest extends Partial<CreateInquiryRequest> {
  id: string;
}

export interface PaginatedInquiriesResponse {
  success: boolean;
  data: Inquiry[];
  pagination?: {
    totalInquiries: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
  };
}

export interface InquiryResponse {
  success: boolean;
  message: string;
  data: Inquiry;
}