'use client';

import { Search } from '@mui/icons-material';
import { Autocomplete, Box, CircularProgress, TextField, Typography } from '@mui/material';

import { forwardRef, useImperativeHandle, useRef, useState } from 'react';

import { useCityAutocomplete } from '@/hooks/useCityAutocomplete';

import type { CitySuggestion } from '@/types/api';

import styles from './CityAutocomplete.module.scss';

interface CityAutocompleteProps {
  onCitySelected: (city: CitySuggestion) => void;
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  sx?: any;
}

export interface CityAutocompleteRef {
  clearInput: () => void;
}

const CityAutocomplete = forwardRef<CityAutocompleteRef, CityAutocompleteProps>(
  (
    { onCitySelected, placeholder = 'Enter city name...', label = 'City', disabled = false, sx },
    ref,
  ) => {
    const [inputValue, setInputValue] = useState('');
    const [open, setOpen] = useState(false);
    const clearingRef = useRef(false);

    const { suggestions, isLoading, error, handleInputChange, clearSuggestions } =
      useCityAutocomplete({
        onCitySelected: () => {},
      });

    useImperativeHandle(ref, () => ({
      clearInput: () => {
        clearingRef.current = true;
        setInputValue('');
        setOpen(false);
        clearSuggestions();
        setTimeout(() => {
          clearingRef.current = false;
        }, 100);
      },
    }));

    const handleInputChangeLocal = (newValue: string) => {
      if (clearingRef.current) return;

      setInputValue(newValue);

      if (!clearingRef.current) {
        handleInputChange(newValue);
      }

      if (newValue.length >= 2) {
        setOpen(true);
      } else {
        setOpen(false);
      }
    };

    const handleCitySelectLocal = (city: CitySuggestion) => {
      onCitySelected(city);
    };

    return (
      <Box className={styles['autocomplete-container']}>
        <Autocomplete
          freeSolo
          value={null}
          open={open && suggestions.length > 0 && !clearingRef.current}
          onClose={() => setOpen(false)}
          options={suggestions}
          getOptionLabel={option => (typeof option === 'string' ? option : option.displayName)}
          filterOptions={options => options}
          loading={isLoading}
          disabled={disabled}
          inputValue={inputValue}
          onInputChange={(_, newValue) => handleInputChangeLocal(newValue)}
          onChange={(_, newValue) => {
            if (newValue && typeof newValue !== 'string') {
              handleCitySelectLocal(newValue);
            }
          }}
          renderOption={(props, option) => (
            <Box component="li" {...props} key={`${option.name}-${option.lat}-${option.lon}`}>
              <Box className={styles['autocomplete-option']}>
                <Search fontSize="small" color="action" />
                <Box className={styles['autocomplete-option-content']}>
                  <Typography variant="body2" className={styles['autocomplete-option-name']}>
                    {option.name}
                  </Typography>
                  <Typography variant="caption" className={styles['autocomplete-option-location']}>
                    {option.state ? `${option.state}, ${option.country}` : option.country}
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}
          renderInput={params => (
            <TextField
              {...params}
              label={label}
              placeholder={placeholder}
              fullWidth
              error={!!error}
              helperText={error}
              sx={sx}
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {isLoading && <CircularProgress size={20} />}
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
            />
          )}
          noOptionsText={error || 'No cities found'}
          loadingText="Searching..."
        />
      </Box>
    );
  },
);

CityAutocomplete.displayName = 'CityAutocomplete';

export default CityAutocomplete;
