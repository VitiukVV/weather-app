import { Box, Typography } from '@mui/material';

import React from 'react';

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import type { ChartDataPoint, CustomTooltipProps, TemperatureChartProps } from '@/types/chart';

import styles from './TemperatureChart.module.scss';

const TemperatureChart: React.FC<TemperatureChartProps> = ({ hourlyData }) => {
  if (!hourlyData?.length) return null;

  const formatTime = (timestamp: number) =>
    new Date(timestamp * 1000).toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });

  // Get current time and filter data for next 24 hours
  const now = Date.now() / 1000;
  const next24Hours = now + 24 * 60 * 60;

  // Filter data for next 24 hours and transform for Recharts
  const chartData: ChartDataPoint[] = hourlyData
    .filter(item => item.dt >= now && item.dt <= next24Hours)
    .map(item => ({
      time: formatTime(item.dt),
      temperature: Math.round(item.main.temp),
      timestamp: item.dt,
    }));

  // Custom tooltip
  const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
    if (active && payload?.[0]) {
      return (
        <Box className={styles['chart-tooltip']}>
          <Typography className={styles['chart-tooltip-label']}>{label}</Typography>
          <Typography className={styles['chart-tooltip-value']}>
            Temperature: {payload[0].value}°C
          </Typography>
        </Box>
      );
    }
    return null;
  };

  return (
    <Box className={styles['temperature-chart']}>
      <Typography variant="h6" component="h3" className={styles['chart-title']}>
        Temperature Trend (Next 24 Hours)
      </Typography>
      <Box className={styles['chart-container']}>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
            <XAxis
              dataKey="time"
              stroke="currentColor"
              fontSize={12}
              tick={{ fill: 'currentColor' }}
              interval="preserveStartEnd"
            />
            <YAxis
              stroke="currentColor"
              fontSize={12}
              tick={{ fill: 'currentColor' }}
              tickFormatter={value => `${value}°C`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="temperature"
              stroke="currentColor"
              strokeWidth={3}
              dot={{ fill: 'currentColor', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: 'currentColor', strokeWidth: 2, fill: 'currentColor' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
};

export default TemperatureChart;
