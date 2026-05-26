"use client";

import * as React from "react";

import { toast } from "sonner";

import { Shield, Plus, Pencil, Trash2, Loader2, Check } from "lucide-react";

import { PermissionService } from "@/services/permission.service";

import type {
  Role,
  Permission,
  CreateRolePayload,
} from "@/types/permission.types";

import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

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

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Input } from "@/components/ui/input";

import { Textarea } from "@/components/ui/textarea";

import { Badge } from "@/components/ui/badge";

export default function RolesPage() {
  const [roles, setRoles] = React.useState<Role[]>([]);

  const [permissions, setPermissions] = React.useState<Permission[]>([]);

  const [loading, setLoading] = React.useState(true);

  const [saving, setSaving] = React.useState(false);

  const [open, setOpen] = React.useState(false);

  const [editing, setEditing] = React.useState<Role | null>(null);

  const [deleteItem, setDeleteItem] = React.useState<Role | null>(null);

  const [selectedPermissions, setSelectedPermissions] = React.useState<
    string[]
  >([]);

  const [form, setForm] = React.useState<CreateRolePayload>({
    roleName: "",
    roleDescription: "",
  });

  /* =========================================================
     LOAD
  ========================================================= */

  const loadData = async () => {
    try {
      setLoading(true);

      const [rolesData, permissionsData] = await Promise.all([
        PermissionService.getAllRoles(),
        PermissionService.getAllPermissions(),
      ]);

      setRoles(rolesData || []);

      setPermissions(permissionsData || []);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadData();
  }, []);

  /* =========================================================
     RESET
  ========================================================= */

  const resetForm = () => {
    setForm({
      roleName: "",
      roleDescription: "",
    });

    setSelectedPermissions([]);

    setEditing(null);
  };

  /* =========================================================
     CREATE
  ========================================================= */

  const handleCreate = () => {
    resetForm();

    setOpen(true);
  };

  /* =========================================================
     EDIT
  ========================================================= */

  const handleEdit = (role: Role) => {
    setEditing(role);

    setForm({
      roleName: role.roleName,
      roleDescription: role.roleDescription || "",
    });

    const ids = role.rolePermissions?.map((p) => p.permission_id) || [];

    setSelectedPermissions(ids);

    setOpen(true);
  };

  /* =========================================================
     TOGGLE PERMISSION
  ========================================================= */

  const togglePermission = (permissionId: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(permissionId)
        ? prev.filter((p) => p !== permissionId)
        : [...prev, permissionId],
    );
  };

  /* =========================================================
     SAVE
  ========================================================= */

  const handleSave = async () => {
    try {
      setSaving(true);

      let roleId = editing?.role_id;

      /* UPDATE */
      if (editing) {
        await PermissionService.updateRole(editing.role_id, form);

        toast.success("Role updated successfully");
      } else {
        /* CREATE */
        const created = await PermissionService.createRole(form);

        roleId = created.role_id;

        toast.success("Role created successfully");
      }

      /* ASSIGN PERMISSIONS */
      if (roleId && selectedPermissions.length > 0) {
        await PermissionService.bulkAssignPermissionsToRole({
          role_id: roleId,
          permission_ids: selectedPermissions,
        });
      }

      setOpen(false);

      resetForm();

      loadData();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  /* =========================================================
     DELETE
  ========================================================= */

  const handleDelete = async () => {
    if (!deleteItem) return;

    try {
      await PermissionService.deleteRole(deleteItem.role_id);

      toast.success("Role deleted successfully");

      setDeleteItem(null);

      loadData();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Roles</h1>

          <p className="text-sm text-muted-foreground">
            Manage system roles and role permissions
          </p>
        </div>

        <Button onClick={handleCreate}>
          <Plus className="w-4 h-4 mr-2" />
          Create Role
        </Button>
      </div>

      {/* =====================================================
          TABLE
      ===================================================== */}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            Roles List
          </CardTitle>

          <CardDescription>
            System roles and assigned permissions
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/40">
                <TableRow>
                  <TableHead>Role Name</TableHead>

                  <TableHead>Description</TableHead>

                  <TableHead>Permissions</TableHead>

                  <TableHead className="text-right w-[140px]">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-10">
                      <div className="flex items-center justify-center gap-2 text-muted-foreground">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Loading roles...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : roles.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center py-10 text-muted-foreground"
                    >
                      No roles found
                    </TableCell>
                  </TableRow>
                ) : (
                  roles.map((role) => (
                    <TableRow key={role.role_id}>
                      <TableCell className="font-medium">
                        {role.roleName}
                      </TableCell>

                      <TableCell>{role.roleDescription}</TableCell>

                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {role.rolePermissions?.map((p) => (
                            <Badge key={p.permission_id} variant="secondary">
                              {p.permission?.permissionName}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="flex justify-end gap-2">
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() => handleEdit(role)}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>

                          <Button
                            size="icon"
                            variant="destructive"
                            onClick={() => setDeleteItem(role)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* =====================================================
          CREATE / EDIT DIALOG
      ===================================================== */}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Role" : "Create Role"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* ROLE INFO */}

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

            {/* PERMISSIONS */}

            <div className="space-y-4">
              <div>
                <h3 className="font-medium">Assign Permissions</h3>

                <p className="text-sm text-muted-foreground">
                  Select permissions for this role
                </p>
              </div>

              <div className="border rounded-xl p-4 max-h-[400px] overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {permissions.map((permission) => {
                    const active = selectedPermissions.includes(
                      permission.permission_id,
                    );

                    return (
                      <button
                        key={permission.permission_id}
                        type="button"
                        onClick={() =>
                          togglePermission(permission.permission_id)
                        }
                        className={`border rounded-lg p-3 text-left transition-all ${
                          active
                            ? "border-primary bg-primary/5"
                            : "hover:border-primary/40"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-medium text-sm">
                              {permission.permissionName}
                            </p>

                            <p className="text-xs text-muted-foreground mt-1">
                              {permission.permissionDescription}
                            </p>

                            <div className="flex gap-2 mt-2">
                              <Badge variant="outline">
                                {permission.module}
                              </Badge>

                              <Badge variant="secondary">
                                {permission.action}
                              </Badge>
                            </div>
                          </div>

                          {active && (
                            <Check className="w-4 h-4 text-primary shrink-0 mt-1" />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>

            <Button onClick={handleSave} disabled={saving}>
              {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}

              {editing ? "Update Role" : "Create Role"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* =====================================================
          DELETE DIALOG
      ===================================================== */}

      <AlertDialog open={!!deleteItem} onOpenChange={() => setDeleteItem(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Role</AlertDialogTitle>

            <AlertDialogDescription>
              Are you sure you want to delete this role?
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>

            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
