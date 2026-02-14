"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DateTimePickerProps {
  date?: Date;
  onDateChange?: (date: Date | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function DateTimePicker({
  date,
  onDateChange,
  placeholder = "Select date and time",
  disabled = false,
}: DateTimePickerProps) {
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(
    date,
  );

  const [hours, setHours] = React.useState<string>(
    date ? format(date, "HH") : "00",
  );
  const [minutes, setMinutes] = React.useState<string>(
    date ? format(date, "mm") : "00",
  );

  // Sync with external date prop changes
  React.useEffect(() => {
    if (date) {
      setSelectedDate(date);
      setHours(format(date, "HH"));
      setMinutes(format(date, "mm"));
    }
  }, [date]);

  const handleDateSelect = (newDate: Date | undefined) => {
    if (!newDate) {
      setSelectedDate(undefined);
      onDateChange?.(undefined);
      return;
    }

    newDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    setSelectedDate(newDate);
    onDateChange?.(newDate);
  };

  const handleHoursChange = (value: string) => {
    setHours(value);
    if (selectedDate) {
      const newDate = new Date(selectedDate);
      newDate.setHours(parseInt(value), parseInt(minutes), 0, 0);
      setSelectedDate(newDate);
      onDateChange?.(newDate);
    }
  };

  const handleMinutesChange = (value: string) => {
    setMinutes(value);
    if (selectedDate) {
      const newDate = new Date(selectedDate);
      newDate.setHours(parseInt(hours), parseInt(value), 0, 0);
      setSelectedDate(newDate);
      onDateChange?.(newDate);
    }
  };

  // Generate hours array (00-23)
  const hoursArray = Array.from({ length: 24 }, (_, i) =>
    i.toString().padStart(2, "0"),
  );

  // Generate minutes array (00-59)
  const minutesArray = Array.from({ length: 60 }, (_, i) =>
    i.toString().padStart(2, "0"),
  );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !selectedDate && "text-muted-foreground",
          )}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {selectedDate ? (
            <span>
              {format(selectedDate, "dd.MM.yyyy")} at {hours}:{minutes}
            </span>
          ) : (
            <span>{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleDateSelect}
          initialFocus
        />
        <div className="p-3 border-t border-border">
          <Label className="text-sm font-medium mb-2 block">Select Time</Label>
          <div className="flex items-center gap-2">
            {/* Hours Select */}
            <Select value={hours} onValueChange={handleHoursChange}>
              <SelectTrigger className="w-[80px]">
                <SelectValue placeholder="HH" />
              </SelectTrigger>
              <SelectContent className="max-h-[200px]">
                {hoursArray.map((hour) => (
                  <SelectItem key={hour} value={hour}>
                    {hour}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <span className="text-lg font-semibold">:</span>

            {/* Minutes Select */}
            <Select value={minutes} onValueChange={handleMinutesChange}>
              <SelectTrigger className="w-[80px]">
                <SelectValue placeholder="MM" />
              </SelectTrigger>
              <SelectContent className="max-h-[200px]">
                {minutesArray.map((minute) => (
                  <SelectItem key={minute} value={minute}>
                    {minute}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Select hours (00-23) and minutes (00-59)
          </p>
        </div>
      </PopoverContent>
    </Popover>
  );
}
