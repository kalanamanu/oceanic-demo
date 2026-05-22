export type ApprovalStatus = "pending" | "approved" | "rejected";

/* ================= CONFIRMED ITEM ================= */

export interface ConfirmedItem {
  data_id: string;

  item_name: string;

  quantity: number;

  original_quantity: number;

  is_qty_changed: boolean;
}

/* ================= REMOVED ITEM ================= */

export interface ConfirmedRemovedItem {
  data_id: string;
}

/* ================= QUANTITY CHANGE ================= */

export interface QuantityChangedItem {
  item_id: string;

  original_quantity: number;

  new_quantity: number;
}

/* ================= CONFIRM ORDER RESPONSE ================= */

export interface ConfirmOrderResponse {
  confirmed_items: string[];

  removed_items: string[];

  quantity_changed_items: QuantityChangedItem[];

  confirmed_total_lkr: number;

  confirmed_total_usd: number;

  variance_lkr: number;

  variance_usd: number;
}

/* ================= CONFIRMED ORDER ================= */

export interface ConfirmedOrder {
  confirmed_pre_cost_id: string;

  pre_cost_id: string;

  confirmed_total_lkr: number;

  confirmed_total_usd: number;

  variance_lkr: number;

  variance_usd: number;

  gm_status: ApprovalStatus;

  document_status: ApprovalStatus;

  createdAt: string;
}

/* ================= CONFIRMED ORDER DETAILS ================= */

export interface ConfirmedOrderDetails {
  confirmed_pre_cost_id: string;

  pre_cost_id: string;

  confirmedItems: ConfirmedItem[];

  confirmedRemovedItems: ConfirmedRemovedItem[];
}

/* ================= UPDATE STATUS PAYLOAD ================= */

export interface UpdateConfirmedOrderStatusPayload {
  gm_status?: ApprovalStatus;

  document_status?: ApprovalStatus;
}