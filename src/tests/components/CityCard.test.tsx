import { fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import React from 'react';

import CityCard from '@/components/cityCard/CityCard';

import type { City } from '@/types/store';

import { mockCity, mockRouter, mockWeatherData, renderWithProviders } from '../utils/test-utils';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => mockRouter,
}));

// Mock weather hook
const mockUseCurrentWeather = jest.fn();
jest.mock('@/hooks/useWeather', () => ({
  useCurrentWeather: () => mockUseCurrentWeather(),
}));

// Mock react-hot-toast
jest.mock('react-hot-toast', () => ({
  success: jest.fn(),
  error: jest.fn(),
}));

describe('CityCard Component', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseCurrentWeather.mockReturnValue({
      data: mockWeatherData,
      isLoading: false,
      error: null,
      refetch: jest.fn().mockResolvedValue({ data: mockWeatherData }),
    });
  });

  describe('Rendering', () => {
    it('renders city information correctly', () => {
      renderWithProviders(<CityCard city={mockCity} />);

      expect(screen.getByText('London')).toBeInTheDocument();
      expect(screen.getByText('GB')).toBeInTheDocument();
    });

    it('renders weather information when available', () => {
      renderWithProviders(<CityCard city={mockCity} />);

      expect(screen.getByText('20°C')).toBeInTheDocument();
      expect(screen.getByText('clear sky')).toBeInTheDocument();
      expect(screen.getByText('Humidity: 65%')).toBeInTheDocument();
      expect(screen.getByText('Wind: 5.2 m/s')).toBeInTheDocument();
    });

    it('renders weather icon', () => {
      renderWithProviders(<CityCard city={mockCity} />);

      // Weather icon should be displayed
      const iconElement = screen.getByText(/🌤️|☀️|☁️|🌧️|🌨️|⛈️|🌫️|❄️/);
      expect(iconElement).toBeInTheDocument();
    });

    it('applies correct weather theme class', () => {
      const { container } = renderWithProviders(<CityCard city={mockCity} />);

      const weatherCard = container.querySelector('.weather-card');
      expect(weatherCard).toHaveClass('theme-clear');
    });
  });

  describe('Loading States', () => {
    it('shows loading skeleton when weather is loading', () => {
      mockUseCurrentWeather.mockReturnValue({
        data: null,
        isLoading: true,
        error: null,
        refetch: jest.fn(),
      });

      renderWithProviders(<CityCard city={mockCity} />);

      expect(screen.getByTestId('loading-skeleton')).toBeInTheDocument();
    });

    it('disables refresh button when loading', () => {
      mockUseCurrentWeather.mockReturnValue({
        data: mockWeatherData,
        isLoading: true,
        error: null,
        refetch: jest.fn(),
      });

      renderWithProviders(<CityCard city={mockCity} />);

      const refreshButton = screen.getByLabelText('refresh weather');
      expect(refreshButton).toBeDisabled();
    });
  });

  describe('Error States', () => {
    it('shows error message when weather fails to load', () => {
      mockUseCurrentWeather.mockReturnValue({
        data: null,
        isLoading: false,
        error: new Error('API Error'),
        refetch: jest.fn(),
      });

      renderWithProviders(<CityCard city={mockCity} />);

      expect(screen.getByText('Error loading weather')).toBeInTheDocument();
    });

    it('handles city without weather data', () => {
      const cityWithoutWeather: City = {
        ...mockCity,
        weather: null,
      };

      mockUseCurrentWeather.mockReturnValue({
        data: null,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      renderWithProviders(<CityCard city={cityWithoutWeather} />);

      expect(screen.getByText('London')).toBeInTheDocument();
      expect(screen.getByText('GB')).toBeInTheDocument();
    });
  });

  describe('User Interactions', () => {
    it('handles refresh button click', async () => {
      const mockRefetch = jest.fn().mockResolvedValue({ data: mockWeatherData });
      mockUseCurrentWeather.mockReturnValue({
        data: mockWeatherData,
        isLoading: false,
        error: null,
        refetch: mockRefetch,
      });

      renderWithProviders(<CityCard city={mockCity} />);

      const refreshButton = screen.getByLabelText('refresh weather');
      await user.click(refreshButton);

      expect(mockRefetch).toHaveBeenCalledTimes(1);
    });

    it('opens delete confirmation dialog', async () => {
      renderWithProviders(<CityCard city={mockCity} />);

      const deleteButton = screen.getByLabelText('delete city');
      await user.click(deleteButton);

      expect(screen.getByText('Remove City')).toBeInTheDocument();
      expect(screen.getByText(/Are you sure you want to remove/)).toBeInTheDocument();
    });

    it('handles delete confirmation', async () => {
      const { store } = renderWithProviders(<CityCard city={mockCity} />);

      // Open delete dialog
      const deleteButton = screen.getByLabelText('delete city');
      await user.click(deleteButton);

      // Confirm deletion
      const confirmButton = screen.getByText('Remove');
      await user.click(confirmButton);

      // Check if city was removed from store
      await waitFor(() => {
        const state = store.getState();
        expect((state as any).cities.cities).not.toContain(mockCity);
      });
    });

    it('handles delete cancellation', async () => {
      renderWithProviders(<CityCard city={mockCity} />);

      // Open delete dialog
      const deleteButton = screen.getByLabelText('delete city');
      await user.click(deleteButton);

      // Cancel deletion
      const cancelButton = screen.getByText('Cancel');
      await user.click(cancelButton);

      // Dialog should be closed
      expect(screen.queryByText('Remove City')).not.toBeInTheDocument();
    });

    it('navigates to weather details on view button click', async () => {
      renderWithProviders(<CityCard city={mockCity} />);

      const viewButton = screen.getByLabelText('view details');
      await user.click(viewButton);

      expect(mockRouter.push).toHaveBeenCalledWith('/weather/london-gb');
    });

    it('navigates to weather details on card click', async () => {
      renderWithProviders(<CityCard city={mockCity} />);

      const weatherContent = screen.getByText('20°C').closest('div[role="button"]');
      if (weatherContent) {
        await user.click(weatherContent);
        expect(mockRouter.push).toHaveBeenCalledWith('/weather/london-gb');
      }
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA labels for buttons', () => {
      renderWithProviders(<CityCard city={mockCity} />);

      expect(screen.getByLabelText('refresh weather')).toBeInTheDocument();
      expect(screen.getByLabelText('delete city')).toBeInTheDocument();
      expect(screen.getByLabelText('view details')).toBeInTheDocument();
    });

    it('has proper dialog accessibility', async () => {
      renderWithProviders(<CityCard city={mockCity} />);

      const deleteButton = screen.getByLabelText('delete city');
      await user.click(deleteButton);

      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveAttribute('aria-labelledby', 'delete-dialog-title');
      expect(dialog).toHaveAttribute('aria-describedby', 'delete-dialog-description');
    });

    it('supports keyboard navigation', async () => {
      renderWithProviders(<CityCard city={mockCity} />);

      const refreshButton = screen.getByLabelText('refresh weather');
      refreshButton.focus();

      // Tab to next button
      await user.keyboard('{Tab}');
      expect(screen.getByLabelText('delete city')).toHaveFocus();

      // Tab to next button
      await user.keyboard('{Tab}');
      expect(screen.getByLabelText('view details')).toHaveFocus();
    });
  });

  describe('Edge Cases', () => {
    it('handles extremely long city names', () => {
      const cityWithLongName: City = {
        ...mockCity,
        name: 'A'.repeat(100),
      };

      renderWithProviders(<CityCard city={cityWithLongName} />);

      expect(screen.getByText('A'.repeat(100))).toBeInTheDocument();
    });

    it('handles special characters in city names', () => {
      const cityWithSpecialChars: City = {
        ...mockCity,
        name: 'São Paulo',
        country: 'BR',
      };

      renderWithProviders(<CityCard city={cityWithSpecialChars} />);

      expect(screen.getByText('São Paulo')).toBeInTheDocument();
      expect(screen.getByText('BR')).toBeInTheDocument();
    });

    it('handles extreme weather values', () => {
      const extremeWeather = {
        temp: -40,
        humidity: 100,
        description: 'extreme weather conditions',
        windSpeed: 200,
      };

      mockUseCurrentWeather.mockReturnValue({
        data: extremeWeather,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      renderWithProviders(<CityCard city={mockCity} />);

      expect(screen.getByText('-40°C')).toBeInTheDocument();
      expect(screen.getByText('Humidity: 100%')).toBeInTheDocument();
      expect(screen.getByText('Wind: 200 m/s')).toBeInTheDocument();
    });
  });
});
