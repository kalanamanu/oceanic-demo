"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ActionDialog({ open, onOpenChange }: Props) {
  const [handover, setHandover] = React.useState("no");
  const [returnFor, setReturnFor] = React.useState("");
  const [remarks, setRemarks] = React.useState("");

  const handleSave = () => {
    const payload = {
      handover_to_boarding_officer: handover === "yes",
      return_for: returnFor,
      remarks,
      status: "saved",
    };

    console.log("SAVE:", payload);
    onOpenChange(false);
  };

  const handleComplete = () => {
    const payload = {
      handover_to_boarding_officer: handover === "yes",
      return_for: returnFor,
      remarks,
      status: "completed",
    };

    console.log("COMPLETED:", payload);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Action Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-5 mt-2">
          {/* Radio */}
          <div className="space-y-2">
            <Label>Handover to Boarding Officer</Label>
            <RadioGroup value={handover} onValueChange={setHandover}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="yes" />
                <Label htmlFor="yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="no" />
                <Label htmlFor="no">No</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Dropdown */}
          <div className="space-y-2">
            <Label>Return For</Label>
            <Select value={returnFor} onValueChange={setReturnFor}>
              <SelectTrigger>
                <SelectValue placeholder="Select return type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="vessel_return">Vessel Return</SelectItem>
                <SelectItem value="return_to_supplier">
                  Return to Supplier
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Remarks */}
          <div className="space-y-2">
            <Label>Remarks</Label>
            <Input
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Enter remarks..."
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="secondary" onClick={handleSave}>
            Save
          </Button>

          <Button onClick={handleComplete}>Mark as Completed</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
