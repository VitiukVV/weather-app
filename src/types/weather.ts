export interface WeatherData {
  temp: number;
  humidity: number;
  description: string;
  icon: string;
  windSpeed: number;
}

export interface Coordinates {
  lat: number;
  lon: number;
}

export interface Weather {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface MainWeatherData {
  temp: number;
  feels_like: number;
  pressure: number;
  humidity: number;
}

export interface Wind {
  speed: number;
  deg: number;
}

export interface SystemData {
  country: string;
}

export interface CurrentWeatherResponse {
  coord: Coordinates;
  weather: Array<Weather>;
  main: MainWeatherData;
  wind: Wind;
  name: string;
  sys: SystemData;
}

export interface HourlyForecastResponse {
  list: Array<{
    dt: number;
    main: Pick<MainWeatherData, 'temp' | 'humidity'>;
    weather: Array<Pick<Weather, 'description' | 'icon'>>;
    wind: Pick<Wind, 'speed'>;
  }>;
  city: {
    name: string;
    country: string;
  };
}
