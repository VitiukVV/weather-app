import { configureStore } from '@reduxjs/toolkit';
import { render, screen } from '@testing-library/react';

import React from 'react';
import { Provider } from 'react-redux';

import Cities from '@/components/cities';

import { rootReducer } from '@/store/root-reducer';

import type { City } from '@/types/store';

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
    renderWithProvider(<Cities />);

    expect(screen.getByText('Weather in Cities')).toBeInTheDocument();
    expect(screen.getByTestId('add-city-form')).toBeInTheDocument();
  });

  it('shows info message when no cities', () => {
    renderWithProvider(<Cities />);

    expect(screen.getByText('Add a city to see the weather')).toBeInTheDocument();
  });

  it('renders cities when they exist', () => {
    const store = configureStore({
      reducer: rootReducer,
      preloadedState: {
        cities: {
          cities: [
            {
              id: 'kyiv-ua',
              name: 'Kyiv',
              country: 'UA',
              weather: null,
              lastUpdated: Date.now(),
            },
            {
              id: 'lviv-ua',
              name: 'Lviv',
              country: 'UA',
              weather: null,
              lastUpdated: Date.now(),
            },
          ],
          loading: false,
          error: null,
        },
      },
    });

    render(
      <Provider store={store}>
        <Cities />
      </Provider>,
    );

    expect(screen.getByTestId('city-card-kyiv-ua')).toBeInTheDocument();
    expect(screen.getByTestId('city-card-lviv-ua')).toBeInTheDocument();
    expect(screen.getByText('Kyiv')).toBeInTheDocument();
    expect(screen.getByText('Lviv')).toBeInTheDocument();
  });

  it('handles undefined cities gracefully', () => {
    const store = configureStore({
      reducer: rootReducer,
      preloadedState: {
        cities: {
          cities: undefined as unknown as City[],
          loading: false,
          error: null,
        },
      },
    });

    render(
      <Provider store={store}>
        <Cities />
      </Provider>,
    );

    // Should not crash and should show info message
    expect(screen.getByText('Add a city to see the weather')).toBeInTheDocument();
  });
});
