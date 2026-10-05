const axios = require('axios');
const cache = require('../utils/cache');
const { getAQICategory, getDominantPollutant, getHealthRecommendations } = require('../utils/aqiUtils');

const AQ_URL  = process.env.OPEN_METEO_AQ_URL  || 'https://air-quality-api.open-meteo.com/v1/air-quality';
const GEO_URL = process.env.OPEN_METEO_GEO_URL || 'https://geocoding-api.open-meteo.com/v1/search';

const AQ_PARAMS = [
  'pm10','pm2_5','carbon_monoxide','nitrogen_dioxide','sulphur_dioxide',
  'ozone','ammonia','nitrogen_monoxide',
  'us_aqi','us_aqi_pm2_5','us_aqi_pm10','us_aqi_nitrogen_dioxide',
  'us_aqi_carbon_monoxide','us_aqi_ozone','us_aqi_sulphur_dioxide',
  'european_aqi','european_aqi_pm2_5','european_aqi_pm10',
  'european_aqi_nitrogen_dioxide','european_aqi_ozone','european_aqi_sulphur_dioxide',
].join(',');

// ── Geocode city name to lat/lon ──────────────────────────
async function geocodeCity(cityName) {
  const cacheKey = `geo:${cityName.toLowerCase()}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  try {
    const { data } = await axios.get(GEO_URL, {
      params: { name: cityName, count: 6, language: 'en', format: 'json' },
      timeout: 8000,
    });

    if (!data.results?.length) {
      throw Object.assign(new Error(`City "${cityName}" not found.`), { status: 404 });
    }

    const results = data.results.map(r => ({
      name:      r.name,
      country:   r.country || '',
      admin1:    r.admin1 || '',
      latitude:  r.latitude,
      longitude: r.longitude,
      timezone:  r.timezone || 'auto',
      population: r.population || 0,
    }));

    cache.set(cacheKey, results);
    return results;
  } catch (err) {
    console.error('[ERROR] geocodeCity failed:', err.message);
    throw Object.assign(err, { status: err.status || 502 });
  }
}

// ── Fetch raw air quality data from Open-Meteo ────────────
async function fetchRawAQ(lat, lon, tz = 'auto') {
  const cacheKey = `aq:${lat.toFixed(3)}:${lon.toFixed(3)}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  try {
    const { data } = await axios.get(AQ_URL, {
      params: {
        latitude:     lat,
        longitude:    lon,
        hourly:       AQ_PARAMS,
        timezone:     tz,
        forecast_days: 7,
        past_hours:   24,
      },
      timeout: 12000,
    });

    if (!data) {
      throw new Error('No data returned from air quality API');
    }

    cache.set(cacheKey, data);
    return data;
  } catch (err) {
    console.error('[ERROR] fetchRawAQ failed:', err.message);
    if (err.response?.status === 400) {
      throw Object.assign(new Error(`Bad request to air quality API: ${err.response.data?.reason || err.message}`), { status: 400 });
    }
    throw Object.assign(err, { status: err.response?.status || 502 });
  }
}

// ── Find current hour index in hourly array ───────────────
function findCurrentIndex(times) {
  if (!times || !Array.isArray(times) || times.length === 0) {
    console.warn('[WARNING] times array is empty or invalid');
    return 0;
  }
  const now = Date.now();
  let idx = 0;
  for (let i = 0; i < times.length; i++) {
    if (new Date(times[i]).getTime() <= now) idx = i;
    else break;
  }
  return idx;
}

// ── Average helper ─────────────────────────────────────────
function avg(arr) {
  const valid = (arr || []).filter(v => v !== null && v !== undefined && !isNaN(v));
  if (!valid.length) return 0;
  return Math.round(valid.reduce((a, b) => a + b, 0) / valid.length * 10) / 10;
}

// ── Build current snapshot ────────────────────────────────
function buildCurrent(h, idx) {
  const val = (key) => +(h[key]?.[idx] ?? 0).toFixed(2);
  const pollutants = {
    pm25: val('pm2_5'),
    pm10: val('pm10'),
    no2:  val('nitrogen_dioxide'),
    o3:   val('ozone'),
    co:   val('carbon_monoxide'),
    so2:  val('sulphur_dioxide'),
    nh3:  val('ammonia'),
    no:   val('nitrogen_monoxide'),
  };
  const usAqi  = Math.round(h.us_aqi?.[idx] ?? 0);
  const euAqi  = Math.round(h.european_aqi?.[idx] ?? 0);
  const category = getAQICategory(usAqi);
  const dominant = getDominantPollutant(pollutants);
  const health   = getHealthRecommendations(usAqi);

  return {
    timestamp: h.time?.[idx],
    usAqi,
    euAqi,
    category,
    dominant,
    pollutants,
    pollutantAqi: {
      pm25: Math.round(h.us_aqi_pm2_5?.[idx] ?? 0),
      pm10: Math.round(h.us_aqi_pm10?.[idx] ?? 0),
      no2:  Math.round(h.us_aqi_nitrogen_dioxide?.[idx] ?? 0),
      o3:   Math.round(h.us_aqi_ozone?.[idx] ?? 0),
      co:   Math.round(h.us_aqi_carbon_monoxide?.[idx] ?? 0),
      so2:  Math.round(h.us_aqi_sulphur_dioxide?.[idx] ?? 0),
    },
    euPollutantAqi: {
      pm25: Math.round(h.european_aqi_pm2_5?.[idx] ?? 0),
      pm10: Math.round(h.european_aqi_pm10?.[idx] ?? 0),
      no2:  Math.round(h.european_aqi_nitrogen_dioxide?.[idx] ?? 0),
      o3:   Math.round(h.european_aqi_ozone?.[idx] ?? 0),
      so2:  Math.round(h.european_aqi_sulphur_dioxide?.[idx] ?? 0),
    },
    health,
  };
}

// ── Build 48h time-series ─────────────────────────────────
function buildTimeSeries(h, idx) {
  const start = Math.max(0, idx - 24);
  const end   = Math.min(h.time.length - 1, idx + 24);
  const series = [];
  for (let i = start; i <= end; i++) {
    series.push({
      time:   h.time[i],
      usAqi:  Math.round(h.us_aqi?.[i]       ?? 0),
      euAqi:  Math.round(h.european_aqi?.[i] ?? 0),
      pm25:   +(h.pm2_5?.[i]               ?? 0).toFixed(1),
      pm10:   +(h.pm10?.[i]                ?? 0).toFixed(1),
      no2:    +(h.nitrogen_dioxide?.[i]    ?? 0).toFixed(1),
      o3:     +(h.ozone?.[i]              ?? 0).toFixed(1),
      isCurrent: i === idx,
    });
  }
  return series;
}

// ── Build next 24h hourly forecast ────────────────────────
function buildHourlyForecast(h, idx) {
  const result = [];
  for (let i = idx; i < idx + 25 && i < h.time.length; i++) {
    const aqi = Math.round(h.us_aqi?.[i] ?? 0);
    result.push({
      time:   h.time[i],
      usAqi:  aqi,
      euAqi:  Math.round(h.european_aqi?.[i] ?? 0),
      pm25:   +(h.pm2_5?.[i] ?? 0).toFixed(1),
      category: getAQICategory(aqi),
      isCurrent: i === idx,
    });
  }
  return result;
}

// ── Build 5-day daily summary ─────────────────────────────
function buildDailyForecast(h, idx) {
  const byDay = {};
  for (let i = idx; i < h.time.length; i++) {
    const day = h.time[i].split('T')[0];
    if (!byDay[day]) byDay[day] = { usAqi: [], euAqi: [], pm25: [], pm10: [], o3: [], no2: [] };
    if (h.us_aqi?.[i]       != null) byDay[day].usAqi.push(h.us_aqi[i]);
    if (h.european_aqi?.[i] != null) byDay[day].euAqi.push(h.european_aqi[i]);
    if (h.pm2_5?.[i]        != null) byDay[day].pm25.push(h.pm2_5[i]);
    if (h.pm10?.[i]         != null) byDay[day].pm10.push(h.pm10[i]);
    if (h.ozone?.[i]        != null) byDay[day].o3.push(h.ozone[i]);
    if (h.nitrogen_dioxide?.[i] != null) byDay[day].no2.push(h.nitrogen_dioxide[i]);
  }

  return Object.entries(byDay).slice(0, 5).map(([date, v]) => {
    const aqiAvg = Math.round(avg(v.usAqi));
    return {
      date,
      usAqi:    aqiAvg,
      euAqi:    Math.round(avg(v.euAqi)),
      maxAqi:   Math.max(...v.usAqi.filter(Boolean)),
      minAqi:   Math.min(...v.usAqi.filter(Boolean)),
      pm25:     avg(v.pm25),
      pm10:     avg(v.pm10),
      o3:       avg(v.o3),
      no2:      avg(v.no2),
      category: getAQICategory(aqiAvg),
    };
  });
}

// ── Main service function ─────────────────────────────────
async function getAirQuality(lat, lon, cityName, country) {
  try {
    const raw = await fetchRawAQ(lat, lon);
    
    if (!raw || !raw.hourly) {
      throw Object.assign(new Error('Invalid air quality data received from API'), { status: 502 });
    }
    
    const h   = raw.hourly;
    const idx = findCurrentIndex(h.time);

    return {
      meta: {
        city:      cityName,
        country,
        latitude:  lat,
        longitude: lon,
        timezone:  raw.timezone || 'UTC',
        fetchedAt: new Date().toISOString(),
      },
      current:        buildCurrent(h, idx),
      timeSeries:     buildTimeSeries(h, idx),
      hourlyForecast: buildHourlyForecast(h, idx),
      dailyForecast:  buildDailyForecast(h, idx),
    };
  } catch (err) {
    console.error('[ERROR] getAirQuality failed:', err.message);
    throw Object.assign(err, { status: err.status || 500 });
  }
}

module.exports = { geocodeCity, getAirQuality };
