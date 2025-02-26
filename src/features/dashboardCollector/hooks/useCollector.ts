import {
    useQueryWithConfig,
    useMutationWithConfig,
  } from "../../../hooks/useQueryWithConfig";
  import { collectorService } from "../services/collector.service";
  import { queryClient } from "../../../lib/react-query";
  import { UpdateCollectorDepositDTO, CreateCollectorDepositDTO } from "../types";
  import { keepPreviousData } from "@tanstack/react-query";
  
  export const QUERY_KEYS = {
    collectorDeposits: ["collectorDeposits"] as const,
    collectorDeposit: (id: string) => ["collectorDeposit", id] as const,
  };
  
  // Get collector deposits with pagination and filters
  export function useCollectorDeposits(params?: {
    page?: number;
    limit?: number;
    sort?: string;
    order?: "asc" | "desc";
    search?: string;
    status?: string;
  }) {
    const shouldFetch = !params?.search || params.search.length >= 3;
    return useQueryWithConfig(
      [...QUERY_KEYS.collectorDeposits, JSON.stringify(params)],
      () => collectorService.getCollectorDeposits(params),
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
      [...QUERY_KEYS.collectorDeposit(id)], // Spread the readonly tuple into a new array
      () => collectorService.getCollectorDepositById(id),
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
      (data: CreateCollectorDepositDTO) => collectorService.createCollectorDeposit(data),
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: QUERY_KEYS.collectorDeposits });
        },
      }
    );
  }
  
  // Update collector deposit
  export function useUpdateCollectorDeposit() {
    return useMutationWithConfig(
      ({ id, data }: { id: string; data: UpdateCollectorDepositDTO }) =>
        collectorService.updateCollectorDeposit(id, data),
      {
        onSuccess: (_, variables) => {
          // Invalidate both the list and the specific collector deposit
          queryClient.invalidateQueries({ queryKey: QUERY_KEYS.collectorDeposits });
          queryClient.invalidateQueries({
            queryKey: QUERY_KEYS.collectorDeposit(variables.id),
          });
        },
      }
    );
  }
  
  // Delete collector deposit
  export function useDeleteCollectorDeposit() {
    return useMutationWithConfig(
      (id: string) => collectorService.deleteCollectorDeposit(id),
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: QUERY_KEYS.collectorDeposits });
        },
      }
    );
  }