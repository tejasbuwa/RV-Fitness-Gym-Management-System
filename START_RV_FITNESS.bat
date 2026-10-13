@echo off
title RV FITNESS - Gym Management System (Narsobawadi)
echo =====================================================================
echo           RV FITNESS - GYM MANAGEMENT SYSTEM (Narsobawadi)
echo =====================================================================
echo.
echo Checking and starting all system services...
echo.

set "NODE_DIR=C:\Users\tejas\.gemini\antigravity\scratch\tools\node"
set "MYSQL_BIN=C:\Program Files\MySQL\MySQL Server 8.0\bin\mysqld.exe"
set "MYSQL_DATA=C:\Users\tejas\.gemini\antigravity\scratch\mysql-data"
set "BACKEND_DIR=C:\Users\tejas\.gemini\antigravity\scratch\rv-fitness\backend"
set "FRONTEND_DIR=C:\Users\tejas\.gemini\antigravity\scratch\rv-fitness\frontend"

set "PATH=%NODE_DIR%;%PATH%"

echo [1/3] Checking MySQL Database Server (Port 3306)...
netstat -ano | findstr ":3306 " >nul
if "%ERRORLEVEL%"=="0" (
    echo [OK] MySQL is already running on port 3306.
) else (
    echo Starting MySQL Server...
    start "RV_Fitness_MySQL" /min "%MYSQL_BIN%" --port=3306 --datadir="%MYSQL_DATA%" --bind-address=127.0.0.1 --console
    timeout /t 2 /nobreak >nul
    echo [OK] MySQL started.
)

echo [2/3] Checking Node.js Backend API (Port 5000)...
netstat -ano | findstr ":5000 " >nul
if "%ERRORLEVEL%"=="0" (
    echo [OK] Backend API is already running on port 5000.
) else (
    echo Starting Backend API...
    start "RV_Fitness_Backend" /min cmd /k "cd /d %BACKEND_DIR% && node src/server.js"
    timeout /t 3 /nobreak >nul
    echo [OK] Backend API started.
)

echo [3/3] Checking React Frontend Web App (Port 3000)...
netstat -ano | findstr ":3000 " >nul
if "%ERRORLEVEL%"=="0" (
    echo [OK] Frontend is already running on port 3000.
) else (
    echo Starting Frontend Web App...
    start "RV_Fitness_Frontend" /min cmd /k "cd /d %FRONTEND_DIR% && npm run dev -- --host 127.0.0.1 --port 3000"
    timeout /t 3 /nobreak >nul
    echo [OK] Frontend Web App started.
)

echo.
echo =====================================================================
echo  SUCCESS: All RV FITNESS services are online!
echo  Opening http://127.0.0.1:3000 in your web browser...
echo =====================================================================
echo.
start http://127.0.0.1:3000

echo You can minimize this window.
pause
