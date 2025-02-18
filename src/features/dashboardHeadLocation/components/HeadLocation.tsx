// import { useNavigate } from '@tanstack/react-router';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import SuccessModal from "./SuccessModal";
import { useNavigate } from "@tanstack/react-router";
import { ArrowRight, Grid2X2, Store } from "lucide-react";
import ProfileIcon from "@/assets/icon/ic_profile_user.svg";
import DepositBankForm from "./DepositBankForm";

export default function HeadLocation() {
  const navigate = useNavigate();

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  //   const handleLogout = () => {
  //     // Clear authentication state (e.g., remove token from storage)
  //     // setIsLoggedIn(false); // Update your isLoggedIn state

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalSuccesOpen, setIsShowModalSuccess] = useState(false);

  //   const [selectedItem, setSelectedItem] = useState(null);

  //   const handleItemClick = (item) => {
  //     setSelectedItem(item);
  //     setIsModalOpen(true);
  //   };

  const handleSubmit = (formData) => {
    console.log("Form submitted:", formData);
    setIsModalOpen(false);
    setIsShowModalSuccess(true);
    // Handle the form submission here
  };

  const handleClose = () => {
    setIsShowModalSuccess(false);
    navigate({ to: "/deposit-confirmation" });
  };

  const setoran = [
    { title: "Lapak Blok A1", nominal: "Rp. 10.000" },
    { title: "Lapak Blok A1", nominal: "Rp. 10.000" },
    { title: "Lapak Blok A1", nominal: "Rp. 10.000" },
    { title: "Lapak Blok A1", nominal: "Rp. 10.000" },
    { title: "Lapak Blok A1", nominal: "Rp. 10.000" },
    { title: "Lapak Blok A1", nominal: "Rp. 10.000" },
    // { title: "Lapak Blok A1", nominal: "Rp. 10.000" },
    // { title: "Lapak Blok A1", nominal: "Rp. 10.000" },
    // { title: "Lapak Blok A1", nominal: "Rp. 10.000" },
    // { title: "Lapak Blok A1", nominal: "Rp. 10.000" },
    // { title: "Lapak Blok A1", nominal: "Rp. 10.000" },
  ];

  return (
    <div className="flex flex-col h-full min-h-screen bg-gradient-to-b from-gradients-background-from to-gradients-background-to">
      <div className="flex flex-col flex-1 p-4">
        {/* Header */}
        <div className="flex items-center justify-between pt-5 pb-8">
          {/* Avatar */}
          <div className="flex items-center justify-center w-10 h-10 text-white bg-orange-500 rounded-full">
            <span className="text-sm font-medium">
              {getInitials("Alim Ganteng")}
            </span>
          </div>
          {/* Role Badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg shadow-sm">
            {/* <div className="h-2 w-2 rounded-full bg-[#216DD9]" /> */}
            <img src={ProfileIcon} alt="Profile" />
            <span className="text-sm font-medium">Head Location</span>
          </div>
          {/* Settings Button */}
          <div className="flex items-center justify-center w-10 h-10 bg-white rounded-full">
            <Button variant="ghost" size="icon" className="text-gray-600">
              <Grid2X2 className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Date Card */}
        <Card className="mb-6 text-white bg-gray-900">
          <CardContent className="p-4">
            <div className="text-sm text-gray-400">15 Jan 2024</div>
            <div className="flex items-baseline gap-2 mt-2">Rp. 160.000</div>
            <div className="mt-1 text-xs text-gray-400">Target harian</div>
          </CardContent>
        </Card>

        <div className="flex flex-row gap-5 mb-7">
          <Button
            className="w-full bg-white hover:bg-orange-600"
            onClick={() => setIsModalOpen(true)}
          >
            <span className="text-orange-500">+</span>{" "}
            <span className="text-black">Laporan Setoran</span>
          </Button>
          <Button
            className="w-full bg-white hover:bg-orange-600"
            onClick={() => setIsModalOpen(true)}
          >
            <span className="text-orange-500">+</span>{" "}
            <span className="text-black">Setoran Bank</span>
          </Button>
        </div>

        {/* Setoran List */}
        <div className="p-4 bg-white bg-opacity-40 rounded-3xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium">Setoran hari ini</h2>
            <Button
              variant="ghost"
              className="relative px-4 py-2 text-sm text-orange-500 group hover:bg-transparent hover:text-orange-500"
            >
              <div className="absolute inset-0 rounded-full bg-[#F24D01] opacity-[0.02]" />
              <div className="absolute inset-0 border-2 border-[#F24D01] border-opacity-[0.14] rounded-full" />
              <span className="relative flex items-center">
                Lihat semua
                <ArrowRight className="w-4 h-4 ml-1" />
              </span>
            </Button>
          </div>

          <ScrollArea>
            <div className="space-y-2">
              {setoran.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-4 bg-white cursor-pointer rounded-xl hover:bg-gray-50"
                >
                  <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-lg">
                    <Store className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-medium">{item.title}</div>
                    <div className="text-sm text-gray-500">
                      Nominal Setoran:{" "}
                      <span className="text-orange-500">{item.nominal}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>

      <DepositBankForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
      />
      {isModalSuccesOpen && (
        <SuccessModal
          isOpen={setIsShowModalSuccess}
          onClose={handleClose}
          title="Bukti Setoran berhasil dibuat!"
          desc="Kamu telah berhasil membuat bukti setoran dari Bank untuk hari ini."
        />
      )}
    </div>
  );
}
