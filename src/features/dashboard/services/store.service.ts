import { ApiResponse, PaginatedResponse } from "@/types/api.types";
import axiosInstance from "@/lib/axios";
import { CreateStoreDTO, Store, UpdateStoreDTO } from "../types/store.types";

// Store API endpoints
const STORE_ENDPOINTS = {
  BASE: "/api/merchants",
  DETAIL: (id: string) => `/api/merchants/${id}`,
};

// Service for store management
export const storeService = {
  // Get stores with pagination, sorting and filtering
  getStores: async (params?: {
    page?: number;
    limit?: number;
    sort?: string;
    order?: "asc" | "desc";
    search?: string;
  }): Promise<PaginatedResponse<Store>> => {
    const response = await axiosInstance.get<
      ApiResponse<PaginatedResponse<Store>>
    >(STORE_ENDPOINTS.BASE, { params });

    return response.data.data;
  },

  // Get a single store by ID
  getStoreById: async (id: string): Promise<Store> => {
    const response = await axiosInstance.get<ApiResponse<Store>>(
      STORE_ENDPOINTS.DETAIL(id)
    );
    return response.data.data;
  },

  // Create a new store
  createStore: async (data: CreateStoreDTO): Promise<Store> => {
    const response = await axiosInstance.post<ApiResponse<Store>>(
      STORE_ENDPOINTS.BASE,
      data
    );
    return response.data.data;
  },

  // Update an existing store
  updateStore: async (
    id: string,
    data: UpdateStoreDTO
  ): Promise<Store> => {
    const response = await axiosInstance.put<ApiResponse<Store>>(
      STORE_ENDPOINTS.DETAIL(id),
      data
    );
    return response.data.data;
  },

  // Delete a store (soft delete)
  deleteStore: async (id: string): Promise<boolean> => {
    const response = await axiosInstance.delete<
      ApiResponse<{ success: boolean }>
    >(STORE_ENDPOINTS.DETAIL(id));
    return response.data.success;
  },
};