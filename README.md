# MERN URL Shortener

A simple URL Shortener built with **MongoDB, Express, React, and Node.js**.

## Setup Instructions

### 1. Prerequisites
- [Node.js](https://nodejs.org/) installed
- [MongoDB](https://www.mongodb.com/try/download/community) installed and running locally on `mongodb://localhost:27017/urlshortener` (or update `.env` in `backend/` with your connection string).

---

### 2. Backend Setup

```bash
cd backend
npm install
npm run dev
```

The backend server will run on `http://localhost:5000`.

---

### 3. Frontend Setup

```bash
cd frontend
npm install
npm start
```

The React frontend will open at `http://localhost:3000`.

---

## Features
- Enter long URLs and get shortened links
- Redirect short URLs (`http://localhost:5000/api/{shortId}`) to original links
- Tracks click statistics (visit count) per URL
- Simple UI with error handling and click counter

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/shorten` | Body: `{ "originalUrl": "..." }` -> Returns shortened URL |
| `GET` | `/api/:shortId` | Redirects to original URL |
| `GET` | `/api/stats/:shortId` | Returns URL click stats |
