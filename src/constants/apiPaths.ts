const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;

if (!API_KEY) {
  throw new Error(
    'Environment variable NEXT_PUBLIC_OPENWEATHER_API_KEY is missing. ' +
      'Set it in your .env[.local] before starting the app.',
  );
}

export const apiPaths = {
  weather: {
    current: 'https://api.openweathermap.org/data/2.5/weather',
    forecast: 'https://api.openweathermap.org/data/2.5/forecast',
  },
  geocode: {
    direct: 'https://api.openweathermap.org/geo/1.0/direct',
  },
  params: {
    appid: API_KEY,
    units: 'metric',
  },
} as const;
