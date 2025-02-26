import React, { useState } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAchievement } from "../../hooks/useIncome";
import IncomeTable from "../table/IncomeTable";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

type ViewType = "daily" | "weekly" | "monthly";

const Income = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [viewType, setViewType] = useState<ViewType>("weekly");
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );

  // Get income data with filters
  const { data: incomeData, isLoading } = useAchievement({
    viewType,
    date: selectedDate,
    sortBy: "total_expected_amount",
    sortOrder,
    // search: searchTerm || undefined,
    limit,
    page,
  });

  // Extract data from paginated response
  const income = incomeData?.records || [];
  const totalPages = incomeData?.totalPage || 1;

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setPage(1);
  };

  const handleSortChange = (value: string) => {
    setSortOrder(value === "tertinggi" ? "desc" : "asc");
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleViewTypeChange = (value: ViewType) => {
    setViewType(value);
    setPage(1);
  };

  // Format the date based on view type
  // const getDatePlaceholder = () => {
  //   switch (viewType) {
  //     case "daily":
  //       return "Pilih tanggal";
  //     case "weekly":
  //       return "Pilih minggu";
  //     case "monthly":
  //       return "Pilih bulan";
  //     default:
  //       return "Pilih tanggal";
  //   }
  // };

  return (
    <div className="h-full min-h-screen px-16 py-14 bg-gradient-to-b from-gradients-background-from to-gradients-background-to">
      <div className="mb-10">
        <h1 className="text-2xl font-semibold">Laporan Pencapaian</h1>
        <p className="text-gray-500">Laporan pencapaian retribusi pedagang</p>
      </div>

      <div className="flex items-center justify-end mb-6">
        {/* Left side view type selector
        <div className="flex overflow-hidden bg-gray-100 rounded-lg">
          <Button
            className={`px-4 py-2 text-normal font-medium shadow-none border-none transition-all duration-300 ease-in-out ${
              viewType === "daily"
                ? "bg-gradient-to-r from-[#FE7A00] to-[#ED3400] text-white"
                : "bg-transparent text-[#7D7D7D] hover:bg-white hover:bg-opacity-30"
            }`}
            onClick={() => handleViewTypeChange("daily")}
          >
            Harian
          </Button>

          <Button
            className={`px-4 py-2 text-normal font-medium shadow-none border-none transition-all duration-300 ease-in-out ${
              viewType === "weekly"
                ? "bg-gradient-to-r from-[#FE7A00] to-[#ED3400] text-white"
                : "bg-transparent text-[#7D7D7D] hover:bg-white hover:bg-opacity-30"
            }`}
            onClick={() => handleViewTypeChange("weekly")}
          >
            Mingguan
          </Button>

          <Button
            className={`px-4 py-2 text-normal font-medium shadow-none border-none transition-all duration-300 ease-in-out ${
              viewType === "monthly"
                ? "bg-gradient-to-r from-[#FE7A00] to-[#ED3400] text-white"
                : "bg-transparent text-[#7D7D7D] hover:bg-white hover:bg-opacity-30"
            }`}
            onClick={() => handleViewTypeChange("monthly")}
          >
            Bulanan
          </Button>
        </div> */}

        {/* Right side search and filter */}
        <div className="flex items-center space-x-2">
          {/* <Input
            type={viewType === "monthly" ? "month" : "date"}
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-white border-0 focus:ring-1 focus:ring-orange-400"
            placeholder={getDatePlaceholder()}
          /> */}

          {/* <div className="relative">
            <Input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Cari nama lokasi"
              className="w-64 py-2 pl-8 pr-4 bg-white rounded-md focus:outline-none focus:ring-1 focus:ring-orange-400"
            />
            <Search className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-2 top-1/2" />
          </div> */}

          <Select
            defaultValue="weekly"
            // onValueChange={handleSortChange}
            onValueChange={handleViewTypeChange}
          >
            <SelectTrigger className="bg-white border-0 min-w-32 focus:ring-1 focus:ring-orange-400">
              <SelectValue placeholder="Urutkan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <IncomeTable
        data={income}
        isLoading={isLoading}
        currentPage={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default Income;
