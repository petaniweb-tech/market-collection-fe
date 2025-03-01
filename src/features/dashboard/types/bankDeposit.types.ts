export interface BankDeposit {
  id: string;
  deposit_amount: number;
  proof_of_payment_url: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  updated_by: string;
}

export interface CreateBankDepositDTO {
  deposit_amount: string;
  proof_of_payment: File;
}

export interface UpdateBankDepositDTO {
  deposit_amount?: string;
  proof_of_payment?: File;
}
