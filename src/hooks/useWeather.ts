import { getCurrentWeather, getHourlyForecast } from '@/api/weatherApi';
import { useQuery } from '@tanstack/react-query';

import { useCallback, useEffect, useMemo } from 'react';
import toast from 'react-hot-toast';

import { selectCityExists } from '@/store/cities/cities.selectors';
import { addCity } from '@/store/cities/cities.slice';
import { useAppDispatch, useAppSelector } from '@/store/store';

import type { ApiWeatherData, CitySuggestion } from '@/types/api';
import type { WeatherData } from '@/types/weather';

const STALE_TIME = 5 * 60 * 1000; // 5 minutes

const transformWeatherData = (data: ApiWeatherData): WeatherData => ({
  temp: data.main.temp,
  humidity: data.main.humidity,
  description: data.weather[0]?.description || '',
  icon: data.weather[0]?.icon || '',
  windSpeed: data.wind.speed,
});

// Utility function to create city ID
const createCityId = (city: CitySuggestion) => `${city.name}-${city.country}`;

// Shared weather query hook
export const useCurrentWeather = (city: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['weather', city],
    queryFn: () => getCurrentWeather(city),
    enabled: !!city && enabled,
    staleTime: STALE_TIME,
    select: transformWeatherData,
  });
};

export const useHourlyForecast = (lat: number, lon: number) => {
  return useQuery({
    queryKey: ['forecast', lat, lon],
    queryFn: () => getHourlyForecast(lat, lon),
    enabled: !!(lat && lon),
    staleTime: STALE_TIME,
  });
};

export const useAutoAddCityWeather = (
  city: CitySuggestion | null,
  onSuccess?: () => void,
  onError?: () => void,
) => {
  const dispatch = useAppDispatch();

  // Memoize city ID
  const cityId = useMemo(() => (city ? createCityId(city) : ''), [city]);

  // Use optimized selector for city existence check
  const cityExistsInStore = useAppSelector(state => selectCityExists(state, cityId));

  const {
    data: weatherData,
    isLoading,
    error,
  } = useCurrentWeather(city?.displayName || '', !!city && !cityExistsInStore);

  const addCityToStore = useCallback(
    (city: CitySuggestion, weatherData: WeatherData) => {
      const newCity = {
        id: createCityId(city),
        name: city.name,
        country: city.country,
        lat: city.lat,
        lon: city.lon,
        weather: weatherData,
        lastUpdated: Date.now(),
      };

      dispatch(addCity(newCity));
      toast.success(`${city.name} has been added successfully!`);
      onSuccess?.();
    },
    [dispatch, onSuccess],
  );

  useEffect(() => {
    if (!city) return;

    if (cityExistsInStore) {
      toast.error(`${city.name} is already in your cities list!`);
      onSuccess?.();
    } else if (weatherData) {
      addCityToStore(city, weatherData);
    }
  }, [city, cityExistsInStore, weatherData, addCityToStore, onSuccess]);

  useEffect(() => {
    if (error && city) {
      toast.error('Failed to get weather data for this city');
      onError?.();
    }
  }, [error, city, onError]);

  return { isLoading, error };
};
