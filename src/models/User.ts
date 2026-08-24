export type UserRole = "ADMIN" | "STUDENT";

export interface User {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  role: UserRole;
  is_active: boolean;
  created_at: Date;
}

export interface SafeUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  is_active: boolean;
}

export interface AuthPayload {
  userId: string;
  email: string;
  role: UserRole;
}