export interface DensityRequest {
  people: number;
  coordinates: [number, number][]; 
}

export interface DensityResponse {
  people: number;
  area_m2: number;
  density_p_m2: number;
  density_p_km2: number;
  coordinates: [number, number][];
}
