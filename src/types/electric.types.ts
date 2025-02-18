export interface Database {
    users: {
      id: string;
      name: string;
      nip: string;
      role: string;
      phone_number: string;
      email: string;
      location_id: string;
      created_at: string;
      updated_at: string;
      deleted_at?: string | null;
    };
    locations: {
      id: string;
      name: string;
      latitude: number;
      longitude: number;
      description: string;
      created_at: string;
      updated_at: string;
      created_by: string;
      updated_by: string;
      deleted_at?: string | null;
    };
    merchants: {
      id: string;
      name: string;
      location_id: string;
      status: string;
      expected_deposit_amount: number;
      created_at: string;
      updated_at: string;
      created_by: string;
      updated_by: string;
      deleted_at?: string | null;
    };
    // Add other table types as needed
  }