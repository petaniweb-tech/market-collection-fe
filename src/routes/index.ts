// import { dashboardCollectorRoutes } from "../features/dashboardCollector/routes/dashboardCollector.routes";
// import {  createRouter } from "@tanstack/react-router";
// import { rootRoute } from "./__root";
// import { protectedRoute } from "./protected";
// import { authRoutes } from "../features/auth/routes/auth.routes";
// import { dashboardHeadLocationRoutes } from "@/features/dashboardHeadLocation/routes/dashboardHeadLocation.routes";
// import { dashboardRoutes } from "@/features/dashboard/routes/dashboard.routes";


// const routeTree = rootRoute.addChildren([
//   protectedRoute,
//   ...authRoutes,
//   ...dashboardRoutes,
//   ...dashboardCollectorRoutes,
//   ...dashboardHeadLocationRoutes,
// ]);

// export const router = createRouter({ routeTree });

// declare module "@tanstack/react-router" {
//   interface Register {
//     router: typeof router;
//   }
// }

// routes/index.ts
import { createRoute, createRouter } from "@tanstack/react-router";
import { rootRoute } from "./__root";
import { 
  dashboardProtectedRoute, 
  collectorProtectedRoute,
  headLocationProtectedRoute
} from "./protected";
import { authRoutes } from "../features/auth/routes/auth.routes";
import { dashboardCollectorRoutes } from "../features/dashboardCollector/routes/dashboardCollector.routes";
import { dashboardHeadLocationRoutes } from "@/features/dashboardHeadLocation/routes/dashboardHeadLocation.routes";
import { dashboardRoutes } from "@/features/dashboard/routes/dashboard.routes";
import Unauthorized from "@/components/common/unauthorize/Unauthorize";


// Define the unauthorized route
const unauthorizedRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/unauthorized",
  component: Unauthorized
});

// Add auth routes directly to root 
const routeTree = rootRoute.addChildren([
  // Public routes
  ...authRoutes,
  unauthorizedRoute,
  
  // Dashboard routes (Admin only)
  dashboardProtectedRoute.addChildren([
    ...dashboardRoutes,
  ]),
  
  // Collector routes
  collectorProtectedRoute.addChildren([
    ...dashboardCollectorRoutes,
  ]),
  
  // Manager routes
  headLocationProtectedRoute.addChildren([
    ...dashboardHeadLocationRoutes,
  ])
]);

export const router = createRouter({ routeTree });

// Type declaration for React Router
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}