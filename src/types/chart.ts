export interface TemperatureChartProps {
  hourlyData: Array<{
    dt: number;
    main: {
      temp: number;
    };
    weather: Array<{
      description: string;
    }>;
  }>;
}

export interface ChartDataPoint {
  time: string;
  temperature: number;
  timestamp: number;
}

export interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    payload: ChartDataPoint;
  }>;
  label?: string;
}
