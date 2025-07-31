'use client';

import { Delete, Refresh, Visibility } from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Skeleton,
  Typography,
} from '@mui/material';

import React, { useMemo, useState } from 'react';
import toast from 'react-hot-toast';

import { useRouter } from 'next/navigation';

import { getWeatherIcon, getWeatherThemeClass } from '@/utils/weatherThemes';

import { useCurrentWeather } from '@/hooks/useWeather';

import { removeCity, updateCityWeather } from '@/store/cities/cities.slice';
import { useAppDispatch } from '@/store/store';

import type { City } from '@/types/store';

import styles from './CityCard.module.scss';

interface CityCardProps {
  city: City;
}

const CityCard: React.FC<CityCardProps> = ({ city }) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Check if weather data is stale and force refresh if needed
  const isStale = useMemo(() => {
    if (!city.weather) return true;
    const now = Date.now();
    const staleThreshold = 10 * 60 * 1000; // 10 minutes
    return now - city.lastUpdated > staleThreshold;
  }, [city.weather, city.lastUpdated]);

  const { data: weather, isLoading, refetch } = useCurrentWeather(city.name, true, isStale);

  // Memoize weather theme class and icon
  const weatherThemeClass = useMemo(() => getWeatherThemeClass(weather || null), [weather]);
  const weatherIcon = useMemo(() => getWeatherIcon(weather || null), [weather]);

  const handleRefresh = async () => {
    try {
      const result = await refetch();
      if (result.data) {
        dispatch(
          updateCityWeather({
            id: city.id,
            weather: result.data,
          }),
        );
        toast.success(`Weather data for ${city.name} has been updated!`);
      }
    } catch (error) {
      console.error('Error refreshing weather:', error);
      toast.error(`Failed to update weather data for ${city.name}`);
    }
  };

  // Show loading state for automatic refresh
  const showLoadingState = isLoading && isStale;

  const handleDeleteClick = () => {
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    dispatch(removeCity(city.id));
    toast.success(`${city.name} has been removed from your cities list!`);
    setIsDeleteDialogOpen(false);
  };

  const handleDeleteCancel = () => {
    setIsDeleteDialogOpen(false);
  };

  const handleViewDetails = () => {
    router.push(`/weather/${city.id}`);
  };

  const formatTemperature = (temp: number) => `${Math.round(temp)}°C`;

  return (
    <>
      <Card
        className={`${styles['weather-card']} ${styles[weatherThemeClass]}`}
        data-icon={weatherIcon}
      >
        <CardContent sx={{ position: 'relative', zIndex: 1 }}>
          <Box display="flex" justifyContent="space-between" alignItems="flex-start">
            <Box>
              <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                {city.name}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                {city.country}
              </Typography>
            </Box>
            <Box display="flex" gap={1}>
              <IconButton
                size="small"
                onClick={handleRefresh}
                disabled={isLoading}
                aria-label="refresh weather"
                className={styles['icon-button']}
                sx={{
                  opacity: showLoadingState ? 0.6 : 1,
                }}
              >
                <Refresh />
              </IconButton>
              <IconButton
                size="small"
                onClick={handleDeleteClick}
                color="error"
                aria-label="delete city"
                className={styles['icon-button']}
              >
                <Delete />
              </IconButton>
              <IconButton
                size="small"
                onClick={handleViewDetails}
                color="primary"
                aria-label="view details"
                className={styles['icon-button']}
              >
                <Visibility />
              </IconButton>
            </Box>
          </Box>

          <Box
            mt={2}
            onClick={handleViewDetails}
            sx={{
              'cursor': 'pointer',
              '&:hover': {
                opacity: 0.8,
              },
            }}
          >
            {showLoadingState ? (
              <Skeleton variant="text" width="60%" />
            ) : weather ? (
              <>
                <Box display="flex" alignItems="center" gap={1} mb={1}>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                    {formatTemperature(weather.temp)}
                  </Typography>
                  <Typography variant="h5" sx={{ opacity: 0.8 }}>
                    {weatherIcon}
                  </Typography>
                </Box>
                <Typography
                  variant="body2"
                  sx={{ opacity: 0.8, mb: 2, textTransform: 'capitalize' }}
                >
                  {weather.description}
                </Typography>
                <Box display="flex" gap={1} flexWrap="wrap">
                  <Chip
                    label={`Humidity: ${weather.humidity}%`}
                    size="small"
                    variant="outlined"
                    className={styles['weather-chip']}
                  />
                  <Chip
                    label={`Wind: ${weather.windSpeed} m/s`}
                    size="small"
                    variant="outlined"
                    className={styles['weather-chip']}
                  />
                </Box>
              </>
            ) : (
              <Typography variant="body2" color="error">
                Error loading weather
              </Typography>
            )}
          </Box>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={isDeleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle id="delete-dialog-title">Remove City</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to remove <strong>{city.name}</strong> from your cities list? This
            action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={handleDeleteCancel} variant="outlined">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Remove
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CityCard;
