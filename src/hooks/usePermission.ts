// hooks/usePermissions.ts
import { useAuth } from "@/features/auth/hooks/useAuth";
import { hasPermission, RolePermissions, UserRole } from "@/types/roles.types";


/**
 * Custom hook to check user permissions
 */
export function usePermissions() {
  const { role, isAuthenticated } = useAuth();

  /**
   * Check if the current user has a specific permission
   */
  const can = (
    permission: keyof typeof RolePermissions[UserRole.ADMIN]
  ): boolean => {
    if (!isAuthenticated) return false;
    return hasPermission(role, permission);
  };

  /**
   * Check if the current user is an admin
   */
  const isAdmin = (): boolean => {
    return role === UserRole.ADMIN;
  };

  /**
   * Check if the current user is a collector
   */
  const isCollector = (): boolean => {
    return role === UserRole.COLLECTOR;
  };

  /**
   * Check if the current user is a manager
   */
  const isManager = (): boolean => {
    return role === UserRole.MANAGER;
  };

  /**
   * Check if the current user is a supervisor
   */
  const isSupervisor = (): boolean => {
    return role === UserRole.SUPERVISOR;
  };

  /**
   * Check if the user can access the dashboard feature
   */
  const canAccessDashboard = (): boolean => {
    return can('canAccessDashboard');
  };

  /**
   * Check if the user can access the collector dashboard
   */
  const canAccessCollector = (): boolean => {
    return can('canAccessCollector');
  };

  /**
   * Check if the user can access the head location dashboard
   */
  const canAccessHeadLocation = (): boolean => {
    return can('canAccessHeadLocation');
  };

  return {
    can,
    isAdmin,
    isCollector,
    isManager,
    isSupervisor,
    canAccessDashboard,
    canAccessCollector,
    canAccessHeadLocation,
    role
  };
}