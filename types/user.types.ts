export type AccountType =
  | "admin"
  | "management"
  | "team_head"
  | "user";

export interface UserProfile {
  profile_id?: string;
  user_id?: string;

  theme?: "light" | "dark";
  notificationsEnabled?: boolean;

  profilePicture_id?: string;
  backgroundImage_id?: string;

  dob?: string;
  phone_number?: string;

  createdAt?: string;
  updatedAt?: string;
}

export interface User {
  id: string;

  firstName: string;
  lastName: string;
  email: string;

  accountType: AccountType;

  role: string;
  roleID?: string;

  department: string;

  createdAt?: string;
  updatedAt?: string;

  profile?: UserProfile;
}

export interface CreateUserRequest {
  firstName: string;
  lastName: string;
  email: string;

  role: string;

  accountType: AccountType;

  department: string;
}

export interface UpdateUserRequest {
  id: string;

  firstName?: string;
  lastName?: string;
  email?: string;

  role?: string;
  roleID?: string;

  accountType?: AccountType;

  department?: string;

  theme?: "light" | "dark";
  notificationsEnabled?: boolean;

  profilePicture_id?: string;
  backgroundImage_id?: string;

  dob?: string;
  phone_number?: string;
}