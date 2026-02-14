export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  accountType: "admin" | "management" | "team_head" | "user";
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
  accountType: "admin" | "management" | "team_head" | "user";
  department: string;
}

export interface UpdateUserRequest extends Partial<CreateUserRequest> {
  id: string;
}