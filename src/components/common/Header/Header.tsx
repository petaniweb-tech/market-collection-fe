import { Link, useMatches } from "@tanstack/react-router";
import { LogOut } from "lucide-react";

export function Header() {
  const matches = useMatches();
  const currentPath = matches[matches.length - 1].pathname;

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const navItems = [
    { path: "/dashboard", label: "Dashboard" },
    { path: "/dashboard/location", label: "Lokasi" },
    { path: "/dashboard/store", label: "Lapak" },
    { path: "/dashboard/employee", label: "Pegawai" },
  ];

  return (
    <header className="flex items-center justify-between px-16 pt-9 bg-[#F5F5F5]">
      <div className="flex items-center gap-8">
        <Link to="/" className="text-xl font-bold text-orange-500">
          Sitemark
        </Link>
      </div>

      <nav className="flex gap-6">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`px-6 py-2 rounded-full transition-all duration-300 ${
              currentPath === item.path
                ? "bg-gradient-to-b from-[#FE8300] to-[#ED3400] text-white"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="flex items-center gap-4">
        {/* <button className="p-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5 text-gray-500"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clipRule="evenodd"
            />
          </svg>
        </button> */}

        <div className="flex items-center justify-center w-10 h-10 text-white bg-orange-500 rounded-full">
          <span className="text-sm font-medium">
            {getInitials("Alim Ganteng")}
          </span>
        </div>

        <button className="p-2 text-gray-500 hover:text-gray-700">
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}
