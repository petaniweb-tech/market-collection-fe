import { ApiResponse, PaginatedResponse } from "@/types/api.types";
import axiosInstance from "@/lib/axios";
import { CreateLocationDTO, Location } from "../types/location.types";

// Location API endpoints
const LOCATION_ENDPOINTS = {
  BASE: "/api/locations",
  DETAIL: (id: string) => `/api/locations/${id}`,
};

// Service for location management
export const locationService = {
  // Get locations with pagination, sorting and filtering
  getLocations: async (params?: {
    page?: number;
    limit?: number;
    sort?: string;
    order?: "asc" | "desc";
    search?: string;
    filter_column?: string[] | null;
    filter_value?: string[] | null;
  }): Promise<PaginatedResponse<Location>> => {
    const response = await axiosInstance.get<
      ApiResponse<PaginatedResponse<Location>>
    >(LOCATION_ENDPOINTS.BASE, { params });

    return response.data.data;
  },

  // Get a single location by ID
  getLocationById: async (id: string): Promise<Location> => {
    const response = await axiosInstance.get<ApiResponse<Location>>(
      LOCATION_ENDPOINTS.DETAIL(id)
    );
    return response.data.data;
  },

  // Create a new location
  createLocation: async (data: CreateLocationDTO): Promise<Location> => {
    const response = await axiosInstance.post<ApiResponse<Location>>(
      LOCATION_ENDPOINTS.BASE,
      data
    );
    return response.data.data;
  },

  // Update an existing location
  updateLocation: async (
    id: string,
    data: Partial<CreateLocationDTO>
  ): Promise<Location> => {
    const response = await axiosInstance.put<ApiResponse<Location>>(
      LOCATION_ENDPOINTS.DETAIL(id),
      data
    );
    return response.data.data;
  },

  deleteLocation: async (id: string): Promise<boolean> => {
    const response = await axiosInstance.delete<
      ApiResponse<{ success: boolean }>
    >(LOCATION_ENDPOINTS.DETAIL(id));
    return response.data.success;
  },
};
