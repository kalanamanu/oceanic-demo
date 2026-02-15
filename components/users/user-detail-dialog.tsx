"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { User } from "@/types/user.types";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Mail,
  Briefcase,
  Building2,
  Shield,
  Calendar,
  Edit,
  X,
} from "lucide-react";
import { format } from "date-fns";

interface UserDetailDialogProps {
  user: User | null;
  open: boolean;
  onClose: () => void;
  onEdit: (user: User) => void;
}

export function UserDetailDialog({
  user,
  open,
  onClose,
  onEdit,
}: UserDetailDialogProps) {
  if (!user) return null;

  const getAccountTypeBadge = (accountType: string) => {
    const variants: Record<string, string> = {
      admin: "bg-purple-500/10 text-purple-500 border-purple-500/20",
      manager: "bg-blue-500/10 text-blue-500 border-blue-500/20",
      user: "bg-gray-500/10 text-gray-500 border-gray-500/20",
    };
    return variants[accountType] || variants.user;
  };

  const getStatusBadge = (status: string) => {
    return status === "active"
      ? "bg-green-500/10 text-green-500 border-green-500/20"
      : "bg-red-500/10 text-red-500 border-red-500/20";
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-2xl">User Details</DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">
                View and manage user information
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* User Name and Status */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold">
                {user.firstName} {user.lastName}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                ID: {user.id}
              </p>
            </div>
            <div className="flex gap-2">
              <Badge
                className={getAccountTypeBadge(user.accountType)}
                variant="outline"
              >
                {user.accountType}
              </Badge>
              {/* <Badge
                className={getStatusBadge(user.status || "active")}
                variant="outline"
              >
                {user.status || "active"}
              </Badge> */}
            </div>
          </div>

          <Separator />

          {/* User Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Email */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Mail className="h-4 w-4" />
                Email
              </div>
              <p className="text-foreground font-medium">{user.email}</p>
            </div>

            {/* Role */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Briefcase className="h-4 w-4" />
                Role
              </div>
              <p className="text-foreground font-medium">{user.role}</p>
            </div>

            {/* Department */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Building2 className="h-4 w-4" />
                Department
              </div>
              <p className="text-foreground font-medium">{user.department}</p>
            </div>

            {/* Account Type */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Shield className="h-4 w-4" />
                Account Type
              </div>
              <p className="text-foreground font-medium capitalize">
                {user.accountType}
              </p>
            </div>

            {/* Created At */}
            {user.createdAt && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  Created At
                </div>
                <p className="text-foreground font-medium">
                  {format(new Date(user.createdAt), "PPP")}
                </p>
              </div>
            )}

            {/* Updated At */}
            {user.updatedAt && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  Last Updated
                </div>
                <p className="text-foreground font-medium">
                  {format(new Date(user.updatedAt), "PPP")}
                </p>
              </div>
            )}
          </div>

          <Separator />

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button
              onClick={() => {
                onEdit(user);
                onClose();
              }}
              className="flex items-center gap-2"
            >
              <Edit className="h-4 w-4" />
              Edit User
            </Button>
            <DialogClose asChild>
              <Button variant="outline">Close</Button>
            </DialogClose>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
