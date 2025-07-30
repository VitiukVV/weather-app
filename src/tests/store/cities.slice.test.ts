import { configureStore } from '@reduxjs/toolkit';

import citiesReducer, { addCity, removeCity, updateCityWeather } from '@/store/cities/cities.slice';

import type { CitiesState, City } from '@/types/store';
import type { WeatherData } from '@/types/weather';

const mockCity: City = {
  id: 'london-gb',
  name: 'London',
  country: 'GB',
  lat: 51.5074,
  lon: -0.1278,
  weather: null,
  lastUpdated: Date.now(),
};

const mockWeatherData: WeatherData = {
  temp: 20,
  humidity: 65,
  description: 'clear sky',
  icon: '01d',
  windSpeed: 5.2,
};

const initialState: CitiesState = {
  cities: [],
};

const stateWithCities: CitiesState = {
  cities: [mockCity],
};

describe('Cities Slice', () => {
  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        cities: citiesReducer,
      },
    });
  });

  describe('Initial State', () => {
    it('has correct initial state', () => {
      const state = (store.getState() as any).cities;
      expect(state).toEqual(initialState);
    });
  });

  describe('addCity Action', () => {
    it('adds a new city to empty state', () => {
      const newState = citiesReducer(initialState, addCity(mockCity));

      expect(newState.cities).toHaveLength(1);
      expect(newState.cities[0]).toEqual(mockCity);
    });

    it('adds a new city to existing cities (unshift behavior)', () => {
      const parisCity: City = {
        id: 'paris-fr',
        name: 'Paris',
        country: 'FR',
        lat: 48.8566,
        lon: 2.3522,
        weather: null,
        lastUpdated: Date.now(),
      };

      const newState = citiesReducer(stateWithCities, addCity(parisCity));

      expect(newState.cities).toHaveLength(2);
      expect(newState.cities[0]).toEqual(parisCity); // unshift adds to beginning
      expect(newState.cities[1]).toEqual(mockCity);
    });

    it('does not add duplicate cities', () => {
      const duplicateCity: City = {
        ...mockCity,
        lastUpdated: Date.now() + 1000,
      };

      const newState = citiesReducer(stateWithCities, addCity(duplicateCity));

      expect(newState.cities).toHaveLength(1);
      expect(newState.cities[0]).toEqual(mockCity);
    });

    it('dispatches addCity action correctly', () => {
      store.dispatch(addCity(mockCity));

      const state = (store.getState() as any).cities;
      expect(state.cities).toContain(mockCity);
    });
  });

  describe('removeCity Action', () => {
    it('removes an existing city', () => {
      const newState = citiesReducer(stateWithCities, removeCity('london-gb'));

      expect(newState.cities).toHaveLength(0);
    });

    it('handles removing non-existent city gracefully', () => {
      const newState = citiesReducer(stateWithCities, removeCity('non-existent-id'));

      expect(newState.cities).toHaveLength(1);
      expect(newState.cities[0]).toEqual(mockCity);
    });

    it('removes correct city from multiple cities', () => {
      const parisCity: City = {
        id: 'paris-fr',
        name: 'Paris',
        country: 'FR',
        lat: 48.8566,
        lon: 2.3522,
        weather: null,
        lastUpdated: Date.now(),
      };

      const stateWithMultipleCities: CitiesState = {
        cities: [mockCity, parisCity],
      };

      const newState = citiesReducer(stateWithMultipleCities, removeCity('paris-fr'));

      expect(newState.cities).toHaveLength(1);
      expect(newState.cities[0]).toEqual(mockCity);
    });

    it('dispatches removeCity action correctly', () => {
      store.dispatch(addCity(mockCity));
      store.dispatch(removeCity('london-gb'));

      const state = (store.getState() as any).cities;
      expect(state.cities).toHaveLength(0);
    });
  });

  describe('updateCityWeather Action', () => {
    it('updates weather for existing city', () => {
      const newState = citiesReducer(
        stateWithCities,
        updateCityWeather({
          id: 'london-gb',
          weather: mockWeatherData,
        }),
      );

      expect(newState.cities).toHaveLength(1);
      expect(newState.cities[0].weather).toEqual(mockWeatherData);
      expect(newState.cities[0].lastUpdated).toBeGreaterThan(mockCity.lastUpdated);
    });

    it('handles updating weather for non-existent city', () => {
      const newState = citiesReducer(
        stateWithCities,
        updateCityWeather({
          id: 'non-existent-id',
          weather: mockWeatherData,
        }),
      );

      expect(newState.cities).toHaveLength(1);
      expect(newState.cities[0]).toEqual(mockCity);
    });

    it('dispatches updateCityWeather action correctly', () => {
      store.dispatch(addCity(mockCity));
      store.dispatch(
        updateCityWeather({
          id: 'london-gb',
          weather: mockWeatherData,
        }),
      );

      const state = (store.getState() as any).cities;
      expect(state.cities[0].weather).toEqual(mockWeatherData);
    });
  });

  describe('State Immutability', () => {
    it('does not mutate original state when adding city', () => {
      const originalState = { ...initialState };
      const newState = citiesReducer(initialState, addCity(mockCity));

      expect(originalState).toEqual({
        cities: [],
      });
      expect(newState).not.toBe(originalState);
      expect(newState.cities).not.toBe(originalState.cities);
    });

    it('does not mutate original state when removing city', () => {
      const originalState = { ...stateWithCities, cities: [...stateWithCities.cities] };
      const newState = citiesReducer(stateWithCities, removeCity('london-gb'));

      expect(originalState.cities).toHaveLength(1);
      expect(newState).not.toBe(originalState);
      expect(newState.cities).not.toBe(originalState.cities);
    });

    it('does not mutate original state when updating weather', () => {
      const originalState = { ...stateWithCities, cities: [...stateWithCities.cities] };
      const newState = citiesReducer(
        stateWithCities,
        updateCityWeather({
          id: 'london-gb',
          weather: mockWeatherData,
        }),
      );

      expect(originalState.cities[0].weather).toBe(null);
      expect(newState).not.toBe(originalState);
      expect(newState.cities).not.toBe(originalState.cities);
      expect(newState.cities[0]).not.toBe(originalState.cities[0]);
    });
  });

  describe('Edge Cases', () => {
    it('handles empty city list operations', () => {
      const removeState = citiesReducer(initialState, removeCity('any-id'));
      const updateState = citiesReducer(
        initialState,
        updateCityWeather({ id: 'any-id', weather: mockWeatherData }),
      );

      expect(removeState).toEqual(initialState);
      expect(updateState).toEqual(initialState);
    });

    it('handles city with special characters', () => {
      const specialCity: City = {
        id: 'são-paulo-br',
        name: 'São Paulo',
        country: 'BR',
        lat: -23.5505,
        lon: -46.6333,
        weather: null,
        lastUpdated: Date.now(),
      };

      const newState = citiesReducer(initialState, addCity(specialCity));

      expect(newState.cities).toHaveLength(1);
      expect(newState.cities[0]).toEqual(specialCity);
    });

    it('handles very long city names', () => {
      const longNameCity: City = {
        id: 'very-long-city-name',
        name: 'A'.repeat(100),
        country: 'XX',
        lat: 0,
        lon: 0,
        weather: null,
        lastUpdated: Date.now(),
      };

      const newState = citiesReducer(initialState, addCity(longNameCity));

      expect(newState.cities).toHaveLength(1);
      expect(newState.cities[0].name).toHaveLength(100);
    });

    it('handles extreme weather values', () => {
      const extremeWeather: WeatherData = {
        temp: -50,
        humidity: 100,
        description: 'extreme conditions',
        icon: '13d',
        windSpeed: 200,
      };

      const newState = citiesReducer(
        stateWithCities,
        updateCityWeather({
          id: 'london-gb',
          weather: extremeWeather,
        }),
      );

      expect(newState.cities[0].weather).toEqual(extremeWeather);
    });
  });

  describe('Performance', () => {
    it('handles moderate number of cities efficiently', () => {
      const moderateCityList: City[] = Array.from({ length: 100 }, (_, i) => ({
        id: `city-${i}`,
        name: `City ${i}`,
        country: 'XX',
        lat: 0,
        lon: 0,
        weather: null,
        lastUpdated: Date.now(),
      }));

      let state = initialState;
      const startTime = Date.now();

      moderateCityList.forEach(city => {
        state = citiesReducer(state, addCity(city));
      });

      const endTime = Date.now();
      const duration = endTime - startTime;

      expect(state.cities).toHaveLength(100);
      expect(duration).toBeLessThan(5000); // Should complete within 5 seconds in test environment
    });
  });
});
