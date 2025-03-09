import { useQueryWithConfig } from "../../../hooks/useQueryWithConfig";
import { incomeService } from "../services/income.service";
import { keepPreviousData } from "@tanstack/react-query";

export const QUERY_KEYS = {
  achievement: ["achievement"] as const,
};

// Type for achievement parameters
interface AchievementParams {
  viewType: "daily" | "weekly" | "monthly" | "yearly";
  date: string;
  sortBy?: string;
  search?: string;
  sortOrder?: "asc" | "desc";
  limit?: number;
  page?: number;
  filter_column?: string[] | null;
  filter_value?: string[]  | null;
}

// Get achievement report with filters
export function useAchievement(params: AchievementParams) {
  return useQueryWithConfig(
    [...QUERY_KEYS.achievement, JSON.stringify(params)],
    () => incomeService.getAchievement(params),
    {
      refetchOnWindowFocus: false,
      staleTime: 60000, // 1 minute
      placeholderData: keepPreviousData,
      retry: 2, // Retry failed requests twice
    }
  );
}
