"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

export interface AddProductDialogProps {
  onAdd: (product: {
    name: string;
    description: string;
    costPrice?: number; // optional now
    retailPrice: number;
  }) => void;
  children: React.ReactNode;
}

export function AddProductDialog({ onAdd, children }: AddProductDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [fields, setFields] = React.useState({
    name: "",
    description: "",
    costPrice: "",
    retailPrice: "",
  });
  const [errors, setErrors] = React.useState<{ [key: string]: string }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFields({ ...fields, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const errs: { [key: string]: string } = {};
    if (!fields.name.trim()) errs.name = "Product name is required.";
    // Only validate costPrice if not blank
    if (fields.costPrice && isNaN(Number(fields.costPrice))) {
      errs.costPrice = "Cost price must be a number.";
    }
    if (!fields.retailPrice || isNaN(Number(fields.retailPrice)))
      errs.retailPrice = "Retail price must be a number.";
    return errs;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      onAdd({
        name: fields.name.trim(),
        description: fields.description.trim(),
        costPrice:
          fields.costPrice === "" ? undefined : Number(fields.costPrice),
        retailPrice: Number(fields.retailPrice),
      });
      setFields({
        name: "",
        description: "",
        costPrice: "",
        retailPrice: "",
      });
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        className="max-w-lg p-0 rounded-xl shadow-lg"
        style={{ maxHeight: "90vh" }}
      >
        <DialogHeader className="px-6 pt-6 pb-1">
          <DialogTitle>Add Product</DialogTitle>
          <DialogDescription>
            Add a new product to your inventory.
          </DialogDescription>
        </DialogHeader>
        {/* Extra px-6 py-6 for scroll area to avoid ring cropping */}
        <ScrollArea className="max-h-[65vh] px-6 py-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-1">
                Product Name <span className="text-red-500">*</span>
              </label>
              <Input
                name="name"
                value={fields.name}
                onChange={handleChange}
                required
                autoFocus
                placeholder="Product name..."
              />
              {errors.name && (
                <p className="mt-1 text-xs text-red-500">{errors.name}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Description
              </label>
              <Input
                name="description"
                value={fields.description}
                onChange={handleChange}
                placeholder="Optional description"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Cost Price
              </label>
              <Input
                name="costPrice"
                type="number"
                value={fields.costPrice}
                onChange={handleChange}
                min={0}
                step="0.01"
                placeholder="0.00"
              />
              {errors.costPrice && (
                <p className="mt-1 text-xs text-red-500">{errors.costPrice}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Retail Price <span className="text-red-500">*</span>
              </label>
              <Input
                name="retailPrice"
                type="number"
                value={fields.retailPrice}
                onChange={handleChange}
                required
                min={0}
                step="0.01"
                placeholder="0.00"
              />
              {errors.retailPrice && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.retailPrice}
                </p>
              )}
            </div>
            <DialogFooter className="mt-6 flex gap-3">
              <Button type="submit">Add Product</Button>
              <DialogClose asChild>
                <Button
                  variant="outline"
                  className="text-foreground dark:text-white hover:bg-muted"
                  type="button"
                >
                  Cancel
                </Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
