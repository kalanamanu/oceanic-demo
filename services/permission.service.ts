import apiClient from '@/lib/api-client';

import type {
  Permission,
  Role,
  RolePermission,
  UserPermission,
  CreatePermissionPayload,
  UpdatePermissionPayload,
  BulkCreatePermissionsPayload,
  CreateRolePayload,
  UpdateRolePayload,
  AssignPermissionPayload,
  BulkAssignPermissionsPayload,
  CreateUserPermissionPayload,
  BulkCreateUserPermissionPayload,
  UpdateUserPermissionPayload,
} from "@/types/permission.types";

export class PermissionService {
  /* =========================================================
     PERMISSIONS
  ========================================================= */

  static async createPermission(payload: CreatePermissionPayload) {
    try {
      const res = await apiClient.post("/api/permission", payload);

      return res.data.data as Permission;
    } catch (err: any) {
      throw new Error(
        err?.response?.data?.message ||
          "Failed to create permission",
      );
    }
  }

  static async bulkCreatePermissions(
    payload: BulkCreatePermissionsPayload,
  ) {
    try {
      const res = await apiClient.post(
        "/api/permission/bulk",
        payload,
      );

      return res.data.data;
    } catch (err: any) {
      throw new Error(
        err?.response?.data?.message ||
          "Failed to bulk create permissions",
      );
    }
  }

  static async getAllPermissions(): Promise<Permission[]> {
    try {
      const res = await apiClient.get("/api/permission");

      return res.data.data;
    } catch (err: any) {
      throw new Error(
        err?.response?.data?.message ||
          "Failed to fetch permissions",
      );
    }
  }

  static async getPermissionById(
    permissionId: string,
  ): Promise<Permission> {
    try {
      const res = await apiClient.get(
        `/api/permission/${permissionId}`,
      );

      return res.data.data;
    } catch (err: any) {
      throw new Error(
        err?.response?.data?.message ||
          "Failed to fetch permission",
      );
    }
  }

  static async updatePermission(
    permissionId: string,
    payload: UpdatePermissionPayload,
  ) {
    try {
      const res = await apiClient.put(
        `/api/permission/${permissionId}`,
        payload,
      );

      return res.data.data as Permission;
    } catch (err: any) {
      throw new Error(
        err?.response?.data?.message ||
          "Failed to update permission",
      );
    }
  }

  static async deletePermission(permissionId: string) {
    try {
      const res = await apiClient.delete(
        `/api/permission/${permissionId}`,
      );

      return res.data;
    } catch (err: any) {
      throw new Error(
        err?.response?.data?.message ||
          "Failed to delete permission",
      );
    }
  }

  /* =========================================================
     ROLES
  ========================================================= */

  static async createRole(payload: CreateRolePayload) {
    try {
      const res = await apiClient.post(
        "/api/permission/roles",
        payload,
      );

      return res.data.data as Role;
    } catch (err: any) {
      throw new Error(
        err?.response?.data?.message ||
          "Failed to create role",
      );
    }
  }

  static async getAllRoles(): Promise<Role[]> {
    try {
      const res = await apiClient.get("/api/permission/roles");

      return res.data.data;
    } catch (err: any) {
      throw new Error(
        err?.response?.data?.message ||
          "Failed to fetch roles",
      );
    }
  }

  static async getRoleById(roleId: string): Promise<Role> {
    try {
      const res = await apiClient.get(
        `/api/permission/roles/${roleId}`,
      );

      return res.data.data;
    } catch (err: any) {
      throw new Error(
        err?.response?.data?.message ||
          "Failed to fetch role",
      );
    }
  }

  static async updateRole(
    roleId: string,
    payload: UpdateRolePayload,
  ) {
    try {
      const res = await apiClient.put(
        `/api/permission/roles/${roleId}`,
        payload,
      );

      return res.data.data as Role;
    } catch (err: any) {
      throw new Error(
        err?.response?.data?.message ||
          "Failed to update role",
      );
    }
  }

  static async deleteRole(roleId: string) {
    try {
      const res = await apiClient.delete(
        `/api/permission/roles/${roleId}`,
      );

      return res.data;
    } catch (err: any) {
      throw new Error(
        err?.response?.data?.message ||
          "Failed to delete role",
      );
    }
  }

  /* =========================================================
     ROLE PERMISSIONS
  ========================================================= */

  static async assignPermissionToRole(
    roleId: string,
    payload: AssignPermissionPayload,
  ) {
    try {
      const res = await apiClient.post(
        `/api/permission/roles/${roleId}/permissions`,
        payload,
      );

      return res.data.data as RolePermission;
    } catch (err: any) {
      throw new Error(
        err?.response?.data?.message ||
          "Failed to assign permission",
      );
    }
  }

  static async bulkAssignPermissionsToRole(
    payload: BulkAssignPermissionsPayload,
  ) {
    try {
      const res = await apiClient.post(
        "/api/permission/roles/permissions/bulk",
        payload,
      );

      return res.data.data;
    } catch (err: any) {
      throw new Error(
        err?.response?.data?.message ||
          "Failed to bulk assign permissions",
      );
    }
  }

  /* =========================================================
     USER PERMISSIONS
  ========================================================= */

  static async getUserPermissions(
    userId: string,
  ): Promise<UserPermission[]> {
    try {
      const res = await apiClient.get(
        `/api/permission/users/${userId}/permissions`,
      );

      return res.data.data;
    } catch (err: any) {
      throw new Error(
        err?.response?.data?.message ||
          "Failed to fetch user permissions",
      );
    }
  }

  static async createUserPermission(
    payload: CreateUserPermissionPayload,
  ) {
    try {
      const res = await apiClient.post(
        "/api/permission/users/permissions",
        payload,
      );

      return res.data.data as UserPermission;
    } catch (err: any) {
      throw new Error(
        err?.response?.data?.message ||
          "Failed to create user permission",
      );
    }
  }

  static async bulkCreateUserPermissions(
    payload: BulkCreateUserPermissionPayload,
  ) {
    try {
      const res = await apiClient.post(
        "/api/permission/users/permissions/bulk",
        payload,
      );

      return res.data.data;
    } catch (err: any) {
      throw new Error(
        err?.response?.data?.message ||
          "Failed to bulk create user permissions",
      );
    }
  }

  static async updateUserPermission(
    upId: number,
    payload: UpdateUserPermissionPayload,
  ) {
    try {
      const res = await apiClient.put(
        `/api/permission/users/permissions/${upId}`,
        payload,
      );

      return res.data.data as UserPermission;
    } catch (err: any) {
      throw new Error(
        err?.response?.data?.message ||
          "Failed to update user permission",
      );
    }
  }

  static async deleteUserPermission(upId: number) {
    try {
      const res = await apiClient.delete(
        `/api/permission/users/permissions/${upId}`,
      );

      return res.data;
    } catch (err: any) {
      throw new Error(
        err?.response?.data?.message ||
          "Failed to delete user permission",
      );
    }
  }
}