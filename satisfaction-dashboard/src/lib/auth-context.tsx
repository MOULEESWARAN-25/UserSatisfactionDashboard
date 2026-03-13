"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import type { User, UserRole, AuthState } from "@/types/auth";

const AuthContext = createContext<AuthState | null>(null);

const STORAGE_KEY = "satisfaction_dashboard_user";
const VALID_ROLES: UserRole[] = ["platform_admin", "college_admin", "department_manager", "viewer", "student"];

function normalizeStoredUser(raw: unknown): User | null {
  if (!raw || typeof raw !== "object") return null;

  const candidate = raw as Partial<User> & { role?: string };
  const normalizedRole = candidate.role === "admin" ? "college_admin" : candidate.role;

  if (!normalizedRole || !VALID_ROLES.includes(normalizedRole as UserRole)) return null;
  if (!candidate.id || !candidate.name) return null;

  return {
    ...candidate,
    role: normalizedRole as UserRole,
    id: String(candidate.id),
    name: String(candidate.name),
  } as User;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load user from localStorage on mount
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = normalizeStoredUser(JSON.parse(stored));
        if (parsed) {
          setUser(parsed);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
        } else {
          localStorage.removeItem(STORAGE_KEY);
        }
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setIsLoading(false);
    setMounted(true);
  }, []);

  const login = (id: string, name: string, role: UserRole) => {
    const newUser: User = { id, name, role };
    setUser(newUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  // Prevent hydration mismatch
  if (!mounted) {
    return null;
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: user !== null,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
