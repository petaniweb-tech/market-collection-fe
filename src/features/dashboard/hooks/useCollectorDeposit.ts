/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  useQueryWithConfig,
  useMutationWithConfig,
} from "../../../hooks/useQueryWithConfig";
import { queryClient } from "../../../lib/react-query";
import { keepPreviousData } from "@tanstack/react-query";
import {
  collectorDepositService,
} from "../services/collectorDeposit.service";
import {
  CreateCollectorDepositDTO,
  UpdateCollectorDepositDTO,
} from "../types/collectorDeposit.types";

export const QUERY_KEYS = {
  collectorDeposits: ["collectorDeposits"] as const,
  collectorDeposit: (id: string) => ["collectorDeposit", id] as const,
  historicalTransactions: (id: string, date?: string) =>
    date
      ? (["collector-deposits", "historical", id, date] as const)
      : (["collector-deposits", "historical", id] as const),
};

// Get collector deposits with pagination and filters
export function useCollectorDeposits(params?: {
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
    [...QUERY_KEYS.collectorDeposits, JSON.stringify(params)],
    () => collectorDepositService.getCollectorDeposits(params),
    {
      refetchOnWindowFocus: false,
      enabled: shouldFetch,
      staleTime: 60000, // 1 minute
      placeholderData: keepPreviousData, // Keep previous data while new data is loading
    }
  );
}

// Get collector deposit by ID
export function useCollectorDeposit(id: string) {
  return useQueryWithConfig(
    [...QUERY_KEYS.collectorDeposit(id)],
    () => collectorDepositService.getCollectorDepositById(id),
    {
      refetchOnWindowFocus: false,
      staleTime: 60000, // 1 minute
      enabled: !!id, // Only run query if ID is provided
    }
  );
}

// Create new collector deposit
export function useCreateCollectorDeposit() {
  return useMutationWithConfig(
    (data: CreateCollectorDepositDTO) =>
      collectorDepositService.createCollectorDeposit(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.collectorDeposits,
        });
      },
    }
  );
}

// Update collector deposit
export function useUpdateCollectorDeposit() {
  return useMutationWithConfig(
    ({ id, data }: { id: string; data: UpdateCollectorDepositDTO }) =>
      collectorDepositService.updateCollectorDeposit(id, data),
    {
      onSuccess: (_, variables) => {
        // Invalidate both the list and the specific collector deposit
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.collectorDeposits,
        });
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.collectorDeposit(variables.id),
        });
      },
    }
  );
}

// Get historical transactions for a collector deposit
export function useHistoricalTransactions(id: string, date?: string) {
  return useQueryWithConfig(
    [...QUERY_KEYS.historicalTransactions(id, date)], // Spread the readonly tuple into a new array
    () => collectorDepositService.getHistoricalTransactions(id, { date }),
    {
      refetchOnWindowFocus: false,
      staleTime: 60000, // 1 minute
      enabled: !!id, // Only run query if ID is provided
    }
  );
}
