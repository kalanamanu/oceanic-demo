type AccountType = "admin" | "user" | "manager";

interface Permission {
  module: string;
  action: "view" | "create" | "edit" | "delete";
  allowedRoles: AccountType[];
}

// Define permissions for each module
const PERMISSIONS: Permission[] = [
  // User Management - Admin only
  { module: "users", action: "view", allowedRoles: ["admin"] },
  { module: "users", action: "create", allowedRoles: ["admin"] },
  { module: "users", action: "edit", allowedRoles: ["admin"] },
  { module: "users", action: "delete", allowedRoles: ["admin"] },

  // Inquiry Management - Admin and Manager
//   { module: "inquiry", action: "view", allowedRoles: ["admin", "manager", "user"] },
//   { module: "inquiry", action: "create", allowedRoles: ["admin", "manager"] },
//   { module: "inquiry", action: "edit", allowedRoles: ["admin", "manager"] },
//   { module: "inquiry", action: "delete", allowedRoles: ["admin"] },

  // Add more modules as needed...
];

export function hasPermission(
  accountType: AccountType,
  module: string,
  action: "view" | "create" | "edit" | "delete" = "view"
): boolean {
  const permission = PERMISSIONS.find(
    (p) => p.module === module && p.action === action
  );

  if (!permission) {
    return false; // No permission defined = deny by default
  }

  return permission.allowedRoles.includes(accountType);
}

export function canAccessModule(accountType: AccountType, module: string): boolean {
  return hasPermission(accountType, module, "view");
}