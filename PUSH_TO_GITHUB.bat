@echo off
title Push RV Fitness to GitHub
echo =====================================================================
echo           Pushing RV Fitness to GitHub (main branch)
echo =====================================================================
echo.
cd /d "C:\Users\tejas\.gemini\antigravity\scratch\rv-fitness"

echo [1/2] Current Remote:
git remote -v
echo.
echo [2/2] Running: git push -u origin main
echo If a GitHub browser or sign-in popup appears, please click "Authorize" or sign in.
echo.

git push -u origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo =====================================================================
    echo  SUCCESS! Repository pushed to GitHub:
    echo  https://github.com/tejasbuwa/RV-Fitness-Gym-Management-System
    echo =====================================================================
) else (
    echo.
    echo =====================================================================
    echo  Push encountered an issue. If prompted for password, use a GitHub 
    echo  Personal Access Token (classic) with 'repo' scope from:
    echo  https://github.com/settings/tokens
    echo =====================================================================
)

echo.
pause
