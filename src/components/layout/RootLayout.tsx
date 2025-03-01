import { Outlet, useMatches } from "@tanstack/react-router";
import { Header } from "../common/Header/Header";
import { Toaster } from "@/components/ui/toaster"

export function RootLayout() {
  const matches = useMatches();
  const allowedRoutes = [
    "/dashboard",
    "/dashboard/pegawai",
    "/dashboard/lokasi",
    "/dashboard/lapak",
    "/dashboard/pendapatan",
    "/dashboard/setoran"
  ];
  const showHeader = matches.some((match) =>
    allowedRoutes.includes(match.pathname)
  );

  return (
    <div>
      {showHeader && <Header />}
      <main>
        <Outlet />
        <Toaster />
      </main>
    </div>
  );
}
