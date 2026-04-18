# CrimeLense — ML-Integrated Platform

A full-stack AI crime intelligence platform with real ML predictions, live hotspot mapping, and JWT authentication.

---

## Architecture

```
CrimeLense Website/
├── CrimeLense/          ← React + Vite frontend (port 5173)
├── backend/             ← Node.js Express API (port 3001)
│   ├── server.js        ← Main entry point
│   ├── routes/          ← auth, predictions, hotspots, users
│   ├── models/          ← Mongoose: User, Prediction
│   └── middleware/      ← JWT auth
├── backend/ml-service/  ← Python Flask ML service (port 5000)
│   └── app.py           ← Feature engineering + model inference
├── Models files/        ← Pre-trained .pkl model files (XGBoost, LightGBM, CatBoost, DBSCAN)
├── start-all.bat        ← 🚀 One-click launcher for all services
└── setup-flask.bat      ← 🔧 First-time Python setup
```

---

## Quick Start

### First-time Setup

**1. Install Python dependencies (run once):**
```bash
setup-flask.bat
```

**2. Install Node.js backend dependencies (already done if npm install was run):**
```bash
cd backend
npm install
```

**3. Install React frontend dependencies (already done):**
```bash
cd CrimeLense
npm install
```

### Start Everything
```bash
start-all.bat
```
Opens 3 terminal windows:
| Service | URL |
|---------|-----|
| React Frontend | http://localhost:5173 |
| Node.js API | http://localhost:3001/api/health |
| Flask ML | http://localhost:5000/health |

---

## API Reference

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login → returns JWT |
| GET | `/api/auth/me` | Get current user (requires token) |

### Predictions
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/predictions` | Full ML prediction (risk + category + severity) |

**Request body:**
```json
{
  "latitude": 34.05,
  "longitude": -118.24,
  "hour": 22,
  "month": 10,
  "weapon_used": 0
}
```

### Hotspots & Data
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/hotspots` | All DBSCAN hotspot clusters |
| GET | `/api/hotspots?tier=CRITICAL` | Filtered by tier |
| GET | `/api/hotspots/trends/hourly` | Hourly crime patterns |
| GET | `/api/hotspots/trends/monthly` | Monthly crime trends |
| GET | `/api/hotspots/metadata` | Model performance metadata |

---

## Environment Variables

### `backend/.env`
```
PORT=3001
MONGO_URI=mongodb://localhost:27017/crimelense
JWT_SECRET=your_secret_key_here
JWT_EXPIRES_IN=7d
FLASK_URL=http://localhost:5000
FRONTEND_URL=http://localhost:5173
```

### `backend/ml-service/.env`
```
MODELS_PATH=../../Models files
PORT=5000
```

### `CrimeLense/.env`
```
VITE_API_URL=http://localhost:3001/api
```

---

## ML Models

| Model | Task | Accuracy |
|-------|------|----------|
| XGBoost + LightGBM + CatBoost | Binary Risk (SAFE/DANGEROUS) | ~94% |
| XGBoost + LightGBM + CatBoost | Crime Category (6 classes) | ~88% |
| XGBoost + LightGBM + CatBoost | Severity (LOW/MEDIUM/HIGH/CRITICAL) | ~87% |
| DBSCAN | Hotspot clustering | 36 zones |

### Feature Engineering (5 inputs → 17 features)
- **Inputs**: `latitude`, `longitude`, `hour`, `month`, `weapon_used`
- **Engineered**: time cyclical encoding (sin/cos), night/weekend flags, season, quarter, cluster ID, cluster tier, area risk score, area crime density

---

## Graceful Degradation

All frontend components are designed to **work without the backend running**:
- Prediction panel shows a friendly error if backend is offline
- User Management falls back to demo data
- AI Insights uses static metrics if metadata API unavailable
- LiveMap shows an offline message with startup instructions
