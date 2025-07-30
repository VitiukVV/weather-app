import { apiPaths } from '@/constants/apiPaths';

import axiosInstance from '@/utils/axiosInstance';

import type { CitySuggestion } from '@/types/api';

export const getCitySuggestions = async (query: string): Promise<CitySuggestion[]> => {
  if (!query.trim() || query.length < 2) {
    return [];
  }

  try {
    const response = await axiosInstance.get(apiPaths.geocode.direct, {
      params: {
        q: query,
        limit: 5,
        ...apiPaths.params,
      },
    });

    return response.data.map((city: any) => ({
      name: city.name,
      country: city.country,
      lat: city.lat,
      lon: city.lon,
      state: city.state,
      displayName: city.state
        ? `${city.name}, ${city.state}, ${city.country}`
        : `${city.name}, ${city.country}`,
    }));
  } catch (error) {
    console.error('Error fetching city suggestions:', error);
    return [];
  }
};
