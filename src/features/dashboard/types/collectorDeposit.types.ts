import { Store } from "./store.types";

export interface CollectorDeposit {
  id: string;
  deposit_amount: number;
  merchant_id: string;
  is_open: boolean;
  created_at: string;
  updated_at: string;
  created_by: string;
  updated_by: string;
  merchant: Store | null;
}

// Interface for creating a new collector deposit
export interface CreateCollectorDepositDTO {
  merchant_id: string;
  deposit_amount: number;
  is_open?: boolean;
}

// Interface for updating a collector deposit
export interface UpdateCollectorDepositDTO {
  deposit_amount?: number;
  is_open?: boolean;
}
