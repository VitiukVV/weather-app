import { apiPaths } from '@/constants/apiPaths';

import axiosInstance from '@/utils/axiosInstance';

import type { CitySuggestion } from '@/types/api';

interface GetCitySuggestionsOptions {
  signal?: AbortSignal;
}

export const getCitySuggestions = async (
  query: string,
  options?: GetCitySuggestionsOptions,
): Promise<CitySuggestion[]> => {
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
      signal: options?.signal,
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

    // Re-throw abort errors so they can be handled properly
    if (error instanceof Error && error.name === 'AbortError') {
      throw error;
    }

    return [];
  }
};
