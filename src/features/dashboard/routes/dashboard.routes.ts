import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "@/routes/__root";
import Employee from "../components/page/Employee";
import Location from "../components/page/Location";
import Store from "../components/page/Store";
import Dashboard from "../components/page/Dashboard";
import Income from "../components/page/Income";
import Deposit from "../components/page/Deposit";

// export const indexRoute = createRoute({
//   getParentRoute: () => rootRoute,
//   path: '/',
//   component: Dashboard,
// })

export const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard",
  component: Dashboard,
});

export const employeeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard/pegawai",
  component: Employee,
});

export const locationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard/lokasi",
  component: Location,
});

export const storeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard/lapak",
  component: Store,
});

export const incomeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard/pendapatan",
  component: Income,
});

export const depositRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard/setoran",
  component: Deposit,
});

export const dashboardRoutes = [
  dashboardRoute,
  employeeRoute,
  locationRoute,
  storeRoute,
  incomeRoute,
  depositRoute,
];
