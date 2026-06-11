# 🌍 City-Level Air Quality Monitoring & Forecasting

## 📌 Overview

City-Level Air Quality Monitoring & Forecasting is a backend application that provides air quality information and forecasting for cities using external air quality and geocoding APIs.

The system fetches location data, retrieves air quality metrics, processes the information, and exposes it through REST APIs for integration with web or mobile applications.

---

## 🚀 Features

* Real-time Air Quality Monitoring
* City-based Air Quality Search
* Air Quality Forecasting
* RESTful API Architecture
* Response Caching for Better Performance
* Rate Limiting for API Protection
* Secure Backend using Helmet
* Environment Variable Configuration
* Error Handling and Logging

---

## 🛠️ Tech Stack

### Backend

* Node.js
* Express.js

### APIs

* Open-Meteo Air Quality API
* Open-Meteo Geocoding API

### Libraries

* Axios
* CORS
* Helmet
* Morgan
* Express Rate Limit
* Node Cache
* Dotenv

### Tools

* Git
* GitHub
* VS Code
* Nodemon

---

## 📂 Project Structure

```text
city-air-quality-monitoring/
│
├── src/
│   ├── server.js
│   ├── routes/
│   ├── controllers/
│   ├── services/
│
├── .env
├── package.json
├── package-lock.json
└── README.md
```

---

## ⚙️ Installation

### Clone Repository

```bash
git clone https://github.com/varunib/City-Level-Air-Quality-Monitoring-and-Forecasting.git
```

### Navigate to Project

```bash
cd City-Level-Air-Quality-Monitoring-and-Forecasting
```

### Install Dependencies

```bash
npm install
```

### Configure Environment Variables

Create a `.env` file:

```env
PORT=5000
NODE_ENV=development
CACHE_TTL_SECONDS=600
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
```

### Run Development Server

```bash
npm run dev
```

### Run Production Server

```bash
npm start
```

---

## 📊 API Capabilities

* Search city locations
* Retrieve air quality data
* Monitor pollution indicators
* Forecast air quality trends
* Provide AQI-related insights

---

## 🔒 Security Features

* Helmet for HTTP security headers
* Rate limiting to prevent abuse
* Environment variable protection
* Cached API responses for efficiency

---

## 🌱 Future Enhancements

* Machine Learning-based AQI Prediction
* Interactive Dashboard
* Historical AQI Analysis
* Multi-City Comparison
* Data Visualization Charts
* Weather and Pollution Correlation Analysis

---

## 👩‍💻 Author

**Varuni Bennur**

GitHub: https://github.com/varunib

---

## ⭐ Support

If you found this project useful, please consider giving it a ⭐ on GitHub.
