"use client";

import * as React from "react";

import { toast } from "sonner";

import { ShieldCheck, Plus, Pencil, Trash2, Loader2 } from "lucide-react";

import { PermissionService } from "@/services/permission.service";

import type {
  Permission,
  CreatePermissionPayload,
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

export default function PermissionsPage() {
  const [permissions, setPermissions] = React.useState<Permission[]>([]);

  const [loading, setLoading] = React.useState(true);

  const [saving, setSaving] = React.useState(false);

  const [open, setOpen] = React.useState(false);

  const [editing, setEditing] = React.useState<Permission | null>(null);

  const [deleteItem, setDeleteItem] = React.useState<Permission | null>(null);

  const [form, setForm] = React.useState<CreatePermissionPayload>({
    permissionName: "",
    permissionDescription: "",
    page: "",
    module: "",
    action: "",
  });

  /* =========================================================
     LOAD
  ========================================================= */

  const loadPermissions = async () => {
    try {
      setLoading(true);

      const data = await PermissionService.getAllPermissions();

      setPermissions(data || []);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadPermissions();
  }, []);

  /* =========================================================
     RESET
  ========================================================= */

  const resetForm = () => {
    setForm({
      permissionName: "",
      permissionDescription: "",
      page: "",
      module: "",
      action: "",
    });

    setEditing(null);
  };

  /* =========================================================
     OPEN CREATE
  ========================================================= */

  const handleCreate = () => {
    resetForm();

    setOpen(true);
  };

  /* =========================================================
     OPEN EDIT
  ========================================================= */

  const handleEdit = (item: Permission) => {
    setEditing(item);

    setForm({
      permissionName: item.permissionName,
      permissionDescription: item.permissionDescription,
      page: item.page,
      module: item.module,
      action: item.action,
    });

    setOpen(true);
  };

  /* =========================================================
     SAVE
  ========================================================= */

  const handleSave = async () => {
    try {
      setSaving(true);

      if (editing) {
        await PermissionService.updatePermission(editing.permission_id, {
          permissionName: form.permissionName,
          permissionDescription: form.permissionDescription,
        });

        toast.success("Permission updated successfully");
      } else {
        await PermissionService.createPermission(form);

        toast.success("Permission created successfully");
      }

      setOpen(false);

      resetForm();

      loadPermissions();
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
      await PermissionService.deletePermission(deleteItem.permission_id);

      toast.success("Permission deleted successfully");

      setDeleteItem(null);

      loadPermissions();
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
          <h1 className="text-2xl font-bold tracking-tight">Permissions</h1>

          <p className="text-sm text-muted-foreground">
            Manage system permissions and access control
          </p>
        </div>

        <Button onClick={handleCreate}>
          <Plus className="w-4 h-4 mr-2" />
          Create Permission
        </Button>
      </div>

      {/* =====================================================
          CARD
      ===================================================== */}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-primary" />
            Permissions List
          </CardTitle>

          <CardDescription>All available system permissions</CardDescription>
        </CardHeader>

        <CardContent>
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/40">
                <TableRow>
                  <TableHead>Name</TableHead>

                  <TableHead>Module</TableHead>

                  <TableHead>Page</TableHead>

                  <TableHead>Action</TableHead>

                  <TableHead>Description</TableHead>

                  <TableHead className="w-[140px] text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-10">
                      <div className="flex items-center justify-center gap-2 text-muted-foreground">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Loading permissions...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : permissions.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-10 text-muted-foreground"
                    >
                      No permissions found
                    </TableCell>
                  </TableRow>
                ) : (
                  permissions.map((item) => (
                    <TableRow key={item.permission_id}>
                      <TableCell className="font-medium">
                        {item.permissionName}
                      </TableCell>

                      <TableCell>{item.module}</TableCell>

                      <TableCell>{item.page}</TableCell>

                      <TableCell>
                        <span className="capitalize">{item.action}</span>
                      </TableCell>

                      <TableCell className="max-w-[350px] truncate">
                        {item.permissionDescription}
                      </TableCell>

                      <TableCell>
                        <div className="flex justify-end gap-2">
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() => handleEdit(item)}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>

                          <Button
                            size="icon"
                            variant="destructive"
                            onClick={() => setDeleteItem(item)}
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
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {editing ? "Edit Permission" : "Create Permission"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Permission Name</label>

              <Input
                value={form.permissionName}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    permissionName: e.target.value,
                  }))
                }
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>

              <Textarea
                value={form.permissionDescription}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    permissionDescription: e.target.value,
                  }))
                }
              />
            </div>

            {!editing && (
              <>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Module</label>

                    <Input
                      value={form.module}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          module: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Page</label>

                    <Input
                      value={form.page}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          page: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Action</label>

                    <Input
                      value={form.action}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          action: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
              </>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>

            <Button onClick={handleSave} disabled={saving}>
              {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}

              {editing ? "Update Permission" : "Create Permission"}
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
            <AlertDialogTitle>Delete Permission</AlertDialogTitle>

            <AlertDialogDescription>
              Are you sure you want to delete this permission?
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
