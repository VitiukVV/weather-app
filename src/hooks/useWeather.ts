import { getCurrentWeather, getHourlyForecast } from '@/api/weatherApi';
import { useQuery } from '@tanstack/react-query';

import { useCallback, useEffect, useMemo } from 'react';
import toast from 'react-hot-toast';

import { selectCityExists } from '@/store/cities/cities.selectors';
import { addCity, updateCityWeather } from '@/store/cities/cities.slice';
import { useAppDispatch, useAppSelector } from '@/store/store';

import type { ApiWeatherData, CitySuggestion } from '@/types/api';
import type { City } from '@/types/store';
import type { WeatherData } from '@/types/weather';

const STALE_TIME = 5 * 60 * 1000; // 5 minutes
const REFRESH_THRESHOLD = 10 * 60 * 1000; // 10 minutes - force refresh if data is older

const transformWeatherData = (data: ApiWeatherData): WeatherData => ({
  temp: data.main.temp,
  humidity: data.main.humidity,
  description: data.weather[0]?.description || '',
  icon: data.weather[0]?.icon || '',
  windSpeed: data.wind.speed,
});

// Utility function to create city ID
const createCityId = (city: CitySuggestion) => `${city.name}-${city.country}`;

// Enhanced weather query hook with automatic refresh for stale data
export const useCurrentWeather = (
  city: string,
  enabled: boolean = true,
  forceRefresh: boolean = false,
) => {
  return useQuery({
    queryKey: ['weather', city],
    queryFn: () => getCurrentWeather(city),
    enabled: !!city && enabled,
    staleTime: forceRefresh ? 0 : STALE_TIME, // Force refresh if data is stale
    select: transformWeatherData,
    refetchOnMount: forceRefresh, // Refetch on mount if data is stale
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

export const useAutoRefreshStaleWeather = () => {
  const dispatch = useAppDispatch();
  const cities = useAppSelector(state => state.cities.cities);

  useEffect(() => {
    const now = Date.now();

    const staleCities = cities.filter(
      city => !city.weather || now - city.lastUpdated > REFRESH_THRESHOLD,
    );

    if (staleCities.length === 0) return;

    const refreshCityWeather = async (city: City) => {
      try {
        const data = await getCurrentWeather(city.name);
        const weatherData = transformWeatherData(data);

        dispatch(updateCityWeather({ id: city.id, weather: weatherData }));
      } catch (error) {
        console.error(`Failed to refresh weather for ${city.name}:`, error);
      }
    };

    Promise.all(staleCities.map(refreshCityWeather)).catch(console.error);
  }, [cities, dispatch]);
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
