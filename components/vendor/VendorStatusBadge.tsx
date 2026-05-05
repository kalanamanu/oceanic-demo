"use client";

import * as React from "react";

interface VendorStatus {
  is_md_approved: boolean;
  is_manager_approved: boolean;
  status?: string;
}

interface Props {
  status?: VendorStatus;
}

export function VendorStatusBadge({ status }: Props) {
  if (!status) {
    return (
      <span className="px-2 py-1 text-xs rounded bg-gray-200 text-gray-600">
        Unknown
      </span>
    );
  }

  const { is_md_approved, is_manager_approved } = status;

  let label = status.status;
  let color = "";

  // ================= LOGIC =================
  if (is_md_approved && is_manager_approved) {
    label = "Fully Approved";
    color = "bg-green-100 text-green-700";
  } else if (is_md_approved && !is_manager_approved) {
    label = "Approved by MD";
    color = "bg-blue-100 text-blue-700";
  } else if (!is_md_approved && is_manager_approved) {
    label = "Approved by Manager";
    color = "bg-indigo-100 text-indigo-700";
  } else {
    label = "Pending Approval";
    color = "bg-yellow-100 text-yellow-700";
  }

  return (
    <span className={`px-2 py-1 text-xs rounded font-medium ${color}`}>
      {label}
    </span>
  );
}
