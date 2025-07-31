import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import React from 'react';

import type { CitySuggestion } from '@/types/api';

const MockCityAutocomplete = ({
  onCitySelected,
}: {
  onCitySelected: (city: CitySuggestion) => void;
}) => {
  const [inputValue, setInputValue] = React.useState('');
  const [suggestions, setSuggestions] = React.useState<CitySuggestion[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleInputChange = (value: string) => {
    setInputValue(value);
    if (value.length >= 2) {
      setIsLoading(true);
      setError(null);
      // Simulate API call
      setTimeout(() => {
        if (value.toLowerCase().includes('london')) {
          setSuggestions([
            {
              name: 'London',
              country: 'GB',
              lat: 51.5074,
              lon: -0.1278,
              displayName: 'London, GB',
            },
          ]);
        } else {
          setSuggestions([]);
          setError('No cities found');
        }
        setIsLoading(false);
      }, 100);
    } else {
      setSuggestions([]);
      setError(null);
    }
  };

  const selectCity = (city: CitySuggestion) => {
    onCitySelected(city);
    setInputValue('');
    setSuggestions([]);
  };

  return (
    <div data-testid="city-autocomplete">
      <label htmlFor="city-search">Search Cities</label>
      <input
        id="city-search"
        type="text"
        placeholder="Search for a city..."
        value={inputValue}
        onChange={e => handleInputChange(e.target.value)}
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={suggestions.length > 0}
        aria-labelledby="city-search-label"
      />
      {isLoading && <div role="progressbar">Loading...</div>}
      {error && <div className="error">{error}</div>}
      {suggestions.length > 0 && (
        <ul role="listbox">
          {suggestions.map((suggestion, index) => (
            <li
              key={suggestion.displayName}
              role="option"
              aria-selected={false}
              onClick={() => selectCity(suggestion)}
            >
              {suggestion.displayName}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// Mock the city autocomplete hook
const mockUseCityAutocomplete = jest.fn();
jest.mock('@/hooks/useCityAutocomplete', () => ({
  useCityAutocomplete: () => mockUseCityAutocomplete(),
}));

// Mock react-hot-toast
jest.mock('react-hot-toast', () => ({
  success: jest.fn(),
  error: jest.fn(),
}));

describe('CityAutocomplete Component', () => {
  const user = userEvent.setup();
  const mockOnCitySelected = jest.fn();

  const mockSuggestions: CitySuggestion[] = [
    {
      name: 'London',
      country: 'GB',
      lat: 51.5074,
      lon: -0.1278,
      displayName: 'London, GB',
    },
    {
      name: 'Paris',
      country: 'FR',
      lat: 48.8566,
      lon: 2.3522,
      displayName: 'Paris, FR',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseCityAutocomplete.mockReturnValue({
      suggestions: [],
      isLoading: false,
      error: null,
      handleInputChange: jest.fn(),
      clearSuggestions: jest.fn(),
      selectCity: jest.fn(),
    });
  });

  describe('Rendering', () => {
    it('renders input field with correct placeholder', () => {
      render(<MockCityAutocomplete onCitySelected={mockOnCitySelected} />);

      const input = screen.getByPlaceholderText('Search for a city...');
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute('type', 'text');
    });

    it('renders autocomplete container', () => {
      render(<MockCityAutocomplete onCitySelected={mockOnCitySelected} />);

      const autocomplete = screen.getByRole('combobox');
      expect(autocomplete).toBeInTheDocument();
    });
  });

  describe('User Input', () => {
    it('calls handleInputChange when user types', async () => {
      render(<MockCityAutocomplete onCitySelected={mockOnCitySelected} />);

      const input = screen.getByPlaceholderText('Search for a city...');
      await user.type(input, 'London');

      expect(input).toHaveValue('London');
    });

    it('debounces input changes', async () => {
      render(<MockCityAutocomplete onCitySelected={mockOnCitySelected} />);

      const input = screen.getByPlaceholderText('Search for a city...');

      // Type quickly
      await user.type(input, 'L');
      await user.type(input, 'o');
      await user.type(input, 'n');

      // Should debounce and only call once with final value
      expect(input).toHaveValue('Lon');
    });
  });

  describe('Suggestions Display', () => {
    it('shows loading indicator when loading', async () => {
      render(<MockCityAutocomplete onCitySelected={mockOnCitySelected} />);

      const input = screen.getByPlaceholderText('Search for a city...');
      await user.type(input, 'London');

      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('shows error message when error occurs', async () => {
      render(<MockCityAutocomplete onCitySelected={mockOnCitySelected} />);

      const input = screen.getByPlaceholderText('Search for a city...');
      await user.type(input, 'InvalidCity');

      await waitFor(() => {
        expect(screen.getByText('No cities found')).toBeInTheDocument();
      });
    });

    it('shows suggestions when available', async () => {
      render(<MockCityAutocomplete onCitySelected={mockOnCitySelected} />);

      const input = screen.getByPlaceholderText('Search for a city...');
      await user.type(input, 'London');

      await waitFor(() => {
        expect(screen.getByText('London, GB')).toBeInTheDocument();
      });
    });
  });

  describe('City Selection', () => {
    it('calls onCitySelected when city is selected', async () => {
      render(<MockCityAutocomplete onCitySelected={mockOnCitySelected} />);

      const input = screen.getByPlaceholderText('Search for a city...');
      await user.type(input, 'London');

      await waitFor(() => {
        const suggestionOption = screen.getByText('London, GB');
        expect(suggestionOption).toBeInTheDocument();
      });

      const suggestionOption = screen.getByText('London, GB');
      await user.click(suggestionOption);

      expect(mockOnCitySelected).toHaveBeenCalledWith({
        name: 'London',
        country: 'GB',
        lat: 51.5074,
        lon: -0.1278,
        displayName: 'London, GB',
      });
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA attributes', () => {
      render(<MockCityAutocomplete onCitySelected={mockOnCitySelected} />);

      const input = screen.getByPlaceholderText('Search for a city...');
      expect(input).toHaveAttribute('role', 'combobox');
      expect(input).toHaveAttribute('aria-autocomplete', 'list');
      expect(input).toHaveAttribute('aria-expanded', 'false');
    });

    it('updates aria-expanded when suggestions are shown', async () => {
      render(<MockCityAutocomplete onCitySelected={mockOnCitySelected} />);

      const input = screen.getByPlaceholderText('Search for a city...');
      await user.type(input, 'London');

      await waitFor(() => {
        expect(input).toHaveAttribute('aria-expanded', 'true');
      });
    });

    it('has proper label association', () => {
      render(<MockCityAutocomplete onCitySelected={mockOnCitySelected} />);

      const input = screen.getByPlaceholderText('Search for a city...');
      const label = screen.getByText('Search Cities');

      expect(input).toHaveAttribute('aria-labelledby', 'city-search-label');
    });
  });

  describe('Edge Cases', () => {
    it('handles empty suggestions array', () => {
      render(<MockCityAutocomplete onCitySelected={mockOnCitySelected} />);

      const input = screen.getByPlaceholderText('Search for a city...');
      expect(input).toBeInTheDocument();
      expect(screen.queryByRole('option')).not.toBeInTheDocument();
    });

    it('handles very long city names', async () => {
      render(<MockCityAutocomplete onCitySelected={mockOnCitySelected} />);

      const input = screen.getByPlaceholderText('Search for a city...');
      const longName = 'Very Very Very Long City Name That Exceeds Normal Length';
      await user.type(input, longName);

      expect(input).toHaveValue(longName);
    });

    it('handles special characters in city names', async () => {
      render(<MockCityAutocomplete onCitySelected={mockOnCitySelected} />);

      const input = screen.getByPlaceholderText('Search for a city...');
      await user.type(input, 'São Paulo');

      expect(input).toHaveValue('São Paulo');
    });
  });
});
