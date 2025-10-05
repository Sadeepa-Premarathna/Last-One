@echo off
echo.
echo ========================================
echo   DAIRY LICIOUS - Starting Servers
echo ========================================
echo.

REM Start Backend Server
echo [1/2] Starting Backend API Server...
start "Backend API - Port 5000" cmd /k "cd /d %~dp0backend && node server.js"
timeout /t 3 /nobreak >nul

REM Start Frontend Server
echo [2/2] Starting Frontend React Server...
start "Frontend App - Port 3000" cmd /k "cd /d %~dp0frontend && npm start"

echo.
echo ========================================
echo   Servers Starting...
echo ========================================
echo.
echo Backend API will run on: http://localhost:5000
echo Frontend App will run on: http://localhost:3000
echo.
echo Check the new command windows for server status.
echo.
pause
