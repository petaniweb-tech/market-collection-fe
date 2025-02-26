export interface Coordinate {
  lat: number;
  lng: number;
}

export interface District {
  id: string;
  name: string;
  code: string;
  coordinates: Coordinate[];
}
