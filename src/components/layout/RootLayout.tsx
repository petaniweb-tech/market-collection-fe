import { Outlet, useMatches } from "@tanstack/react-router";
import { Header } from "../common/Header/Header";

export function RootLayout() {
  const matches = useMatches();
  const allowedRoutes = [
    "/dashboard",
    "/dashboard/employee",
    "/dashboard/location",
    "/dashboard/store",
  ];
  const showHeader = matches.some((match) =>
    allowedRoutes.includes(match.pathname)
  );

  return (
    <div>
      {showHeader && <Header />}
      <main>
        <Outlet />
      </main>
    </div>
  );
}
