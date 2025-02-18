import { dashboardCollectorRoutes } from "../features/dashboardCollector/routes/dashboardCollector.routes";
import {  createRouter } from "@tanstack/react-router";
import { rootRoute } from "./__root";
import { protectedRoute } from "./protected";
import { authRoutes } from "../features/auth/routes/auth.routes";
import { dashboardHeadLocationRoutes } from "@/features/dashboardHeadLocation/routes/dashboardHeadLocation.routes";
import { dashboardRoutes } from "@/features/dashboard/routes/dashboard.routes";


const routeTree = rootRoute.addChildren([
  protectedRoute,
  ...authRoutes,
  ...dashboardRoutes,
  ...dashboardCollectorRoutes,
  ...dashboardHeadLocationRoutes,
]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
