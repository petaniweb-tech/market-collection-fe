import { Store } from "@/features/dashboard/types";

export interface CollectorDeposit {
  id: string;
  deposit_amount: number;
  merchant_id: string;
  is_open: boolean;
  created_at: string;
  updated_at: string;
  created_by: string;
  updated_by: string;
  merchant: Store;
}

export interface CreateCollectorDepositDTO {
  deposit_amount: number;
  merchant_id: string;
  is_open: boolean;
}

export interface UpdateCollectorDepositDTO {
  deposit_amount: number;
  merchant_id: string;
  is_open: boolean;
}
