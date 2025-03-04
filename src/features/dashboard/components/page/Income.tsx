/* eslint-disable @typescript-eslint/no-unused-vars */

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

  const { data: incomeData, isLoading } = useAchievement({
    viewType,
    date: selectedDate,
    sortBy: "total_expected_amount",
    sortOrder,
    limit,
    page,
  });

  const income = incomeData?.records || [];
  const totalPages = incomeData?.totalPage || 1;

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleViewTypeChange = (value: ViewType) => {
    setViewType(value);
    setPage(1);
  };

  return (
    <div className="h-full min-h-screen px-16 py-14 bg-gradient-to-b from-gradients-background-from to-gradients-background-to">
      <div className="mb-10">
        <h1 className="text-2xl font-semibold">Laporan Pencapaian</h1>
        <p className="text-gray-500">Laporan pencapaian retribusi pedagang</p>
      </div>

      <div className="flex items-center justify-end mb-6">
        <div className="flex items-center space-x-2">
          <Select defaultValue="weekly" onValueChange={handleViewTypeChange}>
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
