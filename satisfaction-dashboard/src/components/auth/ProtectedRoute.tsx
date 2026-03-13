"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import type { UserRole } from "@/types/auth";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
  redirectTo?: string;
}

export function ProtectedRoute({ 
  children, 
  allowedRoles, 
  redirectTo = "/login" 
}: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const allowedRolesKey = allowedRoles.join("|");
  const isRoleAllowed = user ? allowedRoles.includes(user.role) : false;

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      router.replace(redirectTo);
      return;
    }

    if (user && !isRoleAllowed) {
      // Redirect to appropriate page based on role
      if (user.role === "student") {
        router.replace("/feedback/submit");
      } else if (user.role === "college_admin") {
        router.replace("/dashboard");
      } else {
        router.replace(redirectTo);
      }
    }
  }, [isLoading, isAuthenticated, user, isRoleAllowed, allowedRolesKey, router, redirectTo]);

  // Show loading while bootstrapping auth state from storage
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // Redirect side-effect is already queued; avoid rendering a permanent spinner.
  if (!isAuthenticated || (user && !isRoleAllowed)) return null;

  return <>{children}</>;
}

// Convenience wrappers
const STUDENT_ROLES: UserRole[] = ["student"];
const ADMIN_ROLES: UserRole[] = ["college_admin"];

export function StudentOnly({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={STUDENT_ROLES}>
      {children}
    </ProtectedRoute>
  );
}

export function AdminOnly({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={ADMIN_ROLES}>
      {children}
    </ProtectedRoute>
  );
}
