// ==============================
// Vendor Types
// ==============================

export interface VendorCategory {
  cte_id: string;
  cte_name: string;
}

export interface VendorPIC {
  pic_id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone_number: string;
  picType: string;
  remark?: string;
}

// ==============================
// Vendor Status
// ==============================

export interface VendorStatus {
  status_id: string;
  vendor_id: string;
  is_md_approved: boolean;
  is_manager_approved: boolean;
  status: "Pending Approval" | "Approved by MD" | "Approved by Manager" | "Fully Approved";
}

// ==============================
// Main Vendor Type
// ==============================

export interface Vendor {
  vendor_id: string;

  name: string;
  email: string;
  phone_number: string;
  address: string;

  company_type: string;
  remark?: string;

  categories: VendorCategory[];

  status: VendorStatus;

  pics: VendorPIC[];

  createdAt?: string;
  updatedAt?: string;
}

// ==============================
// Create Vendor Payload
// ==============================

export interface CreateVendorRequest {
  name: string;
  email: string;
  contact_number: string;
  address: string;
  company_type: string;
  remark?: string;

  categories: {
    id: string;
    name: string;
  }[];

  pic: {
    firstName: string;
    lastName: string;
    email: string;
    picType: string;
    remark?: string;
    phone_number: string;
  }[];
}

// ==============================
// Update Vendor Payload
// ==============================

export interface UpdateVendorRequest {
  name?: string;
  email?: string;
  contact_number?: string;
  address?: string;
  company_type?: string;
  remark?: string;

  categories?: {
    id: string;
    name: string;
  }[];

  pic?: {
    firstName: string;
    lastName: string;
    email: string;
    picType: string;
    remark?: string;
    phone_number: string;
  }[];
}

// ==============================
// API Response Wrapper
// ==============================

export interface VendorListResponse {
  success: boolean;
  message: string;
  data: Vendor[];
}

export interface VendorSingleResponse {
  success: boolean;
  message: string;
  data: Vendor;
}

export interface VendorActionResponse {
  success: boolean;
  message: string;
  vendor_id?: string;
}