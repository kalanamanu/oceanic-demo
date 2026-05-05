"use client";

import * as React from "react";
import { VendorService } from "@/services/vendor.service";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

interface Category {
  id: string;
  name: string;
}

interface PIC {
  firstName: string;
  lastName: string;
  email: string;
  picType: string;
  remark: string;
  phone_number: string;
}

interface Props {
  onSuccess?: () => void;
  initialData?: any;
  mode?: "create" | "edit";
}

export function VendorForm({ onSuccess, initialData, mode = "create" }: Props) {
  /* ================= BASIC INFO ================= */
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [contactNumber, setContactNumber] = React.useState("");
  const [address, setAddress] = React.useState("");
  const [companyType, setCompanyType] = React.useState("");
  const [remark, setRemark] = React.useState("");

  const [loading, setLoading] = React.useState(false);

  /* ================= CATEGORY ================= */
  const [categories, setCategories] = React.useState<Category[]>([
    { id: "", name: "" },
  ]);

  /* ================= PIC ================= */
  const [pics, setPics] = React.useState<PIC[]>([
    {
      firstName: "",
      lastName: "",
      email: "",
      picType: "",
      remark: "",
      phone_number: "",
    },
  ]);

  /* ================= LOAD INITIAL DATA (EDIT MODE) ================= */
  React.useEffect(() => {
    if (!initialData) return;

    setName(initialData.name || "");
    setEmail(initialData.email || "");
    setContactNumber(initialData.phone_number || "");
    setAddress(initialData.address || "");
    setCompanyType(initialData.company_type || "");
    setRemark(initialData.remark || "");

    setCategories(
      initialData.categories?.length
        ? initialData.categories.map((c: any) => ({
            id: c.cte_id,
            name: c.cte_name,
          }))
        : [{ id: "", name: "" }],
    );

    setPics(
      initialData.pics?.length
        ? initialData.pics.map((p: any) => ({
            firstName: p.firstName,
            lastName: p.lastName,
            email: p.email,
            picType: p.picType,
            remark: p.remark,
            phone_number: p.phone_number,
          }))
        : [
            {
              firstName: "",
              lastName: "",
              email: "",
              picType: "",
              remark: "",
              phone_number: "",
            },
          ],
    );
  }, [initialData]);

  /* ================= CATEGORY ================= */
  const addCategory = () =>
    setCategories((prev) => [...prev, { id: "", name: "" }]);

  const updateCategory = (
    index: number,
    field: keyof Category,
    value: string,
  ) => {
    setCategories((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const removeCategory = (index: number) => {
    setCategories((prev) => prev.filter((_, i) => i !== index));
  };

  /* ================= PIC ================= */
  const addPic = () => {
    setPics((prev) => [
      ...prev,
      {
        firstName: "",
        lastName: "",
        email: "",
        picType: "",
        remark: "",
        phone_number: "",
      },
    ]);
  };

  const updatePic = (index: number, field: keyof PIC, value: string) => {
    setPics((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const removePic = (index: number) => {
    setPics((prev) => prev.filter((_, i) => i !== index));
  };

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
        categories: categories.filter((c) => c.id && c.name),
        pic: pics.filter((p) => p.firstName && p.email && p.phone_number),
      };

      if (mode === "edit" && initialData?.vendor_id) {
        await VendorService.updateVendor(initialData.vendor_id, payload);
        toast.success("Vendor updated successfully");
      } else {
        await VendorService.createVendor(payload);
        toast.success("Vendor created successfully");
      }

      onSuccess?.();
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "Failed to save vendor");
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
      <div>
        <div className="flex justify-between mb-2">
          <h3 className="font-semibold">Categories</h3>
          <Button size="sm" onClick={addCategory}>
            + Add
          </Button>
        </div>

        {categories.map((cat, i) => (
          <div key={i} className="flex gap-2 mb-2">
            <input
              className="border p-2 rounded w-full"
              placeholder="Category ID"
              value={cat.id}
              onChange={(e) => updateCategory(i, "id", e.target.value)}
            />

            <input
              className="border p-2 rounded w-full"
              placeholder="Category Name"
              value={cat.name}
              onChange={(e) => updateCategory(i, "name", e.target.value)}
            />

            <Button
              variant="destructive"
              size="sm"
              onClick={() => removeCategory(i)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>

      {/* PIC */}
      <div>
        <div className="flex justify-between mb-2">
          <h3 className="font-semibold">PIC</h3>
          <Button size="sm" onClick={addPic}>
            + Add
          </Button>
        </div>

        {pics.map((pic, i) => (
          <div
            key={i}
            className="grid md:grid-cols-3 gap-2 border p-3 rounded mb-2"
          >
            <input
              placeholder="First Name"
              className="border p-2 rounded"
              value={pic.firstName}
              onChange={(e) => updatePic(i, "firstName", e.target.value)}
            />

            <input
              placeholder="Last Name"
              className="border p-2 rounded"
              value={pic.lastName}
              onChange={(e) => updatePic(i, "lastName", e.target.value)}
            />

            <input
              placeholder="Email"
              className="border p-2 rounded"
              value={pic.email}
              onChange={(e) => updatePic(i, "email", e.target.value)}
            />

            <input
              placeholder="Phone"
              className="border p-2 rounded"
              value={pic.phone_number}
              onChange={(e) => updatePic(i, "phone_number", e.target.value)}
            />

            <input
              placeholder="PIC Type"
              className="border p-2 rounded"
              value={pic.picType}
              onChange={(e) => updatePic(i, "picType", e.target.value)}
            />

            <input
              placeholder="Remark"
              className="border p-2 rounded"
              value={pic.remark}
              onChange={(e) => updatePic(i, "remark", e.target.value)}
            />

            <div className="col-span-3 flex justify-end">
              <Button
                variant="destructive"
                size="sm"
                onClick={() => removePic(i)}
              >
                Remove
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* SUBMIT */}
      <div className="flex justify-end">
        <Button onClick={handleSubmit} disabled={loading}>
          {loading
            ? "Saving..."
            : mode === "edit"
              ? "Update Vendor"
              : "Create Vendor"}
        </Button>
      </div>
    </div>
  );
}
