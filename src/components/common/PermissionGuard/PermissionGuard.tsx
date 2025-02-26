// components/common/PermissionGuard/PermissionGuard.tsx

import { usePermissions } from '@/hooks/usePermission';
import React from 'react';

// Type for permission keys
type Permission = 'canAccessDashboard' | 'canAccessCollector' | 'canAccessHeadLocation';

interface PermissionGuardProps {
  /**
   * Permission needed to render the children
   */
  permission?: Permission;
  
  /**
   * Roles that can access this component
   */
  roles?: string[];
  
  /**
   * Children to render if user has permission
   */
  children: React.ReactNode;
  
  /**
   * Component to render if user doesn't have permission
   */
  fallback?: React.ReactNode;
}

/**
 * Component that conditionally renders children based on user permissions
 */
export function PermissionGuard({
  permission,
  roles,
  children,
  fallback = null
}: PermissionGuardProps) {
  const { 
    can, 
    role 
  } = usePermissions();
  
  // If no permission or roles specified, always render
  if (!permission && !roles) {
    return <>{children}</>;
  }
  
  // Check if user has permission
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const hasPermission = permission ? can(permission as any) : true;
  
  // Check if user has required role
  const hasRequiredRole = roles ? roles.includes(role as string) : true;
  
  // Render children only if all conditions are met
  if (hasPermission && hasRequiredRole) {
    return <>{children}</>;
  }
  
  // Otherwise render fallback
  return <>{fallback}</>;
}

/**
 * Component that only renders its children for admin users
 */
export function AdminOnly({ children, fallback = null }: Omit<PermissionGuardProps, 'permission' | 'roles'>) {
  const { isAdmin } = usePermissions();
  return isAdmin() ? <>{children}</> : <>{fallback}</>;
}

/**
 * Component that only renders its children for collector users
 */
export function CollectorOnly({ children, fallback = null }: Omit<PermissionGuardProps, 'permission' | 'roles'>) {
  const { isCollector } = usePermissions();
  return isCollector() ? <>{children}</> : <>{fallback}</>;
}

/**
 * Component that only renders its children for manager users
 */
export function ManagerOnly({ children, fallback = null }: Omit<PermissionGuardProps, 'permission' | 'roles'>) {
  const { isManager } = usePermissions();
  return isManager() ? <>{children}</> : <>{fallback}</>;
}

/**
 * Component that only renders its children for supervisor users
 */
export function SupervisorOnly({ children, fallback = null }: Omit<PermissionGuardProps, 'permission' | 'roles'>) {
  const { isSupervisor } = usePermissions();
  return isSupervisor() ? <>{children}</> : <>{fallback}</>;
}

/**
 * Component that only renders its children for users who can access dashboard
 */
export function DashboardAccessOnly({ children, fallback = null }: Omit<PermissionGuardProps, 'permission' | 'roles'>) {
  const { canAccessDashboard } = usePermissions();
  return canAccessDashboard() ? <>{children}</> : <>{fallback}</>;
}

/**
 * Component that only renders its children for users who can access collector dashboard
 */
export function CollectorDashboardOnly({ children, fallback = null }: Omit<PermissionGuardProps, 'permission' | 'roles'>) {
  const { canAccessCollector } = usePermissions();
  return canAccessCollector() ? <>{children}</> : <>{fallback}</>;
}

/**
 * Component that only renders its children for users who can access head location dashboard
 */
export function HeadLocationDashboardOnly({ children, fallback = null }: Omit<PermissionGuardProps, 'permission' | 'roles'>) {
  const { canAccessHeadLocation } = usePermissions();
  return canAccessHeadLocation() ? <>{children}</> : <>{fallback}</>;
}

/**
 * Component that only renders its children for users who are admin or manager
 */
export function AdminOrManagerOnly({ children, fallback = null }: Omit<PermissionGuardProps, 'permission' | 'roles'>) {
  const { isAdmin, isManager } = usePermissions();
  return (isAdmin() || isManager()) ? <>{children}</> : <>{fallback}</>;
}