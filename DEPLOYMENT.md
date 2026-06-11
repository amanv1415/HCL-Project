# Deployment Guide — UREI (Frontend + Backend Split)

This project is split into:

| Part | Platform | Folder |
|------|----------|--------|
| **Frontend** (dashboard, login, register) | [Vercel](https://vercel.com) | `frontend/` |
| **Backend** (REST API + ML) | [Render](https://render.com) | project root |

---

## 1. Deploy Backend on Render

### Option A — Blueprint (recommended)

1. Push this repo to GitHub.
2. In Render → **New** → **Blueprint** → connect the repo.
3. Render reads `render.yaml` and creates:
   - Web service: `urei-api`
   - PostgreSQL database: `urei-db`
4. After deploy, set environment variable:
   - `FRONTEND_URL` = your Vercel URL (e.g. `https://urei.vercel.app`)

### Option B — Manual Web Service

1. **New Web Service** → connect repo.
2. Settings:
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `flask db upgrade && gunicorn wsgi:app --bind 0.0.0.0:$PORT --workers 2 --timeout 120`
3. Environment variables:

| Variable | Value |
|----------|-------|
| `FLASK_CONFIG` | `production` |
| `FLASK_APP` | `wsgi:app` |
| `SECRET_KEY` | long random string |
| `DATABASE_URL` | PostgreSQL connection string |
| `FRONTEND_URL` | your Vercel frontend URL |

4. Note your API URL, e.g. `https://urei-api.onrender.com`

### API endpoints

- `GET /api/health` — health check
- `GET /api/summary`, `/api/metrics`, `/api/pca`, `/api/predictions`, `/api/data`
- `POST /api/predict` — valuation prediction
- `POST /api/auth/register`, `/api/auth/login`
- `GET /api/auth/me` — current user (Bearer token)

---

## 2. Deploy Frontend on Vercel

1. Import the GitHub repo in Vercel.
2. Set **Root Directory** to `frontend`.
3. Add environment variable:

| Variable | Value |
|----------|-------|
| `API_URL` | your Render API URL (e.g. `https://urei-api.onrender.com`) |

4. Deploy. Vercel runs `npm run build` which generates `js/config.js` with your API URL.

### Routes

- `/` — dashboard
- `/login` — sign in
- `/register` — create account

---

## 3. Connect Frontend ↔ Backend

After both are live:

1. **Render:** set `FRONTEND_URL` to your Vercel URL (no trailing slash).
2. **Vercel:** set `API_URL` to your Render URL (no trailing slash).
3. Redeploy both services.

CORS is configured on the backend using `FRONTEND_URL`.

---

## 4. Local Development

### Backend

```bash
cd real_estate_project
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
flask db upgrade
python app.py
```

API runs at `http://localhost:5000`

### Frontend

```bash
cd frontend
cp js/config.example.js js/config.js
# Edit js/config.js → API_BASE: 'http://localhost:5000'
npm run dev
```

Frontend runs at `http://localhost:3000`

---

## 5. Notes

- **Model files** (`models/*.pkl`) must be committed for Render to serve predictions.
- **Render free tier** spins down after inactivity; first request may take ~30s.
- **PostgreSQL** is required on Render for persistent user accounts (SQLite resets on redeploy).
- Auth uses **JWT tokens** stored in `localStorage` on the frontend.
