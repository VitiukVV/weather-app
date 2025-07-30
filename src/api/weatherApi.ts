import { apiPaths } from '@/constants/apiPaths';

import axiosInstance from '@/utils/axiosInstance';

import type { ApiWeatherData, ForecastData } from '@/types/api';

export const getCurrentWeather = async (city: string): Promise<ApiWeatherData> =>
  (
    await axiosInstance.get(apiPaths.weather.current, {
      params: {
        q: city,
        ...apiPaths.params,
      },
    })
  ).data;

export const getHourlyForecast = async (lat: number, lon: number): Promise<ForecastData> =>
  (
    await axiosInstance.get(apiPaths.weather.forecast, {
      params: {
        lat,
        lon,
        ...apiPaths.params,
      },
    })
  ).data;
