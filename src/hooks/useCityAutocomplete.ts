import { getCitySuggestions } from '@/api/geocodeApi';

import { useCallback, useEffect, useRef, useState } from 'react';

import type { CitySuggestion } from '@/types/api';

interface UseCityAutocompleteProps {
  onCitySelected: (city: CitySuggestion) => void;
  debounceMs?: number;
  minQueryLength?: number;
}

export const useCityAutocomplete = ({
  onCitySelected,
  debounceMs = 300,
  minQueryLength = 2,
}: UseCityAutocompleteProps) => {
  const [suggestions, setSuggestions] = useState<CitySuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const abortPendingRequests = useCallback(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
      debounceTimeoutRef.current = null;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  useEffect(() => abortPendingRequests, [abortPendingRequests]);

  const searchCities = useCallback(
    async (query: string) => {
      if (!query.trim() || query.length < minQueryLength) {
        setSuggestions([]);
        setError(null);
        return;
      }

      abortPendingRequests();
      const controller = new AbortController();
      abortControllerRef.current = controller;

      setIsLoading(true);
      setError(null);

      try {
        const result = await getCitySuggestions(query, { signal: controller.signal });
        if (controller.signal.aborted) return;

        if (result.length > 0) {
          setSuggestions(result);
        } else {
          setSuggestions([]);
          setError('No cities found');
        }
      } catch (err: any) {
        if (controller.signal.aborted) return;
        if (err instanceof DOMException && err.name === 'AbortError') return;

        console.error('City search error:', err);
        setError('Error searching for cities');
        setSuggestions([]);
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    },
    [minQueryLength, abortPendingRequests],
  );

  const handleInputChange = useCallback(
    (value: string) => {
      setError(null);
      if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current);

      if (value.length < minQueryLength) {
        setSuggestions([]);
        setIsLoading(false);
        return;
      }

      debounceTimeoutRef.current = setTimeout(() => {
        searchCities(value);
      }, debounceMs);
    },
    [searchCities, debounceMs, minQueryLength],
  );

  const clearSuggestions = useCallback(() => {
    abortPendingRequests();
    setSuggestions([]);
    setError(null);
    setIsLoading(false);
  }, [abortPendingRequests]);

  const selectCity = useCallback(
    (city: CitySuggestion) => {
      onCitySelected(city);
      clearSuggestions();
    },
    [onCitySelected, clearSuggestions],
  );

  return {
    suggestions,
    isLoading,
    error,
    handleInputChange,
    clearSuggestions,
    selectCity,
  };
};
