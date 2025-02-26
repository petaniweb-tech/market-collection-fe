import { keepPreviousData } from "@tanstack/react-query";
import { useQueryWithConfig } from "./useQueryWithConfig";
import { districtService } from "@/services/district.service";

export const QUERY_KEYS = {
  districts: ["districts"] as const,
  district: (id: string) => ["district", id] as const,
};

// Get districts with pagination and filters
export function useDistricts(params?: {
  page?: number;
  limit?: number;
  sort?: string;
  order?: "asc" | "desc";
  search?: string;
}) {
  const shouldFetch = !params?.search || params.search.length >= 3;
  return useQueryWithConfig(
    [...QUERY_KEYS.districts, JSON.stringify(params)],
    () => districtService.getDistricts(params),
    {
      refetchOnWindowFocus: false,
      enabled: shouldFetch,
      staleTime: 60000, // 1 minute
      placeholderData: keepPreviousData, // Keep previous data while new data is loading
    }
  );
}
