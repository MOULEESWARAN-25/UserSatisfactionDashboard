import { NextRequest } from "next/server";
import type { User } from "@/types/auth";

/**
 * Tenant Context Utilities for Multi-Tenant SaaS
 * 
 * Extracts collegeId from:
 * 1. Subdomain (production): mit.platform.com → "mit"
 * 2. Request headers (development/testing)
 * 3. User auth context (from session/JWT)
 * 4. Fallback to default college for single-tenant development
 */

export const DEFAULT_COLLEGE_ID = "college-default-001";

/**
 * Extract college ID from subdomain
 * Examples:
 *   mit.yourplatform.com → "mit"
 *   stanford.yourplatform.com → "stanford"
 *   localhost:3000 → null (returns default)
 */
export function getCollegeIdFromSubdomain(hostname: string): string | null {
  // Skip localhost and IP addresses
  if (hostname === "localhost" || /^\d+\.\d+\.\d+\.\d+$/.test(hostname)) {
    return null;
  }

  // Extract subdomain from hostname
  const parts = hostname.split(".");
  
  // If format is: subdomain.platform.com (3+ parts), take first part
  if (parts.length >= 3) {
    const subdomain = parts[0];
    // Don't treat www as a college
    if (subdomain !== "www" && subdomain !== "app") {
      return `college-${subdomain}`;
    }
  }

  return null;
}

/**
 * Extract college ID from request headers
 * Used for development/testing when subdomain routing isn't available
 */
export function getCollegeIdFromHeaders(req: NextRequest): string | null {
  // Check custom header (for API testing)
  const headerCollegeId = req.headers.get("x-college-id");
  if (headerCollegeId) {
    return headerCollegeId;
  }

  return null;
}

/**
 * Extract college ID from authenticated user
 * This would typically come from decoded JWT or session
 */
export function getCollegeIdFromUser(user: User | null): string | null {
  if (!user) return null;
  
  // Platform admins don't belong to a specific college
  if (user.role === "platform_admin") {
    return null;
  }

  return user.collegeId || null;
}

/**
 * Main function to get college ID from request
 * Priority order:
 * 1. Header (x-college-id) - for testing/development
 * 2. Subdomain extraction
 * 3. User context (from auth)
 * 4. Default college (single-tenant fallback)
 */
export function getTenantContext(req: NextRequest, user?: User | null): {
  collegeId: string;
  isSingleTenant: boolean;
  isPlatformAdmin: boolean;
} {
  // Check header first (useful for testing)
  const headerCollegeId = getCollegeIdFromHeaders(req);
  if (headerCollegeId) {
    return {
      collegeId: headerCollegeId,
      isSingleTenant: false,
      isPlatformAdmin: false,
    };
  }

  // Check if user is platform admin
  const isPlatformAdmin = user?.role === "platform_admin";
  
  // Extract from subdomain
  const hostname = req.headers.get("host") || "localhost";
  const subdomainCollegeId = getCollegeIdFromSubdomain(hostname);
  
  if (subdomainCollegeId) {
    return {
      collegeId: subdomainCollegeId,
      isSingleTenant: false,
      isPlatformAdmin,
    };
  }

  // Extract from user context
  const userCollegeId = getCollegeIdFromUser(user || null);
  if (userCollegeId) {
    return {
      collegeId: userCollegeId,
      isSingleTenant: false,
      isPlatformAdmin,
    };
  }

  // Fallback to default (single-tenant development)
  return {
    collegeId: DEFAULT_COLLEGE_ID,
    isSingleTenant: true,
    isPlatformAdmin,
  };
}

/**
 * Validate that user has access to the requested college
 * Prevents cross-tenant data access
 */
export function validateTenantAccess(
  user: User | null,
  requestedCollegeId: string
): { hasAccess: boolean; reason?: string } {
  // No user = no access
  if (!user) {
    return { hasAccess: false, reason: "Not authenticated" };
  }

  // Platform admins can access all colleges
  if (user.role === "platform_admin") {
    return { hasAccess: true };
  }

  // User must belong to the requested college
  if (user.collegeId !== requestedCollegeId) {
    return { 
      hasAccess: false, 
      reason: "Cannot access data from other institutions" 
    };
  }

  return { hasAccess: true };
}

/**
 * Build tenant-aware MongoDB query filter
 * Automatically adds collegeId to query
 */
export function buildTenantQuery<T extends Record<string, any>>(
  baseQuery: T,
  collegeId: string
): T & { collegeId: string } {
  return {
    ...baseQuery,
    collegeId,
  };
}

/**
 * For platform admins: optionally filter by specific college
 * Otherwise uses user's college
 */
export function getCollegeIdForQuery(
  req: NextRequest,
  user: User | null
): string | null {
  // Platform admins can optionally filter by college via query param
  if (user?.role === "platform_admin") {
    const { searchParams } = new URL(req.url);
    const filterCollegeId = searchParams.get("collegeId");
    if (filterCollegeId) {
      return filterCollegeId;
    }
    // No filter = return null (platform admin sees all)
    return null;
  }

  // Regular users get their own college
  const context = getTenantContext(req, user);
  return context.collegeId;
}
