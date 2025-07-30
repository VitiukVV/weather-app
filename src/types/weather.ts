export interface WeatherData {
  temp: number;
  humidity: number;
  description: string;
  icon: string;
  windSpeed: number;
}

export interface CurrentWeatherResponse {
  coord: {
    lat: number;
    lon: number;
  };
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  main: {
    temp: number;
    feels_like: number;
    pressure: number;
    humidity: number;
  };
  wind: {
    speed: number;
    deg: number;
  };
  name: string;
  sys: {
    country: string;
  };
}

export interface HourlyForecastResponse {
  list: Array<{
    dt: number;
    main: {
      temp: number;
      humidity: number;
    };
    weather: Array<{
      description: string;
      icon: string;
    }>;
    wind: {
      speed: number;
    };
  }>;
  city: {
    name: string;
    country: string;
  };
}
