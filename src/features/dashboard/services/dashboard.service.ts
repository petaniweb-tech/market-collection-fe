import { ApiResponse } from "@/types/api.types";
import axiosInstance from "@/lib/axios";
import {} from "../types/employee.types";
import { DailyTarget } from "../types/dailyTarget.types";

const DASHBOARD_ENDPOINTS = {
  BASE: "/api/reports/daily-target",
};

export const dashboardService = {
  getDailyTarget: async (): Promise<DailyTarget> => {
    const response = await axiosInstance.get<ApiResponse<DailyTarget>>(
      DASHBOARD_ENDPOINTS.BASE
    );

    return response.data.data;
  },
};
