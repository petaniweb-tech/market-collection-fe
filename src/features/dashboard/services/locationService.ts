import {Location,  CreateLocationDTO } from '../types';

// Dummy data
let DUMMY_LOCATION: Location[] = [
  {
    id: 1,
    location_name: "Location 1",
    address: "Jl. Raya Lowokwaru",
    location: "Lowokwaru",
    desc: "Lokasi 1",
    created_at: '',
    updated_at: ''
  },
];

// Mock API service
export const locationService = {
  getLocations: async (): Promise<Location[]> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    return [...DUMMY_LOCATION];
  },

  createLocation: async (data: CreateLocationDTO): Promise<Location> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const {...locationData } = data;
    const newLocation: Location = {
      id: DUMMY_LOCATION.length + 1,
      ...locationData,
    };
    
    DUMMY_LOCATION = [...DUMMY_LOCATION, newLocation];
    return newLocation;
  }
};