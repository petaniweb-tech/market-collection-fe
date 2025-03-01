/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  useQueryWithConfig,
  useMutationWithConfig,
} from "../../../hooks/useQueryWithConfig";
import { employeeService } from "../services/employee.service";
import { queryClient } from "../../../lib/react-query";
import { keepPreviousData } from "@tanstack/react-query";
import { CreateEmployeeDTO, UpdateEmployeeDTO } from "../types/employee.types";

export const QUERY_KEYS = {
  employees: ["employees"] as const,
  employee: (id: string) => ["employee", id] as const,
};

// Get employees with pagination and filters
export function useEmployees(params?: {
  page?: number;
  limit?: number;
  sort?: string;
  order?: "asc" | "desc";
  search?: string;
  role?: string;
  filter_column?: string[] | null;
  filter_value?: string[]  | null;
}) {
  const shouldFetch = !params?.search || params.search.length >= 3;
  return useQueryWithConfig(
    [...QUERY_KEYS.employees, JSON.stringify(params)],
    () => employeeService.getEmployees(params),
    {
      refetchOnWindowFocus: false,
      enabled: shouldFetch,
      staleTime: 60000, // 1 minute
      placeholderData: keepPreviousData, // Keep previous data while new data is loading
    }
  );
}

// Get employee by ID
export function useEmployee(id: string) {
  return useQueryWithConfig(
    [...QUERY_KEYS.employee(id)], // Spread the readonly tuple into a new array
    () => employeeService.getEmployeeById(id),
    {
      refetchOnWindowFocus: false,
      staleTime: 60000, // 1 minute
      enabled: !!id, // Only run query if ID is provided
    }
  );
}

// Create new employee
export function useCreateEmployee() {
  return useMutationWithConfig(
    (data: CreateEmployeeDTO) => employeeService.createEmployee(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.employees });
      },
    }
  );
}

// Update employee
export function useUpdateEmployee() {
  return useMutationWithConfig(
    ({ id, data }: { id: string; data: UpdateEmployeeDTO }) =>
      employeeService.updateEmployee(id, data),
    {
      onSuccess: (_, variables) => {
        // Invalidate both the list and the specific employee
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.employees });
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.employee(variables.id),
        });
      },
    }
  );
}

// Delete employee
export function useDeleteEmployee() {
  return useMutationWithConfig(
    (id: string) => employeeService.deleteEmployee(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.employees });
      },
    }
  );
}

// reactivate employee
export function useReactivateEmployee() {
  return useMutationWithConfig(
    (id: string) => employeeService.reactivateEmployee(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.employees });
      },
    }
  );
}
