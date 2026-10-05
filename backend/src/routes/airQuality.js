const express = require('express');
const { getAirQuality, geocodeCity } = require('../services/airQualityService');

const router = express.Router();

// GET /api/air-quality?lat=&lon=&city=&country=
router.get('/', async (req, res, next) => {
  try {
    const { lat, lon, city = 'Unknown', country = '' } = req.query;

    if (!lat || !lon) {
      return res.status(400).json({ error: 'lat and lon query parameters are required.' });
    }

    const latitude  = parseFloat(lat);
    const longitude = parseFloat(lon);

    if (isNaN(latitude) || isNaN(longitude)) {
      return res.status(400).json({ error: 'lat and lon must be valid numbers.' });
    }
    if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
      return res.status(400).json({ error: 'Coordinates out of range.' });
    }

    const data = await getAirQuality(latitude, longitude, city, country);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
});

// GET /api/air-quality/search?q=cityName
router.get('/search', async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q || q.trim().length < 2) {
      return res.status(400).json({ error: 'Query must be at least 2 characters.' });
    }
    const results = await geocodeCity(q.trim());
    res.json({ success: true, results });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
