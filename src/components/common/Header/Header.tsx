// import { Link, useMatches } from "@tanstack/react-router";
// import { LogOut, Settings } from "lucide-react";
// import { useState, useRef, useEffect } from "react";
// import { useAuth } from "@/features/auth/hooks/useAuth";
// import { LogoutModal } from "../Modal/LogoutModal";
// import LogoIcon from "@/assets/icon/ic_union.svg";

// export function Header() {
//   const matches = useMatches();
//   const currentPath = matches[matches.length - 1].pathname;
//   const [showProfileMenu, setShowProfileMenu] = useState(false);
//   const [isLoggingOut, setIsLoggingOut] = useState(false);
//   const [showLogoutModal, setShowLogoutModal] = useState(false);
//   const profileMenuRef = useRef<HTMLDivElement>(null);
//   const { user, logout } = useAuth();

//   const userName = user?.name || "John Doe";
//   const userRole = user?.role || "Dinas Perdagangan Kota";

//   const getInitials = (name: string) => {
//     return name
//       .split(" ")
//       .map((n) => n[0])
//       .join("")
//       .toUpperCase();
//   };

//   const handleLogout = async () => {
//     if (isLoggingOut) return;

//     setIsLoggingOut(true);
//     try {
//       await logout();

//       // Force a hard redirect to the login page
//       window.location.href = "/login";
//     } catch (error) {
//       console.error("Logout failed:", error);
//       setIsLoggingOut(false);
//     }
//   };

//   // Close menu when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (
//         profileMenuRef.current &&
//         !profileMenuRef.current.contains(event.target as Node)
//       ) {
//         setShowProfileMenu(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [profileMenuRef]);

//   const navItems = [
//     { path: "/dashboard", label: "Dashboard" },
//     { path: "/dashboard/pendapatan", label: "Pendapatan" },
//     { path: "/dashboard/location", label: "Lokasi" },
//     { path: "/dashboard/store", label: "Lapak" },
//     { path: "/dashboard/employee", label: "Pegawai" },
//     { path: "/dashboard/employee", label: "Setoran" },
//   ];

//   return (
//     <>
//       <header className="flex items-center justify-between px-16 pt-9 bg-[#F5F5F5]">
//         <div className="flex items-center gap-8">
//           <Link to="/" className="flex items-center">
//             <img src={LogoIcon} alt="Logo" className="h-8" />
//             <span className="ml-3 text-xl font-bold">Disperindag</span>
//           </Link>
//         </div>

//         <nav className="flex gap-6">
//           {navItems.map((item) => (
//             <Link
//               key={item.path}
//               to={item.path}
//               className={`px-6 py-2 rounded-full transition-all duration-300 ${
//                 currentPath === item.path
//                   ? "bg-gradient-to-b from-[#FE8300] to-[#ED3400] text-white"
//                   : "text-gray-500 hover:text-gray-700"
//               }`}
//             >
//               {item.label}
//             </Link>
//           ))}
//         </nav>

//         <div className="flex items-center gap-4">
//           <div className="relative" ref={profileMenuRef}>
//             <div
//               className="flex items-center justify-center w-10 h-10 text-white bg-[#EE370114] bg-opacity-5 rounded-full cursor-pointer"
//               onClick={() => setShowProfileMenu(!showProfileMenu)}
//               aria-expanded={showProfileMenu}
//               aria-haspopup="true"
//             >
//               <span className="text-sm font-medium text-[#EE3701]">
//                 {getInitials(userName)}
//               </span>
//             </div>

//             {/* Profile dropdown menu */}
//             {showProfileMenu && (
//               <div className="absolute right-0 z-10 mt-2 origin-top-right bg-white rounded-lg shadow-lg w-72 ring-1 ring-black ring-opacity-5 focus:outline-none">
//                 <div className="px-6 py-4">
//                   {/* User info section */}
//                   <div className="flex items-center mb-6 space-x-4">
//                     <div className="flex-shrink-0">
//                       <div className="flex items-center justify-center bg-[#EE370114] bg-opacity-5 rounded-full w-14 h-14">
//                         <span className="text-xl font-medium text-[#EE3701]">
//                           {getInitials(userName)}
//                         </span>
//                       </div>
//                     </div>
//                     <div className="flex-1 min-w-0">
//                       <div className="flex items-center justify-between">
//                         <p className="text-lg font-medium text-gray-900 truncate">
//                           {userName}
//                         </p>
//                       </div>
//                       <p className="text-sm text-gray-500 truncate">
//                         {userRole}
//                       </p>
//                     </div>
//                   </div>

//                   {/* Menu items */}
//                   <div className="space-y-1">
//                     <button
//                       className="flex items-center w-full px-3 py-3 text-gray-700 rounded-lg hover:bg-gray-100"
//                       onClick={() => {
//                         setShowProfileMenu(false);
//                         // navigate({ to: "/settings" });
//                       }}
//                     >
//                       <Settings className="w-5 h-5 mr-3 text-gray-500" />
//                       <span>Pengaturan</span>
//                     </button>

//                     <button
//                       className="flex items-center w-full px-3 py-3 text-red-600 rounded-lg hover:bg-red-50 disabled:opacity-50"
//                       onClick={() => {
//                         setShowProfileMenu(false);
//                         setShowLogoutModal(true);
//                       }}
//                       disabled={isLoggingOut}
//                     >
//                       <LogOut className="w-5 h-5 mr-3 text-red-500" />
//                       <span>{isLoggingOut ? "Keluar..." : "Keluar"}</span>
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </header>

//       {/* Logout Confirmation Modal */}
//       <LogoutModal
//         open={showLogoutModal}
//         onOpenChange={setShowLogoutModal}
//         onConfirm={handleLogout}
//       />
//     </>
//   );
// }

import { Link, useMatches } from "@tanstack/react-router";
import { LogOut, Settings } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { LogoutModal } from "../Modal/LogoutModal";
import LogoIcon from "@/assets/icon/ic_union.svg";
import { usePermissions } from "@/hooks/usePermission";

export function Header() {
  const matches = useMatches();
  const currentPath = matches[matches.length - 1].pathname;
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const { user, logout } = useAuth();
  const { 
    isAdmin,
    // isCollector,
    // isManager,
    // isSupervisor
  } = usePermissions();

  const userName = user?.name || "John Doe";
  const userRole = user?.role || "Dinas Perdagangan Kota";

  // Define navigation items with role-based permissions
  const navItems = [
    // Dashboard navigation items - Admin only
    ...(isAdmin() ? [
      { path: "/dashboard", label: "Dashboard" },
      { path: "/dashboard/pendapatan", label: "Pendapatan" },
      { path: "/dashboard/location", label: "Lokasi" },
      { path: "/dashboard/store", label: "Lapak" },
      { path: "/dashboard/employee", label: "Pegawai" },
      { path: "/dashboard/setoran", label: "Setoran" },
    ] : []),
    
    // // Collector navigation items - Collector only
    // ...(isCollector() ? [
    //   { path: "/collector", label: "Dashboard Collector" },
    //   { path: "/dashboardCollector/collections", label: "Koleksi" },
    //   // Add more collector-specific navigation items here
    // ] : []),
    
    // // Manager navigation items - Manager only
    // ...(isManager() ? [
    //   { path: "/dashboardHeadLocation", label: "Dashboard Lokasi" },
    //   { path: "/dashboardHeadLocation/overview", label: "Overview" },
    //   // Add more manager-specific navigation items here
    // ] : []),

    // // Supervisor navigation items - Supervisor only
    // ...(isSupervisor() ? [
    //   // Add supervisor-specific navigation when needed
    // ] : []),
  ];

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const handleLogout = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);
    try {
      await logout();

      // Force a hard redirect to the login page
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout failed:", error);
      setIsLoggingOut(false);
    }
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [profileMenuRef]);

  // Get the translated role name for display
  const getDisplayRole = (role: string | undefined) => {
    switch(role) {
      case 'admin': return 'Administrator';
      case 'collector': return 'Kolektor';
      case 'manager': return 'Manajer';
      case 'supervisor': return 'Supervisor';
      default: return role || 'Dinas Perdagangan Kota';
    }
  };

  return (
    <>
      <header className="flex items-center justify-between px-16 pt-9 bg-[#F5F5F5]">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center">
            <img src={LogoIcon} alt="Logo" className="h-8" />
            <span className="ml-3 text-xl font-bold">Disperindag</span>
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
          <div className="relative" ref={profileMenuRef}>
            <div
              className="flex items-center justify-center w-10 h-10 text-white bg-[#EE370114] bg-opacity-5 rounded-full cursor-pointer"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              aria-expanded={showProfileMenu}
              aria-haspopup="true"
            >
              <span className="text-sm font-medium text-[#EE3701]">
                {getInitials(userName)}
              </span>
            </div>

            {/* Profile dropdown menu */}
            {showProfileMenu && (
              <div className="absolute right-0 z-10 mt-2 origin-top-right bg-white rounded-lg shadow-lg w-72 ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="px-6 py-4">
                  {/* User info section */}
                  <div className="flex items-center mb-6 space-x-4">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center bg-[#EE370114] bg-opacity-5 rounded-full w-14 h-14">
                        <span className="text-xl font-medium text-[#EE3701]">
                          {getInitials(userName)}
                        </span>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-lg font-medium text-gray-900 truncate">
                          {userName}
                        </p>
                      </div>
                      <p className="text-sm text-gray-500 truncate">
                        {getDisplayRole(userRole)}
                      </p>
                    </div>
                  </div>

                  {/* Menu items */}
                  <div className="space-y-1">
                    <button
                      className="flex items-center w-full px-3 py-3 text-gray-700 rounded-lg hover:bg-gray-100"
                      onClick={() => {
                        setShowProfileMenu(false);
                        // navigate({ to: "/settings" });
                      }}
                    >
                      <Settings className="w-5 h-5 mr-3 text-gray-500" />
                      <span>Pengaturan</span>
                    </button>

                    <button
                      className="flex items-center w-full px-3 py-3 text-red-600 rounded-lg hover:bg-red-50 disabled:opacity-50"
                      onClick={() => {
                        setShowProfileMenu(false);
                        setShowLogoutModal(true);
                      }}
                      disabled={isLoggingOut}
                    >
                      <LogOut className="w-5 h-5 mr-3 text-red-500" />
                      <span>{isLoggingOut ? "Keluar..." : "Keluar"}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Logout Confirmation Modal */}
      <LogoutModal
        open={showLogoutModal}
        onOpenChange={setShowLogoutModal}
        onConfirm={handleLogout}
      />
    </>
  );
}