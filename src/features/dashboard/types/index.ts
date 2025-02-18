export interface Employee {
  is_synced: boolean;
  id: number;
  name: string;
  nip: string;
  password: string;
  phone: string;
  email: string;
  location: string;
  role: string;
  created_at: string;
  updated_at: string;
}

export interface CreateEmployeeDTO {
  password: string;
  name: string;
  nip: string;
  phone: string;
  email: string;
  location: string;
  role: string;
  created_at: string;
  updated_at: string;
}

export interface Location {
  id: number;
  location_name: string;
  address: string;
  location: string;
  desc: string;
  created_at: string;
  updated_at: string;
}

export interface CreateLocationDTO {
  location_name: string;
  address: string;
  location: string;
  desc: string;
  created_at: string;
  updated_at: string;
}

export interface Store {
  id: number;
  store_name: string;
  location: string;
  retribution: string;
  desc: string;
  created_at: string;
  updated_at: string;
}

export interface CreateStoreDTO {
  store_name: string;
  location: string;
  retribution: string;
  desc: string;
  created_at: string;
  updated_at: string;
}


// export interface Employee {
//     is_synced: boolean;
//     id: string;
//     name: string;
//     nip: string;
//     password: string;
//     phone: string;
//     email: string;
//     location: string;
//     role: string;
//     created_at: string;
//     updated_at: string;
//   }

//   export interface CreateEmployeeDTO {
//     password: string;
//     name: string;
//     nip: string;
//     phone: string;
//     email: string;
//     location: string;
//     role: string;
//     created_at: string;
//     updated_at: string;
//   }
