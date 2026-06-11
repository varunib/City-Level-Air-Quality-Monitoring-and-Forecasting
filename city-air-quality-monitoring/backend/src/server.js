require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const airQualityRoutes = require('./routes/airQuality');
const geocodeRoutes    = require('./routes/geocode');

const app  = express();
const PORT = process.env.PORT || 5000;

// ── Security & Middleware ─────────────────────
app.use(helmet());
const allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
];
const allowedOriginPattern = /^http:\/\/192\.168\.\d{1,3}\.\d{1,3}:3000$/;
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin) || allowedOriginPattern.test(origin)) {
      return callback(null, true);
    }
    callback(new Error('CORS policy does not allow access from this origin.'));
  },
}));
app.use(express.json());
app.use(morgan('dev'));

// ── Rate Limiting ─────────────────────────────
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max:      parseInt(process.env.RATE_LIMIT_MAX) || 100,
  standardHeaders: true,
  legacyHeaders:   false,
  message: { error: 'Too many requests, please try again later.' },
});
app.use('/api/', limiter);

// ── Routes ────────────────────────────────────
app.use('/api/air-quality', airQualityRoutes);
app.use('/api/geocode',     geocodeRoutes);

// ── Health Check ──────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'City Air Quality Monitoring & Forecasting',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// ── 404 ───────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ── Error Handler ─────────────────────────────
app.use((err, _req, res, _next) => {
  console.error('[ERROR]', err.message);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
  });
});

// ── Start ─────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🌬️  City Air Quality Monitoring & Forecasting`);
  console.log(`✅  Server running → http://localhost:${PORT}`);
  console.log(`📡  API Base       → http://localhost:${PORT}/api`);
  console.log(`❤️   Health Check  → http://localhost:${PORT}/api/health\n`);
});

module.exports = app;
