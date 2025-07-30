import { WEATHER_ICONS } from '@/constants/weatherIcons';
import themeVariables from '@/styles/variables.scss';

import type { WeatherData } from '@/types/weather';

export interface WeatherTheme {
  bg: string;
  color: string;
  icon: string;
}

// Theme constants using SCSS variables for colors/gradients and constants for icons
const THEMES = {
  clear: {
    bg: themeVariables?.gradientClear || 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
    color: themeVariables?.colorClear || '#2c3e50',
    icon: WEATHER_ICONS.clear,
  },
  rain: {
    bg: themeVariables?.gradientRain || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: themeVariables?.colorRain || '#1e3a8a',
    icon: WEATHER_ICONS.rain,
  },
  snow: {
    bg: themeVariables?.gradientSnow || 'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)',
    color: themeVariables?.colorSnow || '#1e40af',
    icon: WEATHER_ICONS.snow,
  },
  thunder: {
    bg: themeVariables?.gradientThunder || 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    color: themeVariables?.colorThunder || '#1e293b',
    icon: WEATHER_ICONS.thunder,
  },
  fog: {
    bg: themeVariables?.gradientFog || 'linear-gradient(135deg, #d1d5db 0%, #9ca3af 100%)',
    color: themeVariables?.colorFog || '#374151',
    icon: WEATHER_ICONS.fog,
  },
  cloud: {
    bg: themeVariables?.gradientCloud || 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    color: themeVariables?.colorCloud || '#2e8b57',
    icon: WEATHER_ICONS.cloud,
  },
  hot: {
    bg: themeVariables?.gradientHot || 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
    color: themeVariables?.colorHot || '#8b0000',
    icon: WEATHER_ICONS.hot,
  },
  warm: {
    bg: themeVariables?.gradientWarm || 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
    color: themeVariables?.colorWarm || '#ff6b35',
    icon: WEATHER_ICONS.warm,
  },
  cold: {
    bg: themeVariables?.gradientCold || 'linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)',
    color: themeVariables?.colorCold || '#4682b4',
    icon: WEATHER_ICONS.cold,
  },
} as const;

// Weather condition tests
const isRainy = (desc: string) => desc.includes('rain') || desc.includes('drizzle');
const isSnowy = (desc: string) => desc.includes('snow');
const isStormy = (desc: string) => desc.includes('storm') || desc.includes('thunder');
const isFoggy = (desc: string) => desc.includes('fog') || desc.includes('mist');
const isCloudy = (desc: string) => desc.includes('cloud');

// Temperature ranges
const isHot = (temp: number) => temp >= 30;
const isWarm = (temp: number) => temp >= 20;
const isCool = (temp: number) => temp >= 10;
const isCold = (temp: number) => temp >= 0;

const defaultTheme: WeatherTheme = THEMES.clear;

const descriptionThemes: { test: (desc: string) => boolean; theme: WeatherTheme }[] = [
  {
    test: isRainy,
    theme: THEMES.rain,
  },
  {
    test: isSnowy,
    theme: THEMES.snow,
  },
  {
    test: isStormy,
    theme: THEMES.thunder,
  },
  {
    test: isFoggy,
    theme: THEMES.fog,
  },
  {
    test: isCloudy,
    theme: THEMES.cloud,
  },
];

const tempThemes: { test: (temp: number) => boolean; theme: WeatherTheme }[] = [
  {
    test: isHot,
    theme: THEMES.hot,
  },
  {
    test: isWarm,
    theme: THEMES.warm,
  },
  {
    test: isCool,
    theme: THEMES.cloud,
  },
  {
    test: isCold,
    theme: THEMES.cold,
  },
  {
    test: () => true,
    theme: THEMES.rain,
  },
];

// Optimized theme resolver
export const getWeatherTheme = (weather: WeatherData | null): WeatherTheme => {
  if (!weather) return defaultTheme;

  const desc = weather.description.toLowerCase();
  const temp = weather.temp;

  // Check description-based themes first (priority)
  for (const { test, theme } of descriptionThemes) {
    if (test(desc)) return theme;
  }

  // Check temperature-based themes
  for (const { test, theme } of tempThemes) {
    if (test(temp)) return theme;
  }

  return defaultTheme;
};

// CSS class-based theme resolver
export const getWeatherThemeClass = (weather: WeatherData | null): string => {
  if (!weather) return 'theme-clear';

  const desc = weather.description.toLowerCase();
  const temp = weather.temp;

  // Description-based themes (priority)
  if (isRainy(desc)) return 'theme-rain';
  if (isSnowy(desc)) return 'theme-snow';
  if (isStormy(desc)) return 'theme-thunder';
  if (isFoggy(desc)) return 'theme-fog';
  if (isCloudy(desc)) return 'theme-cloud';

  // Temperature-based themes
  if (isHot(temp)) return 'theme-hot';
  if (isWarm(temp)) return 'theme-warm';
  if (isCool(temp)) return 'theme-cloud';
  if (isCold(temp)) return 'theme-cold';
  return 'theme-rain';
};

// Get weather icon for CSS content
export const getWeatherIcon = (weather: WeatherData | null): string => {
  if (!weather) return THEMES.clear.icon;

  const desc = weather.description.toLowerCase();
  const temp = weather.temp;

  // Description-based icons (priority)
  if (isRainy(desc)) return THEMES.rain.icon;
  if (isSnowy(desc)) return THEMES.snow.icon;
  if (isStormy(desc)) return THEMES.thunder.icon;
  if (isFoggy(desc)) return THEMES.fog.icon;
  if (isCloudy(desc)) return THEMES.cloud.icon;

  // Temperature-based icons
  if (isHot(temp)) return THEMES.hot.icon;
  if (isWarm(temp)) return THEMES.warm.icon;
  if (isCool(temp)) return THEMES.cloud.icon;
  if (isCold(temp)) return THEMES.cold.icon;
  return THEMES.rain.icon;
};
