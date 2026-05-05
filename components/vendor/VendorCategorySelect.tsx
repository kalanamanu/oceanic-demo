"use client";

import * as React from "react";
import { VendorService } from "@/services/vendor.service";

interface Category {
  cte_id: string;
  cte_name: string;
}

interface Props {
  vendorId?: string;
  value?: string;
  onChange?: (categoryId: string) => void;
}

export function VendorCategorySelect({ vendorId, value, onChange }: Props) {
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (!vendorId) {
      setCategories([]);
      return;
    }

    const load = async () => {
      try {
        setLoading(true);
        const data = await VendorService.getVendorCategories(vendorId);
        setCategories(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [vendorId]);

  if (!vendorId) {
    return (
      <select className="w-full border p-2 rounded bg-muted" disabled>
        <option>Select vendor first</option>
      </select>
    );
  }

  return (
    <select
      className="w-full border p-2 rounded"
      value={value || ""}
      onChange={(e) => onChange?.(e.target.value)}
      disabled={loading}
    >
      <option value="">Select Category</option>

      {categories.map((cat) => (
        <option key={cat.cte_id} value={cat.cte_id}>
          {cat.cte_name}
        </option>
      ))}
    </select>
  );
}
