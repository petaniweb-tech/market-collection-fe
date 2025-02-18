import {
  useQueryWithConfig,
  useMutationWithConfig,
} from "../../../hooks/useQueryWithConfig";
import { queryClient } from "../../../lib/react-query";
import { storeService } from "../services/storeService";

export const QUERY_KEYS = {
  stores: ["stores"] as const,
};

export function useStores() {
  return useQueryWithConfig([...QUERY_KEYS.stores], storeService.getStores, {
    refetchOnWindowFocus: false, // Optional: prevent refetch on window focus
    staleTime: 0, // Ensure data is always considered stale and will refetch
  });
}

export function useCreateStore() {
  return useMutationWithConfig(storeService.createStore, {
    onSuccess: () => {
      // Invalidate and refetch employees query after successful creation
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.stores });
    },
  });
}
