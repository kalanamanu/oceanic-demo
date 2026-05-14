"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Loader2, X } from "lucide-react";

import { cn } from "@/lib/utils";
import apiClient from "@/lib/api-client";

import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { InquiryCategory } from "@/types/inquiry.types";

interface CategoryApiResponse {
  cte_id: string;
  cte_name: string;
  color: string;
  type: string;
}

interface CategorySelectProps {
  selectedCategories: InquiryCategory[];
  onChange: (categories: InquiryCategory[]) => void;
  disabled?: boolean;
}

export function CategorySelect({
  selectedCategories,
  onChange,
  disabled = false,
}: CategorySelectProps) {
  const [open, setOpen] = React.useState(false);
  const [categories, setCategories] = React.useState<CategoryApiResponse[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await apiClient.get("/api/category");

      if (response.data?.success) {
        setCategories(response.data.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (category: CategoryApiResponse) => {
    const isAlreadySelected = selectedCategories.some(
      (c) => c.cte_id === category.cte_id,
    );

    if (isAlreadySelected) {
      onChange(selectedCategories.filter((c) => c.cte_id !== category.cte_id));
    } else {
      onChange([
        ...selectedCategories,
        {
          id: Number(category.cte_id),
          cte_id: category.cte_id,
          cte_name: category.cte_name,
        },
      ]);
    }
  };

  const removeCategory = (cteIdToRemove: string, e: React.MouseEvent) => {
    e.stopPropagation();

    onChange(selectedCategories.filter((c) => c.cte_id !== cteIdToRemove));
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 rounded border-2 border-input bg-background px-3 py-2">
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />

        <span className="text-sm text-muted-foreground">
          Loading categories...
        </span>
      </div>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div
          role="combobox"
          aria-expanded={open}
          className={cn(
            "min-h-[44px] w-full cursor-pointer rounded border-2 border-input bg-background px-3 py-2 transition-all hover:border-primary/50 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20",
            "flex flex-wrap items-center justify-between gap-2",
            disabled && "cursor-not-allowed opacity-50",
          )}
          onClick={() => !disabled && setOpen(true)}
        >
          <div className="flex flex-1 flex-wrap items-center gap-1">
            {selectedCategories.length === 0 && (
              <span className="text-sm text-muted-foreground">
                Select categories...
              </span>
            )}

            {selectedCategories.map((cat) => (
              <Badge
                key={cat.cte_id}
                variant="secondary"
                className="group/badge flex items-center gap-1 rounded-full px-2.5 py-1"
              >
                {cat.cte_name}

                <div
                  role="button"
                  tabIndex={0}
                  className="cursor-pointer rounded-full bg-background/50 p-0.5 transition-colors hover:bg-destructive hover:text-destructive-foreground"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onClick={(e) => removeCategory(cat.cte_id, e)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      removeCategory(cat.cte_id, e as any);
                    }
                  }}
                >
                  <X className="h-3 w-3" />
                  <span className="sr-only">Remove {cat.cte_name}</span>
                </div>
              </Badge>
            ))}
          </div>

          <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
        </div>
      </PopoverTrigger>

      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
        <Command>
          <CommandInput placeholder="Search categories..." />

          <CommandList>
            <CommandEmpty>No category found.</CommandEmpty>

            <CommandGroup className="max-h-64 overflow-auto">
              {categories.map((category) => {
                const isSelected = selectedCategories.some(
                  (c) => c.cte_id === category.cte_id,
                );

                return (
                  <CommandItem
                    key={category.cte_id}
                    value={category.cte_name}
                    onSelect={() => handleSelect(category)}
                    className="cursor-pointer"
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        isSelected ? "opacity-100" : "opacity-0",
                      )}
                    />

                    <div className="flex items-center gap-2">
                      <div
                        className="h-3 w-3 rounded-full"
                        style={{
                          backgroundColor: category.color,
                        }}
                      />

                      <span>{category.cte_name}</span>
                    </div>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
