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
import CheckPercentage from "@/assets/icon/ic_check_percentage.svg";
import { useDashboard } from "../../hooks/useDashboard";

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
  const {data: dailyTarget} = useDashboard();

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
      {/* <div className="flex justify-between h-14"> */}
      {/* 
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
        </div> */}
      {/* </div> */}

      <div className="relative overflow-hidden bg-white shadow-sm bg-opacity-35 rounded-xl">
        <div className="px-8 py-10">
          <SegmentedProgress
            total={dailyTarget?.total_expected || 0}
            current={dailyTarget?.total_collected || 0}
            percentage={dailyTarget?.achievement_percentage || 0}
            segments={80} // Optional, defaults to 36 segments
          />
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
                      <img src={CheckPercentage} alt="percentage" />
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
          <div className="">
            <CardTitle>Peta Lokasi berdasarkan pendapatan</CardTitle>
            <div className="flex gap-4 mt-7">
              <div className="flex items-center px-4 py-2 bg-white shadow-sm rounded-xl">
                <div className="w-4 h-4 mr-3 bg-red-500 rounded-full"></div>
                <span className="text-sm font-medium">Rendah</span>
              </div>
              <div className="flex items-center px-4 py-2 bg-white shadow-sm rounded-xl">
                <div className="w-4 h-4 mr-3 bg-orange-500 rounded-full"></div>
                <span className="text-sm font-medium">Sedang</span>
              </div>
              <div className="flex items-center px-4 py-2 bg-white shadow-sm rounded-xl">
                <div className="w-4 h-4 mr-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm font-medium">Tinggi</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="">
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
              className="w-full h-[500px] rounded-lg"
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
