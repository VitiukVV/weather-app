import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

import type { CitiesState, City } from '@/types/store';
import type { WeatherData } from '@/types/weather';

const initialState: CitiesState = {
  cities: [],
};

const findCityIndex = (state: CitiesState, id: string): number =>
  state.cities.findIndex(city => city.id === id);

const citiesSlice = createSlice({
  name: 'cities',
  initialState,
  reducers: {
    addCity: (state, action: PayloadAction<City>) => {
      const index = findCityIndex(state, action.payload.id);
      if (index === -1) {
        state.cities.unshift(action.payload);
      }
    },
    removeCity: (state, action: PayloadAction<string>) => {
      state.cities = state.cities.filter(city => city.id !== action.payload);
    },
    updateCityWeather: (state, action: PayloadAction<{ id: string; weather: WeatherData }>) => {
      const index = findCityIndex(state, action.payload.id);
      if (index !== -1) {
        state.cities[index] = {
          ...state.cities[index],
          weather: action.payload.weather,
          lastUpdated: Date.now(),
        };
      }
    },
  },
});

export const { addCity, removeCity, updateCityWeather } = citiesSlice.actions;

export default citiesSlice.reducer;
