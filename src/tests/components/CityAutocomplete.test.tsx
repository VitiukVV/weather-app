import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import React from 'react';

import CityAutocomplete from '@/components/CityAutocomplete/CityAutocomplete';

import type { CitySuggestion } from '@/types/api';

import { renderWithProviders } from '../utils/test-utils';

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
      renderWithProviders(<CityAutocomplete onCitySelected={mockOnCitySelected} />);

      const input = screen.getByPlaceholderText('Search for a city...');
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute('type', 'text');
    });

    it('renders autocomplete container', () => {
      renderWithProviders(<CityAutocomplete onCitySelected={mockOnCitySelected} />);

      const autocomplete = screen.getByRole('combobox');
      expect(autocomplete).toBeInTheDocument();
    });
  });

  describe('User Input', () => {
    it('calls handleInputChange when user types', async () => {
      const mockHandleInputChange = jest.fn();
      mockUseCityAutocomplete.mockReturnValue({
        suggestions: [],
        isLoading: false,
        error: null,
        handleInputChange: mockHandleInputChange,
        clearSuggestions: jest.fn(),
        selectCity: jest.fn(),
      });

      renderWithProviders(<CityAutocomplete onCitySelected={mockOnCitySelected} />);

      const input = screen.getByPlaceholderText('Search for a city...');
      await user.type(input, 'London');

      expect(mockHandleInputChange).toHaveBeenCalledWith('London');
    });

    it('debounces input changes', async () => {
      const mockHandleInputChange = jest.fn();
      mockUseCityAutocomplete.mockReturnValue({
        suggestions: [],
        isLoading: false,
        error: null,
        handleInputChange: mockHandleInputChange,
        clearSuggestions: jest.fn(),
        selectCity: jest.fn(),
      });

      renderWithProviders(<CityAutocomplete onCitySelected={mockOnCitySelected} />);

      const input = screen.getByPlaceholderText('Search for a city...');

      // Type quickly
      await user.type(input, 'L');
      await user.type(input, 'o');
      await user.type(input, 'n');

      // Should debounce and only call once with final value
      await waitFor(() => {
        expect(mockHandleInputChange).toHaveBeenLastCalledWith('Lon');
      });
    });

    it('clears input when escape is pressed', async () => {
      const mockClearSuggestions = jest.fn();
      mockUseCityAutocomplete.mockReturnValue({
        suggestions: mockSuggestions,
        isLoading: false,
        error: null,
        handleInputChange: jest.fn(),
        clearSuggestions: mockClearSuggestions,
        selectCity: jest.fn(),
      });

      renderWithProviders(<CityAutocomplete onCitySelected={mockOnCitySelected} />);

      const input = screen.getByPlaceholderText('Search for a city...');
      await user.type(input, 'London');
      await user.keyboard('{Escape}');

      expect(mockClearSuggestions).toHaveBeenCalled();
    });
  });

  describe('Suggestions Display', () => {
    it('displays suggestions when available', () => {
      mockUseCityAutocomplete.mockReturnValue({
        suggestions: mockSuggestions,
        isLoading: false,
        error: null,
        handleInputChange: jest.fn(),
        clearSuggestions: jest.fn(),
        selectCity: jest.fn(),
      });

      renderWithProviders(<CityAutocomplete onCitySelected={mockOnCitySelected} />);

      expect(screen.getByText('London, GB')).toBeInTheDocument();
      expect(screen.getByText('Paris, FR')).toBeInTheDocument();
    });

    it('shows loading indicator when loading', () => {
      mockUseCityAutocomplete.mockReturnValue({
        suggestions: [],
        isLoading: true,
        error: null,
        handleInputChange: jest.fn(),
        clearSuggestions: jest.fn(),
        selectCity: jest.fn(),
      });

      renderWithProviders(<CityAutocomplete onCitySelected={mockOnCitySelected} />);

      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('shows error message when error occurs', () => {
      mockUseCityAutocomplete.mockReturnValue({
        suggestions: [],
        isLoading: false,
        error: 'Network error',
        handleInputChange: jest.fn(),
        clearSuggestions: jest.fn(),
        selectCity: jest.fn(),
      });

      renderWithProviders(<CityAutocomplete onCitySelected={mockOnCitySelected} />);

      expect(screen.getByText('Network error')).toBeInTheDocument();
    });

    it('shows no results message when no suggestions found', () => {
      mockUseCityAutocomplete.mockReturnValue({
        suggestions: [],
        isLoading: false,
        error: 'No cities found',
        handleInputChange: jest.fn(),
        clearSuggestions: jest.fn(),
        selectCity: jest.fn(),
      });

      renderWithProviders(<CityAutocomplete onCitySelected={mockOnCitySelected} />);

      expect(screen.getByText('No cities found')).toBeInTheDocument();
    });
  });

  describe('City Selection', () => {
    it('calls selectCity when suggestion is clicked', async () => {
      const mockSelectCity = jest.fn();
      mockUseCityAutocomplete.mockReturnValue({
        suggestions: mockSuggestions,
        isLoading: false,
        error: null,
        handleInputChange: jest.fn(),
        clearSuggestions: jest.fn(),
        selectCity: mockSelectCity,
      });

      renderWithProviders(<CityAutocomplete onCitySelected={mockOnCitySelected} />);

      const suggestionOption = screen.getByText('London, GB');
      await user.click(suggestionOption);

      expect(mockSelectCity).toHaveBeenCalledWith(mockSuggestions[0]);
    });

    it('calls onCitySelected when city is selected', async () => {
      const mockSelectCity = jest.fn(city => {
        mockOnCitySelected(city);
      });

      mockUseCityAutocomplete.mockReturnValue({
        suggestions: mockSuggestions,
        isLoading: false,
        error: null,
        handleInputChange: jest.fn(),
        clearSuggestions: jest.fn(),
        selectCity: mockSelectCity,
      });

      renderWithProviders(<CityAutocomplete onCitySelected={mockOnCitySelected} />);

      const suggestionOption = screen.getByText('London, GB');
      await user.click(suggestionOption);

      expect(mockOnCitySelected).toHaveBeenCalledWith(mockSuggestions[0]);
    });
  });

  describe('Keyboard Navigation', () => {
    it('supports arrow key navigation through suggestions', async () => {
      mockUseCityAutocomplete.mockReturnValue({
        suggestions: mockSuggestions,
        isLoading: false,
        error: null,
        handleInputChange: jest.fn(),
        clearSuggestions: jest.fn(),
        selectCity: jest.fn(),
      });

      renderWithProviders(<CityAutocomplete onCitySelected={mockOnCitySelected} />);

      const input = screen.getByPlaceholderText('Search for a city...');
      input.focus();

      // Press ArrowDown to highlight first option
      await user.keyboard('{ArrowDown}');

      const firstOption = screen.getByText('London, GB');
      expect(firstOption).toHaveAttribute('aria-selected', 'true');

      // Press ArrowDown to highlight second option
      await user.keyboard('{ArrowDown}');

      const secondOption = screen.getByText('Paris, FR');
      expect(secondOption).toHaveAttribute('aria-selected', 'true');
    });

    it('selects highlighted option when Enter is pressed', async () => {
      const mockSelectCity = jest.fn();
      mockUseCityAutocomplete.mockReturnValue({
        suggestions: mockSuggestions,
        isLoading: false,
        error: null,
        handleInputChange: jest.fn(),
        clearSuggestions: jest.fn(),
        selectCity: mockSelectCity,
      });

      renderWithProviders(<CityAutocomplete onCitySelected={mockOnCitySelected} />);

      const input = screen.getByPlaceholderText('Search for a city...');
      input.focus();

      // Navigate to first option and select
      await user.keyboard('{ArrowDown}');
      await user.keyboard('{Enter}');

      expect(mockSelectCity).toHaveBeenCalledWith(mockSuggestions[0]);
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA attributes', () => {
      renderWithProviders(<CityAutocomplete onCitySelected={mockOnCitySelected} />);

      const input = screen.getByPlaceholderText('Search for a city...');
      expect(input).toHaveAttribute('role', 'combobox');
      expect(input).toHaveAttribute('aria-autocomplete', 'list');
      expect(input).toHaveAttribute('aria-expanded', 'false');
    });

    it('updates aria-expanded when suggestions are shown', () => {
      mockUseCityAutocomplete.mockReturnValue({
        suggestions: mockSuggestions,
        isLoading: false,
        error: null,
        handleInputChange: jest.fn(),
        clearSuggestions: jest.fn(),
        selectCity: jest.fn(),
      });

      renderWithProviders(<CityAutocomplete onCitySelected={mockOnCitySelected} />);

      const input = screen.getByPlaceholderText('Search for a city...');
      expect(input).toHaveAttribute('aria-expanded', 'true');
    });

    it('has proper label association', () => {
      renderWithProviders(<CityAutocomplete onCitySelected={mockOnCitySelected} />);

      const input = screen.getByPlaceholderText('Search for a city...');
      const label = screen.getByText('Search Cities');

      expect(input).toHaveAttribute('aria-labelledby', label.id);
    });
  });

  describe('Edge Cases', () => {
    it('handles empty suggestions array', () => {
      mockUseCityAutocomplete.mockReturnValue({
        suggestions: [],
        isLoading: false,
        error: null,
        handleInputChange: jest.fn(),
        clearSuggestions: jest.fn(),
        selectCity: jest.fn(),
      });

      renderWithProviders(<CityAutocomplete onCitySelected={mockOnCitySelected} />);

      const input = screen.getByPlaceholderText('Search for a city...');
      expect(input).toBeInTheDocument();
      expect(screen.queryByRole('option')).not.toBeInTheDocument();
    });

    it('handles very long city names', () => {
      const longNameSuggestions = [
        {
          name: 'Very Very Very Long City Name That Exceeds Normal Length',
          country: 'XX',
          lat: 0,
          lon: 0,
          displayName: 'Very Very Very Long City Name That Exceeds Normal Length, XX',
        },
      ];

      mockUseCityAutocomplete.mockReturnValue({
        suggestions: longNameSuggestions,
        isLoading: false,
        error: null,
        handleInputChange: jest.fn(),
        clearSuggestions: jest.fn(),
        selectCity: jest.fn(),
      });

      renderWithProviders(<CityAutocomplete onCitySelected={mockOnCitySelected} />);

      expect(screen.getByText(longNameSuggestions[0].displayName)).toBeInTheDocument();
    });

    it('handles special characters in city names', () => {
      const specialCharSuggestions = [
        {
          name: 'São Paulo',
          country: 'BR',
          lat: -23.5505,
          lon: -46.6333,
          displayName: 'São Paulo, BR',
        },
      ];

      mockUseCityAutocomplete.mockReturnValue({
        suggestions: specialCharSuggestions,
        isLoading: false,
        error: null,
        handleInputChange: jest.fn(),
        clearSuggestions: jest.fn(),
        selectCity: jest.fn(),
      });

      renderWithProviders(<CityAutocomplete onCitySelected={mockOnCitySelected} />);

      expect(screen.getByText('São Paulo, BR')).toBeInTheDocument();
    });
  });
});
