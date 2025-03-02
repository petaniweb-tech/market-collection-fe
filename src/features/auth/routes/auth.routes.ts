import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "@/routes/__root";
import LoginForm from "../components/LoginForm";
import Verify from "../components/Verify";
import ForgotPassword from "../components/ForgotPassword";
import ResetPassword from "../components/ResetPassword";
import ResetPasswordConfirmation from "../components/ResetPasswordConfirmation";

export const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: LoginForm,
});
export const verifyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/auth/verifikasi",
  component: Verify,
});

export const forgotPasswordRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/lupa-password",
  component: ForgotPassword,
});

export const resetPasswordRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/reset-password",
  component: ResetPassword,
});

export const resetPasswordConfirmationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/reset-password-confirmation",
  component: ResetPasswordConfirmation,
});

export const authRoutes = [
  loginRoute,
  verifyRoute,
  forgotPasswordRoute,
  resetPasswordRoute,
  resetPasswordConfirmationRoute,
];
