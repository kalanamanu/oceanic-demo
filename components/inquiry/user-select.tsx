"use client";

import * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserService } from "@/services/user.service";
import { User } from "@/types/user.types";
import { Loader2 } from "lucide-react";

interface UserSelectProps {
  value: string;
  onValueChange: (userId: string, userName: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function UserSelect({
  value,
  onValueChange,
  placeholder = "Select user",
  disabled = false,
}: UserSelectProps) {
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

  const handleValueChange = (userId: string) => {
    const selectedUser = users.find((u) => u.id === userId);
    if (selectedUser) {
      const userName = `${selectedUser.firstName} ${selectedUser.lastName}`;
      onValueChange(userId, userName);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 border border-input rounded px-3 py-2 bg-background">
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Loading users...</span>
      </div>
    );
  }

  return (
    <Select value={value} onValueChange={handleValueChange} disabled={disabled}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {users.length === 0 ? (
          <div className="p-2 text-sm text-muted-foreground">
            No users found
          </div>
        ) : (
          users.map((user) => (
            <SelectItem key={user.id} value={user.id}>
              {user.firstName} {user.lastName} - {user.role}
            </SelectItem>
          ))
        )}
      </SelectContent>
    </Select>
  );
}
