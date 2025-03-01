/* eslint-disable @typescript-eslint/no-explicit-any */

import { ApiResponse, PaginatedResponse } from "@/types/api.types";
import axiosInstance from "@/lib/axios";
import { CreateEmployeeDTO, Employee, UpdateEmployeeDTO } from "../types/employee.types";

// Updated endpoints to match your API structure
const EMPLOYEE_ENDPOINTS = {
  BASE: "/api/users",
  DETAIL: (id: string) => `/api/users/${id}`,
  RESEND_INVITATION: (id: string) => `/api/users/${id}/resend-invitation`,
  REACTIVATE: (id: string) => `/api/users/re-active/${id}`,
};

// Service for employee management
export const employeeService = {
  // Get employees with pagination, sorting and filtering
  getEmployees: async (params?: {
    page?: number;
    limit?: number;
    sort?: string;
    order?: "asc" | "desc";
    search?: string;
    role?: string;
    filter_column?: string[]  | null;
    filter_value?: string[]  | null;
  }): Promise<PaginatedResponse<Employee>> => {
    const response = await axiosInstance.get<
      ApiResponse<PaginatedResponse<Employee>>
    >(EMPLOYEE_ENDPOINTS.BASE, { params });

    return response.data.data;
  },

  // Get a single employee by ID
  getEmployeeById: async (id: string): Promise<Employee> => {
    const response = await axiosInstance.get<ApiResponse<Employee>>(
      EMPLOYEE_ENDPOINTS.DETAIL(id)
    );
    return response.data.data;
  },

  // Create a new employee
  createEmployee: async (data: CreateEmployeeDTO): Promise<Employee> => {
    const response = await axiosInstance.post<ApiResponse<Employee>>(
      EMPLOYEE_ENDPOINTS.BASE,
      data
    );
    return response.data.data;
  },

  // Update an existing employee
  updateEmployee: async (
    id: string,
    data: UpdateEmployeeDTO
  ): Promise<Employee> => {
    const response = await axiosInstance.put<ApiResponse<Employee>>(
      EMPLOYEE_ENDPOINTS.DETAIL(id),
      data
    );
    return response.data.data;
  },

  // Delete an employee (soft delete)
  deleteEmployee: async (id: string): Promise<boolean> => {
    const response = await axiosInstance.delete<
      ApiResponse<{ success: boolean }>
    >(EMPLOYEE_ENDPOINTS.DETAIL(id));
    return response.data.success;
  },

  // Resend invitation email
  resendInvitation: async (id: string): Promise<boolean> => {
    const response = await axiosInstance.post<
      ApiResponse<{ success: boolean }>
    >(EMPLOYEE_ENDPOINTS.RESEND_INVITATION(id));
    return response.data.success;
  },

  reactivateEmployee: async (id: string): Promise<boolean> => {
    const response = await axiosInstance.put<ApiResponse<{ success: boolean }>>(
      EMPLOYEE_ENDPOINTS.REACTIVATE(id)
    );
    
    return response.data.success;
  },
};
