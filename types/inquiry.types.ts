export interface InquiryPIC {
  inq_id?: string;
  id: string;
  name: string;

}

export interface InquiryCategory {
  id: string;
  name: string;
}

export interface Inquiry {
  id?: string;
  inq_id?: string;

  vessel_name: string;
  agent: string;
  eta: string;
  port: string;

  categories?: InquiryCategory[];

  received_date: string;
  received_time: string;
  qout_submission_deadline_date?: string;

  key_pic_usr_id: string;

  // ✅ FIXED
  key_pic?: InquiryPIC | null;
  other_pics?: InquiryPIC[];

  customer?: string;
  customerContact?: string;
  customerEmail?: string;
  commissionParty?: string;

  // backend sends null sometimes
  status?: "Pending" | "Active" | "Confirmed" | "Rejected" | null;

  createdAt?: string;
  updatedAt?: string;
}

export interface CreateInquiryRequest {
  vessel_name: string;
  agent: string;
  eta: string; // "YYYY-MM-DD"
  port: string;
  categories: InquiryCategory[];
  received_date: string; // "YYYY-MM-DD"
  received_time: string; // "HH:MM"
  qout_submission_deadline_date?: string; // "YYYY-MM-DD"
  key_pic_usr_id: string;
  pics: {
    pic_usr_id: string;
    pic_name: string;
  }[];
  customer?: string;
  customerContact?: string;
  customerEmail?: string;
  commissionParty?: string;
  status?: string;
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

export interface InquiryRemark {
  remark_id: string;
  inq_id: string;
  remark: string;
  created_by: string;
  created_date: string;
  last_updated: string;
}

export interface CreateInquiryRemarkRequest {
  inq_id: string;
  remark: string;
}

export interface UpdateInquiryRemarkRequest {
  remark: string;
}

export interface InquiryRemarkResponse {
  success: boolean;
  message: string;
  data: InquiryRemark;
}

export interface InquiryRemarksResponse {
  success: boolean;
  message: string;
  data: InquiryRemark[];
}