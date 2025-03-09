import { Income } from "../types/income.types";
import { ApiResponse, PaginatedResponse } from "@/types/api.types";
import axiosInstance from "@/lib/axios";

// Define endpoint constants
const INCOME_ENDPOINTS = {
  ACHIEVEMENT: "/api/reports/achievement",
};

// Define the parameter types for the achievement endpoint
interface AchievementParams {
  viewType: "daily" | "weekly" | "monthly" | "yearly";
  date: string;
  sortBy?: string;
  search?: string;
  sortOrder?: "asc" | "desc";
  limit?: number;
  filter_column?: string[] | null;
  filter_value?: string[] | null;
}

// Create the income service
export const incomeService = {
  getAchievement: async (
    params?: AchievementParams
  ): Promise<PaginatedResponse<Income>> => {
    const response = await axiosInstance.get<
      ApiResponse<PaginatedResponse<Income>>
    >(INCOME_ENDPOINTS.ACHIEVEMENT, { params });

    return response.data.data;
  },
};
