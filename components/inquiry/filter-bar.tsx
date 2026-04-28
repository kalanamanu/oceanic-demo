"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Filter, Download, Plus, Search } from "lucide-react";
import { useState } from "react";
import { VesselInquiryDialog } from "@/components/inquiry/AddVesselInquiryDialog";
import { Input } from "@/components/ui/input";

interface FilterBarProps {
  onExport?: () => void;
  onCreateNew?: () => void;
  onSearch?: (value: string) => void;
}

export function FilterBar({ onExport, onCreateNew, onSearch }: FilterBarProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [search, setSearch] = useState("");

  const handleSearchChange = (value: string) => {
    setSearch(value);
    onSearch?.(value);
  };

  return (
    <Card className="p-4 glass bg-gradient-to-br from-card to-secondary/35">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {/* LEFT SIDE */}
        <div className="flex items-center gap-3 flex-1">
          <Button
            variant={showFilters ? "default" : "outline"}
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>

          {/* 🔥 SEARCH BAR */}
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search vessel, agent, port..."
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-8"
            />
          </div>

          <p className="text-sm text-muted-foreground hidden md:block">
            Filter by status, port, PIC, or date range
          </p>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex gap-2">
          {onExport && (
            <Button variant="outline" size="sm" onClick={onExport}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          )}

          {onCreateNew && (
            <VesselInquiryDialog>
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                New Inquiry
              </Button>
            </VesselInquiryDialog>
          )}
        </div>
      </div>

      {/* FILTERS */}
      {showFilters && (
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-4 pt-4 border-t border-border">
          <div>
            <label className="text-xs font-medium text-muted-foreground">
              Status
            </label>
            <select className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm">
              <option>All Statuses</option>
              <option>Pending</option>
              <option>Quotation Submitted</option>
              <option>Active</option>
              <option>Confirmed</option>
              <option>Rejected</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground">
              Port
            </label>
            <select className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm">
              <option>All Ports</option>
              <option>Colombo</option>
              <option>Hambantota</option>
              <option>Trincomalee</option>
              <option>Galle</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground">
              PIC
            </label>
            <select className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm">
              <option>All PICs</option>
              <option>John Silva</option>
              <option>Maria Santos</option>
              <option>Ahmed Hassan</option>
              <option>Lisa Fernando</option>
              <option>Priya Kumar</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground">
              Date Range
            </label>
            <select className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm">
              <option>Last 30 Days</option>
              <option>Last 7 Days</option>
              <option>Today</option>
              <option>Custom Range</option>
            </select>
          </div>
        </div>
      )}
    </Card>
  );
}
