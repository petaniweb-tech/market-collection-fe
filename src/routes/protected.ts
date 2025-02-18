import { createRoute, useNavigate } from "@tanstack/react-router"; // Import from '@tanstack/router'
import { rootRoute } from "./__root";
import { useAuth } from "../features/auth/hooks/useAuth";

// Define the protected route
export const protectedRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "protected",
  component: ProtectedLayout,
});

// The ProtectedLayout component
function ProtectedLayout() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  // const isAuthenticated  = false;

  if (!isAuthenticated) {
    navigate({
      to: "/login",
    });
    return null;
  }

  // navigate({
  //   to: "/home",
  // });
}
