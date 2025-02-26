import {
  useQueryWithConfig,
  useMutationWithConfig,
} from "../../../hooks/useQueryWithConfig";
import { storeService } from "../services/store.service";
import { queryClient } from "../../../lib/react-query";
import { CreateStoreDTO, UpdateStoreDTO } from "../types";
import { keepPreviousData } from "@tanstack/react-query";

export const QUERY_KEYS = {
  stores: ["stores"] as const,
  store: (id: string) => ["store", id] as const,
};

// Get stores with pagination and filters
export function useStores(params?: {
  page?: number;
  limit?: number;
  sort?: string;
  order?: "asc" | "desc";
  search?: string;
}) {
  const shouldFetch = !params?.search || params.search.length >= 3;
  return useQueryWithConfig(
    [...QUERY_KEYS.stores, JSON.stringify(params)],
    () => storeService.getStores(params),
    {
      refetchOnWindowFocus: false,
      staleTime: 60000, // 1 minute
      enabled: shouldFetch,
      placeholderData: keepPreviousData, // Keep previous data while new data is loading
    }
  );
}

// Get store by ID
export function useStore(id: string) {
  return useQueryWithConfig(
    [...QUERY_KEYS.store(id)], // Spread the readonly tuple into a new array
    () => storeService.getStoreById(id),
    {
      refetchOnWindowFocus: false,
      staleTime: 60000, // 1 minute
      enabled: !!id, // Only run query if ID is provided
    }
  );
}

// Create new store
export function useCreateStore() {
  return useMutationWithConfig(
    (data: CreateStoreDTO) => storeService.createStore(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.stores });
      },
    }
  );
}

// Update store
export function useUpdateStore() {
  return useMutationWithConfig(
    ({ id, data }: { id: string; data: UpdateStoreDTO }) =>
      storeService.updateStore(id, data),
    {
      onSuccess: (_, variables) => {
        // Invalidate both the list and the specific store
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.stores });
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.store(variables.id),
        });
      },
    }
  );
}

// Delete store
export function useDeleteStore() {
  return useMutationWithConfig((id: string) => storeService.deleteStore(id), {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.stores });
    },
  });
}
