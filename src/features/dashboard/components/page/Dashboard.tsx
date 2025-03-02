/* eslint-disable @typescript-eslint/no-unused-vars */
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowRight, BarChart3, ArrowLeft, RotateCcw } from "lucide-react";
import { ProgressBar } from "@tremor/react";
import { useEffect, useState } from "react";
import SegmentedProgress from "../progress/SegmentedProgress";
import IncomeAreaChart from "../card/IncomeAreaChart";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { usePermissions } from "@/hooks/usePermission";
import { Navigate } from "@tanstack/react-router";
import Unauthorized from "@/components/common/unauthorize/Unauthorize";

// Function to detect if the device is mobile or tablet
// const isMobileDevice = () => {
//   return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
//     navigator.userAgent
//   );
// };

// Detect current orientation
// const isLandscape = () => {
//   // For mobile/tablet devices
//   if (window.orientation !== undefined) {
//     return window.orientation === 90 || window.orientation === -90;
//   }

//   // For desktop and browsers
//   return window.innerWidth > window.innerHeight;
// };

const Dashboard = () => {
  const [shouldRotate, setShouldRotate] = useState(false);
  const { isAuthenticated } = useAuth();
  const { isAdmin } = usePermissions();
  // const { isAuthenticated, user } = useAuth();
  // if (!isAuthenticated) {
  //   return <Navigate to="/" />;
  // }

  // if (user?.role !== 'admin') {
  //   return <Navigate to="/" />;
  // }

  // useEffect(() => {
  //   // Check if it's a mobile/tablet device and initial orientation is portrait
  //   const checkOrientation = () => {
  //     if (isMobileDevice() && !isLandscape()) {
  //       setShouldRotate(true);
  //     } else {
  //       setShouldRotate(false);
  //     }
  //   };

  //   // Initial check
  //   checkOrientation();

  //   // Listen for orientation and resize changes
  //   window.addEventListener("orientationchange", checkOrientation);
  //   window.addEventListener("resize", checkOrientation);

  //   // Cleanup listeners
  //   return () => {
  //     window.removeEventListener("orientationchange", checkOrientation);
  //     window.removeEventListener("resize", checkOrientation);
  //   };
  // }, []);

  // // If not in landscape mode on mobile/tablet, show rotation prompt
  // if (shouldRotate) {
  //   return (
  //     <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-90">
  //       <div className="p-8 text-center text-white">
  //         <RotateCcw
  //           className="w-24 h-24 mx-auto mb-6 text-white animate-spin-slow"
  //           strokeWidth={1.5}
  //         />
  //         <h2 className="mb-4 text-2xl font-bold">Rotate Your Device</h2>
  //         <p className="text-lg">
  //           Please rotate your device to landscape mode for the best experience.
  //         </p>
  //       </div>
  //     </div>
  //   );
  // }

  const locations = ["Klojen", "Dinoyo", "Lowokwaru", "Sukun", "Gadang"];

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  // Show unauthorized page if user is not an admin
  if (!isAdmin()) {
    return <Unauthorized />;
  }

  return (
    <div className="px-16 py-9 bg-gradient-to-b from-gradients-background-from to-gradients-background-to">
      <div className="mb-10">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-gray-500">
          Informasi Ringkas tentang pencapaian target harian
        </p>
      </div>
      <div className="flex justify-between h-14">
        <div className="relative w-full pt-3 pl-4 text-xl font-semibold bg-white bg-opacity-35 h-14 rounded-t-2xl rounded-out-br-2xl ">
          Target Harian
        </div>

        <div className="flex items-center gap-2 mx-10">
          <Button
            variant="default"
            size="icon"
            className="w-8 h-8 bg-white rounded-full"
          >
            <ArrowLeft className="w-4 h-4 text-black" />
          </Button>
          {locations.map((location) => (
            <Button
              key={location}
              variant={location === "Lowokwaru" ? "default" : "outline"}
              className={`rounded-full ${
                location === "Lowokwaru"
                  ? "bg-black text-white hover:bg-black/90"
                  : "hover:bg-gray-100"
              }`}
            >
              {location}
            </Button>
          ))}
          <Button
            variant="default"
            size="icon"
            className="w-8 h-8 bg-white rounded-full"
          >
            <ArrowRight className="w-4 h-4 text-black" />
          </Button>
        </div>

        <div className="relative flex items-center justify-between w-full gap-2 pt-3 pl-4 text-2xl font-semibold bg-white bg-opacity-35 pr-7 h-14 rounded-t-2xl rounded-out-bl-2xl">
          Pencapaian
          <Button
            variant="default"
            className="border-[#282828] border-opacity-15 border-2 bg-transparent text-black"
          >
            Lihat semua
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="relative overflow-hidden bg-white shadow-sm bg-opacity-35 rounded-tr-2xl rounded-b-2xl">
          <div className="px-6 pb-6 pt-7">
            <div className="flex justify-between">
              <div className="flex items-center gap-2 p-2 mb-10 bg-white rounded-lg">
                <div className="p-2 text-sm text-white bg-orange-500 rounded-lg">
                  <BarChart3 className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium bg-[#282828] bg-opacity-5 rounded-lg px-4 pt-[6px] pb-2">
                  Statistik Target Harian
                </span>
              </div>
              <Button
                variant="default"
                className="border-[#282828] border-opacity-15 border-2 bg-transparent text-black"
              >
                Lihat detail
              </Button>
            </div>

            {/* <h3 className="mb-4 text-5xl font-bold">Rp. 120.000.000</h3> */}
            {/* <div className="w-full h-2 bg-gray-100 rounded-full">
              <div className="w-[50%] h-full bg-gradient-to-r from-orange-500 to-orange-200 rounded-full" />
            </div>
            <div className="flex justify-between mt-2 text-sm text-gray-500">
              <span>10%</span>
              <span>50%</span>
              <span>100%</span>
            </div> */}

            <div className="space-y-2">
              {/* <ProgressBar
                value={50}
                color="orange"
                className="h-10"
                showAnimation={true}
                // segments={35}
              /> */}
              <SegmentedProgress
                total={120000000}
                current={80000000}
                segments={36} // Optional, defaults to 36 segments
              />
              {/* <div className="flex justify-between text-sm">
                <span className="text-gray-500">10%</span>
                <span className="text-orange-500">50%</span>
                <span className="text-gray-500">100%</span>
              </div> */}
            </div>
          </div>
        </div>

        {/* Right Column */}
        {/* Content */}
        <div className="px-8 py-8 bg-white rounded-tl-2xl rounded-b-2xl bg-opacity-35">
          <div className="overflow-hidden rounded-2xl ">
            {/* Header Row */}
            <div className="grid grid-cols-10 gap-4 p-4 mb-3 bg-white rounded-2xl">
              <div className="col-span-1 text-sm font-normal text-gray-500 bg-[#282828] bg-opacity-5 px-2 py-1 rounded-lg">
                No
              </div>
              <div className="col-span-2 text-sm font-normal text-gray-500 bg-[#282828] bg-opacity-5 px-2 py-1 rounded-lg">
                Lokasi
              </div>
              <div className="col-span-2 text-sm font-normal text-gray-500 bg-[#282828] bg-opacity-5 px-2 py-1 rounded-lg">
                Lapak
              </div>
              <div className="col-span-3 text-sm font-normal text-gray-500 bg-[#282828] bg-opacity-5 px-2 py-1 rounded-lg">
                Target
              </div>
              <div className="col-span-2 text-sm font-normal text-gray-500 bg-[#282828] bg-opacity-5 px-2 py-1 rounded-lg">
                Status
              </div>
            </div>

            {/* Table Rows */}
            {[1, 2, 3].map((index) => (
              <div
                key={index}
                className="grid items-center grid-cols-10 gap-4 p-4 mb-3 bg-white rounded-2xl"
              >
                <div className="flex items-center justify-center w-10 h-10 font-medium text-white bg-orange-500 rounded-xl">
                  {String(index).padStart(2, "0")}
                </div>
                <div className="flex items-center col-span-2 text-sm font-normal text-black bg-[#282828] bg-opacity-5 px-2 h-8 rounded-lg">
                  Klojen
                </div>
                <div className="flex items-center col-span-2 text-sm font-normal text-black bg-[#282828] bg-opacity-5 px-2 h-8 rounded-lg">
                  100 Lapak
                </div>
                <div className="flex items-center col-span-3 text-sm font-normal text-black bg-[#282828] bg-opacity-5 px-2 h-8 rounded-lg">
                  Rp. 1.000.000
                </div>
                <div className="flex items-center col-span-2 text-sm font-normal text-black bg-[#282828] bg-opacity-5 px-2 h-8 rounded-lg">
                  <div className="flex items-center gap-1 font-semibold text-orange-500">
                    <svg
                      viewBox="0 0 24 24"
                      className="w-4 h-4"
                      fill="currentColor"
                    >
                      <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8zm3.707-11.707L11 13.586V8a1 1 0 00-2 0v6c0 .266.105.52.293.707l5 5a.997.997 0 001.414 0 .999.999 0 000-1.414l-4.293-4.293 4.293-4.293a.999.999 0 10-1.414-1.414z" />
                    </svg>
                    100%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-2 gap-6 mt-6">
        {/* Top Earners */}
        <div className="">
          {/* Header */}
          <div className="flex items-center">
            <div className="relative flex items-center justify-between w-full h-16 pt-3 pl-8 text-xl font-semibold bg-white bg-opacity-35 rounded-t-2xl">
              Top Earners
              <span>
                <div className="mr-8">
                  <Select defaultValue="minggu">
                    <SelectTrigger className="bg-transparent border-2 shadow-sm w-28 rounded-xl hover:bg-gray-100">
                      <SelectValue placeholder="Period" />
                    </SelectTrigger>
                    <SelectContent className="bg-white rounded-lg shadow-md">
                      <SelectItem value="minggu" className="hover:bg-gray-50">
                        Minggu
                      </SelectItem>
                      <SelectItem value="bulan" className="hover:bg-gray-50">
                        Bulan
                      </SelectItem>
                      <SelectItem value="tahun" className="hover:bg-gray-50">
                        Tahun
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="px-8 py-8 bg-white rounded-br-2xl rounded-bl-2xl bg-opacity-35">
            <div className="overflow-hidden rounded-2xl ">
              {/* Header Row */}
              <div className="grid grid-cols-10 gap-4 p-4 mb-3 bg-white rounded-2xl">
                <div className="col-span-1 text-sm font-normal text-gray-500 bg-[#282828] bg-opacity-5 px-2 py-1 rounded-lg">
                  No
                </div>
                <div className="col-span-2 text-sm font-normal text-gray-500 bg-[#282828] bg-opacity-5 px-2 py-1 rounded-lg">
                  Lokasi
                </div>
                <div className="col-span-2 text-sm font-normal text-gray-500 bg-[#282828] bg-opacity-5 px-2 py-1 rounded-lg">
                  Lapak
                </div>
                <div className="col-span-3 text-sm font-normal text-gray-500 bg-[#282828] bg-opacity-5 px-2 py-1 rounded-lg">
                  Target
                </div>
                <div className="col-span-2 text-sm font-normal text-gray-500 bg-[#282828] bg-opacity-5 px-2 py-1 rounded-lg">
                  Status
                </div>
              </div>

              {/* Table Rows */}
              {[1, 2, 3, 4, 5].map((index) => (
                <div
                  key={index}
                  className="grid items-center grid-cols-10 gap-4 p-4 mb-3 bg-white rounded-2xl"
                >
                  <div className="flex items-center justify-center w-10 h-10 font-medium text-white bg-orange-500 rounded-xl">
                    {String(index).padStart(2, "0")}
                  </div>
                  <div className="flex items-center col-span-2 text-sm font-normal text-black bg-[#282828] bg-opacity-5 px-2 h-8 rounded-lg">
                    Klojen
                  </div>
                  <div className="flex items-center col-span-2 text-sm font-normal text-black bg-[#282828] bg-opacity-5 px-2 h-8 rounded-lg">
                    100 Lapak
                  </div>
                  <div className="flex items-center col-span-3 text-sm font-normal text-black bg-[#282828] bg-opacity-5 px-2 h-8 rounded-lg">
                    Rp. 1.000.000
                  </div>
                  <div className="flex items-center col-span-2 text-sm font-normal text-black bg-[#282828] bg-opacity-5 px-2 h-8 rounded-lg">
                    <div className="flex items-center gap-1 font-semibold text-orange-500">
                      <svg
                        viewBox="0 0 24 24"
                        className="w-4 h-4"
                        fill="currentColor"
                      >
                        <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8zm3.707-11.707L11 13.586V8a1 1 0 00-2 0v6c0 .266.105.52.293.707l5 5a.997.997 0 001.414 0 .999.999 0 000-1.414l-4.293-4.293 4.293-4.293a.999.999 0 10-1.414-1.414z" />
                      </svg>
                      100%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Income Chart */}
        <Card className="bg-white shadow-sm bg-opacity-35 rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-medium">
              Akumulasi Pendapatan
            </CardTitle>
            <div className="flex items-center gap-2">
              <Select defaultValue="minggu">
                <SelectTrigger className="w-28">
                  <SelectValue placeholder="Period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="minggu">Minggu</SelectItem>
                  <SelectItem value="bulan">Bulan</SelectItem>
                  <SelectItem value="tahun">Tahun</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <IncomeAreaChart />
          </CardContent>
        </Card>
      </div>

      {/* Map Section */}
      <Card className="mt-6 bg-white shadow-sm bg-opacity-35 rounded-2xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Peta Lokasi berdasarkan pendapatan</CardTitle>
            <div className="flex gap-4 p-2 bg-white rounded-lg shadow-sm ">
              <div className="flex items-center">
                <div className="w-3 h-3 mr-2 bg-red-500 rounded-full"></div>
                <span className="text-sm">Rendah</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 mr-2 bg-orange-500 rounded-full"></div>
                <span className="text-sm">Sedang</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 mr-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm">Tinggi</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative">
            {/* <div className="absolute flex gap-4 p-2 bg-white rounded-lg shadow-sm top-4 right-4">
              <div className="flex items-center">
                <div className="w-3 h-3 mr-2 bg-red-500 rounded-full"></div>
                <span className="text-sm">Rendah</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 mr-2 bg-orange-500 rounded-full"></div>
                <span className="text-sm">Sedang</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 mr-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm">Tinggi</span>
              </div>
            </div> */}
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15806.750339631503!2d112.61244184622461!3d-7.960429088671297!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd629a93c2bacdb%3A0x8debde0941497d31!2sTidar%2C%20Kec.%20Sukun%2C%20Kota%20Malang%2C%20Jawa%20Timur!5e0!3m2!1sid!2sid!4v1707814057351!5m2!1sid!2sid"
              className="w-full h-[400px] rounded-lg"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
