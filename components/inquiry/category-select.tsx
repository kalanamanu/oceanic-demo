"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Loader2, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
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
import { Badge } from "@/components/ui/badge";
import apiClient from "@/lib/api-client";
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
      if (response.data && response.data.success) {
        setCategories(response.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (category: CategoryApiResponse) => {
    const isAlreadySelected = selectedCategories.some(
      (c) => c.id === category.cte_id,
    );

    if (isAlreadySelected) {
      onChange(selectedCategories.filter((c) => c.id !== category.cte_id));
    } else {
      onChange([
        ...selectedCategories,
        { id: category.cte_id, name: category.cte_name },
      ]);
    }
  };

  const removeCategory = (idToRemove: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(selectedCategories.filter((c) => c.id !== idToRemove));
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 border-2 border-input rounded px-3 py-2 bg-background">
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
            "min-h-[44px] w-full flex flex-wrap items-center justify-between gap-2 border-2 border-input rounded px-3 py-2 bg-background hover:border-primary/50 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all cursor-pointer",
            disabled && "opacity-50 cursor-not-allowed",
          )}
          onClick={() => !disabled && setOpen(true)}
        >
          <div className="flex flex-wrap gap-1 flex-1 items-center">
            {selectedCategories.length === 0 && (
              <span className="text-muted-foreground text-sm">
                Select categories...
              </span>
            )}
            {selectedCategories.map((cat) => (
              <Badge
                key={cat.id}
                variant="secondary"
                className="flex items-center gap-1 group/badge py-1 px-2.5 rounded-full"
              >
                {cat.name}
                <div
                  role="button"
                  tabIndex={0}
                  className="rounded-full bg-background/50 p-0.5 hover:bg-destructive hover:text-destructive-foreground transition-colors cursor-pointer"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") removeCategory(cat.id, e as any);
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onClick={(e) => removeCategory(cat.id, e)}
                >
                  <X className="h-3 w-3" />
                  <span className="sr-only">Remove {cat.name}</span>
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
                  (c) => c.id === category.cte_id,
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
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: category.color }}
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
