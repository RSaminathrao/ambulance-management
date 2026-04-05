# Run This Project on a New Laptop

## 1) Install Required Software

Install these first:
- Node.js LTS (includes `npm`)
- MongoDB Community Server
- Git (optional, only if cloning from repo)

Verify:
```bash
node -v
npm -v
```

## 2) Get the Project

Either:
- Copy `ambulance-management` folder via zip/drive, then extract.

Or:
- Clone from repo (if available).

Open terminal in:
```bash
.../ambulance-management
```

## 3) Install Dependencies

Run:
```bash
npm install
npm run install:all
npm install react-leaflet@4.2.1 leaflet@1.9.4 --prefix client
```

## 4) Setup Environment File

Create:
```bash
server/.env
```

Copy from:
```bash
server/.env.example
```

Use this content:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/ambulance_management
ADMIN_EMAIL=admin@ambulance.com
ADMIN_PASSWORD=admin123
DISPATCH_INTERVAL_MS=45000
DISPATCH_GRID_STEP=0.01
DISPATCH_MAX_REQUESTS=10
```

## 5) Start MongoDB

Make sure MongoDB service is running before starting the app.

## 6) Run Full Project (All Modules)

From project root:
```bash
npm run dev
```

This starts:
- Backend server
- Dispatch worker
- Frontend client

## 7) Open the App

In terminal, find Vite URL and open it in browser.
Usually:
```text
http://localhost:5173
```
If 5173 is busy, Vite will use another port (5174/5175/etc).

## 8) Quick Functional Test

1. Register a driver with location (inside Pudukottai bounds).
2. Driver login and set status to `Available`.
3. Hire ambulance with patient location.
4. Admin login and verify assignment/dashboard/map.

## 9) Common Issues

### Port 5000 already in use
```bash
netstat -ano | findstr :5000
taskkill /PID <PID> /F
npm run dev
```

### Frontend not updating
- Hard refresh browser: `Ctrl + Shift + R`

## 10) Optional: Clear Project Data Only

Using MongoDB Compass, clear documents in these collections:
- `ambulancerequests`
- `drivers`
- `trips`
- `driverlocations`
- `requestlocations`
- `dispatchaudits`
