/* eslint-disable @typescript-eslint/no-explicit-any */
import { keepPreviousData } from "@tanstack/react-query";
import { useQueryWithConfig } from "../../../hooks/useQueryWithConfig";
import { dashboardService } from "../services/dashboard.service";

import { DailyTarget } from "../types/dailyTarget.types";
import { IncomeAccumulation } from "../types/incomeAccumulation.types";

export const QUERY_KEYS = {
  dailyTarget: ["dailyTarget"] as const,
  incomeAccumulation: ["incomeAccumulation"] as const,
};

// Get daily target data
export function useDashboard() {
  return useQueryWithConfig<DailyTarget>(
    [...QUERY_KEYS.dailyTarget],
    () => dashboardService.getDailyTarget(),
    {
      refetchOnWindowFocus: false,
      staleTime: 300000, // 5 minutes
    }
  );
}

export function useIncomeAccumulation(params?: {
  viewType?: "daily" | "weekly" | "monthly" | "yearly";
  date?: string;
}) {
  return useQueryWithConfig<IncomeAccumulation[]>(
    [...QUERY_KEYS.incomeAccumulation, JSON.stringify(params)],
    () => dashboardService.getIncomeAccumulation(params),
    {
      refetchOnWindowFocus: false,
      staleTime: 300000, // 5 minutes
      placeholderData: keepPreviousData,
    }
  );
}
