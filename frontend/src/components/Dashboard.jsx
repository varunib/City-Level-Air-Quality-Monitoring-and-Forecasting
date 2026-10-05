import React from 'react';
import AQIDialGauge         from './AQIDialGauge';
import PollutantGrid        from './PollutantGrid';
import StatsRow             from './StatsRow';
import FiveDayForecast      from './FiveDayForecast';
import HourlyStrip          from './HourlyStrip';
import HealthRecommendations from './HealthRecommendations';
import AQILegend            from './AQILegend';
import {
  AQILineChart, PollutantBarChart,
  ForecastBarChart, PollutantRadar,
} from './Charts';

export default function Dashboard({ data }) {
  if (!data) return null;
  const { meta, current, timeSeries, hourlyForecast, dailyForecast } = data;

  return (
    <div style={s.root}>

      {/* ── Hero: Gauge + Pollutants ── */}
      <div style={s.heroGrid}>
        <AQIDialGauge
          aqi={current.usAqi}
          euAqi={current.euAqi}
          city={meta.city}
          country={meta.country}
          updatedAt={current.timestamp}
          dominant={current.dominant}
        />
        <PollutantGrid
          pollutants={current.pollutants}
          pollutantAqi={current.pollutantAqi}
        />
      </div>

      {/* ── Stats banner ── */}
      <StatsRow current={current} />

      {/* ── 5-Day Forecast ── */}
      <FiveDayForecast forecast={dailyForecast} />

      {/* ── 2-col Charts ── */}
      <div style={s.chartsGrid}>
        <AQILineChart timeSeries={timeSeries} />
        <PollutantBarChart pollutants={current.pollutants} />
      </div>

      {/* ── Hourly strip ── */}
      <HourlyStrip hourlyForecast={hourlyForecast} />

      {/* ── 2-col bottom charts ── */}
      <div style={s.chartsGrid}>
        <ForecastBarChart dailyForecast={dailyForecast} />
        <PollutantRadar pollutants={current.pollutants} />
      </div>

      {/* ── Health Recommendations ── */}
      <HealthRecommendations health={current.health} aqi={current.usAqi} />

      {/* ── AQI Legend ── */}
      <AQILegend />

    </div>
  );
}

const s = {
  root: { display:'flex', flexDirection:'column', gap:'1rem' },
  heroGrid: {
    display:'grid',
    gridTemplateColumns:'320px 1fr',
    gap:'1rem',
  },
  chartsGrid: {
    display:'grid',
    gridTemplateColumns:'1fr 1fr',
    gap:'1rem',
  },
};
