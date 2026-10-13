@echo off
title Stop RV FITNESS
echo =====================================================================
echo           Stopping RV FITNESS System Services...
echo =====================================================================
echo.

taskkill /F /IM node.exe /T 2>nul
taskkill /F /IM mysqld.exe /T 2>nul

echo.
echo All RV FITNESS servers (Frontend, Backend, and MySQL) have been stopped.
echo.
pause
