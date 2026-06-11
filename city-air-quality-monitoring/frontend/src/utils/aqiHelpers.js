export const POLLUTANTS_META = [
  { key: 'pm25', symbol: 'PM₂.₅', name: 'Fine Particles',   unit: 'μg/m³', max: 250,   color: '#FF5252', gradient: ['#FF5252','#FF1744'] },
  { key: 'pm10', symbol: 'PM₁₀',  name: 'Coarse Particles', unit: 'μg/m³', max: 500,   color: '#FF9800', gradient: ['#FF9800','#F44336'] },
  { key: 'no2',  symbol: 'NO₂',   name: 'Nitrogen Dioxide', unit: 'μg/m³', max: 340,   color: '#FFEE58', gradient: ['#FFEE58','#FFA000'] },
  { key: 'o3',   symbol: 'O₃',    name: 'Ozone',            unit: 'μg/m³', max: 380,   color: '#40C4FF', gradient: ['#40C4FF','#0091EA'] },
  { key: 'co',   symbol: 'CO',    name: 'Carbon Monoxide',  unit: 'μg/m³', max: 15400, color: '#69F0AE', gradient: ['#69F0AE','#00C853'] },
  { key: 'so2',  symbol: 'SO₂',   name: 'Sulphur Dioxide',  unit: 'μg/m³', max: 750,   color: '#EA80FC', gradient: ['#EA80FC','#D500F9'] },
  { key: 'nh3',  symbol: 'NH₃',   name: 'Ammonia',          unit: 'μg/m³', max: 300,   color: '#B2FF59', gradient: ['#B2FF59','#64DD17'] },
  { key: 'no',   symbol: 'NO',    name: 'Nitric Oxide',     unit: 'μg/m³', max: 200,   color: '#80CBC4', gradient: ['#80CBC4','#00897B'] },
];

export const AQI_LEVELS = [
  { max: 50,  label: 'Good',                      color: '#00E676', bg: 'rgba(0,230,118,0.12)',  emoji: '😊', desc: 'Air quality is satisfactory and poses little or no risk.' },
  { max: 100, label: 'Moderate',                  color: '#FFEE58', bg: 'rgba(255,238,88,0.12)', emoji: '😐', desc: 'Acceptable. Unusual sensitivity may notice mild effects.' },
  { max: 150, label: 'Unhealthy for Sensitive',   color: '#FF9800', bg: 'rgba(255,152,0,0.12)',  emoji: '😷', desc: 'Sensitive groups may experience health effects.' },
  { max: 200, label: 'Unhealthy',                 color: '#F44336', bg: 'rgba(244,67,54,0.12)',  emoji: '🤢', desc: 'Everyone may experience health effects.' },
  { max: 300, label: 'Very Unhealthy',            color: '#9C27B0', bg: 'rgba(156,39,176,0.12)', emoji: '🤮', desc: 'Health alert — serious effects for everyone.' },
  { max: 500, label: 'Hazardous',                 color: '#7B0000', bg: 'rgba(180,0,0,0.18)',    emoji: '☠️', desc: 'Emergency conditions. Entire population at risk.' },
];

export function getAQILevel(aqi) {
  return AQI_LEVELS.find(l => aqi <= l.max) || AQI_LEVELS[AQI_LEVELS.length - 1];
}

export function fmtVal(v, decimals = 1) {
  if (v === null || v === undefined) return '—';
  return v < 10 ? (+v).toFixed(decimals) : Math.round(v).toString();
}

export const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
export const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export function formatDate(dateStr) {
  const d = new Date(dateStr);
  return `${DAYS[d.getDay()]} ${d.getDate()} ${MONTHS[d.getMonth()]}`;
}

export function formatTime(timeStr) {
  const d = new Date(timeStr);
  return d.getHours().toString().padStart(2,'0') + ':00';
}
