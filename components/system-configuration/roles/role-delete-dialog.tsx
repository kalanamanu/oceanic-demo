"use client";

import * as React from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import type { Role } from "@/types/permission.types";

interface RoleDeleteDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  role: Role | null;
  onConfirm: () => void | Promise<void>;
}

export default function RoleDeleteDialog({
  open,
  setOpen,
  role,
  onConfirm,
}: RoleDeleteDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Role</AlertDialogTitle>

          <AlertDialogDescription>
            Are you sure you want to delete{" "}
            <span className="font-semibold">{role?.roleName}</span>? This action
            cannot be reversed.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>

          <AlertDialogAction
            onClick={onConfirm}
            className="bg-destructive text-white hover:bg-destructive/90"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
