/* =========================================================
   PERMISSION
========================================================= */

export interface Permission {
  permission_id: string;

  permissionName: string;

  permissionDescription: string;

  page: string;

  module: string;

  action: string;

  createdAt?: string;

  updatedAt?: string;
}

export interface CreatePermissionPayload {
  permissionName: string;

  permissionDescription: string;

  page: string;

  module: string;

  action: string;
}

export interface UpdatePermissionPayload {
  permissionName?: string;

  permissionDescription?: string;
}

export interface BulkCreatePermissionsPayload {
  permissions: CreatePermissionPayload[];
}

/* =========================================================
   ROLE
========================================================= */

export interface Role {
  role_id: string;

  roleName: string;

  roleDescription: string;

  createdAt?: string;

  updatedAt?: string;

  rolePermissions?: RolePermission[];
}

export interface CreateRolePayload {
  roleName: string;

  roleDescription: string;
}

export interface UpdateRolePayload {
  roleName?: string;

  roleDescription?: string;
}

/* =========================================================
   ROLE PERMISSION
========================================================= */

export interface RolePermission {
  rp_id: string;

  role_id: string;

  permission_id: string;

  createdAt?: string;

  updatedAt?: string;

  permission?: Permission;
}

export interface AssignPermissionPayload {
  role_id: string;

  permission_id: string;
}

export interface BulkAssignPermissionsPayload {
  role_id: string;

  permission_ids: string[];
}

/* =========================================================
   USER PERMISSION
========================================================= */

export interface UserPermission {
  up_id: number;

  user_id: string;

  permission_id: string;

  createdAt?: string;

  updatedAt?: string;

  permission?: Permission;
}

export interface CreateUserPermissionPayload {
  user_id: string;

  permission_id: string;
}

export interface BulkCreateUserPermissionPayload {
  user_id: string;

  permission_ids: string[];
}

export interface UpdateUserPermissionPayload {
  permission_id: string;
}

/* =========================================================
   COMMON API RESPONSES
========================================================= */

export interface ApiResponse<T> {
  success: boolean;

  message?: string;

  data: T;
}

export interface BulkResponse<T> {
  created: T[];

  failed: any[];
}