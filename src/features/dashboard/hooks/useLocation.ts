import {
  useQueryWithConfig,
  useMutationWithConfig,
} from "../../../hooks/useQueryWithConfig";
import { locationService } from "../services/location.service";
import { queryClient } from "../../../lib/react-query";
import { keepPreviousData } from "@tanstack/react-query";
import { CreateLocationDTO } from "../types/location.types";

export const QUERY_KEYS = {
  locations: ["locations"] as const,
  location: (id: string) => ["location", id] as const,
};

// Get locations with pagination and filters
export function useLocations(params?: {
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
    [...QUERY_KEYS.locations, JSON.stringify(params)],
    () => locationService.getLocations(params),
    {
      refetchOnWindowFocus: false,
      staleTime: 60000, // 1 minute
      enabled: shouldFetch,
      placeholderData: keepPreviousData, // Keep previous data while new data is loading
    }
  );
}

// Get location by ID
export function useLocation(id: string) {
  return useQueryWithConfig(
    [...QUERY_KEYS.location(id)], // Spread the readonly tuple into a new array
    () => locationService.getLocationById(id),
    {
      refetchOnWindowFocus: false,
      staleTime: 60000, // 1 minute
      enabled: !!id, // Only run query if ID is provided
    }
  );
}

// Create new location
export function useCreateLocation() {
  return useMutationWithConfig(
    (data: CreateLocationDTO) => locationService.createLocation(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.locations });
      },
    }
  );
}

// Update location
export function useUpdateLocation() {
  return useMutationWithConfig(
    ({ id, data }: { id: string; data: Partial<CreateLocationDTO> }) =>
      locationService.updateLocation(id, data),
    {
      onSuccess: (_, variables) => {
        // Invalidate both the list and the specific location
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.locations });
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.location(variables.id),
        });
      },
    }
  );
}

// Delete location
export function useDeleteLocation() {
  return useMutationWithConfig(
    (id: string) => locationService.deleteLocation(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.locations });
      },
    }
  );
}
