import * as weatherApi from '@/api/weatherApi';
import { configureStore } from '@reduxjs/toolkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';

import React from 'react';
import { Provider } from 'react-redux';

import { useAutoRefreshStaleWeather, useCurrentWeather } from '@/hooks/useWeather';

import { rootReducer } from '@/store/root-reducer';

import type { ApiWeatherData } from '@/types/api';
import type { WeatherData } from '@/types/weather';

// Mock the weather API
jest.mock('@/api/weatherApi');
const mockedWeatherApi = weatherApi as jest.Mocked<typeof weatherApi>;

const mockApiWeatherData: ApiWeatherData = {
  main: {
    temp: 22,
    humidity: 60,
  },
  weather: [
    {
      description: 'sunny',
      icon: '01d',
    },
  ],
  wind: {
    speed: 3.5,
  },
  name: 'London',
  sys: {
    country: 'GB',
  },
};

const expectedWeatherData: WeatherData = {
  temp: 22,
  humidity: 60,
  description: 'sunny',
  icon: '01d',
  windSpeed: 3.5,
};

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  return Wrapper;
};

describe('useCurrentWeather Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Successful API Calls', () => {
    it('fetches weather data successfully', async () => {
      mockedWeatherApi.getCurrentWeather.mockResolvedValueOnce(mockApiWeatherData);

      const { result } = renderHook(() => useCurrentWeather('London'), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);
      expect(result.current.data).toBe(undefined);
      expect(result.current.error).toBe(null);

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.data).toEqual(expectedWeatherData);
      expect(result.current.error).toBe(null);
      expect(mockedWeatherApi.getCurrentWeather).toHaveBeenCalledWith('London');
    });

    it('handles empty city name', () => {
      const { result } = renderHook(() => useCurrentWeather(''), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(false);
      expect(result.current.data).toBe(undefined);
      expect(result.current.error).toBe(null);
      expect(mockedWeatherApi.getCurrentWeather).not.toHaveBeenCalled();
    });
  });

  describe('Error Handling', () => {
    it('handles API errors gracefully', async () => {
      const error = new Error('API Error');
      mockedWeatherApi.getCurrentWeather.mockRejectedValueOnce(error);

      const { result } = renderHook(() => useCurrentWeather('InvalidCity'), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.data).toBe(undefined);
      expect(result.current.error).toBeTruthy();
      expect(mockedWeatherApi.getCurrentWeather).toHaveBeenCalledWith('InvalidCity');
    });
  });

  describe('Refetch Functionality', () => {
    it('refetches data when refetch is called', async () => {
      const updatedApiData: ApiWeatherData = {
        ...mockApiWeatherData,
        main: {
          ...mockApiWeatherData.main,
          temp: 25,
        },
        weather: [
          {
            ...mockApiWeatherData.weather[0],
            description: 'cloudy',
          },
        ],
      };

      const expectedUpdatedData: WeatherData = {
        ...expectedWeatherData,
        temp: 25,
        description: 'cloudy',
      };

      mockedWeatherApi.getCurrentWeather
        .mockResolvedValueOnce(mockApiWeatherData)
        .mockResolvedValueOnce(updatedApiData);

      const { result } = renderHook(() => useCurrentWeather('London'), {
        wrapper: createWrapper(),
      });

      // Wait for initial fetch
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.data).toEqual(expectedWeatherData);

      // Refetch
      await result.current.refetch();

      await waitFor(() => {
        expect(result.current.data).toEqual(expectedUpdatedData);
      });

      expect(mockedWeatherApi.getCurrentWeather).toHaveBeenCalledTimes(2);
    });
  });

  describe('useAutoRefreshStaleWeather Hook', () => {
    it('refreshes stale weather data for cities from localStorage', async () => {
      const staleCity = {
        id: 'london-gb',
        name: 'London',
        country: 'GB',
        lat: 51.5074,
        lon: -0.1278,
        weather: expectedWeatherData,
        lastUpdated: Date.now() - 15 * 60 * 1000, // 15 minutes ago (stale)
      };

      const freshCity = {
        id: 'paris-fr',
        name: 'Paris',
        country: 'FR',
        lat: 48.8566,
        lon: 2.3522,
        weather: expectedWeatherData,
        lastUpdated: Date.now() - 5 * 60 * 1000, // 5 minutes ago (fresh)
      };

      const store = configureStore({
        reducer: rootReducer,
        preloadedState: {
          cities: {
            cities: [staleCity, freshCity],
          },
        },
      });

      const queryClient = new QueryClient({
        defaultOptions: {
          queries: {
            retry: false,
          },
        },
      });

      mockedWeatherApi.getCurrentWeather.mockResolvedValue(mockApiWeatherData);

      renderHook(() => useAutoRefreshStaleWeather(), {
        wrapper: ({ children }) => (
          <Provider store={store}>
            <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
          </Provider>
        ),
      });

      // Wait for the effect to run
      await waitFor(() => {
        expect(mockedWeatherApi.getCurrentWeather).toHaveBeenCalledWith('London');
      });

      // Should not call API for fresh city
      expect(mockedWeatherApi.getCurrentWeather).not.toHaveBeenCalledWith('Paris');
    });

    it('handles cities without weather data', async () => {
      const cityWithoutWeather = {
        id: 'kyiv-ua',
        name: 'Kyiv',
        country: 'UA',
        lat: 50.4501,
        lon: 30.5234,
        weather: null,
        lastUpdated: Date.now(),
      };

      const store = configureStore({
        reducer: rootReducer,
        preloadedState: {
          cities: {
            cities: [cityWithoutWeather],
          },
        },
      });

      const queryClient = new QueryClient({
        defaultOptions: {
          queries: {
            retry: false,
          },
        },
      });

      mockedWeatherApi.getCurrentWeather.mockResolvedValue(mockApiWeatherData);

      renderHook(() => useAutoRefreshStaleWeather(), {
        wrapper: ({ children }) => (
          <Provider store={store}>
            <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
          </Provider>
        ),
      });

      // Should call API for city without weather data
      await waitFor(() => {
        expect(mockedWeatherApi.getCurrentWeather).toHaveBeenCalledWith('Kyiv');
      });
    });
  });
});
