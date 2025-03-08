/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQueryWithConfig } from "../../../hooks/useQueryWithConfig";
import { dashboardService } from "../services/dashboard.service";

import { DailyTarget } from "../types/dailyTarget.types";

export const QUERY_KEYS = {
  dailyTarget: ["dailyTarget"] as const,
//   topEarners: ["topEarners"] as const,
//   incomeStats: ["incomeStats"] as const,
//   locationData: ["locationData"] as const,
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
