
export interface Store {
    id: string;
    name: string;
    location_id: string;
    status: "active" | "inactive";
    expected_deposit_amount: number;
    desc: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    created_by: string;
    updated_by: string;
    deleted_by: string | null;
    location: Location | null;
  }
  
  export interface CreateStoreDTO {
    name: string;
    location_id: string;
    status?: "active" | "inactive";
    expected_deposit_amount: number;
    created_by?: string;
    updated_by?: string;
  }
  
  export interface UpdateStoreDTO {
    id?: string;
    name: string;
    location_id: string;
    status?: "active" | "inactive";
    expected_deposit_amount: number;
    created_by?: string;
    updated_by?: string;
  }