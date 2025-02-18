import { createRootRoute } from "@tanstack/react-router";
import { RootLayout } from "../components/layout/RootLayout";
import NotFound from "@/components/common/404/NotFound";

export const rootRoute = createRootRoute({
  component: RootLayout,
  notFoundComponent: NotFound,
});
