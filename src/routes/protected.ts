// import { createRoute } from "@tanstack/react-router";
// import { rootRoute } from "./__root";
// import { ProtectedLayout } from "./protected-route";

// // Define the protected route
// export const protectedRoute = createRoute({
//   getParentRoute: () => rootRoute,
//   id: "protected",
//   component: ProtectedLayout,
// });
// routes/protected.ts
import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "./__root";
import {
  AdminProtectedLayout,
  CollectorProtectedLayout,
  ManagerProtectedLayout,
  SupervisorProtectedLayout,
  ProtectedLayout,
} from "./protected-route";

// Base protected route for any authenticated user
export const protectedRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "protected",
  component: ProtectedLayout,
});

// Dashboard feature - Admin only
export const dashboardProtectedRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "dashboard-protected",
  component: AdminProtectedLayout,
});

// Dashboard Collector feature - Collector only
export const collectorProtectedRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "collector-protected",
  component: CollectorProtectedLayout,
});

// Dashboard Head Location feature - Manager only
export const headLocationProtectedRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "head-location-protected",
  component: ManagerProtectedLayout,
});

// Supervisor routes (if needed in the future)
export const supervisorProtectedRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "supervisor-protected",
  component: SupervisorProtectedLayout,
});
