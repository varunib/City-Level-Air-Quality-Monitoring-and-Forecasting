const express = require('express');
const { geocodeCity } = require('../services/airQualityService');

const router = express.Router();

// GET /api/geocode?q=cityName
router.get('/', async (req, res, next) => {
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
