import { ApiResponse } from "@/types/api.types";
import axiosInstance from "@/lib/axios";
import {} from "../types/employee.types";
import { DailyTarget } from "../types/dailyTarget.types";
import { IncomeAccumulation } from "../types/incomeAccumulation.types";

const DASHBOARD_ENDPOINTS = {
  BASE: "/api/reports/daily-target",
  INCOME_ACCUMULATION: "/api/reports/income-accumulation",
};

export const dashboardService = {
  getDailyTarget: async (): Promise<DailyTarget> => {
    const response = await axiosInstance.get<ApiResponse<DailyTarget>>(
      DASHBOARD_ENDPOINTS.BASE
    );

    return response.data.data;
  },

  getIncomeAccumulation: async (params?: {
    viewType?: "daily" | "weekly" | "monthly" | "yearly";
    date?: string;
  }): Promise<IncomeAccumulation[]> => {
    const response = await axiosInstance.get<ApiResponse<IncomeAccumulation[]>>(
      DASHBOARD_ENDPOINTS.INCOME_ACCUMULATION,
      { params }
    );

    return response.data.data;
  },
};
