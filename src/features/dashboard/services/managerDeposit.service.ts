// services/managerDeposit.service.ts
import { ApiResponse, PaginatedResponse } from "@/types/api.types";
import axiosInstance from "@/lib/axios";
import { CreateManagerDepositDTO, ManagerDeposit, UpdateManagerDepositDTO } from "../types/managerDeposit.types";

const MANAGER_DEPOSIT_ENDPOINTS = {
  BASE: "/api/manager-deposits",
  DETAIL: (id: string) => `/api/manager-deposits/${id}`,
};

export const managerDepositService = {
  // Get manager deposits with pagination, sorting and filtering
  getManagerDeposits: async (params?: {
    page?: number;
    limit?: number;
    sort?: string;
    order?: "asc" | "desc";
    search?: string;
    filter_column?: string[] | null;
    filter_value?: string[] | null;
  }): Promise<PaginatedResponse<ManagerDeposit>> => {
    const response = await axiosInstance.get<ApiResponse<PaginatedResponse<ManagerDeposit>>>(
      MANAGER_DEPOSIT_ENDPOINTS.BASE,
      { params }
    );

    return response.data.data;
  },

  // Get a single manager deposit by ID
  getManagerDepositById: async (id: string): Promise<ManagerDeposit> => {
    const response = await axiosInstance.get<ApiResponse<ManagerDeposit>>(
      MANAGER_DEPOSIT_ENDPOINTS.DETAIL(id)
    );
    return response.data.data;
  },

  // Create a new manager deposit
  createManagerDeposit: async (data: CreateManagerDepositDTO): Promise<ManagerDeposit> => {
    const response = await axiosInstance.post<ApiResponse<ManagerDeposit>>(
      MANAGER_DEPOSIT_ENDPOINTS.BASE,
      data
    );
    return response.data.data;
  },

  // Update an existing manager deposit
  updateManagerDeposit: async (
    id: string,
    data: UpdateManagerDepositDTO
  ): Promise<ManagerDeposit> => {
    const response = await axiosInstance.put<ApiResponse<ManagerDeposit>>(
      MANAGER_DEPOSIT_ENDPOINTS.DETAIL(id),
      data
    );
    return response.data.data;
  },
};