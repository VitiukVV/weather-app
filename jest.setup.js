require('@testing-library/jest-dom');

// Setup environment variables for tests
process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY = 'test-api-key';

// Mock weatherThemes to avoid SCSS import issues
jest.mock('@/utils/weatherThemes', () => ({
  getWeatherThemeClass: jest.fn(() => 'theme-clear'),
  getWeatherIcon: jest.fn(() => '🌤️'),
  getWeatherTheme: jest.fn(() => ({
    bg: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
    color: '#2c3e50',
    icon: '🌤️',
  })),
}));

// Mock Material UI theme
jest.mock('@/styles/theme', () => ({
  theme: {
    palette: {
      primary: { main: '#1976d2' },
      secondary: { main: '#dc004e' },
    },
  },
}));

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock window.getComputedStyle
Object.defineProperty(window, 'getComputedStyle', {
  value: () => ({
    getPropertyValue: () => '',
  }),
});
