import { CreateStoreDTO, Store } from "../types";

// Dummy data
let DUMMY_STORE: Store[] = [
  {
    id: 1,
    store_name: "Store 1",
    retribution: "Rp. 10.000",
    location: "Lowokwaru",
    desc: "Lokasi 1",
    created_at: "",
    updated_at: "",
  },
];

// Mock API service
export const storeService = {
  getStores: async (): Promise<Store[]> => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return [...DUMMY_STORE];
  },

  createStore: async (data: CreateStoreDTO): Promise<Store> => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const { ...storeData } = data;
    const newStore: Store = {
      id: DUMMY_STORE.length + 1,
      ...storeData,
    };

    DUMMY_STORE = [...DUMMY_STORE, newStore];

    return newStore;
  },
};
