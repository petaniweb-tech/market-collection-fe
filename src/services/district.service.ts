import axiosInstance from "@/lib/axios";
import { ApiResponse, PaginatedResponse } from "@/types/api.types";
import { District } from "@/types/common.types";

const DISTRICT_ENDPOINTS = {
  BASE: "/api/districts",
  DETAIL: (id: string) => `/api/districts/${id}`,
};

// District Service
export const districtService = {
  // Get districts with pagination, sorting and filtering
  getDistricts: async (params?: {
    page?: number;
    limit?: number;
    sort?: string;
    order?: "asc" | "desc";
    search?: string;
  }): Promise<PaginatedResponse<District>> => {
    const response = await axiosInstance.get<
      ApiResponse<PaginatedResponse<District>>
    >(DISTRICT_ENDPOINTS.BASE, { params });

    return response.data.data;
  },
};
