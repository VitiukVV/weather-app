'use client';

import { Alert, Box, Typography } from '@mui/material';

import { selectCities } from '@/store/cities/cities.selectors';
import { useAppSelector } from '@/store/store';

import CityCard from '../cityCard';
import AddCityForm from '../form';
import styles from './Cities.module.scss';

const Cities = () => {
  const cities = useAppSelector(selectCities);

  return (
    <Box className={styles['cities-container']}>
      <Typography variant="h4" component="h1" gutterBottom className={styles['cities-title']}>
        Weather in cities
      </Typography>

      <AddCityForm />

      {cities.length === 0 ? (
        <Alert severity="info" className={styles['cities-empty']}>
          Add a city to see the weather
        </Alert>
      ) : (
        <Box className={styles['cities-grid']}>
          {cities.map(city => (
            <CityCard key={city.id} city={city} />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default Cities;
