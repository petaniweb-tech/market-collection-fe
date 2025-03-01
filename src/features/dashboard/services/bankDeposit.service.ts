// services/bankDeposit.service.ts
import { ApiResponse, PaginatedResponse } from "@/types/api.types";
import axiosInstance from "@/lib/axios";
import { BankDeposit, CreateBankDepositDTO, UpdateBankDepositDTO } from "../types/bankDeposit.types";

const BANK_DEPOSIT_ENDPOINTS = {
  BASE: "/api/bank-deposits",
  DETAIL: (id: string) => `/api/bank-deposits/${id}`,
};

export const bankDepositService = {
  // Get bank deposits with pagination, sorting and filtering
  getBankDeposits: async (params?: {
    page?: number;
    limit?: number;
    sort?: string;
    order?: "asc" | "desc";
    search?: string;
    filter_column?: string[] | null;
    filter_value?: string[] | null;
  }): Promise<PaginatedResponse<BankDeposit>> => {
    const response = await axiosInstance.get<ApiResponse<PaginatedResponse<BankDeposit>>>(
      BANK_DEPOSIT_ENDPOINTS.BASE,
      { params }
    );

    return response.data.data;
  },

  // Get a single bank deposit by ID
  getBankDepositById: async (id: string): Promise<BankDeposit> => {
    const response = await axiosInstance.get<ApiResponse<BankDeposit>>(
      BANK_DEPOSIT_ENDPOINTS.DETAIL(id)
    );
    return response.data.data;
  },

  // Create a new bank deposit
  createBankDeposit: async (data: CreateBankDepositDTO): Promise<BankDeposit> => {
    // Create FormData for file upload
    const formData = new FormData();
    formData.append('deposit_amount', data.deposit_amount);
    formData.append('proof_of_payment', data.proof_of_payment);
    
    const response = await axiosInstance.post<ApiResponse<BankDeposit>>(
      BANK_DEPOSIT_ENDPOINTS.BASE,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data.data;
  },

  // Update an existing bank deposit
  updateBankDeposit: async (
    id: string,
    data: UpdateBankDepositDTO
  ): Promise<BankDeposit> => {
    // Create FormData for file upload
    const formData = new FormData();
    if (data.deposit_amount) {
      formData.append('deposit_amount', data.deposit_amount);
    }
    if (data.proof_of_payment) {
      formData.append('proof_of_payment', data.proof_of_payment);
    }
    
    const response = await axiosInstance.put<ApiResponse<BankDeposit>>(
      BANK_DEPOSIT_ENDPOINTS.DETAIL(id),
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data.data;
  },


};