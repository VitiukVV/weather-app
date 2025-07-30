// Weather icons constants
export const WEATHER_ICONS = {
  clear: '🌤️',
  rain: '🌧️',
  snow: '🌨️',
  thunder: '⛈️',
  fog: '🌫️',
  cloud: '☁️',
  hot: '☀️',
  warm: '🌤️',
  cold: '❄️',
} as const;

export type WeatherIconType = keyof typeof WEATHER_ICONS;
