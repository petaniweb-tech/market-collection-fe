// // import { createRoute, Navigate } from "@tanstack/react-router"; // Import from '@tanstack/router'
// // import { rootRoute } from "./__root";
// // import { useAuth } from "../features/auth/hooks/useAuth";
// // import { PropsWithChildren } from "react";

// // // Define the protected route
// // export const protectedRoute = createRoute({
// //   getParentRoute: () => rootRoute,
// //   id: "protected",
// //   component: ProtectedLayout,
// // });

// // // The ProtectedLayout component
// // // function ProtectedLayout({ children }: PropsWithChildren) {
// // //   // const navigate = useNavigate();
// // //   // const { isAuthenticated } = useAuth();

// // //   // if (!isAuthenticated) {
// // //   //   navigate({
// // //   //     to: "/login",
// // //   //   });
// // //   //   return null;
// // //   // }

// // //   const { isAuthenticated } = useAuth();

// // //   if (!isAuthenticated) {
// // //     return <Navigate to="/login" />;
// // //   }

// // //   return <>{children}</>;
// // // }


// import { Navigate } from "@tanstack/react-router";
// import { PropsWithChildren, useEffect } from "react";
// import { useAuth } from "../features/auth/hooks/useAuth";

// export function ProtectedLayout({ children }: PropsWithChildren) {
//   const { isAuthenticated, isLoading, user, token, expiresAt } = useAuth();

//   useEffect(() => {
//     console.group('Authentication Debug');
//     console.log('Is Authenticated:', isAuthenticated);
//     console.log('Is Loading:', isLoading);
//     console.log('User:', user);
//     console.log('Token:', token);
//     console.log('Expires At:', expiresAt);
//     console.log('Current Time:', Date.now());
//     console.groupEnd();
//   }, [isAuthenticated, isLoading, user, token, expiresAt]);

//   // Show loading state or null while checking authentication
//   if (isLoading) {
//     return <div>Loading...</div>; // Or a loading spinner
//   }

//   // Redirect to login if not authenticated
//   if (!isAuthenticated) {
//     return <Navigate to="/login" />;
//   }

//   return <>{children}</>;
// }

// routes/protected-route.tsx
import { Navigate } from "@tanstack/react-router";
import { PropsWithChildren, useEffect } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { UserRole } from "@/types/roles.types";

// Define the interface for the component props
interface ProtectedLayoutProps extends PropsWithChildren {
  requiredRoles?: UserRole[];
}

// Base protected layout component that handles auth logic
export function ProtectedLayoutBase({ 
  children, 
  requiredRoles = [] 
}: ProtectedLayoutProps) {
  const { 
    isAuthenticated, 
    isLoading, 
    user, 
    token, 
    expiresAt, 
    role, 
    refreshToken 
  } = useAuth();

  // Check if token is approaching expiration and refresh if needed
  useEffect(() => {
    if (isAuthenticated && expiresAt) {
      const timeToExpire = expiresAt - Date.now();
      // If token expires in less than 5 minutes, refresh it
      if (timeToExpire < 5 * 60 * 1000) {
        refreshToken();
      }
    }
  }, [isAuthenticated, expiresAt, refreshToken]);

  // Debugging information
  useEffect(() => {
    console.group('Authentication Debug');
    console.log('Is Authenticated:', isAuthenticated);
    console.log('Is Loading:', isLoading);
    console.log('User:', user);
    console.log('User Role:', role);
    console.log('Required Roles:', requiredRoles);
    console.log('Token Expires At:', expiresAt ? new Date(expiresAt).toLocaleString() : 'N/A');
    console.log('Current Time:', new Date().toLocaleString());
    console.groupEnd();
  }, [isAuthenticated, isLoading, user, role, expiresAt, requiredRoles]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#F5F5F5]">
        <div className="w-12 h-12 border-t-2 border-b-2 border-[#FE8300] rounded-full animate-spin"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated || !token) {
    return <Navigate to="/login" />;
  }

  // Check role-based access if requiredRoles is provided
  const hasRequiredRole = requiredRoles.length === 0 || 
    (role && requiredRoles.includes(role as UserRole));

  // Redirect to unauthorized page if user doesn't have required role
  if (!hasRequiredRole) {
    return <Navigate to="/unauthorized" />;
  }

  return <>{children}</>;
}

// Create specific layout components for each role
export function ProtectedLayout({ children }: PropsWithChildren) {
  return <ProtectedLayoutBase>{children}</ProtectedLayoutBase>;
}

export function AdminProtectedLayout({ children }: PropsWithChildren) {
  return (
    <ProtectedLayoutBase requiredRoles={[UserRole.ADMIN]}>
      {children}
    </ProtectedLayoutBase>
  );
}

export function CollectorProtectedLayout({ children }: PropsWithChildren) {
  return (
    <ProtectedLayoutBase requiredRoles={[UserRole.COLLECTOR]}>
      {children}
    </ProtectedLayoutBase>
  );
}

export function ManagerProtectedLayout({ children }: PropsWithChildren) {
  return (
    <ProtectedLayoutBase requiredRoles={[UserRole.MANAGER]}>
      {children}
    </ProtectedLayoutBase>
  );
}

export function SupervisorProtectedLayout({ children }: PropsWithChildren) {
  return (
    <ProtectedLayoutBase requiredRoles={[UserRole.SUPERVISOR]}>
      {children}
    </ProtectedLayoutBase>
  );
}