export interface HistoryTransaction {
    id: string;
    deposit_amount: number;
    merchant_id: string;
    is_open: boolean;
    created_at: string;
    updated_at: string;
    created_by: string;
    updated_by: string;
    created: {
      name: string;
    };
    updated: {
      name: string;
    };
  }