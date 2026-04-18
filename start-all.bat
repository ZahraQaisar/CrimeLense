@echo off
title CrimeLense — All Services
color 0A

echo.
echo  =============================================
echo   CrimeLense Platform Startup
echo   Flask ML Service + Node.js API + React Dev
echo  =============================================
echo.

:: ── 1. Start Flask ML Service ────────────────────────────────────────
echo [1/3] Starting Flask ML Service (port 5000)...
cd /d "%~dp0backend\ml-service"

:: Check if virtual environment exists
if exist "venv\Scripts\activate.bat" (
    start "Flask ML Service" cmd /k "venv\Scripts\activate.bat && python app.py"
) else (
    start "Flask ML Service" cmd /k "python app.py"
)
timeout /t 3 /nobreak > nul

:: ── 2. Start Node.js Backend ──────────────────────────────────────────
echo [2/3] Starting Node.js Backend API (port 3001)...
cd /d "%~dp0backend"
start "Node.js API" cmd /k "node server.js"
timeout /t 2 /nobreak > nul

:: ── 3. Start React Frontend ───────────────────────────────────────────
echo [3/3] Starting React Dev Server (port 5173)...
cd /d "%~dp0CrimeLense"
start "React Frontend" cmd /k "npm run dev"

echo.
echo  ✓ All services started!
echo.
echo  Frontend  → http://localhost:5173
echo  Node API  → http://localhost:3001/api/health
echo  Flask ML  → http://localhost:5000/health
echo.
echo  Press any key to exit this launcher...
pause > nul
