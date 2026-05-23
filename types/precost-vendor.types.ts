/* ================= VENDOR STATUS ================= */

export interface VendorStatus {
  id: number;
  status_id: string;
  vendor_id: string;
  is_md_approved: boolean;
  is_manager_approved: boolean;
  status: string;
  createdAt: string;
  updatedAt: string;
}

/* ================= VENDOR PIC ================= */

export interface VendorPIC {
  pic_id: string;
  vendor_id: string;
  firstName: string;
  lastName: string;
  phone_number: string;
  email: string;
  picType: string;
  remark: string;
  createdAt: string;
  updatedAt: string;
}

/* ================= VENDOR CATEGORY ================= */

export interface VendorCategory {
  id: number;
  cte_id: string;
  vendor_id: string;
  cte_name: string;
  createdAt: string;
  updatedAt: string;
}

/* ================= VENDOR ================= */

export interface PreCostVendor {
  vendor_id: string;
  name: string;
  address: string;
  phone_number: string;
  company_type: string;
  email: string;
  remark: string;
  createdAt: string;
  updatedAt: string;

  status: VendorStatus;
  categories: VendorCategory[];
  pics: VendorPIC[];
}

/* ================= VENDOR ITEM ================= */

export interface PreCostVendorItem {
  id: string;
  pre_cost_id: string;
  data_id: string;

  item_name: string;
  customer_remark: string;

  is_qty_changed: boolean;
  original_quantity: number;
  quantity: number;

  unit: string;
  impa: string;

  vendor_id: string | null;

  original_unit_price: number;
  unit_price: number;

  additional_charges: number;

  total_price: number;

  basis: string;

  unit_rate_usd: number;
  total_price_usd: number;

  discount: number;
  grand_total_usd: number;

  is_removed: boolean;

  createdAt: string;
  updatedAt: string;
}

/* ================= API RESPONSES ================= */

export interface GetPreCostVendorsResponse {
  success: boolean;
  message: string;
  data: PreCostVendor[];
}

export interface GetPreCostVendorItemsResponse {
  success: boolean;
  message: string;
  data: PreCostVendorItem[];
}