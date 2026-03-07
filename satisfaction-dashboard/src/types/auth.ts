// SaaS Multi-Tenant Role System
export type UserRole = "platform_admin" | "college_admin" | "department_manager" | "viewer" | "student";

// Legacy role type for backwards compatibility
export type LegacyRole = "student" | "admin";

export interface User {
  id: string;
  name: string;
  email?: string;
  role: UserRole;
  
  // Multi-tenant support
  collegeId?: string; // null for platform_admin
  collegeName?: string;
  
  // Department association (for department_manager role)
  departmentId?: string;
  departmentName?: string;
  
  // Permissions
  permissions?: {
    canViewDashboard: boolean;
    canViewAnalytics: boolean;
    canManageIssues: boolean;
    canConfigureServices: boolean;
    canManageUsers: boolean;
    canViewReports: boolean;
    canExportData: boolean;
    canAccessAI: boolean;
    canManageNotifications: boolean;
  };
  
  // Profile
  avatar?: string;
  phone?: string;
  
  // Metadata
  createdAt?: string;
  lastLogin?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (id: string, name: string, role: UserRole, collegeId?: string) => void;
  logout: () => void;
}

// Helper function types for role checking
export type RoleChecker = (user: User | null) => boolean;

// Role hierarchy helpers
export const RoleHierarchy: Record<UserRole, number> = {
  platform_admin: 100,
  college_admin: 75,
  department_manager: 50,
  viewer: 25,
  student: 10,
};

// Permission presets by role
export const DefaultPermissions: Record<UserRole, User["permissions"]> = {
  platform_admin: {
    canViewDashboard: true,
    canViewAnalytics: true,
    canManageIssues: true,
    canConfigureServices: true,
    canManageUsers: true,
    canViewReports: true,
    canExportData: true,
    canAccessAI: true,
    canManageNotifications: true,
  },
  college_admin: {
    canViewDashboard: true,
    canViewAnalytics: true,
    canManageIssues: true,
    canConfigureServices: true,
    canManageUsers: true,
    canViewReports: true,
    canExportData: true,
    canAccessAI: true,
    canManageNotifications: true,
  },
  department_manager: {
    canViewDashboard: true,
    canViewAnalytics: true,
    canManageIssues: true,
    canConfigureServices: false,
    canManageUsers: false,
    canViewReports: true,
    canExportData: false,
    canAccessAI: true,
    canManageNotifications: false,
  },
  viewer: {
    canViewDashboard: true,
    canViewAnalytics: true,
    canManageIssues: false,
    canConfigureServices: false,
    canManageUsers: false,
    canViewReports: true,
    canExportData: false,
    canAccessAI: false,
    canManageNotifications: false,
  },
  student: {
    canViewDashboard: false,
    canViewAnalytics: false,
    canManageIssues: false,
    canConfigureServices: false,
    canManageUsers: false,
    canViewReports: false,
    canExportData: false,
    canAccessAI: false,
    canManageNotifications: false,
  },
};
