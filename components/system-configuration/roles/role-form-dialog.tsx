"use client";

import * as React from "react";
import { Loader2, ChevronsUpDown, Check, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import type {
  Role,
  Permission,
  CreateRolePayload,
} from "@/types/permission.types";

interface RoleFormDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;

  editing: Role | null;
  saving: boolean;

  form: CreateRolePayload;
  setForm: React.Dispatch<React.SetStateAction<CreateRolePayload>>;

  permissions: Permission[];

  selectedPermissions: string[];
  setSelectedPermissions: React.Dispatch<React.SetStateAction<string[]>>;

  onSave: () => void | Promise<void>;
}

export default function RoleFormDialog({
  open,
  setOpen,
  editing,
  saving,
  form,
  setForm,
  permissions,
  selectedPermissions,
  setSelectedPermissions,
  onSave,
}: RoleFormDialogProps) {
  const togglePermission = (id: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id],
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>{editing ? "Edit Role" : "Create Role"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Role Name</label>
              <Input
                value={form.roleName}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    roleName: e.target.value,
                  }))
                }
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={form.roleDescription}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    roleDescription: e.target.value,
                  }))
                }
              />
            </div>
          </div>

          <div>
            <h3 className="font-medium">Assign Permissions</h3>
          </div>

          {/* Permission Selector */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                Select Permissions
                <ChevronsUpDown className="w-4 h-4 opacity-50" />
              </Button>
            </PopoverTrigger>

            <PopoverContent className="w-[500px] p-0">
              <Command>
                <CommandInput placeholder="Search permissions..." />
                <CommandList>
                  <CommandEmpty>No permissions found</CommandEmpty>

                  <CommandGroup>
                    {permissions.map((p) => {
                      const selected = selectedPermissions.includes(
                        p.permission_id,
                      );

                      return (
                        <CommandItem
                          key={p.permission_id}
                          value={p.permissionName}
                          onSelect={() => togglePermission(p.permission_id)}
                        >
                          <Check
                            className={`mr-2 h-4 w-4 ${
                              selected ? "opacity-100" : "opacity-0"
                            }`}
                          />

                          <div>
                            <p className="text-sm font-medium">
                              {p.permissionName}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {p.module} • {p.action}
                            </p>
                          </div>
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          {/* Selected Permissions */}
          <div className="flex flex-wrap gap-2">
            {selectedPermissions.map((id) => {
              const perm = permissions.find((p) => p.permission_id === id);

              if (!perm) return null;

              return (
                <div
                  key={id}
                  className="flex items-center gap-2 border rounded px-3 py-1"
                >
                  <span className="text-sm">{perm.permissionName}</span>

                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6"
                    onClick={() => togglePermission(id)}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              );
            })}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>

          <Button onClick={onSave} disabled={saving}>
            {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {editing ? "Update" : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
