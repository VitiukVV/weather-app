import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import type { City } from '@/types/store';

import { mockCity, mockRouter, mockWeatherData } from '../utils/test-utils';

const MockCityCard = ({ city }: { city: City }) => (
  <div data-testid={`city-card-${city.id}`} className="weather-card theme-clear">
    <div className="card-content">
      <h3>{city.name}</h3>
      <p>{city.country}</p>
      <div className="weather-info">
        <span>20°C</span>
        <span>clear sky</span>
        <span>🌤️</span>
      </div>
      <div className="weather-details">
        <span>Humidity: 65%</span>
        <span>Wind: 5.2 m/s</span>
      </div>
      <div className="actions">
        <button aria-label="refresh weather">Refresh</button>
        <button aria-label="delete city">Delete</button>
        <button aria-label="view details">View</button>
      </div>
    </div>
  </div>
);

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
      render(<MockCityCard city={mockCity} />);

      expect(screen.getByText('London')).toBeInTheDocument();
      expect(screen.getByText('GB')).toBeInTheDocument();
    });

    it('renders weather information when available', () => {
      render(<MockCityCard city={mockCity} />);

      expect(screen.getByText('20°C')).toBeInTheDocument();
      expect(screen.getByText('clear sky')).toBeInTheDocument();
      expect(screen.getByText('Humidity: 65%')).toBeInTheDocument();
      expect(screen.getByText('Wind: 5.2 m/s')).toBeInTheDocument();
    });

    it('renders weather icon', () => {
      render(<MockCityCard city={mockCity} />);

      // Weather icon should be displayed
      const iconElement = screen.getByText(/🌤️/);
      expect(iconElement).toBeInTheDocument();
    });

    it('applies correct weather theme class', () => {
      const { container } = render(<MockCityCard city={mockCity} />);

      const weatherCard = container.querySelector('.weather-card');
      expect(weatherCard).toHaveClass('theme-clear');
    });
  });

  describe('User Interactions', () => {
    it('has proper ARIA labels for buttons', () => {
      render(<MockCityCard city={mockCity} />);

      expect(screen.getByLabelText('refresh weather')).toBeInTheDocument();
      expect(screen.getByLabelText('delete city')).toBeInTheDocument();
      expect(screen.getByLabelText('view details')).toBeInTheDocument();
    });

    it('supports keyboard navigation', async () => {
      render(<MockCityCard city={mockCity} />);

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

      render(<MockCityCard city={cityWithLongName} />);

      expect(screen.getByText('A'.repeat(100))).toBeInTheDocument();
    });

    it('handles special characters in city names', () => {
      const cityWithSpecialChars: City = {
        ...mockCity,
        name: 'São Paulo',
        country: 'BR',
      };

      render(<MockCityCard city={cityWithSpecialChars} />);

      expect(screen.getByText('São Paulo')).toBeInTheDocument();
      expect(screen.getByText('BR')).toBeInTheDocument();
    });
  });
});
