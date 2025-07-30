import * as weatherApi from '@/api/weatherApi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';

import React from 'react';

import { useCurrentWeather } from '@/hooks/useWeather';

import type { WeatherData } from '@/types/weather';

// Mock the weather API
jest.mock('@/api/weatherApi');
const mockedWeatherApi = weatherApi as jest.Mocked<typeof weatherApi>;

const mockWeatherData: WeatherData = {
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
      mockedWeatherApi.getCurrentWeather.mockResolvedValueOnce(mockWeatherData);

      const { result } = renderHook(() => useCurrentWeather('London'), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);
      expect(result.current.data).toBe(undefined);
      expect(result.current.error).toBe(null);

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.data).toEqual(mockWeatherData);
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
      const updatedData = {
        ...mockWeatherData,
        temp: 25,
        description: 'cloudy',
      };

      mockedWeatherApi.getCurrentWeather
        .mockResolvedValueOnce(mockWeatherData)
        .mockResolvedValueOnce(updatedData);

      const { result } = renderHook(() => useCurrentWeather('London'), {
        wrapper: createWrapper(),
      });

      // Wait for initial fetch
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.data).toEqual(mockWeatherData);

      // Refetch
      await result.current.refetch();

      await waitFor(() => {
        expect(result.current.data?.temp).toBe(25);
        expect(result.current.data?.description).toBe('cloudy');
      });

      expect(mockedWeatherApi.getCurrentWeather).toHaveBeenCalledTimes(2);
    });
  });
});
