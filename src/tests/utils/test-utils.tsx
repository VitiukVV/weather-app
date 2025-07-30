import { theme } from '@/styles/theme';
import { ThemeProvider } from '@mui/material/styles';
import { configureStore } from '@reduxjs/toolkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { RenderOptions } from '@testing-library/react';
import { render } from '@testing-library/react';

import React from 'react';
import { Toaster } from 'react-hot-toast';
import { Provider } from 'react-redux';

import { rootReducer } from '@/store/root-reducer';

import type { City } from '@/types/store';
import type { WeatherData } from '@/types/weather';

// Test data
export const mockWeatherData: WeatherData = {
  temp: 20,
  humidity: 65,
  description: 'clear sky',
  icon: '01d',
  windSpeed: 5.2,
};

export const mockCity: City = {
  id: 'london-gb',
  name: 'London',
  country: 'GB',
  lat: 51.5074,
  lon: -0.1278,
  weather: mockWeatherData,
  lastUpdated: Date.now(),
};

export const mockCities: City[] = [
  mockCity,
  {
    id: 'paris-fr',
    name: 'Paris',
    country: 'FR',
    lat: 48.8566,
    lon: 2.3522,
    weather: {
      temp: 18,
      humidity: 70,
      description: 'cloudy',
      icon: '04d',
      windSpeed: 3.1,
    },
    lastUpdated: Date.now(),
  },
  {
    id: 'tokyo-jp',
    name: 'Tokyo',
    country: 'JP',
    lat: 35.6762,
    lon: 139.6503,
    weather: null,
    lastUpdated: Date.now(),
  },
];

// Extended render function with providers
interface ExtendedRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  preloadedState?: any;
  store?: ReturnType<typeof configureStore>;
}

export function renderWithProviders(
  ui: React.ReactElement,
  {
    preloadedState = {},
    store = configureStore({
      reducer: rootReducer,
      preloadedState,
    }),
    ...renderOptions
  }: ExtendedRenderOptions = {},
) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider theme={theme}>
            {children}
            <Toaster />
          </ThemeProvider>
        </QueryClientProvider>
      </Provider>
    );
  }

  return { store, queryClient, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}

// Mock implementations
export const mockRouter = {
  push: jest.fn(),
  back: jest.fn(),
  forward: jest.fn(),
  refresh: jest.fn(),
  replace: jest.fn(),
  prefetch: jest.fn(),
};

export const mockUseWeather = {
  data: mockWeatherData,
  isLoading: false,
  error: null,
  refetch: jest.fn().mockResolvedValue({ data: mockWeatherData }),
};

export const mockUseCityAutocomplete = {
  suggestions: [
    { name: 'London', country: 'GB', lat: 51.5074, lon: -0.1278, displayName: 'London, GB' },
    { name: 'Paris', country: 'FR', lat: 48.8566, lon: 2.3522, displayName: 'Paris, FR' },
  ],
  isLoading: false,
  error: null,
  handleInputChange: jest.fn(),
  clearSuggestions: jest.fn(),
  selectCity: jest.fn(),
};
