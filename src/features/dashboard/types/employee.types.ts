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
  