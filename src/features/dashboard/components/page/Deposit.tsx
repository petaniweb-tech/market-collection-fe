// pages/Deposit.tsx
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Download, Filter, ChevronDown, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { Navigate } from "@tanstack/react-router";
import DepositTable from "../table/DepositTable";
import { usePermissions } from "@/hooks/usePermission";
import { useCollectorDeposits } from "../../hooks/useCollectorDeposit";
import { useManagerDeposits } from "../../hooks/useManagerDeposit";
import { useBankDeposits } from "../../hooks/useBankDeposit";
import { exportToExcel } from "@/utils/exportUtils";

type TabOption = "collector" | "manager" | "bank";

const Deposit = () => {
  const { isAuthenticated } = useAuth();
  const { isAdmin, isManager, isCollector, isSupervisor } = usePermissions();

  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [activeTab, setActiveTab] = useState<TabOption>("collector");
  const [isDownloading, setIsDownloading] = useState(false);

  const { toast } = useToast();

  // Fetch data based on active tab
  const collectorQuery = useCollectorDeposits({
    page,
    limit,
    sort: "created_at",
    order: sortOrder,
    search: searchTerm || undefined,
  });

  const managerQuery = useManagerDeposits({
    page,
    limit,
    sort: "created_at",
    order: sortOrder,
    search: searchTerm || undefined,
  });

  const bankQuery = useBankDeposits({
    page,
    limit,
    sort: "created_at",
    order: sortOrder,
    search: searchTerm || undefined,
  });

  // Get current active query data
  const getActiveQueryData = () => {
    switch (activeTab) {
      case "collector":
        return {
          data: collectorQuery.data?.records || [],
          totalPages: collectorQuery.data?.totalPage || 1,
          isLoading: collectorQuery.isLoading,
        };
      case "manager":
        return {
          data: managerQuery.data?.records || [],
          totalPages: managerQuery.data?.totalPage || 1,
          isLoading: managerQuery.isLoading,
        };
      case "bank":
        return {
          data: bankQuery.data?.records || [],
          totalPages: bankQuery.data?.totalPage || 1,
          isLoading: bankQuery.isLoading,
        };
    }
  };

  const { data, totalPages, isLoading } = getActiveQueryData();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setPage(1); // Reset to first page on new search
  };

  const handleTabChange = (value: TabOption) => {
    setActiveTab(value);
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  // Client-side export function
  const handleDownload = async () => {
    try {
      setIsDownloading(true);

      toast({
        title: "Mempersiapkan data",
        description: "Data setoran sedang disiapkan untuk diunduh",
      });

      // Get all data for the active tab
      let allData;

      // For client-side export, we need to decide:
      // 1. Use currently loaded data (fast but incomplete if multiple pages)
      // 2. Load all data first (complete but might be slower for large datasets)

      // Using approach #1 for simplicity - only export what's currently loaded
      // You can modify this to fetch all data if needed
      switch (activeTab) {
        case "collector":
          allData = collectorQuery.data?.records || [];
          break;
        case "manager":
          allData = managerQuery.data?.records || [];
          break;
        case "bank":
          allData = bankQuery.data?.records || [];
          break;
      }

      // Export data to Excel
      exportToExcel(allData, activeTab);

      toast({
        title: "Berhasil mengunduh data",
        description: "Data telah berhasil diunduh",
      });
    } catch (error) {
      console.error("Export error:", error);
      toast({
        title: "Gagal mengunduh data",
        description: "Terjadi kesalahan saat mengunduh data",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  // Get placeholder text based on active tab
  const getPlaceholderText = () => {
    switch (activeTab) {
      case "collector":
        return "Cari nama Lapak";
      case "manager":
        return "Cari nama Collector";
      case "bank":
        return "Cari nama Kepala Lokasi";
      default:
        return "Cari";
    }
  };

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // Get tab title based on active tab
  const getTabTitle = () => {
    switch (activeTab) {
      case "collector":
        return "Setoran Collector Lapak";
      case "manager":
        return "Setoran Kepala Lokasi";
      case "bank":
        return "Setoran ke Bank";
    }
  };

  return (
    <div className="h-full min-h-screen px-16 py-14 bg-gradient-to-b from-gradients-background-from to-gradients-background-to">
      <div>
        <h1 className="text-2xl font-semibold">Data Riwayat Setoran</h1>
        <p className="text-gray-500">
          Rekap data riwayat setoran retribusi harian
        </p>
      </div>

      <div className="pt-6 ">
        {/* Tab buttons */}
        <div className="flex mb-8">
          <div className="bg-gray-100 rounded-lg">
            <Button
              className={`px-4 py-2 text-normal font-medium shadow-none border-none transition-all duration-300 ease-in-out ${
                activeTab === "collector"
                  ? "bg-gradient-to-r from-[#FE7A00] to-[#ED3400] text-white"
                  : "bg-transparent text-[#7D7D7D] hover:bg-white hover:bg-opacity-30"
              }`}
              onClick={() => handleTabChange("collector")}
            >
              Setoran Collector Lapak
            </Button>

            <Button
              className={`px-4 py-2 text-normal font-medium shadow-none border-none transition-all duration-300 ease-in-out ${
                activeTab === "manager"
                  ? "bg-gradient-to-r from-[#FE7A00] to-[#ED3400] text-white"
                  : "bg-transparent text-[#7D7D7D] hover:bg-white hover:bg-opacity-30"
              }`}
              onClick={() => handleTabChange("manager")}
            >
              Setoran Kepala Lokasi
            </Button>

            <Button
              className={`px-4 py-2 text-normal font-medium shadow-none border-none transition-all duration-300 ease-in-out ${
                activeTab === "bank"
                  ? "bg-gradient-to-r from-[#FE7A00] to-[#ED3400] text-white"
                  : "bg-transparent text-[#7D7D7D] hover:bg-white hover:bg-opacity-30"
              }`}
              onClick={() => handleTabChange("bank")}
            >
              Setoran Collector Lapak
            </Button>
          </div>

          <div className="flex-grow"></div>

          <Button
            onClick={handleDownload}
            variant="outline"
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-md"
            disabled={isDownloading || isLoading || data.length === 0}
          >
            {isDownloading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            Download Data Setoran
          </Button>
        </div>

        {/* Search and filter row */}
        <div className="flex items-center justify-between py-6 mb-6 bg-white rounded-lg bg-opacity-40 i px-7">
          <h2 className="text-xl font-medium ">{getTabTitle()}</h2>

          <div className="flex items-center">
            <div className="relative pr-4">
              <Input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder={getPlaceholderText()}
                className="w-64 py-2 pl-8 pr-4 bg-white border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-300"
              />
              <Search className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-2 top-1/2" />
            </div>
            <Button
              variant="outline"
              className="flex items-center gap-2 mr-2 border-gray-200 rounded-md"
            >
              <Filter className="w-4 h-4" />
              Filter
            </Button>

            <div className="relative">
              <Button
                variant="outline"
                className="flex items-center gap-2 border-gray-200 rounded-md"
              >
                <span>Terbaru</span>
                <ChevronDown className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        <DepositTable
          depositType={activeTab}
          data={data}
          isLoading={isLoading}
          currentPage={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default Deposit;
