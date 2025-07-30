'use client';

import { Alert, Box, Paper } from '@mui/material';

import { useCallback, useMemo, useRef, useState } from 'react';

import { useAutoAddCityWeather } from '@/hooks/useWeather';

import type { CitySuggestion } from '@/types/api';

import CityAutocomplete, { type CityAutocompleteRef } from '../CityAutocomplete';

const AddCityForm = () => {
  const [currentCity, setCurrentCity] = useState<CitySuggestion | null>(null);
  const autocompleteRef = useRef<CityAutocompleteRef>(null);

  const clearForm = useCallback(() => {
    setCurrentCity(null);
    autocompleteRef.current?.clearInput();
  }, []);

  const { isLoading } = useAutoAddCityWeather(currentCity, clearForm, clearForm);

  const handleCitySelected = useCallback((city: CitySuggestion) => {
    setCurrentCity(city);
  }, []);

  // Memoize the loading alert to prevent unnecessary re-renders
  const loadingAlert = useMemo(() => {
    if (!isLoading || !currentCity) return null;

    return (
      <Alert severity="info" sx={{ mt: 1 }}>
        Loading weather data for {currentCity.name}...
      </Alert>
    );
  }, [isLoading, currentCity]);

  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Box>
        <CityAutocomplete
          ref={autocompleteRef}
          onCitySelected={handleCitySelected}
          placeholder="Search for a city..."
          label="City"
          disabled={isLoading}
          sx={{ flex: 1 }}
        />
        {loadingAlert}
      </Box>
    </Paper>
  );
};

export default AddCityForm;
