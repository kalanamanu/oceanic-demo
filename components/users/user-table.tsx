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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
    <div className="rounded-lg border border-border bg-card shadow-sm overflow-hidden">
      <Table className="p-6">
        <TableHeader>
          <TableRow className="hover:bg-transparent bg-muted/50 border-b-2 border-border">
            <TableHead className="font-semibold text-foreground px-4">
              Name
            </TableHead>
            <TableHead className="font-semibold text-foreground px-4">
              Email
            </TableHead>
            <TableHead className="font-semibold text-foreground px-4">
              Role
            </TableHead>
            <TableHead className="font-semibold text-foreground px-4">
              Department
            </TableHead>
            <TableHead className="font-semibold text-foreground px-4">
              Account Type
            </TableHead>
            <TableHead className="font-semibold text-foreground text-right px-4">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={6}
                className="text-center py-12 text-muted-foreground"
              >
                <div className="flex flex-col items-center gap-2">
                  <div className="text-lg font-medium">No users found</div>
                  <div className="text-sm">
                    Try adjusting your search or filters
                  </div>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
              <TableRow
                key={user.id}
                className="hover:bg-muted/70 border-b border-border/50 transition-colors"
              >
                <TableCell className="font-medium text-foreground py-4 px-4">
                  {user.firstName} {user.lastName}
                </TableCell>
                <TableCell className="text-muted-foreground py-4 px-4">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="truncate max-w-xs block cursor-help">
                          {user.email}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>{user.email}</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
                <TableCell className="text-foreground py-4 px-4">
                  {user.role}
                </TableCell>
                <TableCell className="text-muted-foreground py-4 px-4">
                  {user.department}
                </TableCell>
                <TableCell className="py-4 px-4">
                  <Badge className={getAccountTypeBadge(user.accountType)}>
                    {user.accountType}
                  </Badge>
                </TableCell>
                <TableCell className="text-right py-4 px-4">
                  <div>
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
