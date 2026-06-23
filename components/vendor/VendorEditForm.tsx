"use client";

import * as React from "react";
import { VendorService } from "@/services/vendor.service";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { CategorySelect } from "@/components/inquiry/category-select";

interface PIC {
  firstName: string;
  lastName: string;
  email: string;
  picType: string;
  remark: string;
  phone_number: string;
}

interface Props {
  initialData: any;
  onSuccess?: () => void;
}

export function VendorEditForm({ initialData, onSuccess }: Props) {
  /* ================= BASIC INFO ================= */
  const [name, setName] = React.useState(initialData?.name || "");
  const [email, setEmail] = React.useState(initialData?.email || "");
  const [contactNumber, setContactNumber] = React.useState(
    initialData?.phone_number || "",
  );
  const [address, setAddress] = React.useState(initialData?.address || "");
  const [companyType, setCompanyType] = React.useState(
    initialData?.company_type || "",
  );
  const [remark, setRemark] = React.useState(initialData?.remark || "");

  const [loading, setLoading] = React.useState(false);

  /* ================= CATEGORY ================= */
  const [categories, setCategories] = React.useState<any[]>(
    initialData?.categories || [],
  );

  /* ================= PIC ================= */
  const [pics, setPics] = React.useState<PIC[]>(initialData?.pics || []);

  /* ================= VALIDATION ================= */
  const isValid = () => {
    if (!name || !email || !contactNumber) {
      toast.error("Name, Email, Contact Number are required");
      return false;
    }
    return true;
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {
    if (!isValid()) return;

    try {
      setLoading(true);

      const payload = {
        name,
        email,
        contact_number: contactNumber,
        address,
        company_type: companyType,
        remark,

        categories: categories.map((c) => ({
          id: c.cte_id,
          name: c.cte_name,
        })),

        pic: pics.map((p) => ({
          firstName: p.firstName,
          lastName: p.lastName,
          email: p.email,
          picType: p.picType,
          remark: p.remark,
          phone_number: p.phone_number,
        })),
      };
      await VendorService.updateVendor(initialData.vendor_id, payload);

      toast.success("Vendor updated successfully");
      onSuccess?.();
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "Failed to update vendor");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */
  return (
    <div className="space-y-6">
      {/* BASIC INFO */}
      <div className="grid md:grid-cols-2 gap-4">
        <input
          className="border p-2 rounded"
          placeholder="Vendor Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="border p-2 rounded"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="border p-2 rounded"
          placeholder="Contact Number"
          value={contactNumber}
          onChange={(e) => setContactNumber(e.target.value)}
        />

        <input
          className="border p-2 rounded"
          placeholder="Company Type"
          value={companyType}
          onChange={(e) => setCompanyType(e.target.value)}
        />

        <input
          className="border p-2 rounded col-span-2"
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
      </div>

      <textarea
        className="w-full border p-2 rounded"
        placeholder="Remark"
        value={remark}
        onChange={(e) => setRemark(e.target.value)}
      />

      {/* CATEGORY */}
      <div className="space-y-2">
        <h3 className="font-semibold text-sm">Categories</h3>

        <CategorySelect
          selectedCategories={categories}
          onChange={setCategories}
        />
      </div>

      {/* PIC */}
      <div className="space-y-2">
        <h3 className="font-semibold">PIC</h3>

        {pics.map((pic, i) => (
          <div
            key={i}
            className="grid md:grid-cols-3 gap-2 border p-3 rounded mb-2"
          >
            <input
              className="border p-2 rounded"
              placeholder="First Name"
              value={pic.firstName}
              onChange={(e) => {
                const copy = [...pics];
                copy[i].firstName = e.target.value;
                setPics(copy);
              }}
            />

            <input
              className="border p-2 rounded"
              placeholder="Last Name"
              value={pic.lastName}
              onChange={(e) => {
                const copy = [...pics];
                copy[i].lastName = e.target.value;
                setPics(copy);
              }}
            />

            <input
              className="border p-2 rounded"
              placeholder="Email"
              value={pic.email}
              onChange={(e) => {
                const copy = [...pics];
                copy[i].email = e.target.value;
                setPics(copy);
              }}
            />

            <input
              className="border p-2 rounded"
              placeholder="Phone"
              value={pic.phone_number}
              onChange={(e) => {
                const copy = [...pics];
                copy[i].phone_number = e.target.value;
                setPics(copy);
              }}
            />

            <input
              className="border p-2 rounded"
              placeholder="PIC Type"
              value={pic.picType}
              onChange={(e) => {
                const copy = [...pics];
                copy[i].picType = e.target.value;
                setPics(copy);
              }}
            />

            <input
              className="border p-2 rounded"
              placeholder="Remark"
              value={pic.remark}
              onChange={(e) => {
                const copy = [...pics];
                copy[i].remark = e.target.value;
                setPics(copy);
              }}
            />
          </div>
        ))}
      </div>

      {/* SUBMIT */}
      <div className="flex justify-end">
        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? "Updating..." : "Update Vendor"}
        </Button>
      </div>
    </div>
  );
}
