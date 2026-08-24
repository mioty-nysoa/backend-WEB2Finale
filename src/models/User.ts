export type UserRole = 'ADMIN' | 'STUDENT';

export interface User {
  id: number;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  is_active: boolean;
  created_at?: Date;
}