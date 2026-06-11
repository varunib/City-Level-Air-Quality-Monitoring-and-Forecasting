import axios from 'axios';

const api = axios.create({ baseURL: '/api', timeout: 15000 });

export const searchCity  = (q)                      => api.get(`/air-quality/search?q=${encodeURIComponent(q)}`);
export const fetchAirQuality = (lat, lon, city, country) =>
  api.get(`/air-quality?lat=${lat}&lon=${lon}&city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}`);

export default api;
