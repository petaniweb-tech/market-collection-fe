import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import CollectorForm from "./CollectorForm";
import { useState } from "react";
import SuccessModal from "./SuccessModal";
import { Navigate, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Grid2X2, Store } from "lucide-react";
import ProfileIcon from "@/assets/icon/ic_profile_user.svg";
import { useAuth } from "@/features/auth/hooks/useAuth";
import {
  useCollectorDeposits,
  useCreateCollectorDeposit,
} from "../hooks/useCollector";
// import { format } from "date-fns";
import DepositCard from "./card/DepositCard";
import { usePermissions } from "@/hooks/usePermission";
import Unauthorized from "@/components/common/unauthorize/Unauthorize";

export default function Collector() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { isCollector } = usePermissions();
  // const today = new Date();
  // const formattedDate = format(today, "dd MMM yyyy");

  // State for modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalSuccessOpen, setIsShowModalSuccess] = useState(false);

  // Fetch collector deposits for today
  const { data: collectorDepositsData, isLoading } = useCollectorDeposits({
    page: 1,
    limit: 5,
    // You can add additional filters here, like a date filter for today's deposits
  });

  // Create collector deposit mutation
  const { mutate: createDeposit } = useCreateCollectorDeposit();

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const handleSubmit = (formData) => {
    // Use the mutation to create a new deposit
    createDeposit(formData, {
      onSuccess: () => {
        setIsModalOpen(false);
        setIsShowModalSuccess(true);
      },
      onError: (error) => {
        console.error("Failed to create deposit:", error);
        // Handle error state
      },
    });
  };

  const handleClose = () => {
    setIsShowModalSuccess(false);
    navigate({ to: "/deposit-confirmation" });
  };

  // Get deposits from API data or use fallback
  const deposits = collectorDepositsData?.records || [];

  // Calculate progress
  // const collectedCount = deposits.length;
  // const totalTarget = 56; // This should come from your API if possible

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  // Show unauthorized page if user is not an admin
  if (!isCollector()) {
    return <Unauthorized />;
  }

  return (
    <div className="flex flex-col h-full min-h-screen bg-gradient-to-b from-gradients-background-from to-gradients-background-to">
      <div className="flex flex-col flex-1 p-4">
        {/* Header */}
        <div className="flex items-center justify-between pt-5 pb-8">
          {/* Avatar */}
          <div className="flex items-center justify-center w-10 h-10 text-white bg-orange-500 rounded-full">
            <span className="text-sm font-medium">
              {getInitials(user?.name || "")}
            </span>
          </div>
          {/* Role Badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg shadow-sm">
            <img src={ProfileIcon} alt="Profile" />
            <span className="text-sm font-medium">Collector Lapak</span>
          </div>
          {/* Settings Button */}
          <div className="flex items-center justify-center w-10 h-10 bg-white rounded-full">
            <Button variant="ghost" size="icon" className="text-gray-600">
              <Grid2X2 className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Date Card */}
        {/* <Card className="mb-6 text-white bg-gray-900">
          <CardContent className="p-4">
            <div className="text-sm text-gray-400">{formattedDate}</div>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-semibold">{collectedCount}</span>
              <span className="text-3xl text-gray-400">/{totalTarget}</span>
            </div>
            <div className="mt-1 text-xs text-gray-400">
              Dana telah terkumpul
            </div>
            <Button
              className="w-full mt-4 bg-orange-500 hover:bg-orange-600"
              onClick={() => setIsModalOpen(true)}
              disabled={isCreating}
            >
              {isCreating ? "Memproses..." : "+ Buat Setoran"}
            </Button>
          </CardContent>
        </Card> */}

        <DepositCard
          location="Lowokwaru"
          collectedCount={16}
          totalTarget={56}
        />

        <Button
          onClick={() => setIsModalOpen(true)}
          className="w-auto px-4 py-2 my-2 font-medium text-white rounded-md bg-gradient-to-b from-[#FE8300] to-[#ED3400]"
        >
          <span className="mr-2">+</span>
          Buat Setoran
        </Button>

        {/* Setoran List */}
        <div className="p-4 bg-white bg-opacity-40 rounded-3xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium">Setoran hari ini</h2>
            <Button
              variant="ghost"
              className="relative px-4 py-2 text-sm text-orange-500 group hover:bg-transparent hover:text-orange-500"
              // onClick={() => navigate({ to: "/deposits" })}
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
            {isLoading ? (
              <div className="py-4 text-center">Loading...</div>
            ) : deposits.length > 0 ? (
              <div className="space-y-2">
                {deposits.map((deposit, index) => (
                  <div
                    key={deposit.id || index}
                    className="flex items-center gap-3 p-4 border cursor-pointer rounded-xl hover:bg-gray-50"
                  >
                    <div className="flex items-center justify-center w-8 h-8 bg-white rounded-lg">
                      <Store className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-medium">{`Lapak ${deposit.merchant.name || ""}`}</div>
                      <div className="text-sm text-gray-500">
                        Nominal Setoran:{" "}
                        <span className="text-orange-500">
                          {typeof deposit.deposit_amount === "number"
                            ? `Rp. ${deposit.deposit_amount.toLocaleString("id-ID")}`
                            : deposit.deposit_amount || "Rp. -"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-4 text-center text-gray-500">
                Belum ada setoran hari ini
              </div>
            )}
          </ScrollArea>
        </div>
      </div>

      <CollectorForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
      />
      {isModalSuccessOpen && (
        <SuccessModal isOpen={isModalSuccessOpen} onClose={handleClose} />
      )}
    </div>
  );
}
