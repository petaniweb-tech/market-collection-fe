export interface Employee {
  id: string;
  name: string;
  role: "admin" | "manager" | "collector" | "supervisor";
  phone_number: string;
  email: string;
  location_id: string | null;
  status: boolean;
  verified_at: string | null;
  created_at: string;
  updated_at: string;
  location: Location | null;
}

export interface CreateEmployeeDTO {
  name: string;
  role: "admin" | "manager" | "collector" | "supervisor";
  phone_number: string;
  email: string;
  location_id?: string;
  password?: string;
}

export interface UpdateEmployeeDTO {
  name?: string;
  role?: "admin" | "manager" | "collector" | "supervisor";
  phone_number?: string;
  status: boolean;
  location_id?: string | null;
}

export interface Location {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  description: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  created_by: string;
  updated_by: string;
  deleted_by: string | null;
}

export interface CreateLocationDTO {
  name: string;
  latitude: number;
  longitude: number;
  description: string;
  created_by?: string;
  updated_by?: string;
}

export interface UpdateLocationDTO {
  name: string;
  latitude: number;
  longitude: number;
  description: string;
  created_by?: string;
  updated_by?: string;
}

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

export interface Income {
  id: string;
  name: string;
  merchant_count: number;
  total_expected_amount: number;
  total_collected_amount: number;
  collection_percentage: number;
}
