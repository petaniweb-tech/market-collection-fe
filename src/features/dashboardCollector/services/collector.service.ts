import { CollectorDeposit, CreateCollectorDepositDTO, UpdateCollectorDepositDTO } from "../types";
import { ApiResponse, PaginatedResponse } from "@/types/api.types";
import axiosInstance from "@/lib/axios";

// Endpoints for collector deposits API
const COLLECTOR_DEPOSIT_ENDPOINTS = {
  BASE: "/api/collector-deposits",
  DETAIL: (id: string) => `/api/collector-deposits/${id}`,
};

// Service for collector deposits management
export const collectorService = {
  // Get collector deposits with pagination, sorting and filtering
  getCollectorDeposits: async (params?: {
    page?: number;
    limit?: number;
    sort?: string;
    order?: "asc" | "desc";
    search?: string;
    status?: string;
  }): Promise<PaginatedResponse<CollectorDeposit>> => {
    const response = await axiosInstance.get<
      ApiResponse<PaginatedResponse<CollectorDeposit>>
    >(COLLECTOR_DEPOSIT_ENDPOINTS.BASE, { params });

    return response.data.data;
  },

  // Get a single collector deposit by ID
  getCollectorDepositById: async (id: string): Promise<CollectorDeposit> => {
    const response = await axiosInstance.get<ApiResponse<CollectorDeposit>>(
      COLLECTOR_DEPOSIT_ENDPOINTS.DETAIL(id)
    );
    return response.data.data;
  },

  // Create a new collector deposit
  createCollectorDeposit: async (data: CreateCollectorDepositDTO): Promise<CollectorDeposit> => {
    const response = await axiosInstance.post<ApiResponse<CollectorDeposit>>(
      COLLECTOR_DEPOSIT_ENDPOINTS.BASE,
      data
    );
    return response.data.data;
  },

  // Update an existing collector deposit
  updateCollectorDeposit: async (
    id: string,
    data: UpdateCollectorDepositDTO
  ): Promise<CollectorDeposit> => {
    const response = await axiosInstance.put<ApiResponse<CollectorDeposit>>(
      COLLECTOR_DEPOSIT_ENDPOINTS.DETAIL(id),
      data
    );
    return response.data.data;
  },

  // Delete a collector deposit
  deleteCollectorDeposit: async (id: string): Promise<boolean> => {
    const response = await axiosInstance.delete<
      ApiResponse<{ success: boolean }>
    >(COLLECTOR_DEPOSIT_ENDPOINTS.DETAIL(id));
    return response.data.success;
  },
};