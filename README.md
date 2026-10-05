# City-Level Air Quality Monitoring & Forecasting

A full-stack application for exploring real-time air quality, pollutant levels, and forecasts for cities around the world. The React dashboard is backed by a Node.js/Express API and Open-Meteo's air-quality and geocoding services.

## Features

- Search for cities or choose a preconfigured city from the dashboard.
- View current US and European AQI, pollutant measurements, and health guidance.
- Explore hourly and five-day forecasts with interactive charts.
- Use browser geolocation to look up nearby air quality.
- Automatically refresh dashboard data every ten minutes.
- Protect and cache API requests with Express middleware and NodeCache.

## Technology

- **Frontend:** React 18, Recharts, Axios, Framer Motion
- **Backend:** Node.js, Express, Axios
- **Data:** Open-Meteo Air Quality and Geocoding APIs (no API key required)

## Project structure

The runnable application is in `city-air-quality-monitoring/`:

```text
city-air-quality-monitoring/
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   ├── services/
│   │   └── utils/
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   └── package.json
├── package.json
└── README.md
```

## Requirements

- Node.js 16 or newer
- npm 8 or newer

## Run the app

From the repository root, run:

```bash
cd city-air-quality-monitoring
npm install
npm run install:all
npm start
```

The frontend is served at [http://localhost:3000](http://localhost:3000) and the backend API at [http://localhost:5000](http://localhost:5000). The frontend development server proxies `/api` requests to the backend.

To start the services separately, run these commands from `city-air-quality-monitoring/` in separate terminals:

```bash
npm run dev:backend
npm run start:frontend
```

To create a production frontend build:

```bash
npm run build
```

## API endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/health` | Backend health check |
| `GET` | `/api/geocode?q={city}` | Find city coordinates |
| `GET` | `/api/air-quality/search?q={city}` | Search for a city |
| `GET` | `/api/air-quality?lat={lat}&lon={lon}&city={city}&country={country}` | Current conditions and forecasts |

## License

No license has been specified for this repository.
