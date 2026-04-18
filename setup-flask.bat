@echo off
title CrimeLense — Flask ML Service Setup
color 0B

echo.
echo  =============================================
echo   CrimeLense Flask ML Service — First-Time Setup
echo  =============================================
echo.

cd /d "%~dp0backend\ml-service"

echo [1/3] Creating Python virtual environment...
python -m venv venv

echo [2/3] Installing Python dependencies...
call venv\Scripts\activate.bat
pip install -r requirements.txt

echo.
echo [3/3] Python setup complete!
echo.
echo  To start the Flask service:
echo    cd backend\ml-service
echo    venv\Scripts\activate
echo    python app.py
echo.
pause
