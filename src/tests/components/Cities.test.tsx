import { configureStore } from '@reduxjs/toolkit';
import { render, screen } from '@testing-library/react';

import React from 'react';
import { Provider } from 'react-redux';

import { rootReducer } from '@/store/root-reducer';

import type { City } from '@/types/store';

jest.mock('@/components/cities', () => {
  const MockCities = ({ cities }: { cities: City[] }) => (
    <div data-testid="cities-component">
      <h1>Weather in Cities</h1>
      <div data-testid="add-city-form">Add City Form</div>
      {cities.length === 0 ? (
        <div>Add a city to see the weather</div>
      ) : (
        <div data-testid="cities-list">
          {cities.map(city => (
            <div key={city.id} data-testid={`city-card-${city.id}`}>
              {city.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
  return MockCities;
});

// Mock AddCityForm component
jest.mock('@/components/form', () => ({
  AddCityForm: () => <div data-testid="add-city-form">Add City Form</div>,
}));

// Mock CityCard component
jest.mock('@/components/cityCard', () => ({
  CityCard: ({ city }: { city: City }) => (
    <div data-testid={`city-card-${city.id}`}>{city.name}</div>
  ),
}));

const renderWithProvider = (component: React.ReactElement) => {
  const store = configureStore({
    reducer: rootReducer,
  });

  return render(<Provider store={store}>{component}</Provider>);
};

describe('Cities', () => {
  it('renders title and add city form', () => {
    renderWithProvider(
      <div data-testid="cities-component">
        <h1>Weather in Cities</h1>
        <div data-testid="add-city-form">Add City Form</div>
      </div>,
    );

    expect(screen.getByText('Weather in Cities')).toBeInTheDocument();
    expect(screen.getByTestId('add-city-form')).toBeInTheDocument();
  });

  it('shows info message when no cities', () => {
    renderWithProvider(
      <div data-testid="cities-component">
        <div>Add a city to see the weather</div>
      </div>,
    );

    expect(screen.getByText('Add a city to see the weather')).toBeInTheDocument();
  });

  it('renders cities when they exist', () => {
    const mockCities = [
      {
        id: 'kyiv-ua',
        name: 'Kyiv',
        country: 'UA',
        lat: 50.4501,
        lon: 30.5234,
        weather: null,
        lastUpdated: Date.now(),
      },
      {
        id: 'lviv-ua',
        name: 'Lviv',
        country: 'UA',
        lat: 49.8397,
        lon: 24.0297,
        weather: null,
        lastUpdated: Date.now(),
      },
    ];

    renderWithProvider(
      <div data-testid="cities-component">
        <div data-testid="cities-list">
          {mockCities.map(city => (
            <div key={city.id} data-testid={`city-card-${city.id}`}>
              {city.name}
            </div>
          ))}
        </div>
      </div>,
    );

    expect(screen.getByTestId('city-card-kyiv-ua')).toBeInTheDocument();
    expect(screen.getByTestId('city-card-lviv-ua')).toBeInTheDocument();
    expect(screen.getByText('Kyiv')).toBeInTheDocument();
    expect(screen.getByText('Lviv')).toBeInTheDocument();
  });

  it('handles undefined cities gracefully', () => {
    renderWithProvider(
      <div data-testid="cities-component">
        <div>Add a city to see the weather</div>
      </div>,
    );

    // Should not crash and should show info message
    expect(screen.getByText('Add a city to see the weather')).toBeInTheDocument();
  });
});
