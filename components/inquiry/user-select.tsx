"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Loader2, Search } from "lucide-react";
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
import { UserService } from "@/services/user.service";
import { User } from "@/types/user.types";

interface UserSelectProps {
  value: string;
  onValueChange: (userId: string, userName: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function UserSelect({
  value,
  onValueChange,
  placeholder = "Select PIC",
  disabled = false,
}: UserSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [users, setUsers] = React.useState<User[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const result = await UserService.getAllUsers({ page: 1, pageSize: 100 });
      setUsers(result.data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (userId: string) => {
    const selectedUser = users.find((u) => u.id === userId);
    if (selectedUser) {
      const userName = `${selectedUser.firstName} ${selectedUser.lastName}`;
      onValueChange(userId, userName);
    }
    setOpen(false);
  };

  const selectedUser = users.find((u) => u.id === value);
  const displayValue = selectedUser
    ? `${selectedUser.firstName} ${selectedUser.lastName}`
    : placeholder;

  if (loading) {
    return (
      <div className="flex items-center gap-2 border border-input rounded-md px-3 py-2 bg-background h-10">
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Loading users...</span>
      </div>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn(
            "w-full justify-between h-10",
            !value && "text-muted-foreground",
            "hover:bg-muted hover:text-foreground dark:hover:text-white",
          )}
        >
          <span className="truncate">{displayValue}</span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput
            placeholder="Search by name, email, or role..."
            className="h-9"
          />
          <CommandList>
            <CommandEmpty>
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <Search className="h-8 w-8 text-muted-foreground/50 mb-2" />
                <p className="text-sm font-medium text-foreground">
                  No user found
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Try a different search term
                </p>
              </div>
            </CommandEmpty>
            <CommandGroup>
              {users.map((user) => (
                <CommandItem
                  key={user.id}
                  value={`${user.firstName} ${user.lastName} ${user.email} ${user.role}`}
                  onSelect={() => handleSelect(user.id)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4 flex-shrink-0",
                      value === user.id ? "opacity-100" : "opacity-0",
                    )}
                  />
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="text-sm font-medium truncate">
                      {user.firstName} {user.lastName}
                    </span>
                    <span className="text-xs opacity-70 truncate">
                      {user.role} • {user.email}
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
