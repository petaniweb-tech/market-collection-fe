import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeft, Grid2X2, Check, X } from "lucide-react";
import { useState } from "react";
import RejectionSheet from "./RejectionSheet";
import BillIcon from "@/assets/icon/ic_bill.svg";

export default function DepositConfirmation({
  nominal = "Rp. 160.000",
  date = "16 Jan 2025",
  location = "Lowokwaru",
  supervisor = "John Doe",
  onConfirm,
  onReject,
}) {
  const [isRejectionSheetOpen, setIsRejectionSheetOpen] = useState(false);

  const handleReject = () => {
    setIsRejectionSheetOpen(true);
  };

  const handleRejectionSubmit = () => {
    onReject?.();
    setIsRejectionSheetOpen(false);
  };
  return (
    <div className="min-h-screen px-4 bg-gradient-to-b from-gradients-background-from to-gradients-background-to">
      <div className="flex items-center justify-between pt-5 pb-8">
        {/* Avatar */}
        <div className="flex items-center justify-center w-10 h-10 bg-white rounded-full">
          <span className="text-sm font-medium ">
            <ArrowLeft className="w-5 h-5 text-black" />
          </span>
        </div>
        {/* Role Badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg shadow-sm">
          <span className="text-sm font-medium">Konfirmasi Setoran</span>
        </div>
        {/* Settings Button */}
        <div className="flex items-center justify-center w-10 h-10 bg-white rounded-full">
          <Button variant="ghost" size="icon" className="text-gray-600">
            <Grid2X2 className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <ScrollArea className="h-[calc(100vh-8rem)]">
        <div className="flex flex-col items-center pt-8 pb-4">
          {/* Icon */}
          <div className="p-4 mb-6 bg-white rounded-2xl">
          <img src={BillIcon} alt="Profile" />
          </div>

          {/* Amount */}
          <div className="w-full p-4 bg-white rounded-2xl">
            <p className="mb-1 text-sm text-center text-gray-500">
              Nominal Setoran
            </p>
            <p className="text-2xl font-semibold text-center">{nominal}</p>
          </div>

          {/* Details */}
          <div className="w-full p-4 bg-white rounded-2xl">
            <div className="flex justify-between py-2 border-b">
              <p className="text-sm text-gray-500">Tanggal</p>
              <p className="text-sm">{date}</p>
            </div>
            <div className="flex justify-between py-2 border-b">
              <p className="text-sm text-gray-500">Kepala Lokasi</p>
              <p className="text-sm">{supervisor}</p>
            </div>
            <div className="flex justify-between py-2">
              <p className="text-sm text-gray-500">Lokasi</p>
              <p className="text-sm">{location}</p>
            </div>
          </div>
        </div>
      </ScrollArea>

      {/* Action Buttons */}
      <div className="fixed bottom-0 left-0 right-0 flex gap-4 p-4 mb-8">
        <Button
          variant="outline"
          className="w-1/2 py-6 text-red-500 hover:bg-red-50 rounded-xl"
          onClick={handleReject}
        >
         <X /> Tolak
        </Button>

        <Button
          className="w-1/2 py-6 bg-gradient-to-b from-[#FE8300] to-[#ED3400] text-white rounded-xl"
          onClick={onConfirm}
        >
          <Check /> Konfirmasi
        </Button>
      </div>

      <RejectionSheet
        open={isRejectionSheetOpen}
        onClose={() => setIsRejectionSheetOpen(false)}
        onSubmit={handleRejectionSubmit}
      />
    </div>
  );
}
