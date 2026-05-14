"use client";

import * as React from "react";
import { Clock } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TimePickerProps {
  time?: string; // "HH:mm"
  onTimeChange?: (time: string | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function TimePicker({
  time,
  onTimeChange,
  placeholder = "HH:mm",
  disabled = false,
}: TimePickerProps) {
  const [open, setOpen] = React.useState(false);

  const [hours, setHours] = React.useState<string>(() => {
    if (!time) return "00";
    return time.split(":")[0] ?? "00";
  });

  const [minutes, setMinutes] = React.useState<string>(() => {
    if (!time) return "00";
    return time.split(":")[1] ?? "00";
  });

  React.useEffect(() => {
    if (time) {
      const [h, m] = time.split(":");
      setHours(h ?? "00");
      setMinutes(m ?? "00");
    }
  }, [time]);

  const emitChange = (h: string, m: string) => {
    const value = `${h}:${m}`;
    onTimeChange?.(value);
  };

  const handleHoursChange = (value: string) => {
    setHours(value);
    emitChange(value, minutes);
  };

  const handleMinutesChange = (value: string) => {
    setMinutes(value);
    emitChange(hours, value);
  };

  const hoursArray = Array.from({ length: 24 }, (_, i) =>
    i.toString().padStart(2, "0"),
  );

  const minutesArray = Array.from({ length: 60 }, (_, i) =>
    i.toString().padStart(2, "0"),
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className={cn(
            "w-full justify-start text-left font-normal h-10 px-3",
            "border-2 border-input bg-background",
            "hover:bg-primary/10 hover:border-primary/50",
            "transition-colors",
            !time && "text-muted-foreground",
          )}
        >
          <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
          {time ? (
            <span className="text-foreground font-medium">{time}</span>
          ) : (
            <span>{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-auto p-4">
        <div className="space-y-3">
          <Label className="text-sm font-medium">Select Time (24H)</Label>

          <div className="flex items-center gap-2">
            {/* Hours */}
            <Select value={hours} onValueChange={handleHoursChange}>
              <SelectTrigger className="w-[90px]">
                <SelectValue placeholder="HH" />
              </SelectTrigger>
              <SelectContent className="max-h-[220px]">
                {hoursArray.map((h) => (
                  <SelectItem key={h} value={h}>
                    {h}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <span className="text-lg font-semibold">:</span>

            {/* Minutes */}
            <Select value={minutes} onValueChange={handleMinutesChange}>
              <SelectTrigger className="w-[90px]">
                <SelectValue placeholder="MM" />
              </SelectTrigger>
              <SelectContent className="max-h-[220px]">
                {minutesArray.map((m) => (
                  <SelectItem key={m} value={m}>
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <p className="text-xs text-muted-foreground">
            24-hour format (00:00 - 23:59)
          </p>
        </div>
      </PopoverContent>
    </Popover>
  );
}
