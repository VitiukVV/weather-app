import { combineReducers } from '@reduxjs/toolkit';

import citiesReducer from './cities/cities.slice';

// The root reducer is defined here to facilitate future project scaling and easier management of additional reducers.
export const rootReducer = combineReducers({
  cities: citiesReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
