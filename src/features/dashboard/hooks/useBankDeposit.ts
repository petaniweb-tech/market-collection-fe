// hooks/useBankDeposit.ts
import {
  useQueryWithConfig,
  useMutationWithConfig,
} from "../../../hooks/useQueryWithConfig";
import { bankDepositService } from "../services/bankDeposit.service";
import { queryClient } from "../../../lib/react-query";
import { keepPreviousData } from "@tanstack/react-query";
import {
  CreateBankDepositDTO,
  UpdateBankDepositDTO,
} from "../types/bankDeposit.types";

export const QUERY_KEYS = {
  bankDeposits: ["bankDeposits"] as const,
  bankDeposit: (id: string) => ["bankDeposit", id] as const,
};

// Get bank deposits with pagination and filters
export function useBankDeposits(params?: {
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
    [...QUERY_KEYS.bankDeposits, JSON.stringify(params)],
    () => bankDepositService.getBankDeposits(params),
    {
      refetchOnWindowFocus: false,
      enabled: shouldFetch,
      staleTime: 60000, // 1 minute
      placeholderData: keepPreviousData, // Keep previous data while new data is loading
    }
  );
}

// Get bank deposit by ID
export function useBankDeposit(id: string) {
  return useQueryWithConfig(
    [...QUERY_KEYS.bankDeposit(id)],
    () => bankDepositService.getBankDepositById(id),
    {
      refetchOnWindowFocus: false,
      staleTime: 60000, // 1 minute
      enabled: !!id, // Only run query if ID is provided
    }
  );
}

// Create new bank deposit
export function useCreateBankDeposit() {
  return useMutationWithConfig(
    (data: CreateBankDepositDTO) => bankDepositService.createBankDeposit(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.bankDeposits });
      },
    }
  );
}

// Update bank deposit
export function useUpdateBankDeposit() {
  return useMutationWithConfig(
    ({ id, data }: { id: string; data: UpdateBankDepositDTO }) =>
      bankDepositService.updateBankDeposit(id, data),
    {
      onSuccess: (_, variables) => {
        // Invalidate both the list and the specific bank deposit
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.bankDeposits });
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.bankDeposit(variables.id),
        });
      },
    }
  );
}
