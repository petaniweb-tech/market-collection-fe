// types/role.types.ts
/**
 * User role definitions for the application matching API values
 */
export enum UserRole {
    ADMIN = "admin",
    MANAGER = "manager",
    SUPERVISOR = "supervisor",
    COLLECTOR = "collector",
  }
  
  /**
   * Role permission mapping - defines what each role can access
   */
  export const RolePermissions = {
    [UserRole.ADMIN]: {
      canAccessDashboard: true,
      canAccessCollector: false,
      canAccessHeadLocation: false,
    },
    [UserRole.COLLECTOR]: {
      canAccessDashboard: false,
      canAccessCollector: true,
      canAccessHeadLocation: false,
    },
    [UserRole.MANAGER]: {
      canAccessDashboard: false,
      canAccessCollector: false,
      canAccessHeadLocation: true,
    },
    [UserRole.SUPERVISOR]: {
      canAccessDashboard: false,
      canAccessCollector: false,
      canAccessHeadLocation: false,
    },
  };
  
  /**
   * Helper function to check if a user has a specific permission
   */
  export function hasPermission(
    userRole: UserRole | string | undefined,
    permission: keyof typeof RolePermissions[UserRole.ADMIN]
  ): boolean {
    if (!userRole) return false;
    
    // Get role permissions or default to no permissions
    const rolePermissions = RolePermissions[userRole as UserRole] || {};
    
    return !!rolePermissions[permission];
  }