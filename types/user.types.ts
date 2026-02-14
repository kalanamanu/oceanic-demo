// Add this to your existing types.ts

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  accountType: "admin" | "user" | "manager";
  role: string;
  department: string;
  createdAt?: string;
  updatedAt?: string;
  status?: "active" | "inactive";
}

export interface CreateUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  accountType: "admin" | "user" | "manager";
  department: string;
}

export interface UpdateUserRequest extends Partial<CreateUserRequest> {
  id: string;
}