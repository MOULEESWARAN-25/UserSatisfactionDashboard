export type UserRole = "student" | "admin";

export interface User {
  id: string;
  name: string;
  role: UserRole;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (id: string, name: string, role: UserRole) => void;
  logout: () => void;
}
