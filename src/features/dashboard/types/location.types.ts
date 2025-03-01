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
  