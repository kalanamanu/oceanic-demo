"use client";

import * as React from "react";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { PermissionService } from "@/services/permission.service";
import { Button } from "@/components/ui/button";

import type {
  Role,
  Permission,
  CreateRolePayload,
} from "@/types/permission.types";

import RolesTable from "@/components/system-configuration/roles/roles-table";
import RoleFormDialog from "@/components/system-configuration/roles/role-form-dialog";
import RoleDeleteDialog from "@/components/system-configuration/roles/role-delete-dialog";

export default function RolesPage() {
  const [roles, setRoles] = React.useState<Role[]>([]);
  const [permissions, setPermissions] = React.useState<Permission[]>([]);

  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);

  // Form Dialog
  const [open, setOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Role | null>(null);

  // Delete Dialog
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [deleteItem, setDeleteItem] = React.useState<Role | null>(null);

  const [selectedPermissions, setSelectedPermissions] = React.useState<
    string[]
  >([]);

  const [form, setForm] = React.useState<CreateRolePayload>({
    roleName: "",
    roleDescription: "",
  });

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

  const resetForm = () => {
    setForm({
      roleName: "",
      roleDescription: "",
    });

    setSelectedPermissions([]);
    setEditing(null);
  };

  const handleCreate = () => {
    resetForm();
    setOpen(true);
  };

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

  const handleDeleteClick = (role: Role) => {
    setDeleteItem(role);
    setDeleteOpen(true);
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      let roleId = editing?.role_id;

      if (editing) {
        await PermissionService.updateRole(editing.role_id, form);

        toast.success("Role updated successfully");
      } else {
        const created = await PermissionService.createRole(form);

        roleId = created.role_id;

        toast.success("Role created successfully");
      }

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

  const handleDelete = async () => {
    if (!deleteItem) return;

    try {
      await PermissionService.deleteRole(deleteItem.role_id);

      toast.success("Role deleted successfully");

      setDeleteOpen(false);
      setDeleteItem(null);

      loadData();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <div className="p-6 space-y-6">
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

      <RolesTable
        roles={roles}
        loading={loading}
        onEdit={handleEdit}
        onDeleteClick={handleDeleteClick}
      />

      <RoleFormDialog
        open={open}
        setOpen={setOpen}
        editing={editing}
        saving={saving}
        form={form}
        setForm={setForm}
        permissions={permissions}
        selectedPermissions={selectedPermissions}
        setSelectedPermissions={setSelectedPermissions}
        onSave={handleSave}
      />

      <RoleDeleteDialog
        open={deleteOpen}
        setOpen={setDeleteOpen}
        role={deleteItem}
        onConfirm={handleDelete}
      />
    </div>
  );
}
