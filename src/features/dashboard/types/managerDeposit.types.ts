export interface ManagerDeposit {
  id: string;
  deposit_amount: number;
  merchant_id: string;
  verification: boolean;
  created_at: string;
  updated_at: string;
  created_by: string;
  updated_by: string;
}

export interface CreateManagerDepositDTO {
  collector_id: string;
  deposit_amount: number;
}

export interface UpdateManagerDepositDTO {
  collector_id: string;
  deposit_amount: number;
}
