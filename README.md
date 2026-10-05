# City-Level Air Quality Monitoring & Forecasting

Full-stack air-quality monitoring and forecasting application. The React frontend uses the existing Express API and Open-Meteo's air-quality and geocoding services.

## Project structure

```text
.
├── frontend/   # Existing React application
├── backend/    # Existing Node.js/Express API
├── package.json
└── README.md
```

## Run locally

Requirements: Node.js 16 or newer and npm 8 or newer.

From the repository root:

```bash
npm install
npm run install:all
npm start
```

The React app runs at [http://localhost:3000](http://localhost:3000); the Express API runs at [http://localhost:5000](http://localhost:5000). In development, React proxies `/api` requests to the backend.

To run the services separately, use two terminals from the repository root:

```bash
npm run dev:backend
npm run start:frontend
```

Create a production frontend build with:

```bash
npm run build
```

## Deploy frontend and backend separately

- Deploy `backend/` as the backend service (for example, Render). Set `PORT` as required by the host and `FRONTEND_ORIGINS` to the deployed frontend origin, such as `https://your-app.vercel.app`.
- Deploy `frontend/` as a Create React App site (for example, Vercel). Set the build-time environment variable `REACT_APP_API_URL` to the backend API base URL, including `/api`, such as `https://your-api.onrender.com/api`.

`REACT_APP_API_URL` is optional locally; when unset, the frontend uses `/api` and the existing development proxy.

## API endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/health` | Backend health check |
| `GET` | `/api/geocode?q={city}` | Find city coordinates |
| `GET` | `/api/air-quality/search?q={city}` | Search for a city |
| `GET` | `/api/air-quality?lat={lat}&lon={lon}&city={city}&country={country}` | Current conditions and forecasts |
