@echo off
echo ================================
echo Daily Licious - MERN Application
echo ================================
echo.
echo Starting Backend Server...
echo.
cd /d "%~dp0"
start cmd /k "npm start"
timeout /t 3 /nobreak > nul
echo.
echo Backend started on http://localhost:5000
echo.
echo Starting Frontend Application...
echo.
start cmd /k "cd frontend && npm start"
echo.
echo Frontend will open on http://localhost:3001
echo.
echo ================================
echo Both servers are starting...
echo Check the new terminal windows
echo ================================
pause
