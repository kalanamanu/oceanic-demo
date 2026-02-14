"use client";

import { User } from "@/types/user.types";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface UserTableProps {
  users: User[];
  onSelectUser: (user: User) => void;
  onEditUser: (user: User) => void;
  onDeleteUser: (user: User) => void;
}

export function UserTable({
  users,
  onSelectUser,
  onEditUser,
  onDeleteUser,
}: UserTableProps) {
  const getAccountTypeBadge = (accountType: string) => {
    const variants: Record<string, string> = {
      admin: "bg-purple-500/10 text-purple-500 hover:bg-purple-500/20",
      manager: "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20",
      user: "bg-gray-500/10 text-gray-500 hover:bg-gray-500/20",
    };
    return variants[accountType] || variants.user;
  };

  const getStatusBadge = (status: string) => {
    return status === "active"
      ? "bg-green-500/10 text-green-500 hover:bg-green-500/20"
      : "bg-red-500/10 text-red-500 hover:bg-red-500/20";
  };

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Account Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={7}
                className="text-center py-8 text-muted-foreground"
              >
                No users found
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
              <TableRow key={user.id} className="hover:bg-muted/50">
                <TableCell className="font-medium">
                  {user.firstName} {user.lastName}
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>{user.department}</TableCell>
                <TableCell>
                  <Badge className={getAccountTypeBadge(user.accountType)}>
                    {user.accountType}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={getStatusBadge(user.status || "active")}>
                    {user.status || "active"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onSelectUser(user)}
                      title="View Details"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEditUser(user)}
                      title="Edit User"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDeleteUser(user)}
                      title="Delete User"
                      className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
