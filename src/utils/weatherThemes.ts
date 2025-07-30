import themeVariables from '@/styles/variables.scss';

import type { WeatherData } from '@/types/weather';

export interface WeatherTheme {
  bg: string;
  color: string;
  icon: string;
}

// Theme constants using SCSS variables
const THEMES = {
  clear: {
    bg: themeVariables.gradientClear,
    color: themeVariables.colorClear,
    icon: themeVariables.iconClear,
  },
  rain: {
    bg: themeVariables.gradientRain,
    color: themeVariables.colorRain,
    icon: themeVariables.iconRain,
  },
  snow: {
    bg: themeVariables.gradientSnow,
    color: themeVariables.colorSnow,
    icon: themeVariables.iconSnow,
  },
  thunder: {
    bg: themeVariables.gradientThunder,
    color: themeVariables.colorThunder,
    icon: themeVariables.iconThunder,
  },
  fog: {
    bg: themeVariables.gradientFog,
    color: themeVariables.colorFog,
    icon: themeVariables.iconFog,
  },
  cloud: {
    bg: themeVariables.gradientCloud,
    color: themeVariables.colorCloud,
    icon: themeVariables.iconCloud,
  },
  hot: {
    bg: themeVariables.gradientHot,
    color: themeVariables.colorHot,
    icon: themeVariables.iconHot,
  },
  warm: {
    bg: themeVariables.gradientWarm,
    color: themeVariables.colorWarm,
    icon: themeVariables.iconWarm,
  },
  cold: {
    bg: themeVariables.gradientCold,
    color: themeVariables.colorCold,
    icon: themeVariables.iconCold,
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
