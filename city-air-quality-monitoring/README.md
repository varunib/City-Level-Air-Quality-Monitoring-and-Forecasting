# 🌬️ City Air Quality Monitoring & Forecasting

A production-grade full-stack web application for **real-time air quality monitoring and forecasting** built with **React.js** (frontend) and **Node.js/Express** (backend).

---

## 🚀 Quick Start

### Prerequisites
- Node.js >= 16.x
- npm >= 8.x

### Installation & Run

```bash
# 1. Install all dependencies
cd city-air-quality-monitoring
npm run install:all

# 2. Start both backend + frontend together
npm start

# OR start separately:
npm run dev:backend     # Backend on http://localhost:5000
npm run start:frontend  # Frontend on http://localhost:3000
```

Then open **http://localhost:3000** in your browser.

---

## 🏗️ Project Structure

```
city-air-quality-monitoring/
├── package.json                    ← Root scripts (concurrently)
│
├── backend/                        ← Node.js / Express API
│   ├── package.json
│   ├── .env
│   └── src/
│       ├── server.js               ← Express entry point
│       ├── routes/
│       │   ├── airQuality.js       ← GET /api/air-quality
│       │   └── geocode.js          ← GET /api/geocode
│       ├── services/
│       │   └── airQualityService.js← Open-Meteo API integration
│       └── utils/
│           ├── aqiUtils.js         ← AQI calculation & health logic
│           └── cache.js            ← Node-cache (10-min TTL)
│
└── frontend/                       ← React.js SPA
    ├── package.json
    ├── public/
    │   └── index.html
    └── src/
        ├── index.js                ← React entry
        ├── index.css               ← Global styles + keyframes
        ├── App.jsx                 ← Root component + routing
        ├── hooks/
        │   └── useAirQuality.js    ← Data fetching hook + auto-refresh
        ├── utils/
        │   ├── api.js              ← Axios API client
        │   └── aqiHelpers.js       ← AQI levels, pollutant metadata
        └── components/
            ├── Header.jsx          ← Topbar + live clock
            ├── SearchBar.jsx       ← City search + autocomplete
            ├── WelcomeScreen.jsx   ← Landing / empty state
            ├── LoadingScreen.jsx   ← Animated loader
            ├── Dashboard.jsx       ← Main layout orchestrator
            ├── AQIDialGauge.jsx    ← Animated SVG gauge dial
            ├── PollutantGrid.jsx   ← 8 pollutant cards
            ├── StatsRow.jsx        ← 4-stat summary banner
            ├── FiveDayForecast.jsx ← 5-day forecast tiles
            ├── HourlyStrip.jsx     ← 24h scrollable strip
            ├── Charts.jsx          ← 4 Recharts charts
            ├── HealthRecommendations.jsx ← 6-group health advice
            └── AQILegend.jsx       ← AQI scale reference
```

---

## ✅ All Features

### Real-Time Monitoring
- 🔴 **Live AQI data** — US EPA + EU standard
- 📍 **City search** with instant geocoding autocomplete
- 📍 **GPS "My Location"** detection via browser Geolocation API
- ⏱️ **Auto-refresh** every 10 minutes

### AQI Display
- 🎯 **Animated SVG gauge dial** with needle and color segments
- 🎨 **AQI-reactive color system** (green → yellow → orange → red → purple)
- 🌍 Both **US EPA AQI** and **European AQI** standards

### Pollutant Breakdown (8 pollutants)
| Pollutant | Symbol | Description |
|-----------|--------|-------------|
| Fine Particles | PM₂.₅ | Respiratory risk |
| Coarse Particles | PM₁₀ | Airborne dust |
| Nitrogen Dioxide | NO₂ | Traffic emissions |
| Ozone | O₃ | Photochemical smog |
| Carbon Monoxide | CO | Incomplete combustion |0
| Sulphur Dioxide | SO₂ | Fossil fuel burning |
| Ammonia | NH₃ | Agricultural emissions |
| Nitric Oxide | NO | Combustion byproduct |

### Forecasting
- 📅 **5-Day Daily AQI Forecast** — min/max + PM₂.₅
- ⏱️ **24-Hour Hourly Strip** — scrollable, real-time cards

### Charts (Recharts)
| Chart | Description |
|-------|-------------|
| AQI Line Chart | 48h trend — US/EU toggle |
| Pollutant Bar / Radar | Toggle between bar and radar |
| 5-Day Forecast Bar | Daily avg AQI + PM₂.₅ line overlay |
| Pollutant Radar | % of safe threshold |

### Health Recommendations
6 sensitivity groups with personalised advice:
- 👥 General Population · 👶 Children · 🫀 Heart & Lung Conditions
- 🏃 Athletes · 👴 Elderly · 🤰 Pregnant Women

### Design
- 🌑 **Dark theme** throughout — deep navy (#050B14)
- **Orbitron** — data/display typography
- **JetBrains Mono** — all metric readouts and labels
- **Space Grotesk** — body text
- Animated background orbs, dot grid, pulsing logo
- Hover micro-interactions on all cards

---

## 🔌 APIs Used

| API | Endpoint | Key Required |
|-----|----------|-------------|
| Open-Meteo Air Quality | `air-quality-api.open-meteo.com/v1/air-quality` | **None** |
| Open-Meteo Geocoding | `geocoding-api.open-meteo.com/v1/search` | **None** |
| Browser Geolocation | Native browser API | Permission only |

---

## ⚙️ Backend API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Server health check |
| GET | `/api/geocode?q=cityName` | Geocode city → coordinates |
| GET | `/api/air-quality/search?q=cityName` | Search city |
| GET | `/api/air-quality?lat=&lon=&city=&country=` | Full AQI data |

---

## 🛡️ Backend Features
- **Rate limiting** — 100 req / 15 min per IP
- **Response caching** — 10-minute NodeCache TTL
- **Helmet.js** — security headers
- **CORS** — localhost:3000 allowed
- **Morgan** — HTTP request logging

---

## 📦 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Recharts, Orbitron/JetBrains Mono fonts |
| Backend | Node.js, Express 4, Axios |
| Caching | node-cache (in-memory, 10min TTL) |
| Security | Helmet, express-rate-limit, CORS |
| API | Open-Meteo Air Quality (free, no key) |
| Dev | Nodemon, Concurrently |

---

## 🌍 Pre-configured Quick Cities
Mumbai · Beijing · Delhi · London · New York · Tokyo · Dubai · Los Angeles · Cairo · Bangkok · Lahore
EOF