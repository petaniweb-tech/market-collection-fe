// hooks/useManagerDeposit.ts
import {
  useQueryWithConfig,
  useMutationWithConfig,
} from "../../../hooks/useQueryWithConfig";
import { managerDepositService } from "../services/managerDeposit.service";
import { queryClient } from "../../../lib/react-query";
import { keepPreviousData } from "@tanstack/react-query";
import {
  CreateManagerDepositDTO,
  UpdateManagerDepositDTO,
} from "../types/managerDeposit.types";

export const QUERY_KEYS = {
  managerDeposits: ["managerDeposits"] as const,
  managerDeposit: (id: string) => ["managerDeposit", id] as const,
};

// Get manager deposits with pagination and filters
export function useManagerDeposits(params?: {
  page?: number;
  limit?: number;
  sort?: string;
  order?: "asc" | "desc";
  search?: string;
  filter_column?: string[] | null;
  filter_value?: string[] | null;
}) {
  const shouldFetch = !params?.search || params.search.length >= 3;
  return useQueryWithConfig(
    [...QUERY_KEYS.managerDeposits, JSON.stringify(params)],
    () => managerDepositService.getManagerDeposits(params),
    {
      refetchOnWindowFocus: false,
      enabled: shouldFetch,
      staleTime: 60000, // 1 minute
      placeholderData: keepPreviousData, // Keep previous data while new data is loading
    }
  );
}

// Get manager deposit by ID
export function useManagerDeposit(id: string) {
  return useQueryWithConfig(
    [...QUERY_KEYS.managerDeposit(id)],
    () => managerDepositService.getManagerDepositById(id),
    {
      refetchOnWindowFocus: false,
      staleTime: 60000, // 1 minute
      enabled: !!id, // Only run query if ID is provided
    }
  );
}

// Create new manager deposit
export function useCreateManagerDeposit() {
  return useMutationWithConfig(
    (data: CreateManagerDepositDTO) =>
      managerDepositService.createManagerDeposit(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.managerDeposits });
      },
    }
  );
}

// Update manager deposit
export function useUpdateManagerDeposit() {
  return useMutationWithConfig(
    ({ id, data }: { id: string; data: UpdateManagerDepositDTO }) =>
      managerDepositService.updateManagerDeposit(id, data),
    {
      onSuccess: (_, variables) => {
        // Invalidate both the list and the specific manager deposit
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.managerDeposits });
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.managerDeposit(variables.id),
        });
      },
    }
  );
}
