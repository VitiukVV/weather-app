'use client';

import { Refresh } from '@mui/icons-material';
import { Alert, Box, Card, CardContent, Chip, IconButton, Typography } from '@mui/material';

import React, { useMemo, useState } from 'react';
import toast from 'react-hot-toast';

import { useParams, useRouter } from 'next/navigation';

import { getWeatherIcon, getWeatherThemeClass } from '@/utils/weatherThemes';

import { useHourlyForecast } from '@/hooks/useWeather';

import { selectCityById } from '@/store/cities/cities.selectors';
import { useAppSelector } from '@/store/store';

import BackButton from '../BackButton';
import TemperatureChart from '../TemperatureChart';
import styles from './WeatherDetails.module.scss';

const WeatherDetails: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const cityId = params?.cityId as string;

  const city = useAppSelector(state => selectCityById(state, cityId));
  const { data: forecast, refetch, isFetching } = useHourlyForecast(city?.lat || 0, city?.lon || 0);

  // Memoize weather theme class and icon for current weather
  const currentWeather = city?.weather ?? null;

  const currentWeatherThemeClass = useMemo(
    () => getWeatherThemeClass(currentWeather),
    [currentWeather],
  );
  const currentWeatherIcon = useMemo(() => getWeatherIcon(currentWeather), [currentWeather]);

  const handleBackClick = () => router.push('/');
  const formatTemperature = (temp: number) => `${Math.round(temp)}°C`;

  // Refresh handler
  const [refreshing, setRefreshing] = useState(false);
  const handleRefresh = async () => {
    setRefreshing(true);
    const result = await refetch();
    setRefreshing(false);

    if (result.data) {
      toast.success('Weather forecast has been updated!');
    } else {
      toast.error('Failed to update weather forecast');
    }
  };

  if (!cityId || !city) {
    const message = !cityId ? 'Invalid URL' : 'City not found';
    return (
      <Box className={styles['weather-details-container']}>
        <BackButton onClick={handleBackClick} />
        <Alert severity="error">{message}</Alert>
      </Box>
    );
  }

  return (
    <Box className={styles['weather-details-container']}>
      <BackButton onClick={handleBackClick} />

      <Typography variant="h4" component="h1" gutterBottom>
        Detailed Weather: {city.name}
      </Typography>

      {city.weather && (
        <Card
          className={`${styles['current-weather-card']} ${styles[currentWeatherThemeClass]}`}
          data-icon={currentWeatherIcon}
        >
          <CardContent className={styles['current-weather-content']}>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
              <Typography variant="h5" component="h2" gutterBottom>
                Current Weather
              </Typography>
              <IconButton
                aria-label="refresh forecast"
                onClick={handleRefresh}
                disabled={refreshing || isFetching}
                size="small"
              >
                <Refresh />
              </IconButton>
            </Box>
            <Typography variant="h3" component="div" className={styles['current-temperature']}>
              {formatTemperature(city.weather.temp)}
            </Typography>
            <Typography variant="body1" className={styles['current-description']} gutterBottom>
              {city.weather.description}
            </Typography>
            <Box className={styles['weather-chips']}>
              <Chip
                label={`Humidity: ${city.weather.humidity}%`}
                variant="outlined"
                className={styles['weather-chip']}
              />
              <Chip
                label={`Wind: ${city.weather.windSpeed} m/s`}
                variant="outlined"
                className={styles['weather-chip']}
              />
            </Box>
          </CardContent>
        </Card>
      )}

      {forecast?.list && <TemperatureChart hourlyData={forecast.list.slice(0, 24)} />}
    </Box>
  );
};

export default WeatherDetails;
