import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "@/routes/__root";
import Collector from "../components/Collector";
import DepositConfirmation from "../components/DepositConfirmation";
import LoginMobileForm from "@/features/auth/components/LoginMobileForm";
import ForgotPassword from "../components/ForgotPassword";
import ResetPasswordConfirmation from "../components/ResetPasswordConfirmation";
import ResetPassword from "../components/ResetPassword";

export const loginCollectorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/collector/login",
  component: LoginMobileForm,
});

export const forgotPasswordCollectorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/collector/forgot-password",
  component: ForgotPassword,
});

export const resetPasswordCollectorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/collector/reset-password",
  component: ResetPassword,
});

export const resetPasswordConfirmationCollectorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/collector/reset-password-confirmation",
  component: ResetPasswordConfirmation,
});

export const collectorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/collector",
  component: Collector,
});

export const depositConfirmationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/deposit-confirmation",
  component: DepositConfirmation,
});

export const dashboardCollectorRoutes = [
  loginCollectorRoute,
  collectorRoute,
  depositConfirmationRoute,
  forgotPasswordCollectorRoute,
  resetPasswordConfirmationCollectorRoute,
  resetPasswordCollectorRoute
];
