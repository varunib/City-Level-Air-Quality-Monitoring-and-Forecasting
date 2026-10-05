/**
 * AQI Utilities — US EPA Standard
 * Calculates US AQI from raw pollutant concentrations
 */

const AQI_BREAKPOINTS = {
  pm25: [
    { cLow: 0.0,   cHigh: 12.0,   iLow: 0,   iHigh: 50  },
    { cLow: 12.1,  cHigh: 35.4,   iLow: 51,  iHigh: 100 },
    { cLow: 35.5,  cHigh: 55.4,   iLow: 101, iHigh: 150 },
    { cLow: 55.5,  cHigh: 150.4,  iLow: 151, iHigh: 200 },
    { cLow: 150.5, cHigh: 250.4,  iLow: 201, iHigh: 300 },
    { cLow: 250.5, cHigh: 350.4,  iLow: 301, iHigh: 400 },
    { cLow: 350.5, cHigh: 500.4,  iLow: 401, iHigh: 500 },
  ],
  pm10: [
    { cLow: 0,   cHigh: 54,   iLow: 0,   iHigh: 50  },
    { cLow: 55,  cHigh: 154,  iLow: 51,  iHigh: 100 },
    { cLow: 155, cHigh: 254,  iLow: 101, iHigh: 150 },
    { cLow: 255, cHigh: 354,  iLow: 151, iHigh: 200 },
    { cLow: 355, cHigh: 424,  iLow: 201, iHigh: 300 },
    { cLow: 425, cHigh: 504,  iLow: 301, iHigh: 400 },
    { cLow: 505, cHigh: 604,  iLow: 401, iHigh: 500 },
  ],
};

function calcAQI(concentration, pollutant) {
  const bps = AQI_BREAKPOINTS[pollutant];
  if (!bps) return null;
  const c = Math.round(concentration * 10) / 10;
  const bp = bps.find(b => c >= b.cLow && c <= b.cHigh);
  if (!bp) return concentration > bps[bps.length - 1].cHigh ? 500 : 0;
  return Math.round(
    ((bp.iHigh - bp.iLow) / (bp.cHigh - bp.cLow)) * (c - bp.cLow) + bp.iLow
  );
}

function getAQICategory(aqi) {
  if (aqi <= 50)  return { label: 'Good',                       color: '#00E676', bg: '#00E67622', emoji: '😊' };
  if (aqi <= 100) return { label: 'Moderate',                   color: '#FFEE58', bg: '#FFEE5822', emoji: '😐' };
  if (aqi <= 150) return { label: 'Unhealthy for Sensitive',    color: '#FF9800', bg: '#FF980022', emoji: '😷' };
  if (aqi <= 200) return { label: 'Unhealthy',                  color: '#F44336', bg: '#F4433622', emoji: '🤢' };
  if (aqi <= 300) return { label: 'Very Unhealthy',             color: '#9C27B0', bg: '#9C27B022', emoji: '🤮' };
  return               { label: 'Hazardous',                    color: '#7B0000', bg: '#7B000033', emoji: '☠️' };
}

function getDominantPollutant(pollutants) {
  const { pm25 = 0, pm10 = 0, no2 = 0, o3 = 0, co = 0, so2 = 0 } = pollutants;
  const mapped = [
    { name: 'PM₂.₅', symbol: 'pm25', aqi: calcAQI(pm25, 'pm25') || 0 },
    { name: 'PM₁₀',  symbol: 'pm10', aqi: calcAQI(pm10, 'pm10') || 0 },
    { name: 'NO₂',   symbol: 'no2',  aqi: no2 > 340 ? 300 : Math.round(no2 / 340 * 200) },
    { name: 'O₃',    symbol: 'o3',   aqi: o3 > 380  ? 300 : Math.round(o3  / 380 * 200) },
    { name: 'CO',    symbol: 'co',   aqi: Math.round(co / 15400 * 150) },
    { name: 'SO₂',   symbol: 'so2',  aqi: Math.round(so2 / 750 * 200) },
  ];
  return mapped.sort((a, b) => b.aqi - a.aqi)[0];
}

function getHealthRecommendations(aqi) {
  const level = aqi <= 50 ? 0 : aqi <= 100 ? 1 : aqi <= 150 ? 2 : aqi <= 200 ? 3 : aqi <= 300 ? 4 : 5;

  const matrix = [
    {
      group: 'General Population',
      icon: '👥',
      advice: [
        'Air quality is satisfactory. Enjoy outdoor activities.',
        'Air quality is acceptable; unusually sensitive individuals should limit prolonged exertion.',
        'Active children and adults should limit prolonged outdoor exertion.',
        'Everyone should limit prolonged outdoor exertion.',
        'Everyone should avoid all outdoor exertion.',
        'Everyone should avoid all outdoor activity.',
      ],
    },
    {
      group: 'Children',
      icon: '👶',
      advice: [
        'Safe for all outdoor activities and play.',
        'Sensitive children should reduce prolonged outdoor play.',
        'Sensitive children should avoid outdoor play.',
        'Children should limit all outdoor play.',
        'Children should remain indoors.',
        'Children must stay indoors with air purification.',
      ],
    },
    {
      group: 'Heart & Lung Conditions',
      icon: '🫀',
      advice: [
        'No restrictions. Normal activity is fine.',
        'Consider reducing prolonged, heavy exertion.',
        'Reduce prolonged, heavy outdoor exertion. Take more breaks.',
        'Avoid prolonged or heavy outdoor exertion. Move activities indoors.',
        'Avoid all outdoor activity.',
        'Remain indoors. Seek emergency medical attention if symptoms worsen.',
      ],
    },
    {
      group: 'Athletes & Outdoor Workers',
      icon: '🏃',
      advice: [
        'Ideal conditions for outdoor exercise and work.',
        'Consider reducing high-intensity outdoor activity.',
        'Reduce intensity and duration of outdoor activity.',
        'Avoid strenuous outdoor activity. Reschedule if possible.',
        'Cancel outdoor workouts. Move all activities indoors.',
        'All outdoor physical activity must cease.',
      ],
    },
    {
      group: 'Elderly',
      icon: '👴',
      advice: [
        'No health risk. Enjoy outdoor time.',
        'Reduce prolonged, heavy exertion.',
        'Reduce prolonged outdoor exertion.',
        'Avoid all outdoor exertion.',
        'Stay indoors with windows closed.',
        'Emergency protocols. Do not go outside.',
      ],
    },
    {
      group: 'Pregnant Women',
      icon: '🤰',
      advice: [
        'Safe for outdoor activities.',
        'Monitor for any unusual symptoms.',
        'Reduce outdoor time, especially near high-traffic areas.',
        'Limit outdoor exposure. Consult your healthcare provider.',
        'Stay indoors. Consult physician immediately if symptoms appear.',
        'Remain indoors. Emergency medical attention if symptomatic.',
      ],
    },
  ];

  return matrix.map(m => ({ ...m, recommendation: m.advice[level] }));
}

module.exports = { calcAQI, getAQICategory, getDominantPollutant, getHealthRecommendations };
