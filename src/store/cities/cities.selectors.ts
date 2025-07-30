import { createSelector } from '@reduxjs/toolkit';

import type { RootState } from '../store';

export const selectCitiesState = (state: RootState) => state.cities;

export const selectCities = createSelector(
  [selectCitiesState],
  citiesState => citiesState.cities || [],
);

export const selectCityById = createSelector(
  [selectCities, (_state: RootState, cityId: string) => cityId],
  (cities, cityId) => cities.find(city => city.id === cityId),
);

export const selectCityExists = createSelector(
  [selectCities, (_state: RootState, cityId: string) => cityId],
  (cities, cityId) => cities.some(city => city.id === cityId),
);
