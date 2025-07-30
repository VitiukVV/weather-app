import type { WeatherData } from './weather';

export interface City {
  id: string;
  name: string;
  country: string;
  lat: number;
  lon: number;
  weather: WeatherData | null;
  lastUpdated: number;
}

export interface CitiesState {
  cities: City[];
}

export interface RootState {
  cities: CitiesState;
}
